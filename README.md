<p align="center">
  <img src="public/logo.png" alt="OsFlow Logo" width="200"/>
</p>

<h1 align="center">🌊 OsFlow</h1>

<p align="center">
  <strong>Transform Your Ideas Into Beautiful Diagrams with AI</strong>
</p>

<p align="center">
  <em>Describe it. We'll diagram it.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#usage">Usage</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"/>
</p>

---

## ✨ Overview

**OsFlow** is an AI-powered diagram generation tool that transforms natural language descriptions into beautiful, professional diagrams. No more dragging and dropping boxes - just describe what you want, and let AI do the rest!

<p align="center">
  <img src="public/diagrams/3.avif" alt="OsFlow Demo" width="600"/>
</p>

---

## 🚀 Features

### 🤖 AI-Powered Generation
- **Natural Language Input** - Simply describe your diagram in plain English
- **Smart Detection** - Auto-detects the best diagram type for your needs
- **Multiple AI Models** - Fallback system ensures reliable generation

### 📊 Diagram Types
| Type | Description |
|------|-------------|
| 🔄 **Flowchart** | Process flows and decision trees |
| 📝 **Sequence** | Interaction sequences between components |
| 🏗️ **Class** | OOP class diagrams and relationships |
| 🗄️ **ER/SQL** | Database schema and entity relationships |
| 🏢 **Architecture** | System architecture diagrams |
| 🌐 **Network** | Network topology visualization |

### 🎨 Design Features
- **Sketch Mode** - Hand-drawn style for a personal touch
- **Clean Mode** - Professional, polished diagrams
- **Export to SVG** - High-quality vector graphics export
- **Zoom & Pan** - Navigate large diagrams with ease
- **Auto-fit** - Diagrams automatically fit to viewport

### 💻 User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Real-time Preview** - See your diagram as it generates
- **Interactive Canvas** - Drag, zoom, and explore your diagrams
- **Dark/Light Themes** - Multiple theme options for diagrams

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework for production
- **[React 19](https://react.dev/)** - Latest React with modern features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations

### Backend & APIs
- **[D2 Language](https://d2lang.com/)** - Modern diagram scripting language
- **[Kroki.io](https://kroki.io/)** - Diagram rendering service
- **AI Integration** - OpenAI-compatible API for generation

### Utilities
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Vercel Analytics](https://vercel.com/analytics)** - Performance monitoring
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classNames
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Smart class merging

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KevinJeremi/OsFlow.git
cd OsFlow
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

### Creating a Diagram

1. **Navigate to Generate Page**
   - Click "Get OsFlow free" or go to `/generate`

2. **Select Diagram Type** (optional)
   - Choose from Auto, Flowchart, Sequence, Class, ER, Architecture, or Network
   - Auto mode will intelligently detect the best type

3. **Write Your Prompt**
   - Describe what you want to visualize
   - Be specific about relationships and flow

4. **Generate**
   - Click "Generate Diagram" or press `Ctrl/Cmd + Enter`
   - Watch your diagram come to life!

5. **Customize & Export**
   - Toggle Sketch Mode for hand-drawn style
   - Zoom and pan to explore
   - Export as SVG for use anywhere

### Example Prompts

```
💡 "Design a user authentication flow with login, registration, 
   and password reset"

💡 "Create a database schema for an e-commerce platform with 
   users, products, orders, and reviews"

💡 "Show the architecture of a microservices backend with 
   API gateway, auth service, and database"

💡 "Visualize a CI/CD pipeline from code commit to production 
   deployment"
```

---

## 📁 Project Structure

```
OsFlow/
├── public/              # Static assets
│   ├── diagrams/       # Example diagram images
│   └── logo.png        # OsFlow logo
├── src/
│   ├── app/
│   │   ├── api/        # API routes
│   │   │   ├── generate-diagram/  # AI generation endpoint
│   │   │   └── render-diagram/    # D2 rendering endpoint
│   │   ├── generate/   # Diagram generation page
│   │   │   ├── components/  # Page-specific components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── constants.ts # Configuration
│   │   │   └── types.ts     # TypeScript types
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Home page
│   └── components/     # Shared components
│       ├── Demo.tsx    # Interactive demo
│       ├── Feature.tsx # Features section
│       ├── Footer.tsx  # Footer component
│       ├── Hero.tsx    # Hero section
│       └── Navbar.tsx  # Navigation bar
├── .env.example        # Environment template
├── package.json        # Dependencies
└── README.md           # You are here!
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration (example)
API_KEY=your_api_key_here
API_BASE_URL=https://api.example.com/v1
PRIMARY_MODEL=model-name
FALLBACK_MODEL=fallback-model
```

> ⚠️ **Security Note**: Never commit `.env.local` files to version control. The `.gitignore` is already configured to exclude these files.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [D2 Language](https://d2lang.com/) for the amazing diagram DSL
- [Kroki.io](https://kroki.io/) for diagram rendering
- [Vercel](https://vercel.com/) for hosting and analytics
- All the open-source libraries that made this possible

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/KevinJeremi">Kevin Jeremi</a>
</p>

<p align="center">
  <a href="https://github.com/KevinJeremi/OsFlow">⭐ Star this repo if you found it useful!</a>
</p>
