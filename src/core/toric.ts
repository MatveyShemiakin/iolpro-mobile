import type { BiometryInput, ToricCandidate } from './types';
import { cylinderFromVector, normalizeAxis, vectorFromCylinder } from './math';

const DEFAULT_IOL_TO_CORNEAL_RATIO = 0.7;

export function estimateCornealCylinder(input: BiometryInput): { cylinder: number; axis: number } {
  const rawCylinder = Math.abs(input.k2 - input.k1);
  const steepAxis = input.k2 >= input.k1 ? input.k2Axis : input.k1Axis;
  const corneal = vectorFromCylinder(rawCylinder, steepAxis);

  const sia = input.surgicallyInducedAstigmatism ?? 0;
  const incisionAxis = input.incisionAxis ?? steepAxis;
  const siaVector = vectorFromCylinder(sia, incisionAxis);

  const net = cylinderFromVector(corneal.x - siaVector.x, corneal.y - siaVector.y);
  return { cylinder: Number(net.cylinder.toFixed(2)), axis: normalizeAxis(Number(net.axis.toFixed(0))) };
}

function residualForToric(cornealCylinder: number, cornealAxis: number, toricCornealCylinder: number, toricAxis: number) {
  const cornealVector = vectorFromCylinder(cornealCylinder, cornealAxis);
  const toricVector = vectorFromCylinder(toricCornealCylinder, toricAxis);
  return cylinderFromVector(cornealVector.x - toricVector.x, cornealVector.y - toricVector.y);
}

export function estimateRotationPenalty(cornealEquivalentCylinder: number, degrees: number): number {
  return Math.abs(cornealEquivalentCylinder * Math.sin((2 * degrees * Math.PI) / 180));
}

export function generateToricCandidates(input: BiometryInput, iolPlaneCylinders: number[] = [1.0, 1.5, 2.25, 3.0, 3.75, 4.5, 5.25, 6.0]): ToricCandidate[] {
  if (input.mode !== 'toric') return [];
  const corneal = estimateCornealCylinder(input);
  return iolPlaneCylinders.map((iolCylinder) => {
    const cornealEquivalent = iolCylinder * DEFAULT_IOL_TO_CORNEAL_RATIO;
    const residual = residualForToric(corneal.cylinder, corneal.axis, cornealEquivalent, corneal.axis);
    return {
      iolCylinderPlane: iolCylinder,
      estimatedCornealPlane: Number(cornealEquivalent.toFixed(2)),
      axis: corneal.axis,
      residualCylinder: Number(residual.cylinder.toFixed(2)),
      residualAxis: normalizeAxis(Number(residual.axis.toFixed(0))),
      rotationPenalty5deg: Number(estimateRotationPenalty(cornealEquivalent, 5).toFixed(2)),
      rotationPenalty10deg: Number(estimateRotationPenalty(cornealEquivalent, 10).toFixed(2))
    };
  }).sort((a, b) => a.residualCylinder - b.residualCylinder);
}
