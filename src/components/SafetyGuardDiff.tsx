import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Typography, Tabs, Tag, Timeline, Card, Alert } from 'antd';
import {
    SafetyCertificateOutlined,
    FileTextOutlined,
    DiffOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import SimpleDiffViewer from './SimpleDiffViewer';

// Add custom style for the scanning pulse
const scanningStyle = `
@keyframes scan {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1); opacity: 0.5; }
  100% { transform: scaleX(0); opacity: 0; }
}
`;

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

    // State for dynamic content
    const [redactedText, setRedactedText] = useState('');
    const [loading, setLoading] = useState(false);

    // Effect to handle content switching and API calls
    React.useEffect(() => {
        if (!defect) return;

        const originalText = defect.safetyReport.originalContent;

        // Always try to get redacted version for the "Safety Diff" audit view
        setLoading(true);
        fetch('/api/redact-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: originalText, role: 'YIELD_ENG' }), // Always simulate Yield Eng for redaction
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.redacted_text) {
                    setRedactedText(data.redacted_text);
                } else {
                    setRedactedText(defect.safetyReport.redactedContent);
                }
            })
            .catch(err => {
                console.error(err);
                setRedactedText(defect.safetyReport.redactedContent);
            })
            .finally(() => setLoading(false));

    }, [defect]);

    const finalContent = userRole === 'EQUIPMENT_ENG' ? defect.safetyReport.originalContent : (redactedText || defect.safetyReport.redactedContent);

    return (
        <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px' }}>
                <Title level={5}>Defect Analysis Report</Title>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Tag
                        style={{
                            backgroundColor: userRole === 'EQUIPMENT_ENG' ? '#8B0000' : '#75b008ff',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        {userRole}
                    </Tag>
                    {userRole === 'YIELD_ENG' && (
                        <Tag
                            icon={<SafetyCertificateOutlined />}
                            style={{
                                backgroundColor: '#75b008ff',
                                color: 'white',
                                border: 'none'
                            }}
                        >
                            Protected
                        </Tag>
                    )}
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
                                <Card bordered={false} style={{ background: '#fafafa', position: 'relative', minHeight: '200px' }}>
                                    {loading && (
                                        <div style={{
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(255,255,255,0.98)', zIndex: 1,
                                            borderRadius: '8px',
                                            gap: '16px',
                                            backdropFilter: 'blur(4px)'
                                        }}>
                                            <div style={{ marginBottom: '8px' }}>
                                                <LoadingOutlined style={{ fontSize: 40, color: '#75b008ff' }} spin />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <Text strong style={{ color: '#75b008ff', fontSize: '20px', display: 'block', marginBottom: '4px' }}>
                                                    NVIDIA NIM Security Filter
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                                                    Scrubbing sensitive data with Llama-3.1-70B-Instruct...
                                                </Text>
                                            </div>
                                            {/* Scanning Line Animation */}
                                            <div style={{
                                                width: '180px',
                                                height: '2px',
                                                background: '#75b008ff',
                                                boxShadow: '0 0 8px #75b008ff',
                                                animation: 'scan 2s ease-in-out infinite'
                                            }} />
                                            <style>{scanningStyle}</style>
                                        </div>
                                    )}
                                    <ReactMarkdown
                                        components={{
                                            h1: ({ node, ...props }) => <Text strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }} {...props} />,
                                            h2: ({ node, ...props }) => <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px' }} {...props} />,
                                            p: ({ node, ...props }) => <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px', whiteSpace: 'pre-line' }} {...props} />,
                                        }}
                                    >
                                        {finalContent}
                                    </ReactMarkdown>
                                    <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px dashed #ffa39e' }}>
                                        <Text type="danger" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                                            * Note: The parameters shown above are <b>mockup data</b> for demonstration purposes and <b>DO NOT</b> reflect real-time machine telemetry in this tech preview.
                                        </Text>
                                    </div>
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
                                    message={userRole === 'EQUIPMENT_ENG' ? "Safety Guard Preview (Simulation)" : "Safety Guard Audit"}
                                    description={userRole === 'EQUIPMENT_ENG'
                                        ? "You are viewing a preview of how the AI would redact this report for restricted roles."
                                        : "Visualizing how the Safety Guard redacted sensitive process parameters."
                                    }
                                    type="warning"
                                    showIcon
                                    style={{ marginBottom: '16px' }}
                                />

                                <SimpleDiffViewer
                                    oldValue={defect.safetyReport.originalContent}
                                    newValue={redactedText || defect.safetyReport.redactedContent}
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

