import { calculateReport } from './report';
import type { BiometryInput } from './types';

const eye: BiometryInput = {
  eye: 'OD',
  mode: 'standard',
  axialLength: 23.55,
  k1: 43.25,
  k1Axis: 10,
  k2: 44.1,
  k2Axis: 100,
  anteriorChamberDepth: 3.1,
  lensThickness: 4.4,
  whiteToWhite: 11.8,
  centralCornealThickness: 540,
  targetRefraction: -0.25,
  aConstant: 119.2,
  posteriorCorneaMode: 'nomogram'
};

calculateReport(eye).then((report) => {
  if (!report.results.length) throw new Error('No formula results produced');
  const srk = report.results.find((item) => item.formulaId === 'srk2-reference');
  if (!srk?.recommendedIolPower) throw new Error('SRK-II reference result missing');
  console.log(JSON.stringify({ ok: true, srkPower: srk.recommendedIolPower, issues: report.issues.length }, null, 2));
});
