import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, MapPin, Plus } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { useTaskStore } from '@/store/task-store';
import DonationCard from '@/components/ui/DonationCard';
import TaskCard from '@/components/ui/TaskCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import COLORS from '@/constants/colors';
import { FoodDonation, DeliveryTask } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
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
  
  useEffect(() => {
    loadData();
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
            style={[styles.addButton, { backgroundColor: COLORS.restaurant.primary }]}
            onPress={handleAddDonation}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
        
        {restaurantDonations.length > 0 ? (
          <View>
            {restaurantDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
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
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>
        
        {availableDonations.length > 0 ? (
          <View>
            {availableDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
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
            {claimedDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
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
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={handleTaskPress}
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Donations</Text>
          {availableDonations.length > 0 ? (
            <View>
              {availableDonations.slice(0, 3).map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onPress={handleDonationPress}
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
          {donations.slice(0, 3).map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onPress={handleDonationPress}
            />
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          {tasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={handleTaskPress}
            />
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={COLORS.text.secondary} />
            <Text style={styles.location}>Anytown, CA</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>
      
      {renderRoleBasedContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
  },
});