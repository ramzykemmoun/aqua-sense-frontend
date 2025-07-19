# 🐟 AquaSense Frontend

A modern, real-time aquaculture monitoring dashboard built with React, TypeScript, and cutting-edge web technologies for comprehensive pond management and fish health monitoring.

![AquaSense Dashboard](https://img.shields.io/badge/Status-Active-green) ![React](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue) ![Vite](https://img.shields.io/badge/Vite-5+-purple)

## 🌟 Overview

AquaSense Frontend is a comprehensive aquaculture management system that provides real-time monitoring, AI-powered analysis, and interactive visualizations for fish farming operations. The application integrates with IoT sensors, computer vision models, and external analysis services to deliver a complete pond management solution.

## ✨ Key Features

### 🎯 **Real-time Pond Monitoring**

- **Live sensor data** from temperature, pH, dissolved oxygen, and water quality sensors
- **Moving window charts** showing the last 5 data points for immediate trend analysis
- **Auto-refresh functionality** with manual refresh options
- **Historical data management** with intelligent data merging and cleanup

### 🗺️ **Interactive Map Interface**

- **OpenLayers-powered map** with custom pond markers and clustering
- **Dynamic pond locations** with real-time status indicators
- **Responsive map sizing** (600px-700px height) optimized for all devices
- **Click-to-navigate** pond selection with smooth transitions

### 🐠 **Advanced Fish Analysis**

- **Innovative expandable interface** with smooth animations
- **Computer vision integration** via iframe to `http://127.0.0.1:8001/`
- **AI-powered health recommendations** and activity pattern analysis
- **Real-time population monitoring** with growth rate calculations

### 🔬 **Bacteria Detection System**

- **YOLO-powered image analysis** via iframe to `http://127.0.0.1:8000/`
- **Risk level assessment** with color-coded alerts
- **Streamlined interface** replacing complex upload logic with simple iframe integration

### 📊 **Comprehensive Analytics**

- **Multi-parameter charts** for temperature, pH, dissolved oxygen, ammonia, turbidity, nitrite, nitrate, salinity
- **Real-time notifications** with intelligent throttling (5-10 minute intervals)
- **Moving window visualization** for focused data analysis
- **Color-coded status indicators** for immediate problem identification

### 🤖 **AI-Powered Assistant**

- **3D floating robot** with custom animations and glow effects
- **Mastra-powered chatbot** with fallback responses
- **Markdown rendering** for rich text responses
- **Streaming responses** with typing simulation for better UX

### 🎨 **Modern UI/UX**

- **shadcn/ui components** with dark/light theme support
- **Tailwind CSS** for responsive design and custom animations
- **Gradient backgrounds** and smooth transitions throughout
- **Mobile-first responsive design** optimized for all screen sizes

## 🛠️ Technology Stack

### **Frontend Framework**

- **React 18+** with TypeScript for type-safe development
- **Vite** for lightning-fast development and building
- **React Router** for client-side routing and navigation

### **UI & Styling**

- **shadcn/ui** - Modern, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Custom animations** with CSS-in-JS and Tailwind animations

### **Data Management**

- **React Query** for server state management and caching
- **Zustand** for client-side state management
- **Custom hooks** for notifications, user management, and mobile detection

### **Visualization & Maps**

- **Recharts** for interactive data visualization and charts
- **OpenLayers** for advanced mapping capabilities
- **Unity WebGL** for 3D pond visualization
- **Custom chart containers** with responsive design

### **AI & External Integrations**

- **Mastra Client** for AI agent communication
- **External iframe services** for specialized analysis
- **Custom markdown renderer** for rich text display
- **Streaming response handling** for real-time AI interaction

## 📁 Project Structure

```
src/
├── assets/                    # Static assets (images, etc.)
├── components/                # Reusable UI components
│   ├── ui/                   # shadcn/ui base components
│   ├── layout/               # Layout components (Header, Sidebar)
│   ├── AquaChatBot.tsx       # AI assistant with 3D robot
│   ├── MapView.tsx           # OpenLayers map component
│   ├── NotificationsPopover.tsx
│   ├── PondDashboard.tsx     # Main pond monitoring dashboard
│   └── ProtectedRoute.tsx    # Route protection
├── hooks/                     # Custom React hooks
│   ├── use-mobile.tsx        # Mobile detection
│   ├── use-notifications.ts  # Notification management
│   ├── use-toast.ts          # Toast notifications
│   └── use-user.ts           # User state management
├── lib/                       # Utilities and configurations
│   ├── api/                  # API service layers
│   ├── providers/            # Context providers
│   ├── services/             # API service definitions
│   └── utils.ts              # Utility functions
├── types/                     # TypeScript type definitions
│   ├── notification.d.ts     # Notification system types
│   ├── ponds.d.ts            # Pond data types
│   ├── response.d.ts         # API response types
│   └── user.d.ts             # User management types
├── utils/                     # Helper utilities
│   └── response.ts           # Response handling utilities
├── views/                     # Main application views
│   ├── Alerts.tsx            # Alert management view
│   ├── Dashboard.tsx         # Main dashboard
│   ├── DataHistory.tsx       # Historical data analysis
│   ├── FarmSupervisors.tsx   # Staff management
│   ├── Index.tsx             # Landing page
│   ├── Login.tsx             # Authentication
│   ├── MapOverview.tsx       # Map-centered view
│   ├── NotFound.tsx          # 404 page
│   ├── Ponds.tsx             # Pond management with iframe
│   └── Settings.tsx          # Application settings
├── main.tsx                   # Application entry point
├── routes.tsx                 # Route definitions
└── index.css                 # Global styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**
- **Modern web browser** with WebGL support

### Installation

1. **Clone the repository**

```bash
git clone <YOUR_GIT_URL>
cd aqua-sense-frontend
```

2. **Install dependencies**

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

3. **Environment Setup**
   Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
NEXT_MASTRA_API_URL=http://192.168.137.1:4111
```

4. **Start the development server**

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using bun
bun dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🔧 Configuration

### **Vite Configuration**

The project uses Vite with the following configuration:

- **Server**: Runs on port 8080 with host "::"
- **React SWC**: For fast refresh and compilation
- **Path aliases**: `@/` points to `src/` directory

### **External Services**

The application integrates with several external services:

1. **Bacteria Analysis Service** (`http://127.0.0.1:8000/`)

   - YOLO-powered bacteria detection
   - Risk assessment and analysis
   - Integrated via iframe in PondDashboard and Ponds view

2. **Fish Analysis Service** (`http://127.0.0.1:8001/`)

   - Advanced fish monitoring
   - Health and behavior analysis
   - Expandable interface in PondDashboard

3. **Mastra AI Service** (`http://192.168.137.1:4111`)
   - AI-powered chatbot responses
   - Aquaculture expertise
   - Fallback responses for offline mode

## 📱 Key Components

### **PondDashboard.tsx**

The main monitoring interface featuring:

- Real-time sensor data visualization
- Moving window charts (last 5 readings)
- Automatic notification generation
- Expandable fish analysis section
- Bacteria detection iframe integration
- 3D Unity visualization
- Supervisor management

### **MapView.tsx**

Interactive mapping component with:

- OpenLayers integration
- Custom pond markers
- Dynamic clustering
- Responsive design (600px-700px height)
- Click-to-navigate functionality

### **AquaChatBot.tsx**

AI assistant featuring:

- 3D floating robot with custom animations
- Mastra-powered responses
- Markdown rendering
- Streaming text simulation
- Fallback aquaculture knowledge base
- Fixed input field (always enabled)

### **Ponds.tsx**

Pond management interface with:

- Large, responsive map (600px-700px height)
- Iframe-based pond creation (`http://127.0.0.1:8000/`)
- Wide, scrollable dialog (75% width)
- Simplified external integration

## 🔔 Notification System

The application features an intelligent notification system:

### **Real-time Monitoring**

- **Parameter thresholds**: Temperature, pH, dissolved oxygen, ammonia, water level, turbidity, nitrite
- **Severity levels**: Low, Medium, High, Critical
- **Throttling**: 5-minute intervals for water quality, 10-minute intervals for bacteria
- **Auto-clearing**: Prevents notification spam

### **Notification Types**

- **Water Quality Alerts**: Out-of-range parameter warnings
- **Fish Health**: Population and behavior alerts
- **Bacteria Detection**: Risk level notifications
- **System Status**: Sensor and connectivity alerts

## 🎨 UI/UX Features

### **Responsive Design**

- **Mobile-first approach** with breakpoint-specific layouts
- **Flexible grid systems** adapting to screen sizes
- **Touch-friendly interactions** for mobile devices
- **Optimized performance** across all devices

### **Animations & Interactions**

- **Smooth transitions** (300-500ms duration)
- **Expandable sections** with ease-in-out animations
- **Floating elements** with custom CSS animations
- **Loading states** with skeleton screens and spinners

### **Color Coding**

- **Status indicators**: Green (normal), Yellow (warning), Red (critical)
- **Parameter-specific colors**: Blue (water), Orange (temperature), Purple (pH)
- **Dark/light theme support** throughout the application

## 🔍 Data Flow

### **Real-time Updates**

1. **Sensor data** received from IoT devices
2. **API polling** every 15 seconds (configurable)
3. **State management** via React Query for caching
4. **UI updates** with smooth animations and transitions
5. **Notification generation** based on threshold monitoring

### **Chart Data Processing**

1. **Historical data** fetched and stored locally
2. **Moving window** extraction (last 5 points)
3. **Timestamp fixing** for missing or invalid dates
4. **Chart rendering** with Recharts library
5. **Real-time updates** without full page refresh

## 🧪 Innovation Features

### **Fish Analysis Innovation**

- **Expandable interface** with smooth 500ms animations
- **Gradient backgrounds** and floating animations
- **Three-column stats** with population, health, and growth metrics
- **AI recommendations** with color-coded status badges
- **Activity patterns** monitoring and display

### **Bacteria Detection Innovation**

- **Simplified iframe integration** replacing complex upload logic
- **Streamlined user experience** with external service integration
- **Real-time analysis** without client-side processing
- **Risk assessment** with immediate visual feedback

### **Chatbot Innovation**

- **3D floating robot** with custom CSS animations
- **Glow effects** and bounce animations
- **Fixed input functionality** (always enabled for better UX)
- **Spinner loading states** in send button
- **Markdown rendering** for rich responses

## 🔒 Security Considerations

### **Data Protection**

- **Protected routes** requiring authentication
- **Secure API communication** with proper error handling
- **Input validation** throughout forms and interfaces
- **XSS prevention** via proper sanitization

### **External Integrations**

- **Iframe sandboxing** for external services
- **CORS handling** for cross-origin requests
- **Error boundaries** for graceful failure handling

## 🛠️ Development Guidelines

### **Adding New Parameters**

1. Update type definitions in `types/ponds.d.ts`
2. Add chart configuration in `PondDashboard.tsx`
3. Implement threshold checking in notification system
4. Add color coding and status indicators

### **Extending AI Capabilities**

1. Modify `AquaChatBot.tsx` for new response types
2. Update Mastra agent configuration
3. Add new fallback responses for offline mode
4. Customize markdown rendering for new formats

### **Map Customization**

1. Modify `MapView.tsx` for new map layers
2. Add custom markers and styling
3. Implement new interaction patterns
4. Update responsive breakpoints

## 📞 Support & Troubleshooting

### **Common Issues**

- **Chatbot input not working**: Fixed in latest version - input field is now always enabled
- **Map not loading**: Check if port 8080 is available and OpenLayers dependencies are installed
- **Charts not updating**: Verify API endpoints and React Query configuration
- **External services**: Ensure `http://127.0.0.1:8000/` and `http://127.0.0.1:8001/` are running

### **Development Tips**

- Use browser DevTools for debugging
- Check component state with React DevTools
- Test responsive design across screen sizes
- Verify TypeScript types for API contracts

## 📈 Recent Updates

### **Latest Changes**

- ✅ **Fixed chatbot input field** - always enabled for better UX
- ✅ **Added fish analysis innovation** - expandable interface with smooth animations
- ✅ **Simplified bacteria detection** - iframe integration replacing complex upload logic
- ✅ **Enhanced map sizing** - increased height for better visibility (600px-700px)
- ✅ **Improved pond creation** - wide, scrollable dialog with external service integration

### **Performance Improvements**

- **Moving window charts** for focused data visualization
- **Intelligent notification throttling** to prevent spam
- **Optimized re-rendering** with proper React patterns
- **Responsive design** optimizations for mobile devices

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the excellent component library
- **OpenLayers** for powerful mapping capabilities
- **Recharts** for beautiful data visualization
- **Mastra** for AI integration capabilities
- **Unity** for 3D visualization support

---

**Built with ❤️ for sustainable aquaculture management**

---

## 📊 Performance & Monitoring

### **Real-time Data Processing**

- Efficient data polling with React Query caching
- Moving window calculations for optimal performance
- Intelligent throttling to prevent notification spam
- Background data synchronization

### **Scalability Features**

- Modular component architecture
- Lazy loading for optimal bundle size
- Responsive design across all devices
- Progressive Web App capabilities

## 🌍 Deployment

### **Production Build**

```bash
npm run build
npm run preview
```

### **Environment Variables**

Required environment variables for production:

```env
VITE_API_BASE_URL=https://your-api-domain.com
NEXT_MASTRA_API_URL=https://your-mastra-service.com
```

### **Hosting Recommendations**

- **Vercel** - Recommended for React/Vite applications
- **Netlify** - Great for static hosting with CI/CD
- **AWS S3 + CloudFront** - Enterprise-grade hosting solution
- **Docker** - Containerized deployment option

## 🔗 API Integration

### **Required Services**

1. **Main API Backend** - Pond data and user management
2. **Bacteria Analysis Service** - YOLO model inference
3. **Fish Monitoring Service** - Computer vision analysis
4. **Mastra AI Service** - Chatbot and AI features

### **API Endpoints**

- `GET /api/ponds` - Retrieve all ponds
- `GET /api/ponds/:id` - Get specific pond details
- `GET /api/ponds/:id/data` - Get pond sensor data
- `POST /api/auth/login` - User authentication
- `GET /api/supervisors` - Staff management

## 🎯 Browser Support

### **Supported Browsers**

- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

### **Required Features**

- WebGL support for 3D visualization
- ES6+ JavaScript support
- CSS Grid and Flexbox
- WebSocket connections (future feature)

## 📚 Additional Resources

### **Documentation**

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [OpenLayers Documentation](https://openlayers.org/)

### **Community**

- GitHub Issues for bug reports
- Feature requests via GitHub Discussions
- Technical support through documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support or questions:

- 📧 Email: support@aquasense.dev
- 📋 Documentation: [docs.aquasense.dev](https://docs.aquasense.dev)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/YassWrld/pond-watch-central/issues)

---

**AquaSense Frontend - Revolutionizing Aquaculture Management** 🌊
