# Evergreen Labs Website

A Next.js website for Evergreen Labs, built with TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Lucide React** - Icon library

## Project Structure

```
evergreenlabs/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── page.tsx          # Public landing page
│   │   ├── admin/
│   │   │   ├── layout.tsx        # Admin layout shell
│   │   │   └── page.tsx          # Admin dashboard placeholder
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles + Tailwind
│   ├── components/
│   │   └── ui/                   # All shadcn/ui components
│   └── lib/
│       └── utils.ts              # Utility functions (cn helper)
├── public/                       # Static assets
├── components.json               # shadcn configuration
├── tailwind.config.js            # Tailwind configuration
└── package.json
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Routes

- `/` - Public landing page (scrollable, single page)
- `/admin` - Admin dashboard (empty shell, ready for future development)

## shadcn/ui Components

All shadcn/ui components have been installed and are available in `src/components/ui/`. You can import and use them directly:

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

## Path Aliases

- `@/*` - Points to `src/*`
- `@/components/*` - Components directory
- `@/lib/*` - Utility functions and helpers

## Next Steps

- Add content to the landing page sections
- Implement admin section features
- Configure environment variables as needed
- Set up deployment pipeline
