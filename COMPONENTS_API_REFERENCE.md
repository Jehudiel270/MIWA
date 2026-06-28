# 🎨 Miwa Components API Reference

Complete TypeScript interface reference for all newly created motion components and modals.

---

## Animation Variants Library

**File:** `components/ui/motion/animations.ts`

All variants are pre-built and exported. Use them in Framer Motion:

```typescript
import { fadeIn, slideInUp, containerVariants } from '@/components/ui/motion';

// In component:
<motion.div variants={fadeIn} initial="hidden" animate="visible" />
```

### Available Variants

| Variant             | Duration | Use Case                                   |
| ------------------- | -------- | ------------------------------------------ |
| `fadeIn`            | 0.3s     | Simple opacity fade                        |
| `fadeInScale`       | 0.4s     | Fade + scale entry                         |
| `slideInUp`         | 0.4s     | Slide from bottom                          |
| `slideInDown`       | 0.4s     | Slide from top                             |
| `slideInLeft`       | 0.4s     | Slide from left                            |
| `slideInRight`      | 0.4s     | Slide from right                           |
| `containerVariants` | Stagger  | Parent for staggered children (0.1s delay) |
| `itemVariants`      | 0.3s     | Child item for stagger                     |
| `scaleIn`           | 0.3s     | Scale up entry                             |
| `scaleInCenter`     | 0.3s     | Scale from center                          |
| `bounce`            | 0.6s     | Spring physics bounce                      |
| `backdropVariants`  | 0.3s     | Overlay fade                               |
| `sheetVariants`     | Spring   | Bottom sheet animation                     |
| `modalVariants`     | Spring   | Modal scale + fade                         |

---

## Motion Components

### BottomSheet

**File:** `components/ui/motion/BottomSheet.tsx`

Reusable bottom drawer modal for mobile-first UX.

```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeButton?: boolean;
  className?: string;
  maxHeight?: string;
}

// Usage:
<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Select Filter"
  maxHeight="70vh"
>
  {/* Content here */}
</BottomSheet>
```

**Props:**

- `isOpen` (boolean) - Controls visibility
- `onClose` (function) - Callback when closing
- `title` (string, optional) - Header title
- `children` (ReactNode) - Sheet content
- `closeButton` (boolean, optional) - Show X button (default: true)
- `className` (string, optional) - Additional CSS classes
- `maxHeight` (string, optional) - Max height CSS value (default: "80vh")

---

### Modal

**File:** `components/ui/motion/Modal.tsx`

Reusable centered modal dialog.

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeButton?: boolean;
  className?: string;
}

// Usage:
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
  footer={
    <div className="flex gap-2">
      <button>Cancel</button>
      <button>Confirm</button>
    </div>
  }
>
  <p>Are you sure?</p>
</Modal>
```

**Props:**

- `isOpen` (boolean) - Controls visibility
- `onClose` (function) - Callback when closing
- `title` (string, optional) - Modal header
- `children` (ReactNode) - Modal content
- `footer` (ReactNode, optional) - Footer section
- `size` ('sm' | 'md' | 'lg', optional) - Modal size (default: 'md')
- `closeButton` (boolean, optional) - Show X button (default: true)
- `className` (string, optional) - Additional CSS classes

**Size Options:**

- `'sm'` → max-width: 24rem (384px)
- `'md'` → max-width: 28rem (448px) - default
- `'lg'` → max-width: 32rem (512px)

---

### FadeContainer

**File:** `components/ui/motion/FadeContainer.tsx`

Container for staggered animations.

```typescript
interface FadeContainerProps {
  children: React.ReactNode;
  stagger?: boolean;
  delay?: number;
  variant?: 'fadeIn' | 'slideInUp' | 'slideInLeft';
  className?: string;
}

// Usage - Staggered:
<FadeContainer stagger>
  <AnimatedItem>Item 1</AnimatedItem>
  <AnimatedItem>Item 2</AnimatedItem>
  <AnimatedItem>Item 3</AnimatedItem>
</FadeContainer>

// Usage - Single animation:
<FadeContainer>
  <div>Content fades in</div>
</FadeContainer>
```

**Props:**

- `children` (ReactNode) - Container content
- `stagger` (boolean, optional) - Enable stagger mode (default: false)
- `delay` (number, optional) - Initial delay in seconds (default: 0)
- `variant` (string, optional) - Animation type (default: 'fadeIn')
- `className` (string, optional) - Additional CSS classes

**AnimatedItem Component:**

```typescript
// Wrap individual items for stagger effect:
<FadeContainer stagger>
  <AnimatedItem>Item 1</AnimatedItem>
  <AnimatedItem>Item 2</AnimatedItem>
