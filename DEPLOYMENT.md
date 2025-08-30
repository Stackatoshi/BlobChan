# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Vercel Blob**: Create blob storage in Vercel dashboard (after first deployment)

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Deploy"

### 2. Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```bash
# Vercel Blob Storage (after setting up Vercel Blob)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Solana Configuration
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
USDC_MINT_ADDRESS="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
TREASURY_WALLET="7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e"

# JWT Secret (generate a random string)
JWT_SECRET="your_random_jwt_secret_here"
```

### 3. Set Up Vercel Blob (After First Deployment)

1. In Vercel dashboard, go to **Storage → Blob**
2. Create a new blob store
3. Copy the read/write token to `BLOB_READ_WRITE_TOKEN`

#### Blob API Usage
The app uses the Vercel Blob API for image uploads:
```typescript
import { put } from "@vercel/blob";

const { url } = await put('filename.jpg', file, { access: 'public' });
```

**Features:**
- ✅ Public access for image sharing
- ✅ Automatic file naming with timestamps
- ✅ 5MB file size limit
- ✅ Image format validation
- ✅ Secure upload with JWT authentication

### 4. Deploy

1. **First Deploy**: Push your code to trigger deployment
2. **Set up Blob**: After successful deployment, create Vercel Blob storage
3. **Configure Environment Variables**: Add the blob token and other variables

### 5. Alternative: Use Vercel Dashboard

If you prefer using the Vercel dashboard:

1. Go to your project dashboard
2. Click on **Functions** tab
3. Find the deployment logs
4. Monitor for any errors

## Environment Variables Details

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | `vercel_blob_rw_...` |
| `SOLANA_RPC_URL` | Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |
| `USDC_MINT_ADDRESS` | USDC token mint address | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| `TREASURY_WALLET` | Server wallet for receiving USDC | `7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e` |
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

# Check deployment status
vercel ls
```

### Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Blob**: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)

## Post-Deployment

After successful deployment:

1. **Test Authentication**: Connect a Solana wallet
2. **Test UI**: Navigate through boards and threads
3. **Set up Blob**: Create Vercel Blob storage
4. **Configure Environment Variables**: Add blob token and other variables
5. **Test Full Features**: Try posting, image uploads, etc.

Your BlobChan imageboard should now be live! 🚀
