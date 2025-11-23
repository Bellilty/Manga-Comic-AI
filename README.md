# ComicAI

Transform your story ideas into beautiful AI-generated comics with consistent characters, coherent storylines, and professional comic styling.

## 🎯 Features

- **AI Story Generation**: Automatically structure your pitch into a 3-5 page comic script
- **Multiple Art Styles**: Choose between Comic, Manga, or Ligne Claire styles
- **Consistent Characters**: Maintain character consistency across all panels
- **Panel Assembly**: Automatically compose panels into professional comic pages
- **PDF Export**: Download your comics as A4 PDFs
- **Public Gallery**: Browse all generated comics in the Explore section

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui components
- react-hook-form
- Zustand for state management

### Backend
- Next.js API Routes
- Hugging Face Inference API (FREE tier)
- Sharp for image processing
- PDFKit for PDF generation

### AI Models
- **Text Generation**: Qwen/Qwen2-7B-Instruct
- **Image Generation**: stabilityai/stable-diffusion-xl-base-1.0
- **Character Consistency**: h94/IP-Adapter

### Storage
- File-based JSON storage system
- Local filesystem for development
- Ready for Vercel deployment with vercel-blob

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Hugging Face account and API token
- macOS, Linux, or Windows with WSL2

## 🚀 Installation

### 1. Clone the Repository

```bash
cd comic-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
HF_TOKEN=your_huggingface_token_here
```

To get your Hugging Face token:
1. Sign up at [https://huggingface.co](https://huggingface.co)
2. Go to Settings → Access Tokens
3. Create a new token with "Read" permissions
4. Copy and paste it into your `.env.local` file

### 4. Create Data Directory

The data directory should already exist, but ensure it's there:

```bash
mkdir -p data/comics
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/comic-ai
  /app
    /api
      /story/route.ts           # Generate story structure
      /character/route.ts       # Generate character references
      /panel/route.ts           # Generate individual panels
      /comic/route.ts           # Assemble full comic
      /pdf/route.ts             # Generate PDF export
      /comics
        /list/route.ts          # List all comics
        /[id]/route.ts          # Get specific comic
    /generate/page.tsx          # Generation page
    /explore/page.tsx           # Browse all comics
    /page.tsx                   # Home page
    layout.tsx                  # Root layout
    globals.css                 # Global styles
  /components
    /ui                         # shadcn/ui components
    StoryForm.tsx              # Main form component
    PageViewer.tsx             # Comic page viewer
    LoadingSpinner.tsx         # Loading indicator
    ComicCard.tsx              # Comic preview card
  /lib
    hf.ts                      # Hugging Face API integration
    prompts.ts                 # AI prompt templates
    layout.ts                  # Page layout logic
    types.ts                   # TypeScript types
    storage.ts                 # File system storage
    utils.ts                   # Utility functions
  /data/comics                 # Generated comics storage
```

## 🎨 How It Works

### 1. Story Generation

User provides:
- Story pitch (text description)
- Visual style (comic/manga/ligne claire)
- Optional character reference image

The AI generates a structured story with:
- 3-5 pages
- Character descriptions
- Panel-by-panel breakdown with descriptions, emotions, and dialogue

### 2. Comic Creation

For each page:
1. Generate panels using Stable Diffusion XL
2. Apply style-specific prompts
3. Maintain character consistency using IP-Adapter
4. Assemble panels into a vertical page layout

### 3. Output

- PNG images for each page (1400×2000px)
- Downloadable A4 PDF
- Stored locally with metadata
- Displayed in public Explore gallery

## 🖥 API Routes

### POST `/api/story`
Generate story structure from pitch
```json
{
  "pitch": "A brave knight discovers a magical sword",
  "style": "comic"
}
```

### POST `/api/character`
Generate character reference image
```json
{
  "characterDescription": "A young female knight with red hair",
  "style": "manga"
}
```

### POST `/api/panel`
Generate single panel
```json
{
  "description": "Knight holding glowing sword",
  "style": "comic",
  "character": "young female knight",
  "dialogue": "This sword... it's calling to me"
}
```

### POST `/api/comic`
Generate full comic
```json
{
  "pitch": "Story description",
  "style": "manga",
  "story": { /* StoryStructure object */ }
}
```

### POST `/api/pdf`
Generate PDF download
```json
{
  "comicId": "comic_1234567890"
}
```

### GET `/api/comics/list`
List all generated comics

### GET `/api/comics/[id]`
Get specific comic with all pages

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable: `HF_TOKEN`
4. Deploy

**Note**: For production on Vercel, you'll need to:
- Use Vercel Blob Storage for comic storage
- Update `storage.ts` to use blob APIs instead of filesystem

### Alternative: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## ⚙️ Configuration

### Adjust Generation Settings

Edit `lib/hf.ts` to modify:
- Retry attempts
- Timeout durations
- Model loading wait times

Edit `lib/layout.ts` to modify:
- Page dimensions
- Panel spacing
- Image resizing

### Change AI Models

Update model names in API routes:
- `app/api/story/route.ts` - Text model
- `app/api/character/route.ts` - Image model
- `app/api/panel/route.ts` - Image model
- `app/api/comic/route.ts` - Image model

## 🐛 Troubleshooting

### Model Loading Errors
- Hugging Face models may need 20-30 seconds to "warm up"
- The app automatically retries with exponential backoff
- If persistent, try a different model or check HF status

### Canvas/Sharp Issues
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg

# Ubuntu/Debian
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev librsvg2-dev

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Memory Issues
- Comics are memory-intensive
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run dev`
- For Vercel, upgrade to Pro for more memory

### TypeScript Errors
```bash
npm run build
# Fix any errors shown
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_TOKEN` | Yes | Hugging Face API token |
| `NODE_ENV` | Auto | Development/production mode |

## 🤝 Contributing

This is a production-ready starter template. Feel free to:
- Add new comic styles
- Integrate additional AI models
- Enhance the UI
- Add user authentication
- Implement rating/favorites system

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Powered by [Hugging Face](https://huggingface.co) free inference API
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Built with [Next.js](https://nextjs.org)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Hugging Face model documentation
3. Check Next.js 14 documentation

---

**Ready to create amazing comics? Start your dev server and let your imagination run wild!** 🎨✨

