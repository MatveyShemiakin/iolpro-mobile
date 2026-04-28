import type { BiometryInput, InputIssue } from './types';

function inRange(value: number | undefined, min: number, max: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

export function validateBiometry(input: BiometryInput): InputIssue[] {
  const issues: InputIssue[] = [];

  const checks: Array<[keyof BiometryInput, number | undefined, number, number, string]> = [
    ['axialLength', input.axialLength, 14, 40, 'AL вне допустимого технического диапазона 14–40 мм.'],
    ['k1', input.k1, 30, 60, 'K1 вне допустимого диапазона 30–60 D.'],
    ['k2', input.k2, 30, 60, 'K2 вне допустимого диапазона 30–60 D.'],
    ['k1Axis', input.k1Axis, 0, 180, 'Ось K1 должна быть 0–180°.'],
    ['k2Axis', input.k2Axis, 0, 180, 'Ось K2 должна быть 0–180°.'],
    ['targetRefraction', input.targetRefraction, -10, 5, 'Target refraction вне диапазона -10…+5 D.'],
    ['aConstant', input.aConstant, 110, 125, 'A-constant вне типичного диапазона 110–125.']
  ];

  for (const [field, value, min, max, message] of checks) {
    if (!inRange(value, min, max)) issues.push({ severity: 'error', field, message });
  }

  const optionalChecks: Array<[keyof BiometryInput, number | undefined, number, number, string]> = [
    ['anteriorChamberDepth', input.anteriorChamberDepth, 1.5, 6.5, 'ACD выглядит нетипично; проверьте единицы и метод измерения.'],
    ['lensThickness', input.lensThickness, 2.0, 7.0, 'LT выглядит нетипично; проверьте биометрию.'],
    ['whiteToWhite', input.whiteToWhite, 8.0, 14.5, 'WTW выглядит нетипично; проверьте значение.'],
    ['centralCornealThickness', input.centralCornealThickness, 350, 700, 'CCT выглядит нетипично; проверьте микрометры/миллиметры.'],
    ['incisionAxis', input.incisionAxis, 0, 180, 'Ось разреза должна быть 0–180°.'],
    ['surgicallyInducedAstigmatism', input.surgicallyInducedAstigmatism, 0, 2.5, 'SIA вне типичного диапазона 0–2.5 D.']
  ];

  for (const [field, value, min, max, message] of optionalChecks) {
    if (value !== undefined && !inRange(value, min, max)) issues.push({ severity: 'warning', field, message });
  }

  const astigmatism = Math.abs(input.k2 - input.k1);
  if (input.k2 < input.k1) {
    issues.push({ severity: 'warning', field: 'k2', message: 'K2 меньше K1. Обычно K2 = более крутой меридиан; проверьте ввод.' });
  }
  if (astigmatism > 4) {
    issues.push({ severity: 'warning', field: 'global', message: 'Астигматизм >4 D. Проверьте регулярность роговицы, топографию и применимость формул.' });
  }
  if (Math.abs(((input.k2Axis - input.k1Axis + 180) % 180) - 90) > 12) {
    issues.push({ severity: 'warning', field: 'global', message: 'Оси K1/K2 не ортогональны. Проверьте экспорт из прибора или ручной ввод.' });
  }
  if (input.axialLength < 22) {
    issues.push({ severity: 'info', field: 'axialLength', message: 'Короткий глаз: ожидайте большего разброса между формулами и проверьте ELP-параметры.' });
  }
  if (input.axialLength > 26) {
    issues.push({ severity: 'info', field: 'axialLength', message: 'Длинный глаз: используйте современные формулы/коррекцию AL и проверяйте риск гиперметропического сюрприза.' });
  }
  if (input.mode === 'postRefractive') {
    issues.push({ severity: 'info', field: 'global', message: 'Post-refractive режим требует специализированной формулы/истории рефракционной операции; legacy-оценка не предназначена для выбора ИОЛ.' });
  }
  if (input.posteriorCorneaMode === 'unknown' && input.mode === 'toric') {
    issues.push({ severity: 'warning', field: 'posteriorCorneaMode', message: 'Для toric-планирования желательно измерить или номограммно учесть заднюю поверхность роговицы.' });
  }

  return issues;
}
