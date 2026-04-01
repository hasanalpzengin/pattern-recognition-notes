# GitHub Pages Deployment Guide

This guide explains how to deploy the Pattern Recognition VitePress site to GitHub Pages.

## Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically builds and deploys the site on every push to the `main` branch.

### Setup Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Pattern Recognition VitePress"
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: **Deploy from a branch**
     - Branch: Select **gh-pages** (will be created automatically)
     - Folder: **/ (root)**
   - Click **Save**

3. **Verify Workflow**
   - Go to **Actions** tab
   - You should see "Build and Deploy Pattern Recognition VitePress" workflow running
   - Wait for it to complete (usually 1-2 minutes)
   - Check the deployment status in the workflow run

4. **Access Your Site**
   - Once deployed, visit: `https://yourusername.github.io/pattern-recognition-vitepress/`
   - Initial deployment may take a few minutes to be visible

### How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. **Triggers on**:
   - Push to `main` branch
   - Pull requests to `main` branch (preview builds only)

2. **Workflow Steps**:
   - Checks out code
   - Sets up Node.js 18
   - Installs dependencies
   - Builds the VitePress site
   - Generates static files in `docs/.vitepress/dist`
   - Uploads artifact to GitHub Pages
   - Deploys automatically

3. **Permissions**:
   - Automatically uses GitHub token for deployment
   - No manual secrets configuration needed

## Manual Deployment

If you need to deploy manually or to a different host:

### Build Locally

```bash
# Install dependencies (if not already done)
npm install

# Build the production site
npm run docs:build

# Output will be in: docs/.vitepress/dist
```

### Deploy to GitHub Pages Manually

```bash
# Install gh-pages package (optional, but helpful)
npm install --save-dev gh-pages

# Add deployment script to package.json scripts:
# "deploy": "npm run docs:build && gh-pages -d docs/.vitepress/dist"

# Then run:
npm run deploy
```

### Deploy to Other Platforms

The `docs/.vitepress/dist` directory contains a complete static site that can be deployed to:

- **Vercel**: `vercel --prod docs/.vitepress/dist`
- **Netlify**: Drag & drop the `dist` folder
- **Traditional Web Server**: Upload `dist` contents to your server
- **AWS S3**: `aws s3 sync docs/.vitepress/dist s3://your-bucket`

## Troubleshooting

### Workflow Fails

1. Check **Actions** tab → your workflow run → logs
2. Common issues:
   - Node.js version compatibility: Ensure Node.js 18+ is specified
   - Build errors: Check `npm run docs:build` locally first
   - Dependencies: Ensure `package-lock.json` is committed

### Site Not Updating

1. **Clear cache**: GitHub may cache the site for 5-10 minutes
2. **Hard refresh**: Use `Ctrl+Shift+R` (Cmd+Shift+R on Mac)
3. **Check workflow status**: Verify the latest run was successful
4. **Branch configuration**: Confirm `gh-pages` branch is selected in Pages settings

### Site is Blank or Shows 404

1. Verify `gh-pages` branch exists in your repository
2. Check Pages settings point to correct branch and folder
3. Ensure workflow completed successfully (check Actions tab)
4. Wait 5-10 minutes for GitHub Pages to propagate

## Custom Domain

To use a custom domain:

1. Add `CNAME` file to `docs/public/CNAME`:
   ```
   your-custom-domain.com
   ```

2. Update GitHub Pages settings to your custom domain

3. Ensure DNS records point to GitHub Pages IP addresses

4. Workflow will automatically deploy with your domain

## Continuous Deployment

The workflow automatically:
- ✅ Rebuilds on every push to `main`
- ✅ Runs on pull requests (no publish, just verification)
- ✅ Uses Node.js 18
- ✅ Caches dependencies for faster builds
- ✅ Generates optimized static files
- ✅ Deploys to GitHub Pages

## Local Preview

Before pushing, test the production build locally:

```bash
# Build production version
npm run docs:build

# Preview the build
npm run docs:preview

# Site will be served at http://localhost:4173/pattern-recognition-vitepress/
```

## Monitoring Deployments

Track deployment status:

1. **Actions Tab**: View workflow runs and logs
2. **Deployments Tab**: See deployment history
3. **Pages Tab**: Check deployment status and configuration

## FAQ

**Q: How long does deployment take?**
A: Usually 1-2 minutes from push to live.

**Q: Do I need to manually create the gh-pages branch?**
A: No, the workflow creates it automatically on first run.

**Q: Can I rollback to a previous version?**
A: Yes, revert your commit and push. The workflow will redeploy automatically.

**Q: Is there a way to preview changes before publishing?**
A: Yes, open a pull request. The workflow will run but won't deploy.

**Q: How do I disable automatic deployment?**
A: Disable the workflow in Actions tab, or delete `.github/workflows/deploy.yml`.

---

**Need help?** Check the [GitHub Pages documentation](https://docs.github.com/en/pages) or the [VitePress deployment guide](https://vitepress.dev/guide/deploy).
