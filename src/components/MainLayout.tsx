import { Layout, theme, Switch, Typography, List, Avatar, Badge, Tag } from 'antd';
import {
    ScanOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import type { Defect } from '../types';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface MainLayoutProps {
    children: React.ReactNode;
    rightPanel: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, rightPanel }) => {
    const {
        token: { colorBgContainer, colorBorderSecondary },
    } = theme.useToken();

    const { defects, selectedDefectId, selectDefect, userRole, setUserRole } = useAppStore();

    return (
        <Layout style={{ height: '100vh' }}>
            {/* Header */}
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#001529',
                padding: '0 20px',
                height: '64px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ScanOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title level={4} style={{ color: 'white', margin: 0 }}>
                        Defect Analysis & Safety Agent
                    </Title>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.65)' }}>Role View:</Text>
                    <Switch
                        checkedChildren="Yield Eng"
                        unCheckedChildren="Equip Eng"
                        checked={userRole === 'YIELD_ENG'}
                        onChange={(checked) => setUserRole(checked ? 'YIELD_ENG' : 'EQUIPMENT_ENG')}
                        style={{ backgroundColor: userRole === 'YIELD_ENG' ? '#75b008ff' : '#8B0000' }}
                    />
                    <Avatar icon={<UserOutlined />} style={{ marginLeft: '12px' }} />
                </div>
            </Header>

            <Layout hasSider style={{ height: 'calc(100vh - 64px)' }}>
                {/* Left Sidebar: Defect List */}
                <Sider
                    width={300}
                    style={{
                        background: colorBgContainer,
                        borderRight: `1px solid ${colorBorderSecondary}`,
                        overflow: 'auto'
                    }}
                >
                    <div style={{ padding: '16px', borderBottom: `1px solid ${colorBorderSecondary}` }}>
                        <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>Active Defects</Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Pending Review: {defects.filter((d: Defect) => d.status === 'New' || d.status === 'Reviewing').length}
                        </Text>
                    </div>

                    <List
                        itemLayout="horizontal"
                        dataSource={defects}
                        renderItem={(item: Defect) => (
                            <List.Item
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    background: selectedDefectId === item.id ? '#e6f7ff' : 'transparent',
                                    borderLeft: selectedDefectId === item.id ? '4px solid #1890ff' : '4px solid transparent'
                                }}
                                onClick={() => selectDefect(item.id)}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.thumbnailUrl} shape="square" size={48} />}
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                            <Text strong ellipsis style={{ maxWidth: '140px' }}>{item.name}</Text>
                                            {item.status === 'New' && <Badge status="error" />}
                                        </div>
                                    }
                                    description={
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>{item.id}</Text>
                                            <div>
                                                <Tag color={item.cosmosAnalysis.confidence > 0.9 ? 'green' : 'orange'} style={{ fontSize: '10px', marginRight: 0 }}>
                                                    AI: {Math.round(item.cosmosAnalysis.confidence * 100)}%
                                                </Tag>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </Sider>

                {/* Center: Main Content (Image Viewer) */}
                <Content style={{
                    background: '#f0f2f5',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    flex: 1, // Ensure content expands to fill space
                    minWidth: 0 // Prevent flexbox overflow issues
                }}>
                    {children}
                </Content>

                {/* Right Sidebar: Reports & Safety Guard */}
                <Sider
                    width={400}
                    style={{
                        background: colorBgContainer,
                        borderLeft: `1px solid ${colorBorderSecondary}`,
                        overflow: 'auto'
                    }}
                >
                    {rightPanel}
                </Sider>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
