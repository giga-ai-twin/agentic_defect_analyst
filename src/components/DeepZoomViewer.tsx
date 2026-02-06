import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button, Tooltip } from 'antd';
import {
    ZoomInOutlined,
    ZoomOutOutlined,
    ReloadOutlined,
    EyeOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';

const DeepZoomViewer: React.FC = () => {
    const { getSelectedDefect } = useAppStore();
    const defect = getSelectedDefect();
    const [showAnnotations, setShowAnnotations] = useState(true);

    if (!defect) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                Select a defect from the sidebar to view details
            </div>
        );
    }

    // Calculate scaling for the demo (assuming image is displayed at natural size or contained)
    // For a real app, we'd handle image load and natural dimensions more carefully.
    // Here we just overlay divs assuming the bbox coordinates match the image display.
    // We'll wrap the image in a relative container.

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
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
                                <Button icon={<ZoomInOutlined />} onClick={() => zoomIn()} />
                            </Tooltip>
                            <Tooltip title="Zoom Out">
                                <Button icon={<ZoomOutOutlined />} onClick={() => zoomOut()} />
                            </Tooltip>
                            <Tooltip title="Reset">
                                <Button icon={<ReloadOutlined />} onClick={() => resetTransform()} />
                            </Tooltip>
                            <Tooltip title={showAnnotations ? "Hide AI Annotations" : "Show AI Annotations"}>
                                <Button
                                    type={showAnnotations ? 'primary' : 'default'}
                                    icon={showAnnotations ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    onClick={() => setShowAnnotations(!showAnnotations)}
                                />
                            </Tooltip>
                        </div>

                        <TransformComponent
                            wrapperStyle={{ width: '100%', height: '100%' }}
                            contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={defect.imageUrl}
                                    alt={defect.name}
                                    style={{ maxWidth: '100%', maxHeight: '90vh', display: 'block' }}
                                />

                                {showAnnotations && defect.cosmosAnalysis.boundingBoxes.map((box) => (
                                    <Tooltip
                                        key={box.id}
                                        title={
                                            <div style={{ fontSize: '12px' }}>
                                                <b>{box.label}</b>
                                                <div>{defect.cosmosAnalysis.description}</div>
                                            </div>
                                        }
                                        color="rgba(0,0,0,0.8)"
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: box.x, // Note: In a real app we'd map these to % or ensure image is fixed size
                                                top: box.y,
                                                width: box.width,
                                                height: box.height,
                                                border: `2px solid ${box.color}`,
                                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                                cursor: 'help'
                                            }}
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default DeepZoomViewer;
