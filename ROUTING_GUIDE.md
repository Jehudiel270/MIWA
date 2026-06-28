# 🗺️ Miwa Navigation & Routing Guide

Complete routing and navigation map for all implemented pages and modals.

---

## 📱 Main App Routes

### Root Routes

```
/ → Home/Landing Page
  ├── Search Page
  ├── Listing Detail Page
  ├── QR Code Page
  ├── Bookings Page
  ├── Checkout Page
  ├── Payments Page
  └── Profile Page
```

### Authentication Routes (No Layout)

```
/login → Login Page
/register → Registration Page
/forgot-password → Password Reset
/verify-email → Email Verification
```

### Public Info Routes (No Layout)

```
/terms → Terms of Use
/privacy → Privacy Policy
/about → About Page
```

---

## 👤 Profile & Settings Flow

### Profile Section Routes (Layout: (main))

```
/profile → Main Profile Page
├── /edit-profile → Edit Profile
│   └── Update: name, email, phone, city
│   └── Profile picture upload
│
├── /favorites → Wishlist/Favorites
│   ├── View favorite establishments
│   ├── Star ratings
│   ├── Prices
│   └── Remove with ConfirmationDialog
│
├── /payment-methods → Payment Method Management
│   ├── View saved methods (card, mobile money)
│   ├── Set as default
│   ├── Delete with ConfirmationDialog
│   └── /payment-methods/add → Add New Payment
│       ├── Card payment form
│       └── Mobile money form
│
├── /settings/notifications → Notification Preferences
│   ├── Toggle 6 notification types
│   └── Email/SMS options
│
├── /help → Help Center
│   ├── Quick contact buttons
│   ├── FAQ by category
│   └── Support contact CTA
│
└── /feedback → Feedback Form
    ├── Bug reports
    ├── Feature requests
    ├── Complaints
    └── Praise
```

---

## 🏨 Booking & Payment Flow

### Booking Routes (Layout: (main))

```
/checkout/[id] → Checkout Page
  ├── Select establishment details
  ├── Check-in/Check-out dates
  ├── Guest count
  └── Special requests
  ↓
  Trigger: "Continue to Payment"
  ↓
/payments → Payment Page
  ├── PaymentMethodModal (select payment method)
  ├── Review booking details
  └── Confirm payment
  ↓
  Success → /payment-success/[id]
  ├── Transaction ID
  ├── Amount paid
  ├── Remaining balance
  ├── Next steps info
  └── Actions:
      ├── View Bookings → /bookings
      ├── Home → /
      └── Download Receipt

  Failure → /payment-failed/[id]
  ├── Error details
  ├── Suggested actions
  └── Actions:
      ├── Retry → /checkout/[id]
      ├── Contact Support
      └── Home → /
```

### Booking Confirmation (New Route)

```
/booking-confirmation/[id] → Booking Confirmation
  ├── RoomSelector modal
  │   └── Select room type
  ├── Check-in/Check-out dates
  ├── Guest counter
  ├── Special requests
  ├── Price calculation
  └── ConfirmationDialog on proceed
  ↓
  Proceed → /checkout/[id]
```

---

## 🔐 Authentication Flow

```
/login → Login
  ├── Success → / (home)
  └── Forgot password? → /forgot-password

/register → Registration
  ├── Success → /verify-email
  └── Already registered? → /login

/forgot-password → Password Reset
  ├── Enter email
  ├── Email sent confirmation
  └── Return to Login → /login

/verify-email → Email Verification
  ├── Enter 6-digit code
  ├── Resend option (3x limit)
  ├── Success → / (home)
  └── Back → /register
```

---

## 🔀 Modal & Dialog Integration

### BottomSheet Modals

Used for mobile-first interactive selections:

- **FilterBottomSheet** - Search filters (Miwa app level)
- **PaymentMethodModal** - Payment selection in checkout
- **AddPaymentSheet** - Add new payment method form

### Modal Dialogs

Used for confirmations and center-screen interactions:

- **ConfirmationDialog** - 4 types
  - Success (green) - Booking confirmed
  - Error (red) - Payment failed
  - Warning (orange) - Confirm deletion
  - Info (blue) - General info

### Specific Modal Usage

```
Favorites Page + Remove Button
  → ConfirmationDialog (warning type)
  → Confirm removal

Payment Methods + Delete Button
  → ConfirmationDialog (warning type)
  → Remove payment method

Payment Page + Select Method
  → PaymentMethodModal (bottom sheet)
  → Choose payment type

Room Selection
  → RoomSelector Modal (centered)
  → Pick room type & confirm
```

---

