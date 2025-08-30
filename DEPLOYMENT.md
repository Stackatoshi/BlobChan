# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Vercel Postgres**: Create a database in Vercel dashboard
4. **Vercel Blob**: Create blob storage in Vercel dashboard

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Deploy"

### 2. Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```bash
# Database (from Vercel Postgres)
DATABASE_URL="postgresql://..."

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Solana Configuration
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
USDC_MINT_ADDRESS="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
TREASURY_WALLET="your_treasury_wallet_address"

# JWT Secret (generate a random string)
JWT_SECRET="your_random_jwt_secret_here"
```

### 3. Set Up Vercel Postgres

1. In Vercel dashboard, go to **Storage → Postgres**
2. Create a new database
3. Copy the connection string to `DATABASE_URL`
4. Note: The connection string will look like:
   ```
   postgresql://default:password@host:port/database
   ```

### 4. Set Up Vercel Blob

1. In Vercel dashboard, go to **Storage → Blob**
2. Create a new blob store
3. Copy the read/write token to `BLOB_READ_WRITE_TOKEN`

### 5. Deploy and Set Up Database

1. **First Deploy**: Push your code to trigger deployment
2. **Database Migration**: After deployment, run in Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx drizzle-kit push
   ```
3. **Seed Database**: Run the seeding script:
   ```bash
   npx tsx lib/seed.ts
   ```

### 6. Alternative: Use Vercel Dashboard

If you prefer using the Vercel dashboard:

1. Go to your project dashboard
2. Click on **Functions** tab
3. Find the deployment logs
4. Use the **Shell** feature to run commands:
   ```bash
   npm run db:push
   npm run seed
   ```

## Environment Variables Details

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Vercel Postgres connection string | `postgresql://default:...@.../...` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | `vercel_blob_rw_...` |
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `USDC_MINT_ADDRESS` | USDC token mint address | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| `TREASURY_WALLET` | Your wallet for receiving USDC | `11111111111111111111111111111112` |
| `JWT_SECRET` | Secret for JWT signing | Random 32+ character string |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `USDC_MINT_ADDRESS` | USDC token mint | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are correct in `package.json`
2. **Database Connection**: Ensure `DATABASE_URL` is properly set
3. **Blob Upload Fails**: Verify `BLOB_READ_WRITE_TOKEN` is correct
4. **Authentication Issues**: Check `JWT_SECRET` is set

### Debug Commands

```bash
# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local

# Run database migration
npx drizzle-kit push

# Check database connection
npx drizzle-kit studio

# Seed database
npm run seed
```

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Postgres**: [vercel.com/docs/storage/vercel-postgres](https://vercel.com/docs/storage/vercel-postgres)
- **Vercel Blob**: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)

## Post-Deployment

After successful deployment:

1. **Test Authentication**: Connect a Solana wallet
2. **Test Subscriptions**: Try the subscription flow
3. **Test Posting**: Create a thread and reply
4. **Test Images**: Upload an image
5. **Monitor Logs**: Check Vercel function logs for any errors

Your SolChan imageboard should now be live! 🚀
