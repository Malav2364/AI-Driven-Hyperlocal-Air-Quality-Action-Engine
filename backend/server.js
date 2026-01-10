const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Read from root .env

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Citizen', enum: ['Citizen', 'Industry', 'Government', 'Farmer'] },
    age: { type: Number },
    city: { type: String },
    pincode: { type: String },
    companyName: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Audit Schema
const AuditSchema = new mongoose.Schema({
    title: String,
    target: String, // Company Name
    date: { type: Date, default: Date.now },
    officer: String,
    reason: String,
    status: { type: String, enum: ['Compliant', 'Non-Compliant', 'Resolved', 'Pending', 'Re-Audit Requested', 'Completed'], default: 'Pending' },
    details: String,
    createdAt: { type: Date, default: Date.now }
});

const Audit = mongoose.model('Audit', AuditSchema);

// Register
app.post('/signup', async (req, res) => {
    try {
        console.log('Signup Request Body:', req.body);
        const { name, email, password, role, age, city, pincode, companyName } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            age,
            city,
            pincode,
            companyName
        });

        await user.save();

        // Create Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, age: user.age, city: user.city, pincode: user.pincode, companyName: user.companyName }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern).join(', ');
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, companyName: user.companyName }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User (Protected)
app.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// Create Audit Request (Re-Inspection)
app.post('/audit/request', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user.role !== 'Industry') return res.status(403).json({ message: 'Only Industry can request re-audit' });

        const newAudit = new Audit({
            title: 'Re-Inspection Request',
            target: user.companyName || user.name,
            officer: 'Pending Assignment',
            reason: 'Self-reported correction of violation',
            status: 'Re-Audit Requested',
            details: req.body.details || 'Industry claims to have fixed the emission issues.'
        });

        await newAudit.save();
        res.json(newAudit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Audits (For Government)
app.get('/audits', async (req, res) => {
    try {
        // In a real app, verify token and check if role is Government
        const audits = await Audit.find().sort({ date: -1 });
        res.json(audits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User (Protected)
app.put('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, email, age, city, pincode } = req.body;

        // Build update object
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (age) updateFields.age = age;
        if (city) updateFields.city = city;
        if (pincode) updateFields.pincode = pincode;

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
