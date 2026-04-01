# VitePress Documentation Site - Getting Started Guide

## Quick Start

Navigate to the vitepress folder:
```bash
cd pattern-recognition-vitepress
```

### Development Server

Start the dev server with hot reload:
```bash
npm run docs:dev
```

The site will be available at `http://localhost:5173` (or similar port shown in terminal)

### Production Build

Build the static site:
```bash
npm run docs:build
```

The built site will be in `docs/.vitepress/dist/`

### Preview Built Site

Preview the production build locally:
```bash
npm run docs:preview
```

## Project Structure

```
pattern-recognition-vitepress/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress configuration
│   │   ├── theme/
│   │   │   ├── index.ts           # Theme setup with component registration
│   │   │   └── style.css          # Global styles
│   │   └── dist/                  # Built output (after npm run docs:build)
│   ├── components/
│   │   ├── PlotlyChart.vue        # Generic Plotly chart wrapper
│   │   ├── LDAVisualizer.vue      # LDA interactive visualization
│   │   ├── SVMVisualizer.vue      # SVM hard/soft margin demo
│   │   ├── KernelVisualizer.vue   # Kernel trick visualization
│   │   ├── OptimizationVisualizer.vue  # Gradient descent, optimization
│   │   └── EMVisualizer.vue       # EM algorithm, GMM demo
│   ├── guide/
│   │   ├── index.md               # Guide index/home
│   │   ├── discriminant-analysis.md    # LDA & PCA with visualizer
│   │   ├── norms-regression.md         # Norms and regression types
│   │   ├── optimization.md        # Optimization methods with interactive demo
│   │   ├── svm-i.md               # SVM basics with SVMVisualizer
│   │   ├── duality.md             # Duality theory
│   │   ├── svm-ii.md              # Advanced SVM
│   │   ├── kernels.md             # Kernel methods with KernelVisualizer
│   │   └── em-algorithm.md        # EM algorithm with EMVisualizer
│   ├── public/                    # Static assets
│   └── index.md                   # Main landing page
└── package.json                   # Dependencies and scripts
```

## Features

### 1. **Interactive Visualizations**

The site includes several interactive Vue components for learning:

#### **PlotlyChart** 
Generic Plotly wrapper for any chart data
- Responsive design
- Auto-scales to container
- Interactive tools (zoom, pan, etc)

#### **LDAVisualizer**
Shows LDA dimensionality reduction in action
- Original 2D space with class separation
- LDA projection showing discrimination
- Real-time data generation

#### **SVMVisualizer**
Interactive SVM margin visualization
- Hard margin (linearly separable data)
- Soft margin with adjustable C parameter
- Shows effect of regularization on margins

#### **KernelVisualizer**
Demonstrates the kernel trick
- Original space (XOR-like problem)
- Kernel-transformed space showing separation
- Multiple kernel types (RBF, Polynomial, Sigmoid, Linear)

#### **OptimizationVisualizer**
Optimization algorithm visualization
- Contour plot with optimization path
- Loss convergence curves
- Compare gradient descent, momentum, Nesterov

#### **EMVisualizer**
Expectation-Maximization algorithm demo
- Cluster assignments visualization
- Log-likelihood convergence
- Tunable number of clusters

### 2. **Mathematical Notation**

All LaTeX equations are rendered using **MathJax**:
- Inline math: `$f(x) = x^2$`
- Display math: `$$\min f(x)$$`
- Full MathJax support in markdown

### 3. **Navigation**

- **Top navigation bar**: Quick links to main sections
- **Sidebar**: Detailed navigation organized by topics
- **Search**: Local search through documentation
- **Breadcrumbs**: Show current position in hierarchy

## Creating New Pages

### Add a New Lecture Page

1. Create a new `.md` file in `docs/guide/`:
```
docs/guide/my-topic.md
```

2. Add frontmatter and content:
```markdown
# My Topic Title

## Overview
Introduction to the topic...

### Key Concept

$$\text{Mathematical Formula}$$

Explanation text...

<PlotlyChart 
  :data="myData"
  :layout="myLayout"
  title="Chart Title"
  description="Description"
/>
```

3. Register in sidebar in `docs/.vitepress/config.ts`:
```typescript
{
  text: 'My Topic',
  link: '/guide/my-topic'
}
```

### Using Visualizers

Include any of the visualization components:

```markdown
<LDAVisualizer />
<SVMVisualizer />
<KernelVisualizer />
<OptimizationVisualizer />
<EMVisualizer />
```

These are globally registered - no imports needed!

## Styling and Customization

### Global Styles
Edit `docs/.vitepress/theme/style.css` for global styles

### Component Styles
Each component includes scoped styles

### VitePress Theme
Default VitePress theme (based on Vue 3 docs theme)
- Light/dark mode support
- Responsive design

## Deployment

### Build for Production
```bash
npm run docs:build
```

Output in: `docs/.vitepress/dist/`

### Deploy Options

#### 1. Static Hosting (GitHub Pages, Netlify, Vercel)
- Upload contents of `dist/` folder
- Configure domain settings

#### 2. Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run docs:build
EXPOSE 3000
CMD ["npm", "run", "docs:preview"]
```

#### 3. Node.js Server
```bash
npm run docs:preview  # Production preview server
```

## Troubleshooting

### Components Not Showing
1. Check component paths in `docs/.vitepress/theme/index.ts`
2. Verify components are imported correctly
3. Check browser console for errors

### Math Not Rendering
1. Ensure MathJax script in `config.ts` head
2. Check markdown uses correct syntax: `$...$` or `$$...$$`
3. Clear browser cache

### Build Fails
1. Check for markdown syntax errors
2. Run `npm install` to ensure dependencies
3. Check console output for specific errors

## Performance Tips

### For Large Sites
- Use code-split chunks
- Lazy load visualizations
- Pre-render critical pages

### Local Development
- Use `npm run docs:dev` for instant updates
- HMR (Hot Module Replacement) enabled
- No need to rebuild after changes

## Browser Compatibility

Works on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern JavaScript (ES2015+)

## License

Pattern Recognition lecture notes: Creative Commons CC BY 4.0  
VitePress configuration: MIT

## Resources

- [VitePress Documentation](https://vitepress.dev/)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [MathJax Documentation](https://docs.mathjax.org/)
- [Vue 3 Documentation](https://vuejs.org/)

---

## Next Steps

1. **Start dev server**: `npm run docs:dev`
2. **Edit content**: Modify markdown files in `docs/guide/`
3. **Customize visualizations**: Edit Vue components in `docs/components/`
4. **Deploy**: Build and upload to hosting provider

Enjoy creating interactive documentation!
