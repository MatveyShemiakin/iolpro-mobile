import type { BiometryInput, CalculationReport, LensModel } from './types';
import { formulaProviders } from './formulas';
import { generateToricCandidates } from './toric';
import { validateBiometry } from './validation';

export async function calculateReport(input: BiometryInput, lens?: LensModel): Promise<CalculationReport> {
  const issues = validateBiometry(input);
  const fatal = issues.some((issue) => issue.severity === 'error');

  const results = fatal
    ? []
    : await Promise.all(formulaProviders.map((provider) => Promise.resolve(provider.calculate(input, lens))));

  return {
    createdAt: new Date().toISOString(),
    input,
    issues,
    results,
    toricCandidates: fatal ? [] : generateToricCandidates(input, lens?.toricCylinders),
    auditTrail: [
      `IOLPro Mobile v0.2.0`,
      `Mode: ${input.mode}`,
      lens ? `Lens: ${lens.manufacturer} ${lens.name}` : 'Lens: generic A-constant only',
      'Clinical note: reference formula available only for UI/testing; modern formula connectors require authorized implementation.'
    ]
  };
}

export function exportReportJson(report: CalculationReport): string {
  return JSON.stringify(report, null, 2);
}