</FadeContainer>
```

---

## Modal Components

### FilterBottomSheet

**File:** `components/modals/FilterBottomSheet.tsx`

Filter selector with price range.

```typescript
interface FilterOption {
  id: string;
  label: string;
}

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOption[];
  activeFilters: string[];
  onFilterChange: (filterId: string) => void;
  onApply: (filters: string[], priceRange: [number, number]) => void;
  maxPrice?: number;
}

// Usage:
<FilterBottomSheet
  isOpen={showFilters}
  onClose={() => setShowFilters(false)}
  filters={[
    { id: 'luxury', label: 'Luxury' },
    { id: 'budget', label: 'Budget' },
  ]}
  activeFilters={selectedFilters}
  onFilterChange={(id) => toggleFilter(id)}
  onApply={(filters, price) => applyFilters(filters, price)}
  maxPrice={100000}
/>
```

**Props:**

- `isOpen` (boolean) - Visibility
- `onClose` (function) - Close callback
- `filters` (FilterOption[]) - Filter options array
- `activeFilters` (string[]) - Currently selected filter IDs
- `onFilterChange` (function) - Toggle individual filter
- `onApply` (function) - Apply filters callback with (filters, priceRange)
- `maxPrice` (number, optional) - Maximum price for slider

---

### RoomSelector

**File:** `components/modals/RoomSelector.tsx`

Hotel room selection modal.

```typescript
interface Room {
  id: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  image?: string;
}

interface RoomSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  selectedRoomId?: string;
  onSelectRoom: (roomId: string) => void;
}

// Usage:
<RoomSelector
  isOpen={showRooms}
  onClose={() => setShowRooms(false)}
  rooms={[
    {
      id: '1',
      type: 'Standard',
      capacity: 2,
      price: 35000,
      amenities: ['wifi', 'ac', 'breakfast', 'parking'],
      image: 'https://...'
    }
  ]}
  selectedRoomId={selectedRoom}
  onSelectRoom={(id) => setSelectedRoom(id)}
/>
```

**Props:**

- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close callback
- `rooms` (Room[]) - Array of room objects
- `selectedRoomId` (string, optional) - Currently selected room
- `onSelectRoom` (function) - Selection callback

**Room Object:**

- `id` (string) - Unique room identifier
- `type` (string) - Room type (e.g., "Standard", "Deluxe")
- `capacity` (number) - Number of guests
- `price` (number) - Price per night in FCFA
- `amenities` (string[]) - Array of amenity IDs
- `image` (string, optional) - Image URL

**Supported Amenities:**

- `'wifi'` → WiFi icon
- `'ac'` → AC/Cooling icon
- `'breakfast'` → Coffee/Breakfast icon
- `'parking'` → Parking icon

---

### PaymentMethodModal

**File:** `components/modals/PaymentMethodModal.tsx`

Payment method selection bottom sheet.

```typescript
interface PaymentMethod {
  id: string;
  type: string;
  label: string;
  description: string;
  available: boolean;
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  methods: PaymentMethod[];
  selectedMethodId?: string;
  onSelectMethod: (methodId: string) => void;
  amount: number;
  onApply?: (methodId: string) => void;
}

// Usage:
<PaymentMethodModal
  isOpen={showPayment}
  onClose={() => setShowPayment(false)}
  methods={[
    {
      id: 'card',
      type: 'card',
      label: 'Visa Card',
      description: 'Pay with credit/debit card',
      available: true
    }
  ]}
  selectedMethodId={selected}
  onSelectMethod={(id) => setSelected(id)}
  amount={53750}
  onApply={(id) => processPayment(id)}
/>
```

**Props:**

- `isOpen` (boolean) - Visibility
- `onClose` (function) - Close callback
- `methods` (PaymentMethod[]) - Available payment methods
- `selectedMethodId` (string, optional) - Current selection
- `onSelectMethod` (function) - Selection callback
- `amount` (number) - Amount to pay in FCFA
- `onApply` (function, optional) - Apply callback

---

### ConfirmationDialog

**File:** `components/modals/ConfirmationDialog.tsx`

Generic confirmation dialog with 4 type variants.

```typescript
type ConfirmationType = 'success' | 'error' | 'warning' | 'info';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: ConfirmationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

// Usage:
<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  type="warning"
  title="Delete favorite?"
  message="This action cannot be undone."
  confirmText="Delete"
  cancelText="Keep"
  isDangerous={true}
  onConfirm={() => deleteFavorite()}
