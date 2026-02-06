export type UserRole = 'EQUIPMENT_ENG' | 'YIELD_ENG';

export interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

export interface CosmosAnalysis {
  confidence: number;
  pattern: string; // e.g., "Scratch", "Particle"
  description: string; // Physical description
  boundingBoxes: BoundingBox[];
}

export interface SafetyLog {
  id: string;
  timestamp: string;
  action: 'FILTERED' | 'PASSED' | 'FLAGGED';
  details: string;
}

export interface SafetyReport {
  originalContent: string; // Contains sensitive info
  redactedContent: string; // Safe for general view
  logs: SafetyLog[];
}

export interface Defect {
  id: string;
  name: string;
  imageUrl: string; // URL to the SEM image
  thumbnailUrl: string;
  detectedAt: string;
  status: 'New' | 'Reviewing' | 'Closed';
  cosmosAnalysis: CosmosAnalysis;
  safetyReport: SafetyReport;
}
