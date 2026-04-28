import type { BiometryInput, FormulaProvider, FormulaResult, LensModel } from './types';
import { roundToStep } from './math';

function srk2AConstantAdjustment(axialLength: number): number {
  if (axialLength < 20) return 3;
  if (axialLength < 21) return 2;
  if (axialLength < 22) return 1;
  if (axialLength > 24.5) return -0.5;
  return 0;
}

export class Srk2ReferenceFormula implements FormulaProvider {
  id = 'srk2-reference';
  name = 'SRK-II reference / legacy';
  status = 'available' as const;
  requiredFields: (keyof BiometryInput)[] = ['axialLength', 'k1', 'k2', 'aConstant', 'targetRefraction'];

  calculate(input: BiometryInput, lens?: LensModel): FormulaResult {
    const kMean = (input.k1 + input.k2) / 2;
    const a = lens?.aConstant ?? input.aConstant;
    const adjustedA = a + srk2AConstantAdjustment(input.axialLength);
    const emmetropicPower = adjustedA - 2.5 * input.axialLength - 0.9 * kMean;
    const targetAdjusted = emmetropicPower - input.targetRefraction * 1.5;
    const recommended = roundToStep(targetAdjusted, 0.5);
    const predicted = (targetAdjusted - recommended) / 1.5 + input.targetRefraction;

    return {
      formulaId: this.id,
      formulaName: this.name,
      status: this.status,
      recommendedIolPower: recommended,
      predictedRefraction: Number(predicted.toFixed(2)),
      targetRefraction: input.targetRefraction,
      confidence: 'reference-only',
      messages: [
        'Legacy/public reference formula. Использовать только для проверки UI/пайплайна, не как современный клинический расчёт.',
        input.mode !== 'standard' ? 'Этот модуль не валидирован для toric/post-refractive workflow.' : 'Для клинического выбора сравните с современными лицензированными формулами.'
      ],
      metadata: {
        kMean: Number(kMean.toFixed(2)),
        aConstant: a,
        adjustedAConstant: Number(adjustedA.toFixed(2)),
        formulaEquation: 'P=A-2.5L-0.9K with SRK-II A adjustment; target approximation applied'
      }
    };
  }
}

export class LicensedConnectorFormula implements FormulaProvider {
  id: string;
  name: string;
  status = 'licensed-connector-required' as const;
  requiredFields: (keyof BiometryInput)[];
  private endpointPath: string;

  constructor(id: string, name: string, requiredFields: (keyof BiometryInput)[], endpointPath: string) {
    this.id = id;
    this.name = name;
    this.requiredFields = requiredFields;
    this.endpointPath = endpointPath;
  }

  calculate(input: BiometryInput): FormulaResult {
    return {
      formulaId: this.id,
      formulaName: this.name,
      status: this.status,
      targetRefraction: input.targetRefraction,
      confidence: 'licensed',
      messages: [
        'Требуется лицензированный/официально разрешённый backend-коннектор или локальный модуль с правом использования.',
        `Подготовленный endpoint: ${this.endpointPath}`
      ],
      metadata: {
        connectorReady: true,
        endpointPath: this.endpointPath,
        localImplementationIncluded: false
      }
    };
  }
}

export const formulaProviders: FormulaProvider[] = [
  new Srk2ReferenceFormula(),
  new LicensedConnectorFormula('barrett-universal-ii', 'Barrett Universal II', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'lensThickness', 'whiteToWhite', 'targetRefraction'], '/api/formulas/barrett-universal-ii'),
  new LicensedConnectorFormula('barrett-toric', 'Barrett Toric', ['axialLength', 'k1', 'k2', 'k1Axis', 'k2Axis', 'anteriorChamberDepth', 'lensThickness', 'whiteToWhite', 'incisionAxis', 'surgicallyInducedAstigmatism'], '/api/formulas/barrett-toric'),
  new LicensedConnectorFormula('kane', 'Kane', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'lensThickness', 'centralCornealThickness', 'targetRefraction'], '/api/formulas/kane'),
  new LicensedConnectorFormula('evo', 'EVO', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'lensThickness', 'targetRefraction'], '/api/formulas/evo'),
  new LicensedConnectorFormula('pearl-dgs', 'PEARL-DGS', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'lensThickness', 'whiteToWhite', 'centralCornealThickness', 'targetRefraction'], '/api/formulas/pearl-dgs'),
  new LicensedConnectorFormula('hill-rbf', 'Hill-RBF', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'targetRefraction'], '/api/formulas/hill-rbf'),
  new LicensedConnectorFormula('cooke-k6', 'Cooke K6', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'lensThickness', 'centralCornealThickness', 'targetRefraction'], '/api/formulas/cooke-k6'),
  new LicensedConnectorFormula('hoffer-qst', 'Hoffer QST', ['axialLength', 'k1', 'k2', 'anteriorChamberDepth', 'lensThickness', 'targetRefraction'], '/api/formulas/hoffer-qst')
];
