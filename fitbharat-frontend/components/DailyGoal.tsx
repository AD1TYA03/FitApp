import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: number;
  goal: number;
  unit?: string;
}

const DailyGoal: React.FC<Props> = ({ label, value, goal, unit = '' }) => {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value}{unit} / {goal}{unit}
      </Text>
      <View style={styles.progressBackground}>
        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 13,
    marginVertical: 6,
    color: '#222',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#FF4081',
    borderRadius: 3,
  },
});

export default DailyGoal;
