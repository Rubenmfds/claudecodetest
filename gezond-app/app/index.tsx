import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { Stack } from 'expo-router';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import { FilterKey } from '../constants/filters';
import { useProductSearch } from '../hooks/useProductSearch';
import { Product } from '../utils/scoring';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const { results, loading, error, search, rescore } = useProductSearch();
  const lastResults = useRef<Product[]>([]);

  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
    search(query, activeFilters);
  }, [query, activeFilters, search]);

  const handleToggleFilter = useCallback(
    (key: FilterKey) => {
      setActiveFilters((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        if (lastResults.current.length > 0) {
          rescore(lastResults.current, next);
        }
        return next;
      });
    },
    [rescore]
  );

  // Keep track of unscored results so we can rescore when filters change
  React.useEffect(() => {
    if (results.length > 0) lastResults.current = results;
  }, [results]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '🥗 GezondKiezen' }} />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={handleSearch}
      />
      <FilterBar activeFilters={activeFilters} onToggle={handleToggleFilter} />

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Producten laden...</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && results.length === 0 && query.length > 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>Geen producten gevonden{activeFilters.has('glutenFree') ? ' die glutenvrij zijn' : ''}.</Text>
        </View>
      )}

      {!loading && !error && results.length === 0 && query.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.welcomeEmoji}>🥦</Text>
          <Text style={styles.welcomeTitle}>Vind de gezondste keuze</Text>
          <Text style={styles.welcomeText}>
            Zoek een product (bijv. "yoghurt" of "brood") en stel je filters in om de gezondste variant bovenaan te zien.
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProductCard product={item} rank={index} allProducts={results} />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  list: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  loadingText: {
    color: '#666',
    fontSize: 15,
    marginTop: 8,
  },
  errorEmoji: { fontSize: 48 },
  errorText: {
    color: '#c62828',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyEmoji: { fontSize: 48 },
  emptyText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
  },
  welcomeEmoji: { fontSize: 56 },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
