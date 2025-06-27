import { create } from 'zustand';
import { DeliveryTask } from '@/types';
import { mockTasks } from '@/mocks/tasks';
import { supabase } from '@/lib/supabase';

interface TaskState {
  tasks: DeliveryTask[];
  userNames: Record<string, string>; // Cache for user names
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchUserNames: (userIds: string[]) => Promise<void>;
  createTask: (task: Omit<DeliveryTask, 'id' | 'createdAt'>) => Promise<DeliveryTask>;
  updateTaskStatus: (taskId: string, status: DeliveryTask['status']) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  getTaskById: (id: string) => DeliveryTask | undefined;
  getTasksByVolunteer: (volunteerId: string) => DeliveryTask[];
  getTasksByNGO: (ngoId: string) => DeliveryTask[];
  getActiveTasksByVolunteer: (volunteerId: string) => DeliveryTask[];
  getUserName: (userId: string) => string;
}

// Helper function to map Supabase task to our app DeliveryTask type
const mapSupabaseTask = (task: any): DeliveryTask => {
  return {
    id: task.id,
    donationId: task.donation_id,
    volunteerId: task.volunteer_id,
    ngoId: task.ngo_id,
    restaurantId: task.restaurant_id,
    status: task.status,
    pickupTime: task.pickup_time,
    deliveryTime: task.delivery_time,
    route: {
      pickupLocation: {
        latitude: task.pickup_latitude,
        longitude: task.pickup_longitude,
        address: task.pickup_address,
      },
      dropoffLocation: {
        latitude: task.dropoff_latitude,
        longitude: task.dropoff_longitude,
        address: task.dropoff_address,
      },
    },
    createdAt: task.created_at,
  };
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [...mockTasks],
  userNames: {},
  isLoading: false,
  error: null,
  
  fetchUserNames: async (userIds: string[]) => {
    const { userNames } = get();
    const missingIds = userIds.filter(id => id && !userNames[id]);
    
    if (missingIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .in('id', missingIds);

      if (error) {
        console.warn('Error fetching user names:', error.message);
        return;
      }

      if (data) {
        const newNames: Record<string, string> = {};
        data.forEach(user => {
          if (user.name) {
            newNames[user.id] = user.name;
          }
        });
        
        set(state => ({
          userNames: { ...state.userNames, ...newNames }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user names:', error);
    }
  },
  
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch tasks from Supabase
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching tasks from Supabase, using mock data:', error.message);
        // Fall back to mock data
        set({ tasks: [...mockTasks], isLoading: false });
        
        // Fetch names for mock data
        const userIds = mockTasks.flatMap(t => [t.volunteerId, t.ngoId, t.restaurantId]).filter(Boolean);
        get().fetchUserNames(userIds);
        return;
      }

      if (data && data.length > 0) {
        const mappedTasks = data.map(mapSupabaseTask);
        set({ tasks: mappedTasks, isLoading: false });
        
        // Fetch user names for all related users
        const userIds = mappedTasks.flatMap(t => [t.volunteerId, t.ngoId, t.restaurantId]).filter(Boolean);
        get().fetchUserNames(userIds);
      } else {
        // If no tasks in database, use mock data
        set({ tasks: [...mockTasks], isLoading: false });
        
        // Fetch names for mock data
        const userIds = mockTasks.flatMap(t => [t.volunteerId, t.ngoId, t.restaurantId]).filter(Boolean);
        get().fetchUserNames(userIds);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch tasks", 
        isLoading: false,
        tasks: [...mockTasks] // Fall back to mock data
      });
      
      // Fetch names for mock data
      const userIds = mockTasks.flatMap(t => [t.volunteerId, t.ngoId, t.restaurantId]).filter(Boolean);
      get().fetchUserNames(userIds);
    }
  },
  
  createTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      // Try to add task to Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          donation_id: task.donationId,
          volunteer_id: task.volunteerId,
          ngo_id: task.ngoId,
          restaurant_id: task.restaurantId,
          status: task.status,
          pickup_time: task.pickupTime,
          delivery_time: task.deliveryTime,
          pickup_latitude: task.route.pickupLocation.latitude,
          pickup_longitude: task.route.pickupLocation.longitude,
          pickup_address: task.route.pickupLocation.address,
          dropoff_latitude: task.route.dropoffLocation.latitude,
          dropoff_longitude: task.route.dropoffLocation.longitude,
          dropoff_address: task.route.dropoffLocation.address,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.warn('Error creating task in Supabase, using local state:', error.message);
        // Fall back to local state
        const newTask: DeliveryTask = {
          ...task,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          tasks: [...state.tasks, newTask],
          isLoading: false
        }));
        
        // Fetch user names
        const userIds = [task.volunteerId, task.ngoId, task.restaurantId].filter(Boolean);
        get().fetchUserNames(userIds);
        
        return newTask;
      }

      const newTask = mapSupabaseTask(data);
      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));
      
      // Fetch user names
      const userIds = [newTask.volunteerId, newTask.ngoId, newTask.restaurantId].filter(Boolean);
      get().fetchUserNames(userIds);
      
      return newTask;
    } catch (error) {
      set({ error: "Failed to create task", isLoading: false });
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId, status) => {
    set({ isLoading: true, error: null });
    try {
      // Try to update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) {
        console.warn('Error updating task status in Supabase, updating local state:', error.message);
      }

      // Update local state regardless of Supabase result
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to update task status", isLoading: false });
    }
  },
  
  completeTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const deliveryTime = new Date().toISOString();
      
      // Try to update task in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed', 
          delivery_time: deliveryTime 
        })
        .eq('id', taskId);

      if (error) {
        console.warn('Error completing task in Supabase, updating local state:', error.message);
      }

      // Update local state regardless of Supabase result
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                status: 'completed', 
                deliveryTime
              } 
            : task
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: "Failed to complete task", isLoading: false });
    }
  },
  
  getUserName: (userId: string) => {
    const { userNames } = get();
    return userNames[userId] || `User #${userId.slice(-4)}`;
  },
  
  getTaskById: (id) => {
    return get().tasks.find(task => task.id === id);
  },
  
  getTasksByVolunteer: (volunteerId) => {
    return get().tasks.filter(task => task.volunteerId === volunteerId);
  },
  
  getTasksByNGO: (ngoId) => {
    return get().tasks.filter(task => task.ngoId === ngoId);
  },
  
  getActiveTasksByVolunteer: (volunteerId) => {
    return get().tasks.filter(
      task => task.volunteerId === volunteerId && 
      ['assigned', 'in-progress'].includes(task.status)
    );
  },
}));