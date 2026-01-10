import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Compliant':
            case 'Resolved':
            case 'Completed':
                return '#10B981'; // Green
            case 'Non-Compliant':
                return '#EF4444'; // Red
            case 'Pending':
                return '#F59E0B'; // Amber
            default:
                return '#6B7280'; // Gray
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Audit Reports</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {AUDIT_REPORTS.map((report) => (
                    <View key={report.id} style={styles.card}>
                        <TouchableOpacity 
                            style={styles.cardHeader} 
                            onPress={() => toggleExpand(report.id)}
                            activeOpacity={0.7}
                        >
                            <View style={{flex: 1}}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.reportTitle}>{report.title}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                                            {report.status}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.reportTarget}>{report.target}</Text>
                                <Text style={styles.reportDate}>{report.date}</Text>
                            </View>
                            <Ionicons 
                                name={expandedId === report.id ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color="#6B7280" 
                            />
                        </TouchableOpacity>

                        {expandedId === report.id && (
                            <View style={styles.cardBody}>
                                <View style={styles.divider} />
                                
                                <View style={styles.detailRow}>
                                    <View style={styles.iconBox}>
                                        <Ionicons name="person" size={16} color="#4B5563" />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.detailLabel}>Inspecting Officer</Text>
                                        <Text style={styles.detailValue}>{report.officer}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.iconBox}>
                                        <Ionicons name="alert-circle" size={16} color="#4B5563" />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.detailLabel}>Reason for Audit</Text>
                                        <Text style={styles.detailValue}>{report.reason}</Text>
                                    </View>
                                </View>

                                <View style={styles.detailRow}>
                                    <View style={styles.iconBox}>
                                        <Ionicons name="document-text" size={16} color="#4B5563" />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.detailLabel}>Audit Details</Text>
                                        <Text style={styles.detailValue}>{report.details}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
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
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    reportTarget: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    reportDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    cardBody: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
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
        lineHeight: 20,
    }
});
