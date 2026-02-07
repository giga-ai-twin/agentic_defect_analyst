import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button, Tooltip, Empty, Spin } from 'antd';
import {
    ZoomInOutlined,
    ZoomOutOutlined,
    ReloadOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';

const DeepZoomViewer: React.FC = () => {
    const { getSelectedDefect } = useAppStore();
    const defect = getSelectedDefect();
    const [showAnnotations, setShowAnnotations] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!defect) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', background: '#f5f5f5' }}>
                <Empty description="Select a defect to inspect" />
            </div>
        );
    }

    // Reset error state when defect changes
    React.useEffect(() => {
        setImageError(false);
        setLoading(true);
    }, [defect.id]);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: '#e0e0e0', // Light gray background
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: 'radial-gradient(#bbb 1px, transparent 1px)', // Darker gray dots
            backgroundSize: '20px 20px',
            color: '#000'
        }}>
            {/* Viewer Header */}
            <div style={{
                padding: '8px 16px',
                background: '#fff',
                borderBottom: '1px solid #d9d9d9',
                color: '#000',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PictureOutlined />
                    <span style={{ fontWeight: 500 }}>SEM Deep Zoom Inspector</span>
                    <span style={{ fontSize: '12px', color: '#666' }}> | {defect.name}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Controls moved here for better visibility */}
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    maxScale={8}
                    centerOnInit
                >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                            <div style={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                zIndex: 100,
                                display: 'flex',
                                gap: '8px',
                                flexDirection: 'column'
                            }}>
                                <Tooltip title="Zoom In">
                                    <Button type="primary" shape="circle" icon={<ZoomInOutlined />} onClick={() => zoomIn()} />
                                </Tooltip>
                                <Tooltip title="Zoom Out">
                                    <Button shape="circle" icon={<ZoomOutOutlined />} onClick={() => zoomOut()} />
                                </Tooltip>
                                <Tooltip title="Reset View">
                                    <Button shape="circle" icon={<ReloadOutlined />} onClick={() => resetTransform()} />
                                </Tooltip>
                                <Tooltip title={showAnnotations ? "Hide AI Bounding Boxes" : "Show AI Bounding Boxes"}>
                                    <Button
                                        type={showAnnotations ? 'primary' : 'default'}
                                        shape="circle"
                                        icon={showAnnotations ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        onClick={() => setShowAnnotations(!showAnnotations)}
                                        style={{ marginTop: '8px' }}
                                    />
                                </Tooltip>
                            </div>

                            <TransformComponent
                                wrapperStyle={{ width: '100%', height: '100%' }}
                                contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {imageError ? (
                                    <div style={{ color: '#fff', textAlign: 'center' }}>
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={<span style={{ color: '#aaa' }}>Image Failed to Load (Mock URL)</span>}
                                        />
                                        <Button ghost onClick={() => setImageError(false)} style={{ marginTop: '10px' }}>Retry</Button>
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}>
                                        {loading && (
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'rgba(20,20,20,0.8)',
                                                zIndex: 5
                                            }}>
                                                <Spin size="large" tip="Loading SEM Data..." />
                                            </div>
                                        )}
                                        <img
                                            src={defect.imageUrl}
                                            alt={defect.name}
                                            style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', border: '1px solid #444' }}
                                            onLoad={() => setLoading(false)}
                                            onError={() => { setLoading(false); setImageError(true); }}
                                        />

                                        {!loading && showAnnotations && defect.cosmosAnalysis.boundingBoxes.map((box) => (
                                            <Tooltip
                                                key={box.id}
                                                title={
                                                    <div style={{ fontSize: '12px' }}>
                                                        <b>{box.label}</b>
                                                        <div>{defect.cosmosAnalysis.description}</div>
                                                    </div>
                                                }
                                                color="rgba(0,0,0,0.8)"
                                                placement="top"
                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        left: box.x,
                                                        top: box.y,
                                                        width: box.width,
                                                        height: box.height,
                                                        border: `2px solid ${box.color}`,
                                                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                                                        cursor: 'help',
                                                        boxShadow: `0 0 10px ${box.color}`
                                                    }}
                                                />
                                            </Tooltip>
                                        ))}
                                    </div>
                                )}
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            </div>
        </div>
    );
};

export default DeepZoomViewer;
