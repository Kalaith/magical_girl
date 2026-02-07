# ✨ Magical Girl Simulator

A comprehensive magical girl management game built with React, TypeScript, and Tailwind CSS. Train, recruit, and send your magical girls on epic missions to protect the world!

![Magical Girl Simulator](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.10-blue?style=for-the-badge&logo=tailwindcss)

## 🌟 Features

### Current Features
- **Character Management**: Comprehensive magical girl roster with detailed stats, abilities, and progression
- **Combat System**: Turn-based tactical combat with formations, action system, and battle arena
- **Recruitment System**: Gacha-style recruitment with friendship points and banner system
- **Training System**: Multi-faceted training with various exercise types and stat improvements
- **Mission System**: Story-rich missions with varying difficulties and compelling narratives
- **Achievement System**: Unlockable achievements with meaningful rewards
- **Skill Tree System**: Character progression with skill nodes, specializations, and builds
- **Prestige System**: End-game progression with prestige levels and bonuses
- **Real-time Notifications**: Smooth notification system for game events
- **Responsive Design**: Mobile-first design that scales beautifully across devices
- **State Management**: Robust Zustand-powered state management with persistence and modular slices
- **Beautiful Animations**: Framer Motion animations for smooth, engaging interactions
- **Error Handling**: Comprehensive error boundaries and graceful error recovery
- **Code Quality**: Clean, maintainable codebase with strict TypeScript typing and ESLint compliance

### Core Game Mechanics
- **10 Different Stats**: Power, Defense, Speed, Magic, Wisdom, Charm, Courage, Luck, Endurance, Focus
- **12 Magical Elements**: Light, Darkness, Fire, Water, Earth, Air, Ice, Lightning, Nature, Celestial, Void, Crystal
- **6 Rarity Levels**: Common, Uncommon, Rare, Epic, Legendary, Mythical
- **Multiple Specializations**: Combat, Healing, Support, Magic, Defense, Speed, Balanced
- **Dynamic Difficulty System**: From Tutorial to Impossible difficulty levels
- **Bond System**: Build relationships between magical girls for team bonuses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd magical-girl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run type-check` - Type checking without emitting files
- `npm run type-check:watch` - Watch mode for type checking

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Achievement/          # Achievement-related components
│   ├── Combat/              # Combat system components (battle arena, action panel, etc.)
│   ├── layout/              # Header, navigation, resource display
│   ├── MagicalGirl/         # Character cards, details, management
│   ├── Mission/             # Mission system components
│   ├── Recruitment/         # Recruitment and gacha system components
│   ├── Training/            # Training interface components
│   ├── ui/                  # Reusable UI components
│   └── views/               # Main application views
├── config/
│   └── gameConfig.ts        # Game configuration constants
├── data/
│   ├── gameConfig.ts        # Extended game configuration
│   ├── magicalGirls.ts      # Initial character data
│   ├── missions.ts          # Mission definitions
│   ├── recruitmentBanners.ts # Recruitment banner configurations
│   ├── skillTreeConfig.ts   # Skill tree definitions
│   └── training.ts          # Training exercises data
├── hooks/                   # Custom React hooks
├── stores/
│   ├── gameStore.ts         # Main game state store
│   ├── uiStore.ts          # UI state management
│   ├── skillTreeStore.ts   # Skill tree state management
│   ├── slices/             # Zustand store slices for modular state
│   │   ├── combatSlice.ts  # Combat system state slice
│   │   └── ...             # Other feature slices
│   └── achievementStore.ts # Achievement state management
├── types/
│   ├── game.ts             # Core game type definitions
│   ├── combat.ts           # Combat system type definitions
│   ├── magicalGirl.ts      # Character type system
│   ├── mission.ts          # Mission type definitions
│   ├── recruitment.ts      # Recruitment system type definitions
│   ├── skillTree.ts        # Skill tree type definitions
│   └── index.ts            # Type exports
├── assets/                 # Static assets and images
└── ErrorBoundary.tsx      # Global error handling component
```

## 🎮 Game Systems

### Character System
- **Deep Stat System**: 10 unique attributes affecting different aspects of gameplay
- **Elemental Affinities**: 12 magical elements with strengths and weaknesses
- **Transformation System**: Multiple forms with unique abilities and appearances
- **Personality System**: Dynamic personalities affecting interactions and performance
- **Equipment System**: Weapons, accessories, outfits, and charms with set bonuses

