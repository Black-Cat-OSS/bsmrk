# 🚀 CI/CD Pipeline Guide

This guide explains the automated Continuous Integration and Continuous Deployment pipeline for BismarkJS.

## 📋 Overview

The CI/CD pipeline is fully automated using GitHub Actions and provides:

- ✅ **Automated Testing** on multiple Node.js versions
- 🏗️ **Build Validation** and artifact testing  
- 🔄 **Smart Versioning** with semantic release strategy
- 📦 **Automatic Publishing** to NPM registry
- 📋 **Release Management** with auto-generated changelogs

## 🔄 Pipeline Workflow

### 1. **Trigger Events**
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests targeting `main` branch
- Manual workflow dispatch (if enabled)

### 2. **Test Job** (`test`)

**Matrix Strategy:**
- Node.js versions: 16, 18, 20
- OS: Ubuntu Latest
- Parallel execution across all versions

**Steps:**
1. **📥 Checkout** - Clone repository with full history
2. **📦 Setup Node.js** - Install specified Node version with npm cache
3. **🔧 Install Dependencies** - Run `npm ci` for clean installation
4. **🧪 Run Tests** - Execute full test suite with coverage
5. **🏗️ Build Package** - Create distribution files
6. **📋 Test Artifacts** - Validate CJS and ESM builds

**Quality Gates:**
- All tests must pass
- Build must complete successfully
- Artifacts must be valid and loadable

### 3. **Version and Tag Job** (`version-and-tag`)

**Conditions:**
- Only runs on `main` branch pushes
- Requires successful test job completion
- Skipped on pull requests

**Version Strategy:**
```bash
Current: 1.0.0
Next:    1.1.0  # Minor increment
...
Current: 1.9.0  
Next:    2.0.0  # Major increment when minor reaches 10
```

**Steps:**
1. **📥 Checkout** with write permissions
2. **📦 Setup Node.js** version 20
3. **🔧 Install Dependencies** 
4. **🏗️ Build Package**
5. **📝 Configure Git** for automated commits
6. **🔢 Calculate Version** using smart increment logic
7. **🏷️ Create Tag** and push to repository
8. **📦 Create Release** with auto-generated changelog

### 4. **Publish Job** (`publish`)

**Conditions:**
- Only runs on `main` branch pushes
- Requires successful test and version jobs
- Uses NPM authentication token

**Steps:**
1. **📥 Checkout** latest main branch
2. **📦 Setup Node.js** with NPM registry configuration
3. **🔧 Install Dependencies**
4. **🏗️ Build Package** 
5. **🚀 Publish to NPM** with public access

## ⚙️ Configuration

### Required Secrets

Set these in GitHub Settings → Secrets and variables → Actions:

```bash
# Automatically available
GITHUB_TOKEN=<automatic>

# Required for NPM publishing
NPM_TOKEN=<your-npm-token>
```

### NPM Token Setup

1. **Login to NPM:**
   ```bash
   npm login
   ```

2. **Generate Token:**
   ```bash
   npm token create --type=granular --scope=@your-scope
   ```

3. **Add to GitHub Secrets:**
   - Go to repository Settings → Secrets → Actions
   - Add new secret: `NPM_TOKEN`
   - Paste your token value

### Repository Settings

**Branch Protection Rules** (recommended):
```yaml
Branch: main
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators
- Required status checks:
  - test (16)
  - test (18)  
  - test (20)
```

## 📊 Pipeline Status

### Monitoring

**GitHub Actions Tab:**
- View all workflow runs
- See detailed logs for each job
- Monitor success/failure rates
- Download artifacts if needed

**Status Badges:**
```markdown
[![CI/CD Pipeline](https://github.com/your-username/bismark-js/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/your-username/bismark-js/actions)
```

### Success Indicators

✅ **All Green:**
- All tests pass on all Node versions
- Build artifacts are valid
- Version is tagged successfully
- NPM package is published
- GitHub release is created

❌ **Failure Points:**
- Test failures on any Node version
- Build errors or invalid artifacts
- Version tagging conflicts
- NPM publishing errors
- Git push permission issues

## 🔧 Version Management

### Automatic Versioning Logic

