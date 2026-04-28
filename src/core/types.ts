export type EyeSide = 'OD' | 'OS';
export type CalculationMode = 'standard' | 'toric' | 'postRefractive';
export type FormulaStatus = 'available' | 'licensed-connector-required' | 'disabled';

export interface BiometryInput {
  patientId?: string;
  eye: EyeSide;
  mode: CalculationMode;
  axialLength: number;
  k1: number;
  k1Axis: number;
  k2: number;
  k2Axis: number;
  anteriorChamberDepth?: number;
  lensThickness?: number;
  whiteToWhite?: number;
  centralCornealThickness?: number;
  targetRefraction: number;
  aConstant: number;
  surgeonFactor?: number;
  incisionAxis?: number;
  surgicallyInducedAstigmatism?: number;
  posteriorCorneaMode: 'measured' | 'nomogram' | 'unknown';
  notes?: string;
}

export interface LensModel {
  id: string;
  manufacturer: string;
  name: string;
  opticType: 'monofocal' | 'toric' | 'edof' | 'multifocal';
  aConstant: number;
  availablePowers: number[];
  toricCylinders?: number[];
  constantSource: string;
  warning?: string;
}

export interface FormulaResult {
  formulaId: string;
  formulaName: string;
  status: FormulaStatus;
  recommendedIolPower?: number;
  predictedRefraction?: number;
  targetRefraction: number;
  confidence: 'clinical-validation-required' | 'reference-only' | 'licensed';
  messages: string[];
  metadata: Record<string, string | number | boolean | null>;
}

export interface ToricCandidate {
  iolCylinderPlane: number;
  estimatedCornealPlane: number;
  axis: number;
  residualCylinder: number;
  residualAxis: number;
  rotationPenalty5deg: number;
  rotationPenalty10deg: number;
}

export interface InputIssue {
  severity: 'error' | 'warning' | 'info';
  field: keyof BiometryInput | 'global';
  message: string;
}

export interface CalculationReport {
  createdAt: string;
  input: BiometryInput;
  issues: InputIssue[];
  results: FormulaResult[];
  toricCandidates: ToricCandidate[];
  auditTrail: string[];
}

export interface FormulaProvider {
  id: string;
  name: string;
  status: FormulaStatus;
  requiredFields: (keyof BiometryInput)[];
  calculate(input: BiometryInput, lens?: LensModel): Promise<FormulaResult> | FormulaResult;
}
