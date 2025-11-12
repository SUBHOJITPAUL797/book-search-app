# 📚 Book Search App

A modern React TypeScript application for searching and downloading books via Telegram Bot API integration.

## 🚀 Features

- **Real-time Search**: Search books by title, author, or genre with debounced input
- **Telegram Bot Integration**: Direct integration with Telegram Bot API for book data
- **Advanced Filtering**: Filter by format, language, rating, and publication year
- **Download Management**: Track download progress with visual indicators
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Smooth animations with Framer Motion
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **API Integration**: Axios + Telegram Bot API

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔨 Build

```bash
npm run build
```

## 📱 Usage

1. **Search**: Use the search bar to find books by title, author, or genre
2. **Filter**: Apply filters to narrow down results
3. **Download**: Click on any book to view details and download
4. **View Modes**: Switch between grid and list views

## 🔌 Telegram Bot API

The app integrates with Telegram Bot API using the token `6184466023:AAGsjitIFxcqwr1uqxqh9h05z1Srt8VRQh0`. 

### How it works:
- Fetches book data from bot messages and documents
- Parses book information from message text and attachments
- Downloads files directly from Telegram servers
- Caches data for 5 minutes to improve performance

### Message Format:
The bot parser looks for messages containing:
- 📚 or 📖 emojis for book titles
- ✍️ emoji for author information  
- 📄 emoji for format information
- Document attachments for downloadable files

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── BookCard.tsx    # Book display card
│   ├── SearchBar.tsx    # Search interface
│   └── FilterPanel.tsx  # Advanced filtering
├── hooks/              # Custom React hooks
├── services/           # API services
├── stores/             # State management
├── types/              # TypeScript definitions
└── pages/              # Page components
```

## 🎯 Key Features Implementation

- **Debounced Search**: Prevents excessive API calls during typing
- **Progress Tracking**: Real-time download progress with visual feedback
- **Error Handling**: Graceful fallbacks for API failures
- **Caching**: 5-minute cache for book data to improve performance
- **Responsive Design**: Works seamlessly on desktop and mobile devices

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
