# Pattern Recognition - VitePress Documentation

A comprehensive interactive learning platform for Pattern Recognition lectures with scientific visualizations.

## Features

✨ **Interactive Visualizations**
- Plotly.js charts for data visualization
- Interactive demos for algorithm exploration
- Real-time parameter adjustment

📚 **Rich Content**
- 8 comprehensive lectures
- Mathematical formulations with LaTeX
- Code examples and algorithms

🌙 **Modern Design**
- Responsive layout
- Dark mode support
- Smooth navigation

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn installed

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Project Structure

```
pattern-recognition-vitepress/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts           # Site configuration
│   │   ├── theme/
│   │   │   ├── index.ts        # Theme setup
│   │   │   └── style.css       # Global styles
│   │   └── components/
│   │       ├── PlotlyChart.vue     # Chart visualization component
│   │       ├── MathEquation.vue    # Math rendering component
│   │       └── InteractiveDemo.vue # Interactive demo component
│   ├── guide/
│   │   ├── index.md                # Learning guide
│   │   ├── discriminant-analysis.md
│   │   ├── norms-regression.md
│   │   ├── optimization.md
│   │   ├── svm-i.md
│   │   ├── duality.md
│   │   ├── svm-ii.md
│   │   ├── kernels.md
│   │   └── em-algorithm.md
│   ├── public/                     # Static assets
│   └── index.md                    # Home page
├── package.json
└── README.md
```

## Lecture Topics

1. **Discriminant Analysis II** - LDA, PCA, dimensional reduction
2. **Norms and Regression** - L₁, L₂, L∞ regression methods
3. **Optimization** - Gradient descent, Newton's method
4. **Support Vector Machines I** - Hard/soft margin formulations
5. **Duality in Optimization** - Dual problems, KKT conditions
6. **Support Vector Machines II** - Kernels, practical algorithms
7. **Kernel Methods** - Kernel trick, kernel PCA
8. **EM Algorithm** - Expectation Maximization, GMM

## Technologies

- **VitePress**: Static site generator
- **Vue 3**: Component framework
- **Plotly.js**: Interactive charting
- **MathJax**: Mathematical notation
- **Markdown**: Content format

## Available Scripts

```bash
npm run docs:dev      # Start development server (default: localhost:5173)
npm run docs:build    # Build static site
npm run docs:preview  # Preview production build
```

## Deployment

### GitHub Pages (Automatic)

This repository includes GitHub Actions workflow for automatic deployment:

1. **Setup GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically by workflow)

2. **Automatic Deployment**
   - Push to `main` branch triggers the workflow
   - Site builds and deploys automatically
   - Access at: `https://yourusername.github.io/pattern-recognition-vitepress/`

3. **Manual Deployment** (if needed)
   ```bash
   npm run docs:build
   # Deploy the docs/.vitepress/dist folder manually
   ```

**Note**: The workflow (`.github/workflows/deploy.yml`) is configured to:
- Build on every push to `main` and pull requests
- Upload artifacts to GitHub Pages
- Deploy automatically after successful build

## Customization

### Adding Visualizations

Use the provided Vue components:

```markdown
<PlotlyChart 
  :data="chartData"
  :layout="chartLayout"
  title="Your Title"
  description="Your Description"
/>

<InteractiveDemo
  title="Demo Title"
  :controls="controlDefinitions"
  :generator="generatorFunction"
/>

<MathEquation 
  equation="a^2 + b^2 = c^2"
  :inline="false"
/>
```

### Modifying Theme

Edit `docs/.vitepress/theme/style.css` for global styles.

## Performance Notes

- Static site generation for fast loading
- Responsive charts with Plotly
- MathJax lazy loading for formulas
- Optimized bundle with Vite

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

To add new content:

1. Create new `.md` file in `docs/guide/`
2. Add to navigation in `docs/.vitepress/config.ts`
3. Use Vue components for visualizations
4. Follow markdown conventions

## License

CC BY 4.0 - Friedrich-Alexander-Universität Erlangen-Nürnberg

## Credits

Based on Pattern Recognition lectures from FAU Erlangen-Nürnberg.

Authors: Niemann, Hornegger, Hahn, Steidl, Nöth, Seitz, Rodriguez, Das, Maier

---

**Happy Learning!** Explore the interactive visualizations and deepen your understanding of Pattern Recognition. 🚀
