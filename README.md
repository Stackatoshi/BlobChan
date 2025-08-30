# SolChan - 4chan-style Imageboard on Solana

A decentralized 4chan-style imageboard built with Next.js 14, Vercel Postgres, and Solana blockchain integration. Users can create threads and replies with text and images, with USDC-based subscriptions and wallet authentication.

## Features

- **🔐 Solana Wallet Authentication**: Connect with Phantom, Solflare, or other Solana wallets
- **💰 USDC Subscriptions**: 0.99 USDC/month subscription model
- **👤 Username System**: Optional usernames for 0.99 USDC each change
- **📝 Thread & Reply System**: Create threads and replies with text and images
- **🖼️ Image Support**: Upload images to Vercel Blob storage
- **🔗 Link Previews**: Automatic Open Graph metadata extraction for links
- **📱 Responsive Design**: Modern dark theme UI with Tailwind CSS
- **🗄️ Ephemeral Design**: Configurable thread limits with automatic cleanup
- **⚡ Real-time Updates**: Instant thread and reply creation

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Database**: Vercel Postgres with Drizzle ORM
- **File Storage**: Vercel Blob
- **Blockchain**: Solana (mainnet), @solana/web3.js, @solana/spl-token
- **Authentication**: JWT with jose library
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+ 
- Vercel account
- Solana wallet (Phantom, Solflare, etc.)
- USDC tokens for subscriptions

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SolChan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL`: Vercel Postgres connection string
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob storage token
   - `SOLANA_RPC_URL`: Solana RPC endpoint (default: mainnet)
   - `USDC_MINT_ADDRESS`: USDC token mint address
   - `TREASURY_WALLET`: Your treasury wallet for receiving payments
   - `JWT_SECRET`: Random secret for JWT signing

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npx tsx lib/seed.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Set up database**
   - Create Vercel Postgres database
   - Run `npm run db:push` in Vercel CLI or dashboard
   - Run seeding script: `npx tsx lib/seed.ts`

## Usage

### Authentication
1. Connect your Solana wallet using the wallet button
2. Sign the authentication message
3. Your wallet address becomes your identity

### Subscription
1. Click "Subscribe (0.99 USDC)" after connecting wallet
2. Approve the USDC transfer in your wallet
3. Gain access to create threads and replies

### Creating Content
1. **New Thread**: Use the form at the top of any board
2. **Reply**: Use the form at the bottom of any thread
3. **Images**: Click "Add Image" to upload files
4. **Links**: Add URLs for automatic preview generation

### Username Changes
1. Set a custom username for 0.99 USDC
2. Username changes are permanent until next payment
3. Default display name is "Anonymous"

## Database Schema

### Users
- `wallet_address` (Primary Key): Solana wallet address
- `username`: Optional custom username
- `subscription_expires_at`: Subscription expiry timestamp
- `profile_pic_url`: Optional profile picture
- `created_at`: Account creation timestamp

### Boards
- `id`: Board identifier (e.g., "tech", "crypto")
- `title`: Display name
- `description`: Board description
- `page_limit`: Maximum pages (default: 10)
- `threads_per_page`: Threads per page (default: 15)

### Threads
- `id`: Unique thread identifier
- `board_id`: Associated board
- `op_wallet_address`: Original poster's wallet
- `op_username`: Original poster's username
- `content`: Thread text content
- `image_url`: Optional image URL
- `link_url`, `link_title`, `link_image_url`: Link metadata
- `created_at`, `bumped_at`: Timestamps
- `deleted_at`: Soft delete timestamp

### Replies
- `id`: Unique reply identifier
- `thread_id`: Associated thread
- `wallet_address`: Replier's wallet
- `username`: Replier's username
- `content`: Reply text content
- `image_url`: Optional image URL
- `link_url`, `link_title`, `link_image_url`: Link metadata
- `created_at`: Creation timestamp
- `deleted_at`: Soft delete timestamp

## API Routes

### Authentication
- `GET /api/auth/nonce` - Get authentication nonce
- `POST /api/auth/siws` - Sign-in with Solana

### User Management
- `GET /api/user/me` - Get current user data
- `POST /api/subscribe` - Subscribe with USDC
- `POST /api/change-username` - Change username

### Content
- `GET /api/boards` - List all boards
- `GET /api/threads/[boardId]` - Get board threads
- `GET /api/thread/[threadId]` - Get thread with replies
- `POST /api/thread/create` - Create new thread
- `POST /api/reply/create` - Create reply

### Media
- `POST /api/blob/upload` - Upload image to Vercel Blob
- `POST /api/og/scrape` - Extract Open Graph metadata

## Configuration

### Board Limits
Each board has configurable limits:
- `page_limit`: Maximum number of pages (default: 10)
- `threads_per_page`: Threads per page (default: 15)
- Total threads = page_limit × threads_per_page

### Subscription Pricing
- Monthly subscription: 0.99 USDC
- Username change: 0.99 USDC
- All payments go to treasury wallet

### Image Limits
- Maximum file size: 5MB
- Supported formats: All image types
- Storage: Vercel Blob (public access)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

Built with ❤️ on Solana
