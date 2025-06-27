# KindRipple 🌊

**Reducing food waste, one meal at a time.**

KindRipple is a comprehensive food donation platform that connects restaurants with surplus food to NGOs and volunteers, creating an efficient ecosystem to reduce food waste while helping those in need.

## ✨ Features

### 🏪 For Restaurants
- **Easy Donation Creation**: Post surplus food with photos, descriptions, and pickup details
- **Real-time Tracking**: Monitor donation status from creation to delivery
- **Impact Analytics**: View your contribution to reducing food waste
- **Smart Notifications**: Get updates when NGOs claim your donations

### 🏢 For NGOs
- **Browse Available Food**: Discover nearby food donations in real-time
- **Quick Claiming**: Reserve donations with one tap
- **Volunteer Coordination**: Assign volunteers for pickup and delivery
- **Inventory Management**: Track claimed donations and delivery status

### 🚗 For Volunteers
- **Task Dashboard**: View assigned pickup and delivery tasks
- **Navigation Integration**: Get directions to pickup and dropoff locations
- **Status Updates**: Mark tasks as in-progress or completed
- **Impact Tracking**: See how many meals you've helped deliver

### 👨‍💼 For Admins
- **Platform Overview**: Monitor all donations, tasks, and user activity
- **Analytics Dashboard**: View platform-wide impact metrics
- **User Management**: Oversee restaurant, NGO, and volunteer accounts
- **System Health**: Track platform performance and usage

## 🎨 Design Philosophy

KindRipple features a modern, role-based design system:

- **Restaurant Theme**: Purple accents (`#8c3ccc`) for donation management
- **NGO Theme**: Orange accents (`#ee9a40`) for claiming and coordination  
- **Volunteer Theme**: Green accents (`#4ade80`) for task completion
- **Admin Theme**: Blue accents (`#3b82f6`) for oversight and analytics

The app supports both light and dark themes with seamless switching and system preference detection.

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: React Native StyleSheet with custom theme system
- **Maps**: MapLibre for location services
- **Icons**: Lucide React Native
- **Type Safety**: TypeScript throughout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio (for emulators)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kindripple.git
   cd kindripple
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL script in `scripts/supabase-setup.sql` in your Supabase SQL editor to create the necessary tables and policies.

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on your device**
   - **iOS**: Press `i` to open iOS Simulator
   - **Android**: Press `a` to open Android Emulator  
   - **Web**: Press `w` to open in web browser
   - **Physical Device**: Scan QR code with Expo Go app

## 📱 App Structure

```
app/
├── (app)/                 # Authenticated app routes
│   ├── (tabs)/           # Tab navigation
│   │   ├── index.tsx     # Home screen (role-based)
│   │   ├── tasks.tsx     # Tasks management
│   │   ├── impact.tsx    # Impact analytics
│   │   └── account.tsx   # User account
│   ├── donation/[id].tsx # Donation details
│   └── task/[id].tsx     # Task details
├── auth/                 # Authentication screens
│   ├── login.tsx         # Login screen
│   └── register.tsx      # Registration screen
└── _layout.tsx           # Root layout

components/
├── ui/                   # Reusable UI components
│   ├── DonationCard.tsx  # Donation display card
│   ├── TaskCard.tsx      # Task display card
│   ├── Button.tsx        # Custom button
│   └── ThemeToggle.tsx   # Theme switcher
└── ...

store/                    # Zustand state management
├── auth-store.ts         # Authentication state
├── donation-store.ts     # Donations management
└── task-store.ts         # Tasks management
```

## 🔧 Development

### Running Tests
```bash
npm test
# or
yarn test
```

### Building for Production
```bash
# Build for all platforms
npx expo build

# Build for specific platform
npx expo build:ios
npx expo build:android
```

### Code Style
The project uses ESLint and Prettier for code formatting:
```bash
npm run lint
npm run format
```

## 🌐 Environment Setup

### Development
- Uses Expo development build
- Hot reloading enabled
- Debug mode with React Developer Tools

### Production
- Optimized bundle size
- Error tracking with Sentry (optional)
- Analytics with Expo Analytics

## 📊 Database Schema

The app uses Supabase with the following main tables:

- **users**: User profiles with role-based access
- **donations**: Food donation listings
- **tasks**: Delivery task assignments
- **metrics**: Impact tracking data

See `scripts/supabase-setup.sql` for the complete schema.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing React Native framework
- **Supabase** for the backend infrastructure
- **Lucide** for the beautiful icons
- **MapLibre** for mapping capabilities

## 📞 Support

- 📧 Email: support@kindripple.com
- 💬 Discord: [Join our community](https://discord.gg/kindripple)
- 📖 Documentation: [docs.kindripple.com](https://docs.kindripple.com)

---

**Made with ❤️ to reduce food waste and help communities**