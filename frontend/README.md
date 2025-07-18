# Dragon Ball Characters App - Frontend

## Project Structure

```
src/
├── api/            # API interaction logic
├── assets/         # Static assets
├── components/     # Reusable React components
│   ├── features/   # Feature-specific components
│   ├── shared/     # Shared UI components
│   └── ui/         # UI layout components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── store/          # State management (Zustand)
├── styles/         # Global SCSS values
├── types/          # Data interfaces used across the app
└── utils/          # Utility functions
```

## Component Architecture

The project follows a modular component structure:
- Each component has its own folder containing:
  - Base component file (`.tsx`).
  - Styles file (`.scss`).
  - Test file (`.test.tsx`).
  - `index.ts` for clean exports.

Advantages:
- Improved code organization.
- Easy to locate related files.
- Encapsulation of component-specific logic.
- Simplified imports.
- Easier maintenance and scalability.

## Application Routes

The application supports the following routes:

- `/` (Home)
  - Displays list of characters.
  - Supports character search.
  - Allows adding/removing favorites.

- `/favorites`
  - Shows only favorite characters.
  - Supports searching within favorites.
  - Allows adding/removing favorites.

- `/character/:id`
  - Displays detailed information about a specific character.
  - Shows character transformations.
  - Allows adding/removing from favorites.

## Performance Optimizations Implemented

- Memoized components to prevent unnecessary re-renders.
- Efficient state management with Zustand.
- LocalStorage caching.

## State Management with Zustand

The application uses Zustand for efficient and flexible state management. Key features include:
- Persistent storage using `persist` middleware.
- Immutable state updates with `immer`.
- DevTools integration for debugging.
- Centralized state for:
  - Search functionality.
  - Global state preservation across components.

## Tech Stack

- React 18
- TypeScript
- Zustand (State Management)
- React Router
- Axios (API calls)
- SCSS
- Jest & React Testing Library
- Vite

## Linting

- Run lint: `npm run lint`
- Run lint fix: `npm run lint:fix`

## Recommendations for Further Improvement

1. Add translations capability. By using **i18n** for example, users could select which language to see the app on. Right now, it's all in English as in the given project instructions designs, but the character's description, which comes directly from the API, comes in Spanish, with no possibility of changing its language in the API call payload whatsoever. In the [documentation](https://web.dragonball-api.com/about) there's a reference to the GitHub repository hosting its code, and there even seems to be an [open issue](https://github.com/intentodepirata/api-dragonball/issues/1) about this.
2. Set up a CI/CD pipeline with Lint and Test checks.