```javascript
// Current version: 1.5.0
const [major, minor, patch] = currentVersion.split('.');

// Increment minor
let newMinor = parseInt(minor) + 1;
let newMajor = parseInt(major);
let newPatch = 0;

// Check if minor reaches 10
if (newMinor >= 10) {
  newMajor += 1;
  newMinor = 0;
}

// Result: 1.6.0 or 2.0.0 if minor was 9
const newVersion = `${newMajor}.${newMinor}.${newPatch}`;
```

### Version Examples

```bash
1.0.0 → 1.1.0 → 1.2.0 → ... → 1.9.0 → 2.0.0 → 2.1.0 → ...
```

### Manual Version Override

If you need to override automatic versioning:

```bash
# Manually set version
npm version 1.5.0 --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore: set version to 1.5.0"
git push origin main
```

## 📦 Release Process

### Automatic Releases

Every successful pipeline run on `main` creates:

1. **Git Tag** - `v1.2.0` format
2. **GitHub Release** with:
   - Auto-generated title
   - Changelog with commit history  
   - Build artifacts attached
   - Links to compare with previous version
3. **NPM Package** published with latest tag

### Release Content

**Auto-generated changelog includes:**
- ✅ All tests passed confirmation
- 🏗️ Build artifacts validation
- 🔄 Version increment information
- 📊 Link to full commit history

### Manual Release

For emergency releases or hotfixes:

```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix

# Make your changes
# Commit and push

# Create PR to main
# Pipeline will run on merge
```

## 🛠️ Troubleshooting

### Common Issues

**❌ Test Failures**
```bash
# Check logs in GitHub Actions
# Run tests locally:
npm test
npm run test:coverage
```

**❌ Build Failures**
```bash
# Verify build locally:
npm run build
ls -la dist/
```

**❌ Version Conflicts**
```bash
# Check if tag already exists:
git tag -l
# Delete problematic tag if needed:
git tag -d v1.2.0
git push origin --delete v1.2.0
```

**❌ NPM Publishing Errors**
```bash
# Verify NPM token:
npm whoami
# Check package name availability:
npm info bismark-js
```

**❌ Permission Errors**
```bash
# Verify GITHUB_TOKEN has write access
# Check repository settings → Actions → General
# Ensure "Read and write permissions" is enabled
```

### Debug Mode

Enable debug logging by adding to workflow:

```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## 📈 Metrics and Analytics

### Pipeline Performance

**Typical Execution Times:**
- Test Job (per Node version): ~2-3 minutes
- Version Job: ~1-2 minutes  
- Publish Job: ~1-2 minutes
- **Total Pipeline**: ~5-8 minutes

**Resource Usage:**
- CPU: Standard GitHub Actions runners
- Memory: ~2GB peak during testing
- Storage: ~500MB for dependencies and artifacts

### Success Rates

**Target Metrics:**
- Pipeline success rate: >95%
- Test success rate: >98%
- Publishing success rate: >99%
- Average execution time: <10 minutes

## 🔄 Pipeline Evolution

### Future Enhancements

**Planned Features:**
- 🔍 Automated security scanning
- 📊 Performance regression testing
- 🌍 Multi-platform testing (Windows, macOS)
- 📱 Mobile compatibility checks
- 🔐 Enhanced security with OIDC

### Customization

**Adding New Jobs:**
```yaml
deploy-docs:
  needs: [test, version-and-tag]
  if: github.ref == 'refs/heads/main'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy Documentation
      # Your deployment steps
```

**Custom Version Logic:**
```javascript
// Modify version calculation in workflow
// Add custom rules for pre-release versions
// Implement hotfix version strategy
```

## 📚 Additional Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **NPM Publishing Guide**: https://docs.npmjs.com/packages-and-modules/
- **Semantic Versioning**: https://semver.org/
- **Node.js CI Best Practices**: https://nodejs.org/en/docs/guides/

---

**⚠️ Important Notes:**
- Always test changes in a fork first
- Monitor pipeline execution after major changes
- Keep secrets secure and rotate tokens regularly
- Review and update Node.js versions quarterly

**🎯 Pipeline Goals:**
- Zero-downtime deployments
- Consistent quality assurance  
- Automated release management
- Developer productivity enhancement

