import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Home, Package, BarChart2, User, PlusCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuthStore();
  
  const isRestaurant = user?.role === 'restaurant';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007AFF',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#999',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      {isRestaurant && (
        <Tabs.Screen
          name="create-donation"
          options={{
            title: 'Create',
            tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="impact"
        options={{
          title: 'Impact',
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}