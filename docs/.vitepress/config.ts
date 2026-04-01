import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Pattern Recognition',
  description: 'Lecture Notes with Scientific Visualizations',
  
  head: [
    ['meta', { name: 'theme-color', content: '#3c3c3d' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['script', { src: 'https://cdn.plot.ly/plotly-3.4.0.min.js' }],
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js' }],
    ['script', {}, `
      window.MathJax = {
        tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']] },
        svg: { fontCache: 'global' }
      };
    `],
    ['script', { id: 'MathJax-script', async: '', src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Pattern Recognition',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Lectures', items: [
        { text: 'Discriminant Analysis', link: '/guide/discriminant-analysis' },
        { text: 'Norms & Regression', link: '/guide/norms-regression' },
        { text: 'Optimization', link: '/guide/optimization' },
        { text: 'SVM I', link: '/guide/svm-i' },
        { text: 'Duality', link: '/guide/duality' },
        { text: 'SVM II', link: '/guide/svm-ii' },
        { text: 'Kernels', link: '/guide/kernels' },
        { text: 'EM Algorithm', link: '/guide/em-algorithm' }
      ]}
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Core Topics',
          items: [
            { text: 'Discriminant Analysis', link: '/guide/discriminant-analysis' },
            { text: 'Norms & Norm-Dependent Regression', link: '/guide/norms-regression' },
            { text: 'Optimization', link: '/guide/optimization' }
          ]
        },
        {
          text: 'Support Vector Machines',
          items: [
            { text: 'SVM I - Basics', link: '/guide/svm-i' },
            { text: 'Duality in Optimization', link: '/guide/duality' },
            { text: 'SVM II - Advanced', link: '/guide/svm-ii' }
          ]
        },
        {
          text: 'Advanced Methods',
          items: [
            { text: 'Kernel Methods', link: '/guide/kernels' },
            { text: 'Expectation Maximization', link: '/guide/em-algorithm' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: 'Made with ❤️ for Pattern Recognition learning',
      copyright: 'FAU Erlangen-Nürnberg | CC BY 4.0'
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    math: true
  }
})
