import React from 'react';
import { StyleSheet } from 'react-native';
import Badge from './Badge';
import COLORS from '@/constants/colors';
import { FoodDonation, DeliveryTask } from '@/types';

interface StatusBadgeProps {
  status: FoodDonation['status'] | DeliveryTask['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          label: 'Available',
          color: COLORS.available,
          userRole: 'volunteer' as const,
        };
      case 'claimed':
        return {
          label: 'Claimed',
          color: COLORS.claimed,
          userRole: 'ngo' as const,
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          color: COLORS.inProgress,
          userRole: 'volunteer' as const,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: COLORS.completed,
          userRole: 'volunteer' as const,
        };
      case 'expired':
        return {
          label: 'Expired',
          color: COLORS.error,
          userRole: 'restaurant' as const,
        };
      case 'assigned':
        return {
          label: 'Assigned',
          color: COLORS.info,
          userRole: 'volunteer' as const,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: COLORS.error,
          userRole: 'restaurant' as const,
        };
      default:
        return {
          label: status,
          color: COLORS.text.secondary,
          userRole: 'volunteer' as const,
        };
    }
  };

  const { label, userRole } = getStatusConfig();

  return (
    <Badge
      label={label}
      variant="filled"
      userRole={userRole}
      size="small"
      style={styles.badge}
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    marginVertical: 4,
  },
});

export default StatusBadge;