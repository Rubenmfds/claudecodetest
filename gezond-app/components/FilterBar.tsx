import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FILTERS, FilterKey } from '../constants/filters';

interface Props {
  activeFilters: Set<FilterKey>;
  onToggle: (key: FilterKey) => void;
}

export default function FilterBar({ activeFilters, onToggle }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Prioriteit:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {FILTERS.map((filter) => {
          const active = activeFilters.has(filter.key);
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onToggle(filter.key)}
            >
              <Text style={styles.emoji}>{filter.emoji}</Text>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginLeft: 16,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
  },
  emoji: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#2e7d32',
    fontWeight: '700',
  },
});
