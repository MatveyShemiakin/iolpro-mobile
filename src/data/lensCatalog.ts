import type { LensModel } from '../core/types';

function powers(min: number, max: number, step = 0.5): number[] {
  const values: number[] = [];
  for (let value = min; value <= max + 0.001; value += step) values.push(Number(value.toFixed(2)));
  return values;
}

export const lensCatalog: LensModel[] = [
  {
    id: 'generic-monofocal-1192',
    manufacturer: 'Generic',
    name: 'Monofocal hydrophobic reference A119.2',
    opticType: 'monofocal',
    aConstant: 119.2,
    availablePowers: powers(6, 34),
    constantSource: 'Demo catalog. Replace with ULIB/IOLCon/manufacturer optimized constants before clinical use.',
    warning: 'Демонстрационная константа; не использовать как источник клинической оптимизации.'
  },
  {
    id: 'generic-toric-1192',
    manufacturer: 'Generic',
    name: 'Toric reference A119.2',
    opticType: 'toric',
    aConstant: 119.2,
    availablePowers: powers(6, 34),
    toricCylinders: [1.0, 1.5, 2.25, 3.0, 3.75, 4.5, 5.25, 6.0],
    constantSource: 'Demo catalog. Replace with exact model-specific constants.',
    warning: 'Торические цилиндры приведены для демонстрации workflow, не как каталог конкретного производителя.'
  }
];
