import { useState, useCallback, useRef } from 'react';
import { FilterKey } from '../constants/filters';
import { Product, RawProduct, parseProduct, scoreAndSort } from '../utils/scoring';

const API_BASE = 'https://world.openfoodfacts.org/cgi/search.pl';
const FIELDS = 'id,product_name,brands,image_url,nutriments,allergens,allergens_tags';

export function useProductSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string, activeFilters: Set<FilterKey>) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search_terms: query,
        fields: FIELDS,
        json: '1',
        page_size: '30',
        action: 'process',
      });

      const response = await fetch(`${API_BASE}?${params}`, {
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Netwerkfout');

      const data = await response.json();
      const rawProducts: RawProduct[] = data.products || [];

      const parsed = rawProducts
        .filter((p) => p.product_name)
        .map(parseProduct);

      const sorted = scoreAndSort(parsed, activeFilters);
      setResults(sorted);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Kon producten niet laden. Controleer je internetverbinding.');
    } finally {
      setLoading(false);
    }
  }, []);

  const rescore = useCallback((products: Product[], activeFilters: Set<FilterKey>) => {
    setResults(scoreAndSort([...products], activeFilters));
  }, []);

  return { results, loading, error, search, rescore };
}
