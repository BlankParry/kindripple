import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, MapPin, Plus } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { useTaskStore } from '@/store/task-store';
import { useTheme } from '@/contexts/ThemeContext';
import DonationCard from '@/components/ui/DonationCard';
import TaskCard from '@/components/ui/TaskCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { FoodDonation, DeliveryTask } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuthStore();
  const { 
    donations, 
    fetchDonations, 
    getAvailableDonations, 
    getDonationsByRestaurant,
    getClaimedDonations
  } = useDonationStore();
  const { 
    tasks, 
    fetchTasks, 
    getActiveTasksByVolunteer 
  } = useTaskStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    loadData();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const loadData = async () => {
    await Promise.all([
      fetchDonations(),
      fetchTasks()
    ]);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleDonationPress = (donation: FoodDonation) => {
    router.push(`/donation/${donation.id}`);
  };
  
  const handleTaskPress = (task: DeliveryTask) => {
    router.push(`/task/${task.id}`);
  };
  
  const handleAddDonation = () => {
    router.push('/(app)/(tabs)/create-donation');
  };
  
  // Render content based on user role
  const renderRoleBasedContent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'restaurant':
        return renderRestaurantContent();
      case 'ngo':
        return renderNGOContent();
      case 'volunteer':
        return renderVolunteerContent();
      case 'admin':
        return renderAdminContent();
      default:
        return null;
    }
  };
  
  // Restaurant view
  const renderRestaurantContent = () => {
    const restaurantDonations = getDonationsByRestaurant(user?.id || '');
    
    return (
      <View style={styles.roleContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Donations</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.restaurant.primary }]}
            onPress={handleAddDonation}
            activeOpacity={0.8}
          >
            <Plus size={20} color={theme.text.inverse} />
            <Text style={[styles.addButtonText, { color: theme.text.inverse }]}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {restaurantDonations.length > 0 ? (
          <View>
            {restaurantDonations.map((donation, index) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
                animationDelay={index * 100}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No Donations Yet"
            message="Start sharing your surplus food with those in need."
            buttonText="Add Donation"
            onButtonPress={handleAddDonation}
            userRole="restaurant"
          />
        )}
      </View>
    );
  };
  
  // NGO view
  const renderNGOContent = () => {
    const availableDonations = getAvailableDonations();
    const claimedDonations = getClaimedDonations(user?.id || '');
    
    return (
      <View style={styles.roleContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Donations</Text>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.8}
          >
            <Filter size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>
        
        {availableDonations.length > 0 ? (
          <View>
            {availableDonations.map((donation, index) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
                animationDelay={index * 100}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No Available Donations"
            message="Check back later for new donations from restaurants."
            userRole="ngo"
          />
        )}
        
        {claimedDonations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Claimed Donations</Text>
            {claimedDonations.map((donation, index) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
                animationDelay={index * 100}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  
  // Volunteer view
  const renderVolunteerContent = () => {
    const activeTasks = getActiveTasksByVolunteer(user?.id || '');
    const availableDonations = getAvailableDonations();
    
    return (
      <View style={styles.roleContent}>
        {activeTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Active Tasks</Text>
            {activeTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={handleTaskPress}
                animationDelay={index * 100}
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Donations</Text>
          {availableDonations.length > 0 ? (
            <View>
              {availableDonations.slice(0, 3).map((donation, index) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onPress={handleDonationPress}
                  animationDelay={index * 100}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="No Available Donations"
              message="Check back later for new donations from restaurants."
              userRole="volunteer"
            />
          )}
        </View>
      </View>
    );
  };
  
  // Admin view
  const renderAdminContent = () => {
    return (
      <View style={styles.roleContent}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          {donations.slice(0, 3).map((donation, index) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onPress={handleDonationPress}
              animationDelay={index * 100}
            />
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          {tasks.slice(0, 3).map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={handleTaskPress}
              animationDelay={index * 100}
            />
          ))}
        </View>
      </View>
    );
  };

  const styles = createStyles(theme);
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.text.secondary} />
              <Text style={styles.location}>Anytown, CA</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.searchButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.8}
            >
              <Search size={24} color={theme.text.primary} />
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>
        
        {renderRoleBasedContent()}
      </ScrollView>
    </Animated.View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: theme.text.secondary,
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleContent: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginTop: 32,
  },
});