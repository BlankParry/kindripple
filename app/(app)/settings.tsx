import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Trash2, 
  HelpCircle,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Card from '@/components/ui/Card';
import COLORS from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert(
              "Final Confirmation",
              "This will permanently delete your account and all associated data. Type 'DELETE' to confirm.",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Confirm Delete",
                  onPress: () => {
                    // In a real app, we would call an API to delete the account
                    logout();
                    router.replace('/');
                  },
                  style: "destructive"
                }
              ]
            );
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "You will receive an email with instructions to reset your password.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Send Email",
          onPress: () => {
            Alert.alert("Success", "Password reset email sent to your registered email address.");
          }
        }
      ]
    );
  };

  const handleLanguagePress = () => {
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];
    
    Alert.alert(
      "Select Language",
      "Choose your preferred language:",
      [
        ...languages.map(lang => ({
          text: lang,
          onPress: () => {
            setSelectedLanguage(lang);
            Alert.alert("Success", `Language changed to ${lang}`);
          }
        })),
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const handleHelpCenter = () => {
    Alert.alert(
      "Help Center",
      "Access our comprehensive help resources:",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "FAQ",
          onPress: () => {
            Linking.openURL('https://kindripple.com/faq');
          }
        },
        {
          text: "User Guide",
          onPress: () => {
            Linking.openURL('https://kindripple.com/guide');
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "How would you like to contact our support team?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Email",
          onPress: () => {
            Linking.openURL('mailto:support@kindripple.com?subject=Support Request');
          }
        },
        {
          text: "Phone",
          onPress: () => {
            Linking.openURL('tel:+1-800-KIND-HELP');
          }
        },
        {
          text: "Live Chat",
          onPress: () => {
            Alert.alert("Live Chat", "Live chat will be available soon. Please use email or phone for now.");
          }
        }
      ]
    );
  };
  
  // Get the appropriate color based on user role
  const getRoleColor = () => {
    if (!user) return COLORS.volunteer.primary;
    
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
        return COLORS.volunteer.primary;
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                <Bell size={20} color={getRoleColor()} />
              </View>
              <View>
                <Text style={styles.menuText}>Notifications</Text>
                <Text style={styles.menuSubtext}>
                  {notificationsEnabled ? 'Receive updates and alerts' : 'No notifications'}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                Alert.alert(
                  "Notifications", 
                  `Notifications have been ${value ? 'enabled' : 'disabled'}.`
                );
              }}
              trackColor={{ false: COLORS.border, true: getRoleColor() }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                <Moon size={20} color={getRoleColor()} />
              </View>
              <View>
                <Text style={styles.menuText}>Dark Mode</Text>
                <Text style={styles.menuSubtext}>
                  {darkModeEnabled ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={(value) => {
                setDarkModeEnabled(value);
                Alert.alert(
                  "Theme", 
                  `${value ? 'Dark' : 'Light'} mode will be applied on next app restart.`
                );
              }}
              trackColor={{ false: COLORS.border, true: getRoleColor() }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLanguagePress}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: getRoleColor() + '20' }]}>
                <Globe size={20} color={getRoleColor()} />
              </View>
              <View>
                <Text style={styles.menuText}>Language</Text>
                <Text style={styles.menuSubtext}>App display language</Text>
              </View>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{selectedLanguage}</Text>
              <ChevronRight size={20} color={COLORS.text.light} />
            </View>
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Lock size={20} color={COLORS.info} />
              </View>
              <View>
                <Text style={styles.menuText}>Change Password</Text>
                <Text style={styles.menuSubtext}>Update your account password</Text>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleHelpCenter}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.info + '20' }]}>
                <HelpCircle size={20} color={COLORS.info} />
              </View>
              <View>
                <Text style={styles.menuText}>Help Center</Text>
                <Text style={styles.menuSubtext}>FAQ and user guides</Text>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem} onPress={handleContactSupport}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Mail size={20} color={COLORS.info} />
              </View>
              <View>
                <Text style={styles.menuText}>Contact Support</Text>
                <Text style={styles.menuSubtext}>Get help from our team</Text>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.text.light} />
          </TouchableOpacity>
        </Card>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Trash2 size={20} color={COLORS.error} />
        <Text style={styles.deleteText}>Delete Account</Text>
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
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  menuSubtext: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
  },
  deleteText: {
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