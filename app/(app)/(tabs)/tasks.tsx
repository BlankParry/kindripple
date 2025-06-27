import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter, Plus } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useDonationStore } from '@/store/donation-store';
import { useTaskStore } from '@/store/task-store';
import { useChatStore } from '@/store/chat-store';
import { useTheme } from '@/contexts/ThemeContext';
import DonationCard from '@/components/ui/DonationCard';
import TaskCard from '@/components/ui/TaskCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ChatBot from '@/components/ui/ChatBot';
import { FoodDonation, DeliveryTask } from '@/types';

export default function TasksScreen() {
  const router = useRouter();
  const { theme } = useTheme();
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
  const { isVisible, setVisible, setContext } = useChatStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  
  useEffect(() => {
    loadData();
    
    // Set chat context
    if (user) {
      setContext({
        userRole: user.role,
        currentScreen: 'tasks',
        userName: user.name,
      });
    }
  }, [user]);
  
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

  const handleChatPress = () => {
    setVisible(true);
  };

  const handleChatClose = () => {
    setVisible(false);
  };
  
  // Get role-specific colors
  const getRoleColor = () => {
    switch (user?.role) {
      case 'restaurant':
        return theme.restaurant.primary;
      case 'ngo':
        return theme.ngo.primary;
      case 'volunteer':
        return theme.volunteer.primary;
      case 'admin':
        return theme.admin.primary;
      default:
        return theme.primary;
    }
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
              activeTab === 'active' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: getRoleColor() }]
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
              activeTab === 'active' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Claimed Donations</Text>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Filter size={20} color={theme.text.secondary} />
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
              activeTab === 'active' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerActions}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Filter size={20} color={theme.text.secondary} />
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
              activeTab === 'active' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'active' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'completed' && [styles.activeTab, { borderColor: getRoleColor() }]
            ]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'completed' && [styles.activeTabText, { color: getRoleColor() }]
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.headerActions}>
            <Text style={styles.sectionTitle}>All Donations</Text>
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Filter size={20} color={theme.text.secondary} />
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

  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
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
      >
        {renderRoleBasedContent()}
      </ScrollView>

      {/* Floating Action Button for Chat */}
      <FloatingActionButton
        onPress={handleChatPress}
        hasUnreadMessages={false}
      />

      {/* Chat Bot Modal */}
      <ChatBot
        visible={isVisible}
        onClose={handleChatClose}
        currentScreen="tasks"
      />
    </View>
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
    paddingBottom: 100, // Extra padding for FAB
  },
  roleContent: {
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: theme.surface,
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
    backgroundColor: theme.background,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text.secondary,
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
    color: theme.text.primary,
    marginBottom: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  section: {
    marginTop: 24,
  },
});