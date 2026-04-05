# Development Guidelines

## General

- Use TypeScript strictly — avoid `any` where possible
- Keep components small and focused on a single responsibility
- Use `useMemo` and `useCallback` for expensive computations
- Always handle loading and error states

## Layout & Styling

- Use Flexbox and CSS Grid by default; avoid absolute positioning unless necessary
- Follow mobile-first responsive design using Tailwind breakpoints (`sm`, `md`, `lg`)
- Use shadcn/ui components before building custom ones
- Keep consistent spacing using Tailwind's spacing scale

## Forms & Validation

- Validate required fields before API calls
- Show inline error messages near the relevant field
- Disable submit buttons while saving (`disabled={saving}`)
- Show a `Loader2` spinner inside buttons during async operations

## API & Data

- All API calls go through `src/app/api/` — never call `fetch` directly in components
- Handle errors with `toast.error()` from Sonner
- Refresh data after mutations by re-fetching from the API

## Dialogs & Modals

- Use shadcn `Dialog` for confirmations and forms
- Always include a Cancel button alongside the primary action
- Destructive actions (delete) use `variant="destructive"` button

## Role-Based Access

- Check `currentUser?.role` from `useAuth()` to conditionally render UI
- Never rely solely on frontend checks — backend enforces authorization too
- Roles: `admin`, `manager`, `staff`, `student`, `customer`
