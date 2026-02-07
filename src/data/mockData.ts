import type { Defect } from '../types';
import { generateSemImage } from '../utils/imageGenerator';

export const MOCK_DEFECTS: Defect[] = [
    {
        id: 'DEF-20260206-001',
        name: 'CMP Scratch - Wafer 42',
        imageUrl: generateSemImage('scratch'),
        thumbnailUrl: generateSemImage('scratch'),
        detectedAt: '2026-02-06T08:30:00Z',
        status: 'Reviewing',
        cosmosAnalysis: {
            confidence: 0.98,
            pattern: 'Micro-Scratch',
            description: 'The scratch presents a 45-degree angle with rough edges. Physically, it appears consistent with chemical-mechanical planarization (CMP) slurry residue drag.',
            boundingBoxes: [
                {
                    id: 'bbox-1',
                    x: 200,
                    y: 100, // Adjusted to match SVG path
                    width: 400,
                    height: 400,
                    label: 'Scratch Core',
                    color: '#ff0000',
                },
            ],
        },
        safetyReport: {
            originalContent: `
# Root Cause Analysis (Internal)

**Machine ID**: CMP-X09 (Fab 12A)
**Recipe**: POLY-800-REV3
**Process Parameters**:
- Down Force: 5.2 psi (Out of Spec > 5.0)
- Slurry Flow: 200 ml/min
- Pad Life: 85%

**Assessment**:
The scratch is likely caused by agglomerated slurry particles due to high down force on CMP-X09. Recommend immediate PM.
      `,
            redactedContent: `
# Root Cause Analysis (General)

**Machine ID**: CMP-***
**Recipe**: ****-***-****
**Process Parameters**:
- Down Force: [REDACTED] (Out of Spec)
- Slurry Flow: [REDACTED]
- Pad Life: [REDACTED]

**Assessment**:
The scratch is likely caused by agglomerated slurry particles due to process parameter excursion. Recommend immediate PM.
      `,
            logs: [
                {
                    id: 'log-1',
                    timestamp: '2026-02-06T08:31:00Z',
                    action: 'FILTERED',
                    details: 'Masked Machine ID "CMP-X09" for Yield Engineering Group',
                },
                {
                    id: 'log-2',
                    timestamp: '2026-02-06T08:31:01Z',
                    action: 'FILTERED',
                    details: 'Masked specific process parameters (Down Force, Slurry Flow).',
                },
            ],
        },
    },
    {
        id: 'DEF-20260206-002',
        name: 'Unknown Particle - Edge',
        imageUrl: generateSemImage('particle'),
        thumbnailUrl: generateSemImage('particle'),
        detectedAt: '2026-02-06T09:15:00Z',
        status: 'New',
        cosmosAnalysis: {
            confidence: 0.85,
            pattern: 'Organic Particle',
            description: 'Circular particle approximately 20nm in diameter. Texture suggests organic contamination, possibly photoresist residue or environmental dust.',
            boundingBoxes: [
                {
                    id: 'bbox-2',
                    x: 350, // Adjusted to match SVG circle
                    y: 250,
                    width: 100,
                    height: 100,
                    label: 'Particle',
                    color: '#ffff00',
                },
            ],
        },
        safetyReport: {
            originalContent: `
# Particle Analysis

**Location**: Edge exclusion zone (2mm).
**Source**: Likely Photo-Bay 3 (Track 2).
**Composition**: Carbon-rich.

**Action**: Verify filter efficiency on Track 2.
      `,
            redactedContent: `
# Particle Analysis

**Location**: Edge exclusion zone.
**Source**: Litho Area.
**Composition**: Carbon-rich.

**Action**: Verify filtration systems.
      `,
            logs: [
                {
                    id: 'log-3',
                    timestamp: '2026-02-06T09:16:00Z',
                    action: 'PASSED',
                    details: 'General location info is safe.',
                },
            ],
        },
    },
];
