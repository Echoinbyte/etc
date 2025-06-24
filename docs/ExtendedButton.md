# ExtendedButton Component

A highly customizable and feature-rich button component built for React/Next.js applications with TypeScript support.

## Features

✨ **Multiple Variants**: Primary, Secondary, Outline, Ghost, and Destructive styles  
📏 **Three Sizes**: Small, Medium, and Large  
🎨 **Custom Icons**: Support for left and right icons  
⚡ **Loading States**: Built-in loading spinner and disabled states  
🔗 **Smart Linking**: Automatic Link wrapper with external link support  
🎯 **Accessibility**: Full keyboard navigation and focus management  
🎭 **Animations**: Smooth hover effects and transitions  
📱 **Responsive**: Works perfectly on all screen sizes  

## Installation

The component is already included in the project. Simply import it:

```tsx
import { ExtendedButton } from '@/components/shared/ExtendedButton';
```

## Basic Usage

```tsx
// Simple button
<ExtendedButton>Click me</ExtendedButton>

// With custom link
<ExtendedButton link="/dashboard">Go to Dashboard</ExtendedButton>

// Different variant
<ExtendedButton variant="outline">Outline Button</ExtendedButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | `"Get started"` | Button content |
| `link` | `string` | `"/signup"` | URL to navigate to |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "destructive"` | `"primary"` | Button style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `iconLeft` | `ReactNode` | `undefined` | Icon to display on the left |
| `iconRight` | `ReactNode` | `undefined` | Icon to display on the right |
| `external` | `boolean` | `false` | Opens link in new tab |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `fullWidth` | `boolean` | `false` | Makes button full width |
| `asChild` | `boolean` | `false` | Renders without Link wrapper |
| `disabled` | `boolean` | `false` | Disables the button |
| `className` | `string` | `""` | Additional CSS classes |

## Examples

### Variants

```tsx
<ExtendedButton variant="primary">Primary</ExtendedButton>
<ExtendedButton variant="secondary">Secondary</ExtendedButton>
<ExtendedButton variant="outline">Outline</ExtendedButton>
<ExtendedButton variant="ghost">Ghost</ExtendedButton>
<ExtendedButton variant="destructive">Delete</ExtendedButton>
```

### Sizes

```tsx
<ExtendedButton size="sm">Small</ExtendedButton>
<ExtendedButton size="md">Medium</ExtendedButton>
<ExtendedButton size="lg">Large</ExtendedButton>
```

### With Icons

```tsx
import { Github, Download } from 'lucide-react';

<ExtendedButton 
  iconLeft={<Github className="h-4 w-4" />}
  variant="outline"
  external
  link="https://github.com"
>
  GitHub
</ExtendedButton>

<ExtendedButton 
  iconRight={<Download className="h-4 w-4" />}
  variant="secondary"
>
  Download
</ExtendedButton>
```

### Loading State

```tsx
const [isLoading, setIsLoading] = useState(false);

<ExtendedButton 
  loading={isLoading}
  onClick={() => handleSubmit()}
>
  {isLoading ? 'Submitting...' : 'Submit Form'}
</ExtendedButton>
```

### As Form Button

```tsx
<ExtendedButton 
  asChild 
  type="submit" 
  variant="primary"
  disabled={!isValid}
>
  Submit Form
</ExtendedButton>
```

### Full Width

```tsx
<ExtendedButton fullWidth variant="primary">
  Full Width Button
</ExtendedButton>
```

## Default Behavior

- **Primary** and **Outline** variants automatically get a right arrow icon that moves on hover
- **Secondary** variant automatically gets a code icon on the left
- **External** links open in a new tab with proper `rel` attributes
- **Loading** state shows a spinner and disables the button
- **Disabled** buttons are not clickable and have reduced opacity

## Styling

The component uses Tailwind CSS classes and CSS custom properties for theming. It automatically adapts to your design system's color tokens:

- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--background` / `--foreground`
- `--border`
- `--destructive` / `--destructive-foreground`

## Accessibility

- Full keyboard navigation support
- Proper focus management with visible focus rings
- Screen reader friendly with semantic HTML
- Disabled state properly communicated to assistive technologies