## 🔗 Component Navigation Links

### Header Navigation (Back Button Pattern)

```
All pages with: Link href="/[previous_page]"

Examples:
- /edit-profile → Back to /profile
- /settings/notifications → Back to /profile
- /payment-methods/add → Back to /payment-methods
- /feedback → Back to /profile
- /help → Back to /profile
- /terms → Back to /
- /privacy → Back to /
```

### Primary CTA Buttons

```
Home Page
  → Search → /search
  → Book Now → /listing/[id]
  → My Bookings → /bookings
  → Profile → /profile

Profile Page
  → Edit Profile → /edit-profile
  → View Favorites → /favorites
  → Payment Methods → /payment-methods
  → Settings → /profile (settings subsection)
  → Help & Support → /help
  → Give Feedback → /feedback
  → About Miwa → /about
```

### Footer/Utility Navigation

```
All Pages (if applicable)
  → Terms → /terms
  → Privacy → /privacy
  → Help → /help
  → Contact Support → Feedback form
  → About → /about
```

---

## 📊 Route Structure Summary

| Section   | Routes  | Layout | Status          |
| --------- | ------- | ------ | --------------- |
| Auth      | 4       | None   | ✅ Created      |
| Public    | 3       | None   | ✅ Created      |
| Profile   | 8       | (main) | ✅ Created      |
| Booking   | 3       | (main) | ✅ Created      |
| Existing  | 7       | (main) | ✅ Pre-existing |
| **Total** | **25+** | -      | ✅ Complete     |

---

## 🎯 Critical Navigation Flows

### User Happy Path

```
/login
  → / (home)
  → /search
  → /listing/[id]
  → /booking-confirmation/[id]
  → /checkout/[id]
  → /payments (PaymentMethodModal)
  → /payment-success/[id]
  → /bookings
```

### User Profile Management

```
/profile
  → /edit-profile (edit details)
  → /favorites (view wishlist)
  → /payment-methods (manage payments)
  → /payment-methods/add (add new)
  → /settings/notifications (preferences)
  → /help (support)
  → /feedback (send feedback)
  → /about (company info)
```

### Support & Legal

```
/ or /profile
  → /help (FAQ + support)
  → /feedback (report issues)
  → /terms (read ToS)
  → /privacy (read privacy policy)
  → /about (company info)
```

---

## 🔄 API Endpoint Routing Reference

Each page should call these endpoints:

| Page                 | Method     | Endpoint                  | Purpose             |
| -------------------- | ---------- | ------------------------- | ------------------- |
| forgot-password      | POST       | /api/auth/forgot-password | Send reset email    |
| verify-email         | POST       | /api/auth/verify-email    | Verify 6-digit code |
| booking-confirmation | GET/POST   | /api/bookings             | Create booking      |
| payment-success      | GET        | /api/payments/{id}        | Fetch transaction   |
| edit-profile         | GET/PUT    | /api/user/profile         | Update profile      |
| favorites            | GET/DELETE | /api/user/favorites       | Manage favorites    |
| payment-methods      | GET/DELETE | /api/payment-methods      | Manage payments     |
| payment-methods/add  | POST       | /api/payment-methods      | Add new payment     |

---

## 🧭 Best Practices for Navigation

1. **Always use Next.js Link** - For all internal navigation
2. **Show loading states** - During form submissions
3. **Back button** - Always available on nested routes
4. **Error handling** - Show error page if route not found
5. **Confirm destructive actions** - Use ConfirmationDialog
6. **Toast notifications** - For success/error feedback (pending Sonner integration)
7. **Mobile responsive** - Test on mobile devices
8. **Animation consistency** - Use FadeContainer for page transitions

---

## 📝 Implementation Checklist

- [x] Authentication routes created
- [x] Public info routes created
- [x] Profile & settings routes created
- [x] Booking & payment flow created
- [x] Modal/dialog integration points mapped
- [ ] API endpoints integrated (NEXT)
- [ ] Toast notifications added (NEXT)
- [ ] Route guards added (NEXT)
- [ ] 404 error page (NEXT)
- [ ] Loading states (NEXT)

---

## 🚀 Quick Navigation Setup

### For developers implementing API integration:

1. Check this file for all route paths
2. Verify modal integration points
3. Implement corresponding API endpoints
4. Add error handling & loading states
5. Integrate toast notifications

### For UI/UX designers:

1. Reference this guide for information architecture
2. Ensure consistent navigation patterns
3. Test back button functionality
4. Verify mobile responsiveness
5. Check animation consistency

---

**Last Updated:** December 2024
**Next Priority:** API Integration & Toast Notifications
