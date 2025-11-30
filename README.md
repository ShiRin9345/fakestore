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

### Required Environment Variables

在部署时需要配置以下环境变量：

#### 必需的环境变量（Required）

1. **`DATABASE_URL`** (必需)

   - PostgreSQL 数据库连接字符串
   - 格式：`postgresql://user:password@host:port/database?sslmode=require`
   - 示例：`postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

2. **`BETTER_AUTH_SECRET`** (必需)
   - BetterAuth 用于加密会话的密钥
   - 必须是一个强随机字符串（建议至少 32 个字符）
   - 可以使用以下命令生成：`openssl rand -base64 32`
   - ⚠️ **重要**：生产环境必须使用强密钥，不要使用默认值

#### 可选的环境变量（Optional）

3. **`BETTER_AUTH_URL`** (可选)

   - BetterAuth 服务端的基础 URL
   - 开发环境默认：`http://localhost:3000`
   - 生产环境：设置为你的 Vercel 部署 URL
   - 示例：`https://your-app.vercel.app`

4. **`NEXT_PUBLIC_BETTER_AUTH_URL`** (可选)
   - BetterAuth 客户端使用的基础 URL
   - 开发环境默认：`http://localhost:3000`
   - 生产环境：设置为你的 Vercel 部署 URL
   - 示例：`https://your-app.vercel.app`
   - ⚠️ 注意：`NEXT_PUBLIC_` 前缀表示这个变量会暴露给客户端

### Vercel 部署步骤

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 在 Vercel 项目设置中添加环境变量：
   - `DATABASE_URL` - 你的 PostgreSQL 连接字符串
   - `BETTER_AUTH_SECRET` - 生成的强随机密钥
   - `BETTER_AUTH_URL` - 你的 Vercel 部署 URL（例如：`https://your-app.vercel.app`）
   - `NEXT_PUBLIC_BETTER_AUTH_URL` - 你的 Vercel 部署 URL（例如：`https://your-app.vercel.app`）
4. 运行数据库迁移（如果还没有运行）：
   ```bash
   pnpm db:push
   ```
5. 部署！

### 环境变量示例

**开发环境 (.env.local):**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
BETTER_AUTH_SECRET="dev-secret-key-change-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

**生产环境 (Vercel):**

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
BETTER_AUTH_SECRET="your-strong-random-secret-key-minimum-32-chars"
BETTER_AUTH_URL="https://your-app.vercel.app"
NEXT_PUBLIC_BETTER_AUTH_URL="https://your-app.vercel.app"
```

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
