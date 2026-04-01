# Quick Start: Deploy to GitHub Pages

## 5-Minute Setup

### Step 1: Initialize Git (if not already done)
```bash
cd pattern-recognition-vitepress
git add .
git commit -m "Initial commit: Pattern Recognition VitePress"
```

### Step 2: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/pattern-recognition-vitepress.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository: `https://github.com/YOUR_USERNAME/pattern-recognition-vitepress`
2. Click **Settings** (top right)
3. Left sidebar → **Pages**
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (select from dropdown)
   - Folder: **/ (root)**
5. Click **Save**

### Step 4: Wait for Deployment
1. Go to **Actions** tab
2. You should see "Build and Deploy Pattern Recognition VitePress" running
3. Wait for ✅ (takes 1-2 minutes)

### Step 5: Access Your Site
Your site is now live at:
```
https://YOUR_USERNAME.github.io/pattern-recognition-vitepress/
```

---

## How Updates Work

After initial setup, updates are **automatic**:

```bash
# Make changes to your documentation
# (edit markdown files, add visualizations, etc.)

# Push to GitHub
git add .
git commit -m "Update: Added new visualization"
git push

# That's it! Workflow automatically:
# 1. Builds the site
# 2. Deploys to GitHub Pages
# 3. Updates live at your URL
```

---

## Workflow Features

✅ **Automatic Builds**: Every push to `main` triggers build  
✅ **Pull Request Previews**: Validates changes before merge  
✅ **Fast Caching**: Dependencies cached for speed  
✅ **Production Optimized**: Automatic minification & optimization  
✅ **Zero Config**: Works out of the box  

---

## Files Created

- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `DEPLOYMENT.md` - Detailed deployment guide
- `README.md` - Updated with deployment info

---

## Troubleshooting

**Site shows 404?**
- Check `gh-pages` branch exists in repository
- Verify Pages settings show correct branch
- Wait 5-10 minutes for propagation

**Build fails?**
- Check Actions tab for error logs
- Test locally: `npm run docs:build`
- Verify all commits are pushed: `git push`

**Want to see logs?**
- Go to **Actions** tab
- Click latest workflow run
- Expand steps to see detailed logs

---

**Done!** Your Pattern Recognition documentation is now published online. 🚀

For detailed info, see [DEPLOYMENT.md](./DEPLOYMENT.md)
