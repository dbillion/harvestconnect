# HarvestConnect AI Coding Instructions

## Project Overview
HarvestConnect is a **Next.js 16 faith-driven community marketplace** connecting farmers, artisans, and tradesmen with their community. The architecture emphasizes:
- **App Router** with file-based routing (not pages directory)
- **Client-side interactivity** for dynamic filtering/state management
- **Shadcn/ui + Tailwind CSS** for styling with CSS variables
- **TypeScript strict mode** enforced across all code

## Key Architecture Patterns

### File Structure & Naming
```
app/                    # Next.js App Router - each subdirectory = route
  layout.tsx           # Root layout with metadata, fonts, Analytics
  page.tsx             # Page components (export default)
  [feature]/page.tsx   # Feature pages (marketplace, community-hub, etc)
components/
  navigation.tsx       # 'use client' - sticky nav with mobile menu
  footer.tsx
  ui/                  # Shadcn components (button, input, etc) - use with @/components/ui
lib/
  utils.ts             # Utility functions (cn() for class merging)
```

### Routing Conventions
- **Dynamic routes**: Use app subdirectories - no `[slug]` pattern yet in codebase
- **Navigation links**: Always use `<Link href="/path">` from `next/link`
- **Nested layouts**: Each directory can have its own `layout.tsx` if shared UI needed

## Code Patterns & Conventions

### Component Structure
1. **Page Components** (`app/**/page.tsx`):
   - Default exports only
   - Use `'use client'` when state/interactivity needed (see `community-hub/page.tsx`)
   - Import shared: `Navigation`, `Footer`, UI components
   - Structure: `Navigation > main > sections > Footer`

2. **Reusable Components** (`components/`):
   - Client components: Add `'use client'` at top
   - Named exports + `export default`
   - Use Shadcn UI components for UI primitives
   - Example: `Navigation` manages mobile menu state with Lucide icons

### State Management & Type Safety
- **State**: `useState()` for client-side filtering (see `community-hub` blog post categories)
- **Types**: Define inline with `type BlogPost = { id: string; ... }` for page-specific data
- **No external state libraries** - component-level state is sufficient
- **TypeScript**: Always use strict types, especially for data structures (not `any`)

### Styling Approach
- **Tailwind CSS v4** with CSS variables for theming
- **shadcn/components.json** config:
  - Aliases: `@/components`, `@/components/ui`, `@/lib/utils`
  - Base color: neutral, all icons via lucide-react
  - cssVariables: true (use `--primary`, `--foreground`, etc in code)
- **Class merging**: Import `cn()` from `@/lib/utils` for conditional classes
- **Responsive**: Use `sm:`, `md:`, `lg:` prefixes; mobile-first design
- **Hover states**: Include on interactive elements (buttons, links, cards)

### Shadcn/UI Component Usage
```tsx
// Import UI components from @/components/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Use variant and size props
<Button size="lg" className="...">Text</Button>
<Input placeholder="Search..." onChange={...} />
```

### Next.js Specific Patterns
- **Metadata**: Define in `layout.tsx` root; use dynamic metadata for pages if needed
- **Analytics**: `@vercel/analytics/next` imported in root layout
- **Images**: Use `src="/placeholder.svg?height=X&width=Y&query=description"` for images
- **Font optimization**: Google fonts via `next/font/google` (Geist, Geist_Mono)
- **No API routes yet** - strictly frontend currently

## Developer Workflows

### Setup & Running
```bash
bun install          # Install dependencies (project uses Bun)
bun run dev          # Start dev server at http://localhost:3000 (hot reload)
bun run build        # Production build
bun run lint         # ESLint check (config: next/core-web-vitals + next/typescript)
```

### Debugging Tips
- **Use React DevTools**: `'use client'` components visible in browser dev console
- **Tailwind IntelliSense**: VS Code should suggest Tailwind classes with components.json setup
- **TypeScript errors**: Check strict mode - no implicit `any`

## Critical Conventions NOT to Break

1. **Never use Pages Router** - only App Router (`app/` directory)
2. **Always import UI from `@/components/ui`** - these are generated/curated
3. **Use `@/` alias** - never `../../../` relative imports
4. **Type all data structures** - especially API responses (none yet, but when added)
5. **Mark interactive components with `'use client'`** - essential for Bun/SSR
6. **Use Tailwind for all styling** - no CSS files except `globals.css`
7. **Follow naming**: Components PascalCase, pages lowercase folders, routes lowercase

## Integration Points & Dependencies

- **Shadcn/ui**: Pre-configured with components.json - when adding new component run `npx shadcn-ui@latest add [component]`
- **Lucide icons**: Use `import { IconName } from 'lucide-react'` for all icons
- **Class merging**: `clsx` and `tailwind-merge` via `cn()` in utils
- **Zod/React Hook Form**: Available but not yet used - follow Shadcn patterns if form validation added
- **Recharts/Charts**: Available for future dashboard/analytics features
- **Vercel Analytics**: Auto-enabled, no config needed

## Common Tasks

### Adding a New Page
1. Create `app/[feature-name]/page.tsx`
2. Add to navigation links in `components/navigation.tsx`
3. Use `'use client'` if needs state, otherwise optional
4. Wrap with `Navigation` and `Footer`
5. Build sections with Tailwind + Shadcn components

### Adding a New Component
1. Create `components/[ComponentName].tsx`
2. Use `'use client'` if hooks are used
3. Import Shadcn UI as needed
4. Export as named + default for flexibility

### Adding Styling
- Inline Tailwind classes in JSX (no external CSS files)
- Use CSS variables from Tailwind config: `var(--primary)`, `var(--foreground)`
- Test responsive breakpoints in browser dev tools

---

**Last Updated**: November 2025 | **Framework**: Next.js 16 App Router | **UI**: Shadcn/ui + Tailwind CSS v4
