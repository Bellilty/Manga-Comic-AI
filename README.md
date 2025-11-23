# ComicAI - Manga & Comic Generator

Transform your story ideas into beautiful AI-generated comics and mangas with consistent characters, coherent storylines, and professional styling powered by Ideogram and OpenAI.

## 🎯 Features

- **AI Story Generation**: Automatically structure your pitch into a 2-4 page comic/manga script with detailed panel layouts
- **Multiple Art Styles**: Choose between Comic (left-to-right) or Manga (right-to-left) styles
- **Consistent Characters**: Maintain character consistency across all pages using Ideogram Character Reference
- **Dynamic Panel Layouts**: Each page has unique, creative panel arrangements (not just grids)
- **Precise Panel Positioning**: AI defines exact position, size, and content for each panel
- **Visual Continuity**: Previous pages are sent as reference to maintain style consistency
- **Readable Text**: English dialogue directly generated in speech bubbles
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
- Ideogram API (for image generation)
- OpenAI API (for text generation)
- Sharp for image processing
- PDFKit for PDF generation

### AI Models
- **Text Generation**: OpenAI GPT-4o-mini
- **Image Generation**: Ideogram 3.0 Default with Character Reference
- **Character Consistency**: Ideogram Character Reference feature

### Storage
- File-based JSON storage system
- Local filesystem for development
- Ready for Vercel deployment with vercel-blob

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Ideogram API key ([Get one here](https://ideogram.ai/) - see [IDEOGRAM_API_GUIDE.md](./IDEOGRAM_API_GUIDE.md))
- macOS, Linux, or Windows with WSL2

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Bellilty/Manga-Comic-AI.git
cd Manga-Comic-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key (for GPT-4o-mini text generation)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Ideogram API Key (for image generation)
IDEOGRAM_API_KEY=ideogram_your_api_key_here
```

**Getting your API keys:**

#### OpenAI API Key
1. Sign up at [https://platform.openai.com](https://platform.openai.com)
2. Go to API keys section
3. Create a new secret key
4. Copy and paste it into your `.env.local` file

#### Ideogram API Key
1. Sign up at [https://ideogram.ai](https://ideogram.ai)
2. Click menu (☰) → "API (Beta)"
3. Configure payment
4. Create API key
5. ⚠️ **Copy immediately** (shown only once)
6. See [IDEOGRAM_API_GUIDE.md](./IDEOGRAM_API_GUIDE.md) for detailed instructions

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
      /story/route.ts           # Generate story structure (OpenAI)
      /character/route.ts       # Generate character references
      /panel/route.ts           # Generate individual panels
      /comic/route.ts           # Assemble full comic (Ideogram)
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
    hf.ts                      # Ideogram & OpenAI API integration
    prompts.ts                 # AI prompt templates
    layout.ts                  # Page layout logic
    types.ts                   # TypeScript types
    storage.ts                 # File system storage
    utils.ts                   # Utility functions
  /data/comics                 # Generated comics storage
```

## 🎨 How It Works

### 1. Story Generation (OpenAI GPT-4o-mini)

User provides:
- Story pitch (text description)
- Visual style (comic or manga)
- Optional character reference image and name

The AI generates a structured story with:
- **2-4 pages** (determined automatically based on complexity)
- Character descriptions with visual details
- **Panel-by-panel breakdown** with:
  - Precise position (x, y, width, height as percentages)
  - Detailed visual description
  - Character list
  - Background description
  - Actions description
  - Dialogue with speaker names

### 2. Comic Creation (Ideogram 3.0)

For each page:
1. **Page 1**: 
   - Text-to-image with Ideogram 3.0 Default
   - Character Reference image if provided
   - Full page with multiple panels in one image

2. **Page 2+**:
   - Image-to-image with previous page(s) as reference
   - Character Reference for consistency
   - Style strength: 0.7 (strong consistency)
   - Context from all previous pages in prompt

### 3. Output

- PNG images for each page (portrait orientation)
- Downloadable A4 PDF
- Stored locally with metadata
- Displayed in public Explore gallery

## 🖥 API Routes

### POST `/api/story`
Generate story structure from pitch
```json
{
  "pitch": "A brave knight discovers a magical sword",
  "style": "comic",
  "characterReference": {
    "name": "Knight",
    "image": "data:image/png;base64,..."
  }
}
```

### POST `/api/comic`
Generate full comic
```json
{
  "pitch": "Story description",
  "style": "manga",
  "story": { /* StoryStructure object */ },
  "characterReferenceImage": "data:image/png;base64,..."
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

## 💰 Pricing

### Cost per Comic (4 pages example)

- **OpenAI GPT-4o-mini**: ~$0.01-0.02 (story generation)
- **Ideogram 3.0 Default + Character Reference**: 4 × $0.15 = **$0.60**
- **Total**: ~**$0.61-0.62** per comic

See [IDEOGRAM_API_GUIDE.md](./IDEOGRAM_API_GUIDE.md) for detailed pricing.

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `IDEOGRAM_API_KEY`
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
- Model selection (3.0-turbo, 3.0-default, 3.0-quality)

Edit `lib/prompts.ts` to modify:
- Story structure requirements
- Panel positioning rules
- Style-specific instructions

### Change AI Models

Update model names in API routes:
- `app/api/story/route.ts` - OpenAI model (currently GPT-4o-mini)
- `app/api/comic/route.ts` - Ideogram model (currently 3.0-default)

## 🐛 Troubleshooting

### API Key Errors
- Ensure `.env.local` exists with both `OPENAI_API_KEY` and `IDEOGRAM_API_KEY`
- Check that keys are valid and have sufficient credits
- See [ENV_SETUP.md](./ENV_SETUP.md) for setup instructions

### Ideogram API Errors
- Check your Ideogram account balance
- Verify API key is correct
- See [IDEOGRAM_API_GUIDE.md](./IDEOGRAM_API_GUIDE.md) for troubleshooting

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
| `OPENAI_API_KEY` | Yes | OpenAI API token for text generation |
| `IDEOGRAM_API_KEY` | Yes | Ideogram API token for image generation |
| `NODE_ENV` | Auto | Development/production mode |

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup instructions.

## 📚 Documentation

- [IDEOGRAM_API_GUIDE.md](./IDEOGRAM_API_GUIDE.md) - Complete Ideogram API guide
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables setup
- [MIGRATION_IDEOGRAM.md](./MIGRATION_IDEOGRAM.md) - Migration details
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

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

- Powered by [Ideogram](https://ideogram.ai) for high-quality image generation with readable text
- Powered by [OpenAI](https://openai.com) for intelligent story generation
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Built with [Next.js](https://nextjs.org)

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review [IDEOGRAM_API_GUIDE.md](./IDEOGRAM_API_GUIDE.md)
3. Check [ENV_SETUP.md](./ENV_SETUP.md) for configuration
4. Review OpenAI and Ideogram API documentation

---

**Ready to create amazing comics? Start your dev server and let your imagination run wild!** 🎨✨
