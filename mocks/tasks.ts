import { DeliveryTask } from '@/types';

export const mockTasks: DeliveryTask[] = [
  {
    id: 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj',
    donationId: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
    volunteerId: '99999999-9999-9999-9999-999999999999',
    ngoId: '66666666-6666-6666-6666-666666666666',
    restaurantId: '22222222-2222-2222-2222-222222222222',
    status: 'assigned',
    pickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    route: {
      pickupLocation: {
        latitude: 12.9698,
        longitude: 77.6003,
        address: "Residency Road, Shanthala Nagar, Ashok Nagar, Bengaluru, Karnataka 560025"
      },
      dropoffLocation: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: "Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010"
      }
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    id: 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk',
    donationId: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
    volunteerId: '99999999-9999-9999-9999-999999999999',
    ngoId: '77777777-7777-7777-7777-777777777777',
    restaurantId: '33333333-3333-3333-3333-333333333333',
    status: 'in-progress',
    pickupTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    route: {
      pickupLocation: {
        latitude: 12.9715,
        longitude: 77.6099,
        address: "22, St. Marks Road, Ashok Nagar, Bengaluru, Karnataka 560001"
      },
      dropoffLocation: {
        latitude: 12.9784,
        longitude: 77.6408,
        address: "45, 5th Cross, Indiranagar, Bengaluru, Karnataka 560038"
      }
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'llllllll-llll-llll-llll-llllllllllll',
    donationId: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    volunteerId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    ngoId: '66666666-6666-6666-6666-666666666666',
    restaurantId: '11111111-1111-1111-1111-111111111111',
    status: 'completed',
    pickupTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    deliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    route: {
      pickupLocation: {
        latitude: 12.9507,
        longitude: 77.5848,
        address: "14, Lalbagh Road, Mavalli, Bengaluru, Karnataka 560004"
      },
      dropoffLocation: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: "Hare Krishna Hill, Chord Road, Rajajinagar, Bengaluru, Karnataka 560010"
      }
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  }
];