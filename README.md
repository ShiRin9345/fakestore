# Shopping Website

A modern e-commerce shopping website built with Next.js, featuring product browsing, shopping cart, and user authentication.

## Features

- 🛍️ **Product Listing**: Browse products with category filtering and infinite scroll
- 📦 **Shopping Cart**: Add, update, and remove items from your cart
- 🔐 **User Authentication**: Secure login and registration with BetterAuth
- 🖼️ **Image Optimization**: Lazy loading and optimized images
- 📱 **Responsive Design**: Works on all devices
- 🔍 **SEO Friendly**: Optimized metadata for search engines

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui
- **Authentication**: BetterAuth
- **Database**: PostgreSQL with Drizzle ORM
- **Data Source**: FakeStoreAPI

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mianshi
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
```

4. Run database migrations:
```bash
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (your production URL)
4. Deploy!

## Project Structure

```
app/
  ├── api/          # API routes
  ├── cart/         # Shopping cart page
  ├── login/        # Login page
  ├── products/     # Product pages
  └── page.tsx      # Home page (product listing)

components/
  ├── ui/           # shadcn components
  ├── Navbar.tsx    # Navigation bar
  ├── ProductCard.tsx
  └── CartItem.tsx

lib/
  ├── auth.ts       # BetterAuth configuration
  ├── auth-client.ts
  └── db/           # Database configuration
```

## License

MIT
