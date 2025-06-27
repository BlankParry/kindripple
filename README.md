# 🌊 KindRipple

**Connecting hearts, reducing waste, creating impact.**

KindRipple is a beautiful React Native app that bridges the gap between restaurants with surplus food, NGOs in need, and volunteers ready to help. Together, we create ripples of kindness that transform communities.

![KindRipple Banner](https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&h=400&fit=crop&crop=center)

## ✨ Features

### 🍽️ For Restaurants
- **Smart Donation Management** - Easily post surplus food with photos, quantities, and pickup details
- **Real-time Tracking** - Monitor donation status from posting to delivery
- **Impact Dashboard** - See your contribution to reducing food waste

### 🏠 For NGOs
- **Browse Available Donations** - Discover nearby food donations in real-time
- **Request System** - Simple one-tap requesting with automatic notifications
- **Inventory Tracking** - Keep track of received donations and distribution

### 🚗 For Volunteers
- **Delivery Tasks** - Accept and complete food delivery missions
- **Route Optimization** - Integrated maps for efficient pickup and delivery
- **Impact Metrics** - Track your volunteer hours and meals delivered

### 👥 For Everyone
- **Beautiful UI** - Clean, intuitive design inspired by modern iOS apps
- **Real-time Updates** - Live notifications and status updates
- **Community Impact** - See collective impact metrics and success stories
- **Multi-platform** - Works seamlessly on iOS, Android, and Web

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo SDK 52
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Zustand** for state management
- **React Query (TanStack)** for server state
- **Lucide React Native** for beautiful icons

### Backend
- **Node.js** with Hono framework
- **tRPC** for end-to-end type safety
- **Supabase** for database and real-time features
- **TypeScript** throughout the stack

### Development Tools
- **Expo Dev Tools** for development
- **ESLint & Prettier** for code quality
- **Bun** for fast package management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Studio
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kindriple.git
   cd kindriple
   ```

2. **Install dependencies**
   ```bash
   # Using bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Create a new Supabase project at https://supabase.com
   # Copy your project URL and anon key
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   ```bash
   # Run the SQL setup script in your Supabase SQL editor
   # File: scripts/supabase-setup.sql
   ```

5. **Start the development server**
   ```bash
   bun start
   # or
   npx expo start
   ```

6. **Run on your device**
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## 📱 Development

### Project Structure
```
kindriple/
├── app/                    # Expo Router pages
│   ├── (app)/             # Authenticated app routes
│   │   ├── (tabs)/        # Tab navigation
│   │   └── auth/          # Authentication screens
├── components/            # Reusable UI components
├── backend/               # tRPC backend routes
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state stores
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── constants/             # App constants
```

### Key Commands
```bash
# Start development server
bun start

# Run on specific platform
bun ios
bun android
bun web

# Type checking
bun type-check

# Build for production
bun build

# Reset cache
bun start --clear
```

### Environment Setup
Create `.env.local` with:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎨 Design System

KindRipple follows a clean, modern design inspired by:
- **iOS Human Interface Guidelines**
- **Material Design principles**
- **Airbnb's visual language**
- **Linear's minimalist approach**

### Color Palette
- **Primary**: Soft blue (#3B82F6)
- **Secondary**: Warm green (#10B981)
- **Background**: Clean whites and subtle grays
- **Accent**: Gentle pastels for status indicators

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Test on multiple platforms
- Maintain consistent code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Expo Team** for the amazing development platform
- **Supabase** for the backend infrastructure
- **Open Source Community** for the incredible tools and libraries
- **Food rescue organizations** for inspiring this project

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/kindriple/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/kindriple/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/kindriple/discussions)

---

**Made with ❤️ for a better world**

*Every meal saved is a step towards reducing food waste and feeding those in need.*
