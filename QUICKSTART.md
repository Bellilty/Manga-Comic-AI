# ComicAI - Quick Start Guide

Get your ComicAI app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Get Your Hugging Face Token

1. Go to [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name (e.g., "ComicAI")
4. Select "Read" access
5. Copy the token

## Step 3: Set Environment Variable

Create a file named `.env.local` in the project root:

```bash
HF_TOKEN=hf_YourTokenHere
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## First Comic

1. Enter a story pitch like: "A young wizard discovers a magical library"
2. Choose a style: Comic, Manga, or Ligne Claire
3. Click "Generate Comic"
4. Wait 2-5 minutes for AI generation
5. View your comic and download as PDF!

## Troubleshooting

### "Model is loading" message
- This is normal! HF models need 20-30 seconds to warm up
- The app will automatically retry

### Canvas/Sharp installation issues

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev librsvg2-dev
```

Then reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Out of memory errors
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

## What's Next?

- Check the `README.md` for full documentation
- Explore the API routes in `/app/api`
- Customize prompts in `/lib/prompts.ts`
- Adjust page layout in `/lib/layout.ts`
- Deploy to Vercel!

## Need Help?

- HuggingFace API: [https://huggingface.co/docs/api-inference](https://huggingface.co/docs/api-inference)
- Next.js 14: [https://nextjs.org/docs](https://nextjs.org/docs)
- shadcn/ui: [https://ui.shadcn.com](https://ui.shadcn.com)

**Happy Comic Creating!** 🎨✨

