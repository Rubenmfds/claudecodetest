import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Product } from '../utils/scoring';

interface Props {
  product: Product;
  rank: number;
  allProducts: Product[];
}

export default function ProductCard({ product, rank, allProducts }: Props) {
  const router = useRouter();
  const isBest = rank === 0;

  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: {
        id: product.id,
        productData: JSON.stringify(product),
        allProductsData: JSON.stringify(allProducts.slice(0, 5)),
      },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, isBest && styles.cardBest]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {isBest && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ Beste keuze</Text>
        </View>
      )}
      <View style={styles.row}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>🥗</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          {product.brand ? (
            <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
          ) : null}
          <View style={styles.nutrients}>
            {product.calories !== null && (
              <NutrientTag emoji="🔥" value={`${Math.round(product.calories)} kcal`} />
            )}
            {product.protein !== null && (
              <NutrientTag emoji="💪" value={`${product.protein.toFixed(1)}g eiwit`} />
            )}
            {product.carbs !== null && (
              <NutrientTag emoji="🌾" value={`${product.carbs.toFixed(1)}g koolh.`} />
            )}
          </View>
          {product.isGlutenFree && (
            <Text style={styles.glutenFree}>🚫 Glutenvrij</Text>
          )}
        </View>
      </View>
      {isBest && product.explanation ? (
        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Waarom de beste keuze?</Text>
          <Text style={styles.explanationText}>{product.explanation}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function NutrientTag({ emoji, value }: { emoji: string; value: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{emoji} {value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardBest: {
    borderWidth: 2,
    borderColor: '#2e7d32',
    shadowColor: '#2e7d32',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  badge: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  brand: {
    fontSize: 12,
    color: '#888',
  },
  nutrients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    color: '#555',
  },
  glutenFree: {
    fontSize: 11,
    color: '#5d4037',
    marginTop: 2,
  },
  explanation: {
    marginTop: 12,
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    padding: 12,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: '#33691e',
    lineHeight: 18,
  },
});
