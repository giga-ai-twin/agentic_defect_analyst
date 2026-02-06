import React, { useMemo } from 'react';
import * as Diff from 'diff';


interface SimpleDiffViewerProps {
    oldValue: string;
    newValue: string;
}

const SimpleDiffViewer: React.FC<SimpleDiffViewerProps> = ({ oldValue, newValue }) => {
    const diff = useMemo(() => {
        return Diff.diffWords(oldValue, newValue);
    }, [oldValue, newValue]);

    return (
        <div style={{
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            background: '#fff',
            padding: '16px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap'
        }}>
            {diff.map((part, index) => {
                const color = part.added ? '#e6ffec' : part.removed ? '#ffebe9' : 'transparent';
                const textColor = part.added ? '#000' : part.removed ? '#000' : 'inherit';
                const decoration = part.removed ? 'line-through' : 'none';
                const opacity = part.removed ? 0.5 : 1;

                return (
                    <span
                        key={index}
                        style={{
                            backgroundColor: color,
                            color: textColor,
                            textDecoration: decoration,
                            opacity: opacity
                        }}
                    >
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
};

export default SimpleDiffViewer;
