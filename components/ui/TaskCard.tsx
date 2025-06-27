import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Clock, Navigation, Package, MapPin } from 'lucide-react-native';
import { DeliveryTask } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { useTaskStore } from '@/store/task-store';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { getDirections } from '@/utils/navigation';

interface TaskCardProps {
  task: DeliveryTask;
  onPress: (task: DeliveryTask) => void;
  animationDelay?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onPress,
  animationDelay = 0
}) => {
  const { theme } = useTheme();
  const { getUserName } = useTaskStore();
  
  // Format pickup time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleGetDirections = (e: any) => {
    e.stopPropagation(); // Prevent card press
    getDirections(task.route.pickupLocation, task.route.dropoffLocation);
  };

  // Get user names from store
  const restaurantName = getUserName(task.restaurantId);
  const ngoName = getUserName(task.ngoId);

  const styles = createStyles(theme);

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => onPress(task)}
      style={styles.touchable}
    >
      <Card style={styles.card} animationDelay={animationDelay}>
        <View style={styles.header}>
          <Text style={styles.taskId}>Task #{task.id.slice(-4)}</Text>
          <View style={styles.headerRight}>
            <StatusBadge status={task.status} />
            {(task.status === 'assigned' || task.status === 'in-progress') && (
              <TouchableOpacity 
                style={[styles.directionsButton, { backgroundColor: theme.background }]}
                onPress={handleGetDirections}
              >
                <Navigation size={16} color={theme.volunteer.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.infoItem}>
            <Package size={18} color={theme.restaurant.primary} />
            <Text style={styles.infoText}>Pickup from: {restaurantName}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Navigation size={18} color={theme.ngo.primary} />
            <Text style={styles.infoText}>Deliver to: {ngoName}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={18} color={theme.text.secondary} />
            <Text style={styles.infoText}>Pickup at: {formatTime(task.pickupTime)}</Text>
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={[styles.routeMarker, { backgroundColor: theme.restaurant.primary }]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {task.route.pickupLocation.address}
            </Text>
          </View>
          
          <View style={[styles.routeLine, { backgroundColor: theme.border }]} />
          
          <View style={styles.routePoint}>
            <View style={[styles.routeMarker, { backgroundColor: theme.ngo.primary }]} />
            <Text style={styles.routeText} numberOfLines={1}>
              {task.route.dropoffLocation.address}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  touchable: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskId: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
  },
  directionsButton: {
    padding: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.text.secondary,
    flex: 1,
  },
  routeContainer: {
    marginTop: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  routeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routeLine: {
    width: 2,
    height: 20,
    marginLeft: 5,
  },
  routeText: {
    fontSize: 14,
    color: theme.text.secondary,
    flex: 1,
  },
});

export default TaskCard;