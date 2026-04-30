export type FilterKey = 'calories' | 'protein' | 'carbs' | 'glutenFree';

export interface Filter {
  key: FilterKey;
  label: string;
  emoji: string;
  description: string;
  higherIsBetter: boolean;
  isBinary: boolean;
}

export const FILTERS: Filter[] = [
  {
    key: 'calories',
    label: 'Calorieën',
    emoji: '🔥',
    description: 'minder calorieën',
    higherIsBetter: false,
    isBinary: false,
  },
  {
    key: 'protein',
    label: 'Eiwit',
    emoji: '💪',
    description: 'meer eiwit',
    higherIsBetter: true,
    isBinary: false,
  },
  {
    key: 'carbs',
    label: 'Koolhydraten',
    emoji: '🌾',
    description: 'minder koolhydraten',
    higherIsBetter: false,
    isBinary: false,
  },
  {
    key: 'glutenFree',
    label: 'Glutenvrij',
    emoji: '🚫',
    description: 'geen gluten',
    higherIsBetter: false,
    isBinary: true,
  },
];
