import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Plus } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { useTaskStore } from '@/store/task-store';
import DonationCard from '@/components/ui/DonationCard';
import TaskCard from '@/components/ui/TaskCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import COLORS from '@/constants/colors';
import { FoodDonation, DeliveryTask } from '@/types';

export default function TasksScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    donations, 
    fetchDonations, 
    getDonationsByRestaurant,
    getClaimedDonations
  } = useDonationStore();
  const { 
    tasks, 
    fetchTasks, 
    getTasksByVolunteer,
    getTasksByNGO
  } = useTaskStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
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
    router.push('/donation/new');
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
  
  // Restaurant view - Donations management
  const renderRestaurantContent = () => {
    const restaurantDonations = getDonationsByRestaurant(user?.id || '');
    
    // Filter donations based on active tab
    const filteredDonations = restaurantDonations.filter(donation => {
      if (activeTab === 'active') {
        return ['available', 'claimed', 'in-progress'].includes(donation.status);
      } else {
        return ['completed', 'expired'].includes(donation.status);
      }
    });
    
    return (
      <View style={styles.roleContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'active' && [styles.activeTab, { borderColor: COLORS.restaurant.primary }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: COLORS.restaurant.primary }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: COLORS.restaurant.primary }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: COLORS.restaurant.primary }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Your Donations</Text>
          <Button
            title="Add New"
            onPress={handleAddDonation}
            variant="outline"
            size="small"
            userRole="restaurant"
          />
        </View>
        
        {filteredDonations.length > 0 ? (
          <View>
            {filteredDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title={activeTab === 'active' ? "No Active Donations" : "No Past Donations"}
            message={activeTab === 'active' 
              ? "You don't have any active donations. Add a new donation to share surplus food."
              : "You haven't completed any donations yet."
            }
            buttonText={activeTab === 'active' ? "Add Donation" : undefined}
            onButtonPress={activeTab === 'active' ? handleAddDonation : undefined}
            userRole="restaurant"
          />
        )}
      </View>
    );
  };
  
  // NGO view - Donation management and volunteer coordination
  const renderNGOContent = () => {
    const claimedDonations = getClaimedDonations(user?.id || '');
    const ngoTasks = getTasksByNGO(user?.id || '');
    
    // Filter based on active tab
    const filteredDonations = claimedDonations.filter(donation => {
      if (activeTab === 'active') {
        return ['claimed', 'in-progress'].includes(donation.status);
      } else {
        return ['completed'].includes(donation.status);
      }
    });
    
    const filteredTasks = ngoTasks.filter(task => {
      if (activeTab === 'active') {
        return ['assigned', 'in-progress'].includes(task.status);
      } else {
        return ['completed', 'cancelled'].includes(task.status);
      }
    });
    
    return (
      <View style={styles.roleContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'active' && [styles.activeTab, { borderColor: COLORS.ngo.primary }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: COLORS.ngo.primary }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: COLORS.ngo.primary }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: COLORS.ngo.primary }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Claimed Donations</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>
        
        {filteredDonations.length > 0 ? (
          <View>
            {filteredDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                onPress={handleDonationPress}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title={activeTab === 'active' ? "No Active Donations" : "No Past Donations"}
            message={activeTab === 'active' 
              ? "You haven't claimed any donations yet. Go to the home tab to find available donations."
              : "You haven't completed any donations yet."
            }
            userRole="ngo"
          />
        )}
        
        {filteredTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Tasks</Text>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={handleTaskPress}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  
  // Volunteer view - Task management
  const renderVolunteerContent = () => {
    const volunteerTasks = getTasksByVolunteer(user?.id || '');
    
    // Filter tasks based on active tab
    const filteredTasks = volunteerTasks.filter(task => {
      if (activeTab === 'active') {
        return ['assigned', 'in-progress'].includes(task.status);
      } else {
        return ['completed', 'cancelled'].includes(task.status);
      }
    });
    
    return (
      <View style={styles.roleContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'active' && [styles.activeTab, { borderColor: COLORS.volunteer.primary }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: COLORS.volunteer.primary }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: COLORS.volunteer.primary }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: COLORS.volunteer.primary }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>
        
        {filteredTasks.length > 0 ? (
          <View>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={handleTaskPress}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            title={activeTab === 'active' ? "No Active Tasks" : "No Completed Tasks"}
            message={activeTab === 'active' 
              ? "You don't have any active tasks. Check back later for new assignments."
              : "You haven't completed any tasks yet."
            }
            userRole="volunteer"
          />
        )}
      </View>
    );
  };
  
  // Admin view - All tasks and donations
  const renderAdminContent = () => {
    // Filter based on active tab
    const filteredDonations = donations.filter(donation => {
      if (activeTab === 'active') {
        return ['available', 'claimed', 'in-progress'].includes(donation.status);
      } else {
        return ['completed', 'expired'].includes(donation.status);
      }
    });
    
    const filteredTasks = tasks.filter(task => {
      if (activeTab === 'active') {
        return ['assigned', 'in-progress'].includes(task.status);
      } else {
        return ['completed', 'cancelled'].includes(task.status);
      }
    });
    
    return (
      <View style={styles.roleContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'active' && [styles.activeTab, { borderColor: COLORS.admin.primary }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: COLORS.admin.primary }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: COLORS.admin.primary }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: COLORS.admin.primary }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.headerActions}>
            <Text style={styles.sectionTitle}>All Donations</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={COLORS.text.secondary} />
            </TouchableOpacity>
          </View>
          
          {filteredDonations.length > 0 ? (
            <View>
              {filteredDonations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  onPress={handleDonationPress}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="No Donations"
              message="There are no donations in this category."
              userRole="admin"
            />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Tasks</Text>
          
          {filteredTasks.length > 0 ? (
            <View>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={handleTaskPress}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="No Tasks"
              message="There are no tasks in this category."
              userRole="admin"
            />
          )}
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
  roleContent: {
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.secondary,
  },
  activeTabText: {
    fontWeight: '600',
  },
  headerActions: {
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