# 🌍 Aerolens - Real-Time 3D Flight Radar

<div align="center">

![Aerolens Banner](https://img.shields.io/badge/Aerolens-3D%20Flight%20Radar-blue?style=for-the-badge&logo=airplane)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-Latest-green?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

*A stunning 3D flight radar application that brings real-time aircraft tracking to life with immersive visualizations.*

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## ✨ Features

### 🌟 Core Capabilities
- **Real-Time Flight Tracking**: Live aircraft positions using OpenSky Network API
- **3D Interactive Globe**: Immersive Three.js-powered Earth visualization
- **Dynamic Aircraft Visualization**: Real-time aircraft positions with smooth animations
- **Interactive Controls**: Orbit, zoom, and pan controls for exploration
- **Responsive Design**: Optimized for desktop and mobile devices
- **Error Handling**: Graceful fallbacks and user-friendly error messages

### 🎨 Visual Experience
- **Animated Background**: Dynamic gradient backgrounds with particle effects
- **Aircraft Selection**: Click to select and highlight specific aircraft
- **Flight Statistics**: Real-time data display with beautiful UI components
- **Notification System**: Toast notifications for system events
- **Loading States**: Smooth loading animations and progress indicators

### 🔧 Technical Features
- **Performance Optimized**: Efficient rendering with instanced meshes
- **Error Boundaries**: Robust error handling for 3D components
- **State Management**: Zustand for efficient state management
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Radix UI components with Tailwind CSS styling

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### 3D Graphics & Visualization
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### State Management & Data
- **Zustand** - Lightweight state management
- **OpenSky Network API** - Real-time flight data
- **Immer** - Immutable state updates

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Modern browser with WebGL support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aerolens.git
   cd aerolens
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

---

## 📁 Project Structure

```
aerolens/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── aircraft-layer.tsx # 3D aircraft visualization
│   ├── flight-radar.tsx  # Main radar component
│   ├── globe.tsx         # 3D Earth component
│   └── ...               # Other components
├── lib/                  # Utilities and stores
│   ├── stores/           # State management
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── public/               # Static assets
│   └── assets/           # 3D textures and images
└── styles/               # Additional styles
```

---

## 🎮 Usage

### Basic Navigation
- **Mouse/Touch**: Click and drag to rotate the globe
- **Scroll**: Zoom in/out
- **Aircraft Selection**: Click on aircraft to view details
- **Reset View**: Use the reset button to return to default position

### Features
- **Real-time Updates**: Aircraft positions update every 15 seconds
- **Interactive Elements**: Hover over aircraft for information
- **Responsive Design**: Works on desktop and mobile devices
- **Error Recovery**: Automatic fallback to demo data if API is unavailable

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
# API Configuration
NEXT_PUBLIC_OPENSKY_API_URL=https://opensky-network.org/api/states/all
NEXT_PUBLIC_FETCH_INTERVAL=15000

# Development Settings
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_STATS=true
```

### Customization
- **Aircraft Appearance**: Modify `components/aircraft-layer.tsx` for different aircraft models
- **Globe Texture**: Replace `/public/assets/3d/texture_earth.jpg` with custom Earth texture
- **Color Scheme**: Update Tailwind classes in components for different themes

---

## 🧪 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (if configured)
- **Error Boundaries**: Robust error handling for 3D components

---

## 🎯 Performance

### Optimizations
- **Instanced Rendering**: Efficient aircraft visualization for large datasets
- **Level of Detail**: Different rendering strategies based on aircraft count
- **Memory Management**: Proper cleanup of Three.js resources
- **Throttled Updates**: UI updates limited to prevent excessive re-renders

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **WebGL Required**: For 3D graphics rendering
- **Mobile Support**: Touch controls for mobile devices

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add proper error handling
- Include JSDoc comments for complex functions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenSky Network** - Real-time flight data API
- **Three.js Community** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Radix UI** - Accessible UI components
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

- **Documentation**: [Wiki](wiki)
- **Issues**: [GitHub Issues](issues)
- **Discussions**: [GitHub Discussions](discussions)
- **Email**: support@aerolens.com

---

<div align="center">

**Made with ❤️ by the Aerolens Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/aerolens?style=social)](https://github.com/yourusername/aerolens)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/aerolens?style=social)](https://github.com/yourusername/aerolens)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/aerolens)](https://github.com/yourusername/aerolens/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/aerolens)](https://github.com/yourusername/aerolens/blob/main/LICENSE)

</div> 