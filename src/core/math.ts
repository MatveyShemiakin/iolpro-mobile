export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeAxis(axis: number): number {
  const normalized = ((axis % 180) + 180) % 180;
  return normalized === 0 ? 180 : normalized;
}

export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function vectorFromCylinder(cylinder: number, axis: number): { x: number; y: number } {
  const theta = deg2rad(2 * axis);
  return { x: cylinder * Math.cos(theta), y: cylinder * Math.sin(theta) };
}

export function cylinderFromVector(x: number, y: number): { cylinder: number; axis: number } {
  const cylinder = Math.sqrt(x * x + y * y);
  const axis = normalizeAxis(rad2deg(Math.atan2(y, x)) / 2);
  return { cylinder, axis };
}
