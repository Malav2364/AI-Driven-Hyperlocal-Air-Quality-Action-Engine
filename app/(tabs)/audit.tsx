import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../services/api';

// Mock Data for Audit Reports
const AUDIT_REPORTS = [
    {
        id: '1',
        title: 'Factory Emission Audit - Zone A',
        target: 'SteelWorks Pvt Ltd',
        date: '2025-01-09',
        officer: 'Inspector Rajesh Kumar',
        reason: 'High SO2 levels detected by AI sensor',
        status: 'Non-Compliant',
        details: 'On-site inspection confirmed faulty scrubber system. Notice issued for immediate repair. Fine of ₹50,000 imposed.',
    },
    {
        id: '2',
        title: 'Farm Fire Surveillance',
        target: 'Nangloi Region',
        date: '2025-01-08',
        officer: 'Field Officer Amit Singh',
        reason: 'Satellite thermal anomaly detected',
        status: 'Resolved',
        details: 'Fire extinguished by reaction team. Farmer counseled on alternative stubble management practices.',
    },
    {
        id: '3',
        title: 'Construction Site Dust Check',
        target: 'Metro Phase 4 Site',
        date: '2025-01-07',
        officer: 'Inspector Priya Sharma',
        reason: 'Routine compliance check',
        status: 'Compliant',
        details: 'Anti-smog guns were operational. Water sprinkling records maintained correctly. No violations found.',
    },
    {
        id: '4',
        title: 'Vehicle Pollution Drive',
        target: 'Sector 62 Checkpoint',
        date: '2025-01-05',
        officer: 'Traffic Unit 4',
        reason: 'High NOx levels in sector',
        status: 'Completed',
        details: 'Checked 150 vehicles. 12 impounded for expired PUC and visible smoke emissions.',
    },
];

const AuditScreen = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState('Pending'); // Pending, Completed, Re-Audit
    const [reports, setReports] = useState<any[]>([]);
    const router = useRouter();

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const user = await api.getMe();
            if (user && user.role === 'Government') {
                setIsAuthorized(true);
                const data = await api.getComplaints();
                // Map to UI friendly format if needed, but schema is fine.
                // Schema: { _id, description, location, imageUrl, status, userName, createdAt }
                setReports(data || []);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };
    
    const handleResolve = async (id: string) => {
        try {
            await api.resolveComplaint(id);
            Alert.alert("Success", "Complaint marked as resolved. Credits awarded.");
            fetchReports(); // Refresh
        } catch (e) {
            Alert.alert("Error", "Failed to resolve.");
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#2B5F6C" />
            </View>
        );
    }

    if (!isAuthorized) {
        return (
             <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="lock-closed" size={48} color="#EF4444" />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, color: '#1F2937' }}>Access Denied</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
                    You do not have permission to view pollution complaints.
                </Text>
                <TouchableOpacity 
                    style={{ marginTop: 24, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#2B5F6C', borderRadius: 8 }}
                    onPress={() => router.replace('/dashboard')}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resolved':
                return { bg: '#ECFDF5', text: '#059669' }; // Green
            case 'Rejected':
                return { bg: '#FEF2F2', text: '#EF4444' }; // Red
            case 'Pending':
                 return { bg: '#FEF3C7', text: '#D97706' }; // Yellow
            case 'Re-Audit Requested':
                return { bg: '#DBEAFE', text: '#2563EB' }; // Blue
            default:
                return { bg: '#F3F4F6', text: '#6B7280' }; // Gray
        }
    };

    const getFilteredReports = () => {
        return reports.filter(report => {
            if (activeTab === 'Pending') return report.status === 'Pending';
            if (activeTab === 'Re-Audit Requests') return report.status === 'Re-Audit Requested';
            if (activeTab === 'Completed') return report.status === 'Resolved' || report.status === 'Rejected';
            return true;
        });
    };

    const filteredReports = getFilteredReports();

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ 
                headerShown: true, 
                title: 'Pollution Complaints', 
                headerTitleStyle: { color: '#111827', fontWeight: 'bold' },
                headerStyle: { backgroundColor: 'white' },
                headerShadowVisible: false,
            }} />
            <StatusBar style="dark" />
            
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {['Pending', 'Re-Audit Requests', 'Completed'].map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredReports.length === 0 ? (
                     <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.6 }}>
                        <Ionicons name="clipboard-outline" size={48} color="#9CA3AF" />
                        <Text style={{ marginTop: 12, color: '#6B7280' }}>No complaints found.</Text>
                    </View>
                ) : (
                    filteredReports.map((report) => (
                        <View key={report._id} style={styles.card}>
                            <TouchableOpacity 
                                style={styles.cardHeader} 
                                onPress={() => toggleExpand(report._id)}
                                activeOpacity={0.7}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                         <Text style={styles.reportTitle}>{report.location || 'Unknown Location'}</Text>
                                    </View>
                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="person" size={12} color="#6B7280" />
                                            <Text style={styles.metaText}>{report.userName || 'Anonymous'}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="calendar" size={12} color="#6B7280" />
                                            <Text style={styles.metaText}>{new Date(report.createdAt).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status).bg }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(report.status).text }]}>
                                            {report.status}
                                        </Text>
                                    </View>
                                    <Ionicons 
                                        name={expandedId === report._id ? "chevron-up" : "chevron-down"} 
                                        size={20} 
                                        color="#9CA3AF" 
                                        style={{ marginTop: 8 }}
                                    />
                                </View>
                            </TouchableOpacity>

                            {expandedId === report._id && (
                                <View style={styles.cardContent}>
                                    <View style={styles.divider} />
                                    
                                    {report.imageUrl && (
                                        <Image 
                                            source={{ uri: report.imageUrl }} 
                                            style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }} 
                                            resizeMode="cover"
                                        />
                                    )}

                                    <Text style={styles.label}>Description</Text>
                                    <Text style={styles.value}>{report.description}</Text>
                                    
                                    {report.status === 'Re-Audit Requested' && (
                                        <>
                                            <Text style={styles.label}>Re-Audit Reason</Text>
                                            <Text style={styles.value}>{report.reAuditReason}</Text>
                                        </>
                                    )}

                                    {report.status === 'Pending' && (
                                        <TouchableOpacity 
                                            style={[styles.actionButton, { borderBottomColor: '#059669' }]}
                                            onPress={() => handleResolve(report._id)}
                                        >
                                            <Text style={[styles.actionButtonText, { color: '#059669' }]}>Verify & Mark Resolved (+Credits)</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default AuditScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    scrollContent: {
        padding: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: '#FAFAFA',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
        marginTop: 12,
        fontWeight: '600',
    },
    value: {
        fontSize: 14,
        color: '#1F2937',
        lineHeight: 20,
    },
    actionButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#2B5F6C',
    },
    actionButtonText: {
        color: '#2B5F6C',
        fontWeight: 'bold',
        fontSize: 14,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    activeTabButton: {
        backgroundColor: '#2B5F6C',
    },
    tabText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    activeTabText: {
        color: 'white',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '500',
    }
});
