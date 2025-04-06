import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  value: number;
  goal: number;
  unit?: string;
}

const ProgressCard: React.FC<Props> = ({ title, value, goal, unit = '' }) => {
  const percent = Math.round((value / goal) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}{unit}</Text>
      <Text style={styles.meta}>Goal: {goal}{unit} ({percent}%)</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff0f5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF4081',
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  progressFill: {
    height: 10,
    backgroundColor: '#FF4081',
    borderRadius: 5,
  },
});

export default ProgressCard;
