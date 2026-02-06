import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Tabs, Tag, Timeline, Card, Alert } from 'antd';
import {
    SafetyCertificateOutlined,
    FileTextOutlined,
    DiffOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import SimpleDiffViewer from './SimpleDiffViewer';

const { Title, Text } = Typography;

const SafetyGuardDiff: React.FC = () => {
    const { getSelectedDefect, userRole } = useAppStore();
    const defect = getSelectedDefect();
    const [activeTab, setActiveTab] = useState('1');

    if (!defect) return null;

    const { safetyReport } = defect;

    // Logic: 
    // "Report View": Shows the final report the user sees.
    // "Safety View": Compares Input (Original) vs Output (Redacted) to show WHAT acts.

    const finalContent = userRole === 'EQUIPMENT_ENG' ? safetyReport.originalContent : safetyReport.redactedContent;

    return (
        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
                <Title level={5}>Defect Analysis Report</Title>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Tag color={userRole === 'EQUIPMENT_ENG' ? 'blue' : 'green'}>{userRole}</Tag>
                    {userRole === 'YIELD_ENG' && <Tag icon={<SafetyCertificateOutlined />} color="success">Protected</Tag>}
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: '1',
                        label: (<span><FileTextOutlined />RCA Report</span>),
                        children: (
                            <div style={{ overflow: 'auto', height: 'calc(100vh - 200px)', paddingRight: '8px' }}>
                                <Card bordered={false} style={{ background: '#fafafa' }}>
                                    <ReactMarkdown>{finalContent}</ReactMarkdown>
                                </Card>
                            </div>
                        )
                    },
                    {
                        key: '2',
                        label: (<span><DiffOutlined />Safety Diff</span>),
                        children: (
                            <div style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
                                <Alert
                                    message="Safety Guard Audit"
                                    description="Visualizing how the Safety Guard redacted sensitive process parameters."
                                    type="warning"
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />

                                <SimpleDiffViewer
                                    oldValue={safetyReport.originalContent}
                                    newValue={safetyReport.redactedContent}
                                />

                                <div style={{ marginTop: '24px' }}>
                                    <Title level={5}>Action Logs</Title>
                                    <Timeline>
                                        {safetyReport.logs.map(log => (
                                            <Timeline.Item
                                                key={log.id}
                                                color={log.action === 'FILTERED' ? 'red' : 'green'}
                                            >
                                                <Text strong>{log.action}</Text>
                                                <br />
                                                <Text type="secondary" style={{ fontSize: '12px' }}>{new Date(log.timestamp).toLocaleTimeString()}</Text>
                                                <div>{log.details}</div>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </div>
                            </div>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default SafetyGuardDiff;

