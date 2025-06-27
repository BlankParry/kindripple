import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Card from './Card';
import COLORS from '@/constants/colors';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  suffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = COLORS.volunteer.primary,
  suffix,
}) => {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Text>
          {suffix && <Text style={styles.suffix}>{suffix}</Text>}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  suffix: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
});

export default MetricCard;