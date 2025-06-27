import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
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
  Phone
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import COLORS from '@/constants/colors';

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
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
      "Notifications",
      `Notifications are currently ${notificationsEnabled ? 'enabled' : 'disabled'}. Would you like to ${notificationsEnabled ? 'disable' : 'enable'} them?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: notificationsEnabled ? 'Disable' : 'Enable',
          onPress: () => {
            setNotificationsEnabled(!notificationsEnabled);
            Alert.alert(
              "Success", 
              `Notifications have been ${!notificationsEnabled ? 'enabled' : 'disabled'}.`
            );
          }
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
  
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    if (!user) return COLORS.primary;
    
    switch (user.role) {
      case 'restaurant':
        return COLORS.restaurant.primary;
      case 'ngo':
        return COLORS.ngo.primary;
      case 'volunteer':
        return COLORS.volunteer.primary;
      case 'admin':
        return COLORS.admin.primary;
      default:
        return COLORS.primary;
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleSettingsPress}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                <Settings size={20} color={getRoleColor()} />
              </View>
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleNotificationsPress}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                <Bell size={20} color={getRoleColor()} />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>
                {notificationsEnabled ? 'On' : 'Off'}
              </Text>
              <ChevronRight size={20} color={COLORS.text.light} />
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelpPress}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.info + '20' }]}>
                <HelpCircle size={20} color={COLORS.info} />
              </View>
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPress}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Shield size={20} color={COLORS.info} />
              </View>
              <Text style={styles.menuText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
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
    color: COLORS.text.primary,
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
    color: COLORS.text.secondary,
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
    color: COLORS.text.primary,
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
    color: COLORS.text.primary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
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
    color: COLORS.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.text.light,
    textAlign: 'center',
    marginBottom: 24,
  },
});