# Portal Template

A modern, responsive portal website template built with Vue 3, Vuetify, and Vite.

## Features

- 🎨 Modern UI with Vuetify 3
- 🌐 Internationalization (i18n) support
- 📱 Fully responsive design
- 📰 News/Blog system
- 📝 Contact form
- 🎯 SEO friendly
- 🚀 Fast development with Vite
- 🔍 Search functionality
- 📊 Category filtering

## Tech Stack

- Vue 3 + Composition API
- Vuetify 3
- Vue Router 4
- Vue I18n
- Axios
- Vite
- SCSS

## Project Structure

```
portal-template-vue/
├── public/
├── src/
│   ├── api/            # API services
│   ├── assets/         # Static assets
│   ├── components/     # Reusable components
│   ├── layouts/        # Layout components
│   ├── locales/        # i18n translations
│   ├── router/         # Route configurations
│   ├── styles/         # Global styles
│   ├── utils/          # Utility functions
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── .env               # Environment variables
├── index.html
├── package.json
├── vite.config.js
└── vite.setup.js
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start development server:

   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

## Configuration

### API Configuration

Update the API base URL in `.env`:

```env
VITE_API_BASE_URL=your-api-url
```

### Internationalization

Add new languages in `src/locales/`:

1. Create a new language file (e.g., `fr.js`)
2. Add the language option in `src/locales/index.js`
3. Import and register in `main.js`

### Environment Configuration

Ensure you have an `.env` file in the root directory. You can use the provided `.env.example` for reference:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the environment variables in `.env` with your actual configuration.

## Components

### Key Components

- `DefaultLayout`: Main layout with header, footer, and navigation
- `NewsCard`: Reusable card component for news items
- `ImageSection`: Section with image and text content
- `SectionTitle`: Standardized section title component

### Page Components

- `Home.vue`: Landing page with hero section and featured content
- `NewsList.vue`: News listing with search and filtering
- `NewsDetail.vue`: Article detail page with related articles
- `Contact.vue`: Contact form with company information

## Development Guide

### Adding New Pages

1. Create a new component in `src/views/`
2. Add the route in `src/router/index.js`
3. Add any required translations in `src/locales/`

### API Integration

1. Add new API endpoints in `src/api/index.js`
2. Use the HTTP utility (`src/utils/http.js`) for requests
3. Handle responses and errors appropriately

## Best Practices

- Use Composition API for component logic
- Follow Vue Style Guide recommendations
- Keep components modular and reusable
- Implement proper error handling
- Use TypeScript for better type safety (optional)
- Add comments for complex logic
- Use proper Git commit messages

## License

MIT License
