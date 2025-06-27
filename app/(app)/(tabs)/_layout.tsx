import { Tabs } from 'expo-router';
import { Home, Package, BarChart2, User, PlusCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const { user } = useAuthStore();
  
  const isRestaurant = user?.role === 'restaurant';

  // Get role-specific colors with proper contrast
  const getRoleColors = () => {
    switch (user?.role) {
      case 'restaurant':
        return {
          active: theme.restaurant.primary,
          inactive: theme.text.secondary,
          background: theme.surface,
        };
      case 'ngo':
        return {
          active: theme.ngo.primary,
          inactive: theme.text.secondary,
          background: theme.surface,
        };
      case 'volunteer':
        return {
          active: theme.volunteer.primary,
          inactive: theme.text.secondary,
          background: theme.surface,
        };
      case 'admin':
        return {
          active: theme.admin.primary,
          inactive: theme.text.secondary,
          background: theme.surface,
        };
      default:
        return {
          active: theme.primary,
          inactive: theme.text.secondary,
          background: theme.surface,
        };
    }
  };

  const colors = getRoleColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home 
              size={24} 
              color={color} 
              fill={focused ? color : 'transparent'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <Package 
              size={24} 
              color={color} 
              fill={focused ? color : 'transparent'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      {isRestaurant && (
        <Tabs.Screen
          name="create-donation"
          options={{
            title: 'Create',
            tabBarIcon: ({ color, focused }) => (
              <PlusCircle 
                size={24} 
                color={color} 
                fill={focused ? color : 'transparent'}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="impact"
        options={{
          title: 'Impact',
          tabBarIcon: ({ color, focused }) => (
            <BarChart2 
              size={24} 
              color={color} 
              fill={focused ? color : 'transparent'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={24} 
              color={color} 
              fill={focused ? color : 'transparent'}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}