/>
```

**Props:**

- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close callback (for X button)
- `type` (ConfirmationType) - Dialog type
  - `'success'` → Green, CheckCircle icon
  - `'error'` → Red, AlertCircle icon
  - `'warning'` → Orange, AlertTriangle icon
  - `'info'` → Blue, Info icon
- `title` (string) - Dialog title
- `message` (string) - Dialog message
- `confirmText` (string, optional) - Confirm button text (default: "Confirm")
- `cancelText` (string, optional) - Cancel button text (default: "Cancel")
- `isDangerous` (boolean, optional) - Highlight as destructive action
- `onConfirm` (function) - Confirm button callback
- `onCancel` (function, optional) - Cancel button callback

---

## Import Reference

### Importing Motion Components

```typescript
// Individual imports
import { FadeContainer, AnimatedItem } from "@/components/ui/motion";
import { BottomSheet } from "@/components/ui/motion";
import { Modal } from "@/components/ui/motion";

// Or use barrel export
import {
  FadeContainer,
  AnimatedItem,
  BottomSheet,
  Modal,
} from "@/components/ui/motion";
```

### Importing Modals

```typescript
// Individual imports
import { FilterBottomSheet } from "@/components/modals";
import { RoomSelector } from "@/components/modals";
import { PaymentMethodModal } from "@/components/modals";
import { ConfirmationDialog } from "@/components/modals";

// Or use barrel export
import {
  FilterBottomSheet,
  RoomSelector,
  PaymentMethodModal,
  ConfirmationDialog,
} from "@/components/modals";
```

### Importing Animations

```typescript
import {
  fadeIn,
  slideInUp,
  containerVariants,
  itemVariants,
  // ... other variants
} from "@/components/ui/motion/animations";
```

---

## Common Usage Patterns

### Form with Staggered Animation

```typescript
<FadeContainer stagger>
  <AnimatedItem>
    <input type="text" />
  </AnimatedItem>
  <AnimatedItem>
    <input type="email" />
  </AnimatedItem>
  <AnimatedItem>
    <button>Submit</button>
  </AnimatedItem>
</FadeContainer>
```

### Modal with Confirmation

```typescript
const [showConfirm, setShowConfirm] = useState(false);

<ConfirmationDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  type="warning"
  title="Confirm Action"
  message="Are you sure?"
  onConfirm={() => {
    // Do action
    setShowConfirm(false);
  }}
/>

<button onClick={() => setShowConfirm(true)}>
  Delete
</button>
```

### Bottom Sheet with Filters

```typescript
const [showFilters, setShowFilters] = useState(false);
const [activeFilters, setActiveFilters] = useState<string[]>([]);

<FilterBottomSheet
  isOpen={showFilters}
  onClose={() => setShowFilters(false)}
  filters={filterOptions}
  activeFilters={activeFilters}
  onFilterChange={(id) => {
    setActiveFilters(prev =>
      prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  }}
  onApply={(filters, price) => {
    applySearch({ filters, priceRange: price });
    setShowFilters(false);
  }}
/>
```

---

## Color Scheme Reference

All components use Miwa brand colors:

```typescript
// Primary - Used for CTA buttons, active states
#d4643f (Terracotta)

// Text - Main content
#2d2520 (Dark Brown)

// Text Secondary - Secondary info
#786f69 (Medium Brown)

// Background
#f5f1ed (Light Beige)

// Border
#e8e1db (Light Border)

// Success - Success states, confirmations
#10b981 (Green)

// Error - Errors, warnings
#d4183d (Red)
```

---

## Animation Performance Tips

1. **Use `AnimatePresence`** - For exit animations
2. **Set `initial={false}`** - To avoid animation on mount
3. **Use `AnimatedItem`** - For staggered children
4. **Avoid animating** - Heavy properties like width/height, use maxHeight instead
5. **Use `will-change`** - In CSS for performance

---

## Testing Components

All components accept mock data. Example test data structures:

```typescript
// Room test data
const testRooms: Room[] = [
  {
    id: "1",
    type: "Standard",
    capacity: 2,
    price: 35000,
    amenities: ["wifi", "ac"],
    image: "https://images.unsplash.com/...",
  },
];

// Filter test data
const testFilters = [
  { id: "luxury", label: "Luxury" },
  { id: "budget", label: "Budget" },
];

// Payment method test data
const testMethods: PaymentMethod[] = [
  {
    id: "mtn",
    type: "mobile",
    label: "MTN Mobile Money",
    description: "Pay with MTN",
    available: true,
  },
];
```

---

**Last Updated:** December 2024
**Version:** 1.0
**Status:** Production Ready
