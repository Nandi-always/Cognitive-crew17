# Component Development Guide

## UI Components

All reusable components are in `components/ui/`. They're built on:
- React primitives
- Radix UI (unstyled)
- Tailwind CSS for styling

### Button Component
```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Normal</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### Tabs Component
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Canvas Components

### FloorPlanCanvas
Interactive 2D floor plan editor using Konva.js.

```tsx
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas';

<FloorPlanCanvas />
```

Features:
- Drag & drop rooms
- Grid snap
- Zoom & pan
- Selection highlighting

### HomeModel
3D home visualization using Three.js.

```tsx
import { Canvas } from '@react-three/fiber';
import { HomeModel } from '@/components/canvas/HomeModel';

<Canvas camera={{ position: [5, 5, 5] }}>
  <HomeModel />
</Canvas>
```

## Creating New Components

### Functional Component (Recommended)
```tsx
'use client';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  );
}
```

### With Hooks
```tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### With Animations (Framer Motion)
```tsx
'use client';

import { motion } from 'framer-motion';

export function AnimatedBox() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-indigo-600 text-white rounded"
    >
      Animated content
    </motion.div>
  );
}
```

## Component Patterns

### Controlled Component
```tsx
interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MyInput({ value, onChange }: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
```

### With Context
```tsx
'use client';

import { createContext, useContext } from 'react';

const MyContext = createContext<any>(null);

export function MyProvider({ children }: { children: React.ReactNode }) {
  const value = { /* ... */ };
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Must be used within MyProvider');
  return context;
}
```

## Styling Guidelines

### Tailwind Conventions
```tsx
// ✅ Good - semantic classes
<div className="flex items-center gap-4 rounded-lg bg-slate-100 p-4">

// ✅ Good - responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Good - dark mode
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">

// ❌ Avoid - hardcoded colors
<div style={{ color: '#123456' }}>
```

### Using cn() Utility
```tsx
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium',
        variant === 'primary' && 'bg-indigo-600 text-white',
        variant === 'secondary' && 'bg-slate-200 text-slate-900',
        className
      )}
      {...props}
    />
  );
}
```

## Testing Components

### Unit Tests
```typescript
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Visual Testing
Use Storybook (recommended setup for future):
```typescript
// Button.stories.ts
export default { component: Button };

export const Primary = { args: { variant: 'default', children: 'Button' } };
export const Outline = { args: { variant: 'outline', children: 'Button' } };
```

## Performance Tips

1. **Memoization**:
   ```tsx
   import { memo } from 'react';
   
   export const MyComponent = memo(function MyComponent(props) {
     // Heavy component
   });
   ```

2. **Code Splitting**:
   ```tsx
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'));
   ```

3. **Lazy Images**:
   ```tsx
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="description"
     loading="lazy"
   />
   ```

## Accessibility (a11y)

```tsx
// ✅ Semantic HTML
<button onClick={handleClick}>Click me</button>

// ✅ ARIA labels
<button aria-label="Close dialog">×</button>

// ✅ Keyboard navigation
<input onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />

// ✅ Color contrast
// Use colors with sufficient contrast ratio (4.5:1 for text)
```

## Component Checklist

When creating a new component:
- [ ] Use TypeScript for type safety
- [ ] Add PropTypes or typed interfaces
- [ ] Include JSDoc comments for public API
- [ ] Make it responsive (mobile-first)
- [ ] Test with keyboard & screen readers
- [ ] Use semantic HTML
- [ ] Handle edge cases (empty state, loading, error)
- [ ] Add stories/examples
- [ ] Document in component guide

## Common Patterns

### Loading State
```tsx
{isLoading ? (
  <div className="animate-spin">Loading...</div>
) : (
  <div>{data}</div>
)}
```

### Error State
```tsx
{error ? (
  <div className="text-red-600">{error.message}</div>
) : null}
```

### Empty State
```tsx
{items.length === 0 ? (
  <div className="text-center text-slate-500">No items yet</div>
) : (
  <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
)}
```

For more examples, see `components/` directory.
