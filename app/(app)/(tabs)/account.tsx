import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Linking, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  HelpCircle, 
  Shield, 
  ChevronRight,
  Mail,
  Phone,
  Volume2,
  Vibrate
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { useChatStore } from '@/store/chat-store';
import { useTheme } from '@/contexts/ThemeContext';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import ChatBot from '@/components/ui/ChatBot';

export default function AccountScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, logout } = useAuthStore();
  const { settings, updateSettings, getUnreadCount } = useNotificationStore();
  const { isVisible, setVisible, setContext } = useChatStore();
  
  React.useEffect(() => {
    // Set chat context
    if (user) {
      setContext({
        userRole: user.role,
        currentScreen: 'account',
        userName: user.name,
      });
    }
  }, [user]);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            router.replace('/');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleProfilePress = () => {
    router.push('/profile');
  };
  
  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleNotificationsPress = () => {
    Alert.alert(
      "Notification Settings",
      "Manage your notification preferences below or tap to view detailed settings.",
      [
        {
          text: "Close",
          style: "cancel"
        }
      ]
    );
  };

  const handleHelpPress = () => {
    Alert.alert(
      "Help & Support",
      "How would you like to get help?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Chat with Ripple",
          onPress: () => {
            setVisible(true);
          }
        },
        {
          text: "Email Support",
          onPress: () => {
            Linking.openURL('mailto:support@kindripple.com?subject=Help Request&body=Hello, I need help with...');
          }
        },
        {
          text: "Call Support",
          onPress: () => {
            Linking.openURL('tel:+1-800-KIND-HELP');
          }
        }
      ]
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      "Privacy Policy",
      "Our Privacy Policy outlines how we collect, use, and protect your personal information. We are committed to maintaining your privacy and data security.\n\nKey points:\n• We only collect necessary information\n• Your data is never sold to third parties\n• You can request data deletion at any time\n• All data is encrypted and securely stored",
      [
        {
          text: "Close",
          style: "cancel"
        },
        {
          text: "View Full Policy",
          onPress: () => {
            Linking.openURL('https://kindripple.com/privacy');
          }
        }
      ]
    );
  };

  const handleChatPress = () => {
    setVisible(true);
  };

  const handleChatClose = () => {
    setVisible(false);
  };
  
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    if (!user) return theme.primary;
    
    switch (user.role) {
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
  
  // Get role display name
  const getRoleDisplayName = () => {
    if (!user) return 'User';
    
    switch (user.role) {
      case 'restaurant':
        return 'Restaurant';
      case 'ngo':
        return 'NGO';
      case 'volunteer':
        return 'Volunteer';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  const styles = createStyles(theme, getRoleColor());
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar
              source={user?.avatar}
              name={user?.name}
              size={80}
              userRole={user?.role}
            />
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor() + '20' }]}>
                <Text style={[styles.roleText, { color: getRoleColor() }]}>
                  {getRoleDisplayName()}
                </Text>
              </View>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.editButton, { borderColor: getRoleColor() }]}
            onPress={handleProfilePress}
          >
            <Text style={[styles.editButtonText, { color: getRoleColor() }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </Card>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleProfilePress}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                  <User size={20} color={getRoleColor()} />
                </View>
                <Text style={styles.menuText}>Profile</Text>
              </View>
              <ChevronRight size={20} color={theme.text.light} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handleSettingsPress}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                  <Settings size={20} color={getRoleColor()} />
                </View>
                <Text style={styles.menuText}>Settings</Text>
              </View>
              <ChevronRight size={20} color={theme.text.light} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleNotificationsPress}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.ngo.primary + '20' }]}>
                  <Bell size={20} color={theme.ngo.primary} />
                </View>
                <Text style={styles.menuText}>Food Listings</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Switch
                  value={settings.foodListings}
                  onValueChange={(value) => updateSettings({ foodListings: value })}
                  trackColor={{ false: theme.border, true: theme.ngo.primary + '40' }}
                  thumbColor={settings.foodListings ? theme.ngo.primary : theme.text.light}
                />
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.volunteer.primary + '20' }]}>
                  <User size={20} color={theme.volunteer.primary} />
                </View>
                <Text style={styles.menuText}>Volunteer Assignments</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Switch
                  value={settings.volunteerAssignments}
                  onValueChange={(value) => updateSettings({ volunteerAssignments: value })}
                  trackColor={{ false: theme.border, true: theme.volunteer.primary + '40' }}
                  thumbColor={settings.volunteerAssignments ? theme.volunteer.primary : theme.text.light}
                />
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.restaurant.primary + '20' }]}>
                  <Bell size={20} color={theme.restaurant.primary} />
                </View>
                <Text style={styles.menuText}>Delivery Updates</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Switch
                  value={settings.deliveryUpdates}
                  onValueChange={(value) => updateSettings({ deliveryUpdates: value })}
                  trackColor={{ false: theme.border, true: theme.restaurant.primary + '40' }}
                  thumbColor={settings.deliveryUpdates ? theme.restaurant.primary : theme.text.light}
                />
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.info + '20' }]}>
                  <Volume2 size={20} color={theme.info} />
                </View>
                <Text style={styles.menuText}>Sound</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Switch
                  value={settings.soundEnabled}
                  onValueChange={(value) => updateSettings({ soundEnabled: value })}
                  trackColor={{ false: theme.border, true: theme.info + '40' }}
                  thumbColor={settings.soundEnabled ? theme.info : theme.text.light}
                />
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.info + '20' }]}>
                  <Vibrate size={20} color={theme.info} />
                </View>
                <Text style={styles.menuText}>Vibration</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Switch
                  value={settings.vibrationEnabled}
                  onValueChange={(value) => updateSettings({ vibrationEnabled: value })}
                  trackColor={{ false: theme.border, true: theme.info + '40' }}
                  thumbColor={settings.vibrationEnabled ? theme.info : theme.text.light}
                />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleHelpPress}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.info + '20' }]}>
                  <HelpCircle size={20} color={theme.info} />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color={theme.text.light} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPress}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.info + '20' }]}>
                  <Shield size={20} color={theme.info} />
                </View>
                <Text style={styles.menuText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={theme.text.light} />
            </TouchableOpacity>
          </Card>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={theme.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Floating Action Button for Chat */}
      <FloatingActionButton
        onPress={handleChatPress}
        hasUnreadMessages={getUnreadCount() > 0}
      />

      {/* Chat Bot Modal */}
      <ChatBot
        visible={isVisible}
        onClose={handleChatClose}
        currentScreen="account"
      />
    </View>
  );
}

const createStyles = (theme: any, roleColor: string) => StyleSheet.create({
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
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 16,
  },
  menuCard: {
    padding: 0,
    borderRadius: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: theme.text.primary,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: theme.surface,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: theme.text.light,
    textAlign: 'center',
    marginBottom: 24,
  },
});