import { FilterKey } from '../constants/filters';

export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  sugars: number | null;
  isGlutenFree: boolean;
  score: number;
  explanation: string;
}

export interface RawProduct {
  id: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
  };
  allergens?: string;
  allergens_tags?: string[];
}

export function parseProduct(raw: RawProduct): Product {
  const allergens = (raw.allergens_tags || []).join(' ') + (raw.allergens || '');
  const isGlutenFree = !allergens.toLowerCase().includes('gluten');

  return {
    id: raw.id,
    name: raw.product_name || 'Onbekend product',
    brand: raw.brands || '',
    imageUrl: raw.image_url || '',
    calories: raw.nutriments?.['energy-kcal_100g'] ?? null,
    protein: raw.nutriments?.proteins_100g ?? null,
    carbs: raw.nutriments?.carbohydrates_100g ?? null,
    sugars: raw.nutriments?.sugars_100g ?? null,
    isGlutenFree,
    score: 0,
    explanation: '',
  };
}

export function scoreAndSort(
  products: Product[],
  activeFilters: Set<FilterKey>
): Product[] {
  if (activeFilters.size === 0) return products;

  // Gluten filter: verwijder producten met gluten als glutenvrij actief is
  let filtered = products;
  if (activeFilters.has('glutenFree')) {
    filtered = products.filter((p) => p.isGlutenFree);
  }

  if (filtered.length === 0) return filtered;

  // Bereken ranges voor normalisatie
  type NumericFilterKey = 'calories' | 'protein' | 'carbs';
  const numericFilters: NumericFilterKey[] = ['calories', 'protein', 'carbs'];
  const ranges: Partial<Record<NumericFilterKey, { min: number; max: number }>> = {};

  for (const key of numericFilters) {
    if (!activeFilters.has(key)) continue;
    const values = filtered
      .map((p) => p[key] as number | null)
      .filter((v): v is number => v !== null && !isNaN(v));
    if (values.length < 2) continue;
    ranges[key] = { min: Math.min(...values), max: Math.max(...values) };
  }

  // Bereken score per product
  const scored = filtered.map((product) => {
    let totalScore = 0;
    let activeCount = 0;

    if (activeFilters.has('calories') && ranges.calories && product.calories !== null) {
      const { min, max } = ranges.calories;
      const range = max - min || 1;
      totalScore += (max - product.calories) / range; // minder = beter
      activeCount++;
    }

    if (activeFilters.has('protein') && ranges.protein && product.protein !== null) {
      const { min, max } = ranges.protein;
      const range = max - min || 1;
      totalScore += (product.protein - min) / range; // meer = beter
      activeCount++;
    }

    if (activeFilters.has('carbs') && ranges.carbs && product.carbs !== null) {
      const { min, max } = ranges.carbs;
      const range = max - min || 1;
      totalScore += (max - product.carbs) / range; // minder = beter
      activeCount++;
    }

    const finalScore = activeCount > 0 ? totalScore / activeCount : 0;
    return { ...product, score: finalScore };
  });

  scored.sort((a, b) => b.score - a.score);

  // Genereer uitleg voor het beste product
  if (scored.length > 0) {
    scored[0] = { ...scored[0], explanation: generateExplanation(scored[0], scored, activeFilters) };
  }

  return scored;
}

function generateExplanation(
  best: Product,
  all: Product[],
  activeFilters: Set<FilterKey>
): string {
  const parts: string[] = [];

  if (activeFilters.has('calories') && best.calories !== null) {
    const avgCalories =
      all.reduce((s, p) => s + (p.calories ?? 0), 0) / all.length;
    if (best.calories < avgCalories) {
      parts.push(
        `de minste calorieën (${Math.round(best.calories)} kcal/100g, gemiddeld ${Math.round(avgCalories)} kcal)`
      );
    }
  }

  if (activeFilters.has('protein') && best.protein !== null) {
    const avgProtein =
      all.reduce((s, p) => s + (p.protein ?? 0), 0) / all.length;
    if (best.protein > avgProtein) {
      parts.push(
        `het meeste eiwit (${best.protein.toFixed(1)}g/100g, gemiddeld ${avgProtein.toFixed(1)}g)`
      );
    }
  }

  if (activeFilters.has('carbs') && best.carbs !== null) {
    const avgCarbs = all.reduce((s, p) => s + (p.carbs ?? 0), 0) / all.length;
    if (best.carbs < avgCarbs) {
      parts.push(
        `de minste koolhydraten (${best.carbs.toFixed(1)}g/100g, gemiddeld ${avgCarbs.toFixed(1)}g)`
      );
    }
  }

  if (activeFilters.has('glutenFree') && best.isGlutenFree) {
    parts.push('bevat geen gluten');
  }

  if (parts.length === 0) return 'Dit product scoort het beste op basis van jouw filters.';

  if (parts.length === 1) return `Dit product heeft ${parts[0]}.`;
  const last = parts.pop()!;
  return `Dit product heeft ${parts.join(', ')} en ${last}.`;
}