### Combat System
- **Turn-Based Tactical Combat**: Strategic battles with turn order management
- **Formation System**: 3x3 grid formations with role-based positioning (Tank, Damage, Support, Healer, etc.)
- **Action System**: Diverse actions including attacks, abilities, spells, and items
- **Battle Arena**: Real-time battle visualization with damage numbers and status effects
- **Combat Log**: Detailed battle history with action tracking and analytics
- **AI System**: Intelligent enemy AI with adaptive strategies
- **Combat Settings**: Customizable battle experience (auto mode, animation speed, difficulty)

### Mission System
- **Story Integration**: Rich narratives with dialogue, character development
- **Dynamic Difficulty**: Missions scale with player progression
- **Environmental Factors**: Weather, time of day, and magical intensity affect outcomes
- **Team Dynamics**: Different team compositions provide various bonuses
- **Success Calculations**: Complex algorithms considering stats, elements, and conditions

### Recruitment System
- **Basic Recruitment**: Use Friendship Points to recruit new magical girls
- **Banner System**: Multiple recruitment banners with different rates and featured characters
- **Pity System**: Soft and hard pity counters for guaranteed rare characters
- **No Duplicates**: Intelligent system prevents recruiting the same character twice
- **Recruitment Stats**: Track recruitment history and available characters

### Training System
- **Varied Exercises**: Physical conditioning, magical practice, social activities
- **Instructor System**: Different trainers with unique specialties and personalities
- **Unlockable Content**: New training types unlock as players progress
- **Team Training**: Group exercises that improve multiple characters simultaneously

### Skill Tree System
- **Skill Nodes**: Unlockable skills with prerequisites and branching paths
- **Specialization Paths**: Choose unique builds with exclusive abilities
- **Skill Points**: Earn and allocate points to customize character progression
- **Build Management**: Save, load, and share skill builds
- **Tree Progression**: Multiple tiers from basic to legendary skills

## 🔧 Technical Architecture

### State Management
- **Zustand Store**: Lightweight, performant state management with slice pattern
- **Modular Slices**: Separated concerns with dedicated slices for different features
- **Persistence**: Automatic save/load functionality with localStorage
- **Immer Integration**: Immutable state updates with readable syntax
- **Type Safety**: Full TypeScript coverage with strict typing

### Component Architecture
- **Atomic Design**: Reusable components following atomic design principles
- **TypeScript First**: Comprehensive type safety throughout the application
- **Props Interface**: Well-defined interfaces for all component props
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Error Boundaries**: Graceful error handling with React Error Boundaries

### Code Quality & Best Practices
- **ESLint Compliance**: Strict linting rules with no workarounds or disable comments
- **Magic Number Elimination**: All hardcoded values replaced with named constants
- **Clean Code Principles**: Maintainable, readable code following industry standards
- **Type Safety**: Zero 'any' types, comprehensive interface definitions
- **Unused Code Removal**: Regular cleanup of unused files and dead code

### Performance Optimizations
- **Code Splitting**: Dynamic imports for optimal bundle sizes
- **Memoization**: React.memo and useMemo for preventing unnecessary re-renders
- **Lazy Loading**: Component lazy loading for improved initial load times
- **Bundle Analysis**: Webpack bundle analyzer integration for optimization insights

## 🎨 UI/UX Design

### Design System
- **Modern Aesthetics**: Clean, magical girl anime-inspired design
- **Consistent Color Palette**: Cohesive theming with magical color schemes
- **Typography Hierarchy**: Clear information hierarchy with custom fonts
- **Responsive Grid**: CSS Grid and Flexbox for responsive layouts

### Animation System
- **Framer Motion**: Smooth, performant animations throughout the app
- **Page Transitions**: Seamless navigation between different views
- **Micro-interactions**: Delightful hover effects and click animations
- **Loading States**: Engaging loading animations for better UX

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color contrast ratios
- **Focus Management**: Proper focus management for modals and navigation

## 🔮 Recent Improvements & Future Enhancements

### ✅ Recently Completed
- **Combat System**: Full turn-based tactical combat with formations, actions, and battle arena
- **Recruitment System**: Gacha-style recruitment with banners, pity system, and friendship points
- **Skill Tree System**: Character progression trees with specializations and build management
- **Enhanced Settings System**: Modular settings with category-based management
- **Error Boundary Implementation**: Global error handling for improved stability
- **Code Quality Overhaul**: Eliminated magic numbers, improved typing, removed unused code
- **State Management Refactoring**: Modular slices for better separation of concerns
- **Save System Improvements**: Robust persistence with error handling

