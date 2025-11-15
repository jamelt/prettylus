# 🎨 Prettylus

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/ekqnp.prettylus)](https://marketplace.visualstudio.com/items?itemName=ekqnp.prettylus)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/qnp/prettylus/pulls)

> Seamlessly format Vue Single File Components with Stylus support - combining the power of Prettier and Stylus Supremacy in one extension.

## 🚀 Why Prettylus?

If you're working with Vue SFCs that use Stylus for styling, you've likely encountered the challenge of consistent formatting. Standard Prettier doesn't handle `<style lang="stylus">` blocks, and manually switching between formatters is tedious.

**Prettylus solves this by intelligently applying:**

- **Prettier** for your `<template>` and `<script>` blocks
- **Stylus Supremacy** specifically for `<style lang="stylus">` blocks
- Full support for **Pug templates** via `@prettier/plugin-pug`

The result? Perfectly formatted Vue components with a single keystroke.

## ✨ Features

### 🎯 Smart Multi-Formatter

Automatically detects and formats different sections of your Vue SFCs with the appropriate formatter:

```vue
<template lang="pug">
  // Formatted with Prettier + Pug plugin
  .container
    h1.title Hello Prettylus
    p.description Your Vue files never looked better
</template>

<script setup lang="ts">
// Formatted with Prettier
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<style lang="stylus" scoped>
// Formatted with Stylus Supremacy
.container
  display flex
  flex-direction column
  padding 2rem

  .title
    font-size 2rem
    color #333

  .description
    margin-top 1rem
    color #666
</style>
```

### 🔧 Key Capabilities

- **Vue 3 & Vue 2 Support** - Works with all Vue SFC formats
- **TypeScript Ready** - Full support for `<script setup lang="ts">`
- **Multiple Style Blocks** - Handles multiple `<style>` tags in a single component
- **Scoped Styles** - Preserves `scoped` and other style attributes
- **Flexible Configuration** - Customize both Prettier and Stylus Supremacy settings
- **Monorepo Friendly** - Configure base directories for complex project structures

## 📦 Installation

### Via VS Code Marketplace

1. Open VS Code
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
3. Type `ext install ekqnp.prettylus`
4. Press Enter and click Install

### Via Command Line

```bash
code --install-extension ekqnp.prettylus
```

## ⚙️ Configuration

### Step 1: Create Prettier Configuration

Create a `.prettierrc` file in your project root:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["@prettier/plugin-pug"],
  "pugSingleQuote": false,
  "pugAttributeSeparator": "none",
  "pugWrapAttributesThreshold": 1
}
```

### Step 2: Create Stylus Supremacy Configuration

Create a `.stylusrc` file in your project root:

```json
{
  "insertColons": false,
  "insertSemicolons": false,
  "insertBraces": false,
  "insertNewLineAroundImports": true,
  "insertNewLineAroundBlocks": true,
  "insertSpaceBeforeComment": true,
  "insertSpaceAfterComment": true,
  "indentChar": "  ",
  "newLineChar": "\n",
  "sortProperties": "alphabetical",
  "alwaysUseExtends": true,
  "alwaysUseNoneOverZero": true,
  "alwaysUseAtBlock": true,
  "alwaysUseZeroWithoutUnit": true,
  "reduceMarginAndPaddingValues": true
}
```

### Step 3: VS Code Settings

Configure VS Code to use Prettylus as the default formatter for Vue files. Add to your `.vscode/settings.json`:

```json
{
  "[vue]": {
    "editor.defaultFormatter": "ekqnp.prettylus",
    "editor.formatOnSave": true
  },
  "prettylus.stylusSupremacyConfigFileName": ".stylusrc",
  "prettylus.prettierBaseDirectory": "./",
  "prettylus.prettierConfigFile": ".prettierrc"
}
```

## 🎛️ Extension Settings

| Setting                                   | Description                                                   | Default     |
| ----------------------------------------- | ------------------------------------------------------------- | ----------- |
| `prettylus.stylusSupremacyConfigFileName` | Name of the Stylus Supremacy config file                      | `.stylusrc` |
| `prettylus.prettierBaseDirectory`         | Base directory for Prettier resolution (useful for monorepos) | `null`      |
| `prettylus.prettierConfigFile`            | Path to a specific Prettier config file                       | `null`      |

## 📁 Monorepo Support

For monorepo projects, you can specify where Prettier should resolve its configuration and plugins:

```json
{
  "prettylus.prettierBaseDirectory": "./packages/frontend",
  "prettylus.prettierConfigFile": "./packages/frontend/.prettierrc"
}
```

## 🚨 Troubleshooting

### Issue: "Cannot find package '@prettier/plugin-pug'"

**Solution:** Ensure the plugin is installed in the same directory as Prettier:

```bash
npm install --save-dev prettier @prettier/plugin-pug
# or
yarn add -D prettier @prettier/plugin-pug
```

### Issue: Stylus blocks not formatting

**Solution:** Check that your style blocks have the correct language attribute:

```vue
<!-- ✅ Correct -->
<style lang="stylus">

<!-- ❌ Incorrect -->
<style type="text/stylus">
```

### Issue: Format on save not working

**Solution:** Ensure Prettylus is set as the default formatter:

1. Open a `.vue` file
2. Right-click and select "Format Document With..."
3. Choose "Configure Default Formatter..."
4. Select "Prettylus"

### Viewing Debug Logs

To troubleshoot formatting issues:

1. Open VS Code Output panel (`View` → `Output`)
2. Select "Prettylus" from the dropdown
3. Check the logs for detailed formatting information

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/qnp/prettylus.git
   cd prettylus
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development:**

   ```bash
   npm run watch
   ```

4. **Test the extension:**
   - Press `F5` in VS Code to open a new Extension Development Host window
   - Open a Vue project and test the formatting

### Building and Testing

```bash
# Lint the code
npm run lint

# Build for production
npm run build

# Package the extension
npm run package

# Install locally for testing
npm run install
```

### Submitting Changes

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes in each version.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🙏 Acknowledgments

- [Prettier](https://prettier.io/) - The opinionated code formatter
- [Stylus Supremacy](https://thisismanta.github.io/stylus-supremacy) - The ultimate Stylus formatter
- [@prettier/plugin-pug](https://github.com/prettier/plugin-pug) - Pug template formatting

## 🐛 Found a Bug?

Please [open an issue](https://github.com/qnp/prettylus/issues/new) with:

- Your VS Code version
- Your Prettylus version
- A minimal reproduction example
- The expected vs actual behavior

## ⭐ Support

If Prettylus makes your Vue development experience better, please consider:

- ⭐ Starring the [GitHub repository](https://github.com/qnp/prettylus)
- 📝 Writing a review on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ekqnp.prettylus)
- 🐦 Sharing it with your colleagues

---

Made with ❤️ for the Vue + Stylus community
