import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Product } from '../../utils/scoring';

interface NutrientRowProps {
  label: string;
  value: string | null;
  highlight?: boolean;
}

function NutrientRow({ label, value, highlight }: NutrientRowProps) {
  return (
    <View style={[styles.nutrientRow, highlight && styles.nutrientRowHighlight]}>
      <Text style={styles.nutrientLabel}>{label}</Text>
      <Text style={[styles.nutrientValue, highlight && styles.nutrientValueHighlight]}>
        {value ?? '—'}
      </Text>
    </View>
  );
}

export default function ProductDetailScreen() {
  const params = useLocalSearchParams();
  const product: Product = JSON.parse(params.productData as string);
  const allProducts: Product[] = JSON.parse(params.allProductsData as string);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: product.name.slice(0, 30) }} />

      {/* Header */}
      <View style={styles.header}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ fontSize: 48 }}>🥗</Text>
          </View>
        )}
        <Text style={styles.name}>{product.name}</Text>
        {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
        {product.isGlutenFree && <Text style={styles.glutenFree}>🚫 Glutenvrij</Text>}
      </View>

      {/* Uitleg */}
      {product.explanation ? (
        <View style={styles.explanationCard}>
          <Text style={styles.sectionTitle}>⭐ Waarom de beste keuze?</Text>
          <Text style={styles.explanationText}>{product.explanation}</Text>
        </View>
      ) : null}

      {/* Voedingswaarden */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Voedingswaarden per 100g</Text>
        <NutrientRow
          label="🔥 Calorieën"
          value={product.calories !== null ? `${Math.round(product.calories)} kcal` : null}
        />
        <NutrientRow
          label="💪 Eiwit"
          value={product.protein !== null ? `${product.protein.toFixed(1)} g` : null}
        />
        <NutrientRow
          label="🌾 Koolhydraten"
          value={product.carbs !== null ? `${product.carbs.toFixed(1)} g` : null}
        />
        <NutrientRow
          label="🍬 Suikers"
          value={product.sugars !== null ? `${product.sugars.toFixed(1)} g` : null}
        />
      </View>

      {/* Vergelijking */}
      {allProducts.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vergelijking top {allProducts.length}</Text>
          {allProducts.map((p, i) => (
            <View key={p.id} style={[styles.compareRow, i === 0 && styles.compareRowBest]}>
              <Text style={styles.compareRank}>{i === 0 ? '⭐' : `${i + 1}.`}</Text>
              <Text style={styles.compareName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.compareCalories}>
                {p.calories !== null ? `${Math.round(p.calories)} kcal` : '—'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 26,
  },
  brand: {
    fontSize: 14,
    color: '#888',
  },
  glutenFree: {
    fontSize: 13,
    color: '#5d4037',
    backgroundColor: '#efebe9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  explanationCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2e7d32',
    gap: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#33691e',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutrientRowHighlight: {
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  nutrientLabel: {
    fontSize: 15,
    color: '#333',
  },
  nutrientValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  nutrientValueHighlight: {
    color: '#2e7d32',
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  compareRowBest: {
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  compareRank: {
    fontSize: 14,
    width: 24,
    textAlign: 'center',
  },
  compareName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  compareCalories: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
});