### Planned Features (Short Term)
- [ ] **Advanced Recruitment**: Animated summoning sequences and premium currencies
- [ ] **Sound Design**: Immersive audio with voice acting and sound effects
- [ ] **Tutorial System**: Interactive tutorial with step-by-step guidance
- [ ] **Advanced Settings Panel**: Additional customization options
- [ ] **Combat Enhancements**: More action types, combo system, and environmental interactions

### Expansion Plans (Medium Term)
- [ ] **Multiplayer Features**: 
  - Friend system with magical girl sharing
  - Cooperative missions with real-time collaboration
  - Guild system with shared goals and rewards
  - PvP arena with strategic battles

- [ ] **Advanced Progression**:
  - Prestige system for end-game content
  - Master class unlocks with unique abilities
  - Legendary transformations with epic animations
  - Skill trees for specialized builds

- [ ] **Content Expansion**:
  - Seasonal events with limited-time content
  - Story campaigns with branching narratives
  - Boss raids requiring strategic team coordination
  - Mini-games for varied gameplay experiences

### Long-term Vision (Advanced Features)
- [ ] **AI Integration**:
  - Procedurally generated missions using AI
  - Dynamic dialogue generation for characters
  - Adaptive difficulty based on player behavior
  - AI-powered character personality evolution

- [ ] **Cross-Platform Support**:
  - Mobile app with offline capabilities
  - Desktop application with enhanced features
  - Console versions with controller support
  - Cross-platform progression sync

- [ ] **Community Features**:
  - User-generated content tools
  - Character sharing marketplace
  - Community challenges and competitions
  - Streaming integration with viewer participation

- [ ] **Advanced Graphics**:
  - 3D character models with customization
  - Real-time transformation sequences
  - Dynamic lighting and particle effects
  - VR support for immersive experiences

## 🛠️ Development

### Code Quality Standards
- **Zero ESLint Violations**: Strict adherence to linting rules without workarounds
- **TypeScript Strict Mode**: Full type safety with no 'any' types or loose typing
- **Clean Code**: Following SOLID principles and clean code best practices
- **Magic Number Free**: All hardcoded values replaced with named constants
- **Unused Code Removal**: Regular cleanup of unused imports, variables, and files

### Contributing Guidelines
1. **Code Style**: Follow the existing TypeScript and React conventions
2. **Testing**: Write unit tests for new features using Vitest
3. **Documentation**: Update documentation for API changes
4. **Performance**: Consider performance implications of new features
5. **Code Review**: All changes undergo thorough code review for quality

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check:watch

# Run linting
npm run lint
```

### Code Quality Tools
- **ESLint**: Code linting with React and TypeScript rules (strict, no disables)
- **TypeScript**: Strict type checking for reliability
- **Prettier**: Code formatting for consistency
- **Husky**: Git hooks for pre-commit quality checks

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers
- **WebGL Support**: Enhanced graphics for supported devices

## 🔐 Security & Privacy

- **Local Storage**: All game data stored locally for privacy
- **No Tracking**: No third-party analytics or tracking
- **Secure Dependencies**: Regular security audits of dependencies
- **Content Security Policy**: CSP headers for XSS protection

## 📊 Performance Metrics

- **Initial Load**: Target < 3 seconds on 3G
- **Bundle Size**: Optimized chunks under 250KB gzipped
- **Memory Usage**: Efficient memory management with cleanup
- **Animation Performance**: 60fps animations on modern devices

## 🎯 Game Balance Philosophy

The game is designed around the philosophy of **"meaningful choices"**:
- Every stat matters for different mission types
- Multiple viable strategies for character development
- Resource management creates interesting trade-offs
- Progression feels rewarding without being overwhelming

## 📚 References & Inspiration

- **Anime & Manga**: Sailor Moon, Madoka Magica, PreCure series
- **Game Design**: Granblue Fantasy, FGO, Princess Connect
- **UI/UX**: Modern mobile game interfaces with accessibility focus
- **Technical**: React ecosystem best practices and patterns

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animation capabilities
- **Zustand**: For lightweight state management
- **TypeScript**: For type safety and developer experience

---

**✨ Made with magic and TypeScript ✨**

## License

This project is licensed under the MIT License - see the individual component README files for details.

Part of the WebHatchery game collection.
