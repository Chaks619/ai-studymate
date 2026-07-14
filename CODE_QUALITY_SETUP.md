# Code Quality Setup Guide

This project is configured with professional code quality tools:

## 🔍 ESLint

**Purpose**: Finds and fixes problematic patterns in JavaScript/TypeScript code.

### Client Setup
```bash
cd client
npm run lint           # Check for issues
npm run lint:fix      # Auto-fix issues
```

### Server Setup
```bash
cd server
npm run lint           # Check for issues
npm run lint:fix      # Auto-fix issues
```

## 📝 Prettier

**Purpose**: Enforces consistent code formatting across the project.

### Client Setup
```bash
cd client
npm run format        # Format all files
npm run format:check  # Check if formatting is needed
```

### Server Setup
```bash
cd server
npm run format        # Format all files
npm run format:check  # Check if formatting is needed
```

## 🎯 TypeScript Strict Mode

Both client and server are configured with **strict TypeScript** settings:

- ✅ `noImplicitAny` - Require explicit types
- ✅ `strictNullChecks` - No implicit null/undefined
- ✅ `strictFunctionTypes` - Strict function signatures
- ✅ `noUnusedLocals` - Flag unused variables
- ✅ `noUnusedParameters` - Flag unused parameters
- ✅ `noImplicitReturns` - Require explicit return types
- ✅ `noFallthroughCasesInSwitch` - No switch fall-through

### Type Check
```bash
# Client
npm run type-check

# Server
npm run build  # Includes type checking
```

## 📦 Import Ordering

Imports are automatically organized and checked by ESLint:

### Pattern (Enforced)
1. React/external packages
2. Internal modules
3. Relative paths

### Example
```typescript
// ✅ Correct
import React from 'react';
import { useSelector } from 'react-redux';

import { baseApi } from '@/store/api/baseApi';
import { Navbar } from '@/components/layout/Navbar';

import { formatDate } from './utils';
```

## 🚫 Unused Variables

All unused variables and parameters are caught by ESLint:

### Examples

```typescript
// ❌ Error: unused variable
const _unused = 'value';

// ✅ Correct: prefix with _ to ignore
const _unused = 'value';

// ✅ Correct: use it
const message = 'value';
console.log(message);

// ❌ Error: unused parameter
function process(data, extra) {
  return data;
}

// ✅ Correct: mark with _ if intentionally unused
function process(data, _extra) {
  return data;
}
```

## 📋 Pre-commit Check

Before committing, run:

### Client
```bash
cd client
npm run type-check   # TypeScript errors
npm run lint         # ESLint errors
npm run format:check # Formatting issues
```

### Server
```bash
cd server
npm run type-check   # TypeScript errors (via build)
npm run lint         # ESLint errors
npm run format:check # Formatting issues
```

## 🔧 IDE Integration

### VS Code Settings
Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

Install extensions:
- **ESLint** - dbaeumer.vscode-eslint
- **Prettier** - esbenp.prettier-vscode
- **EditorConfig** - EditorConfig.EditorConfig

## 📚 Configuration Files

### Client
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting
- `.prettierignore` - Prettier exclusions
- `.eslintignore` - ESLint exclusions
- `tsconfig.json` - TypeScript strict settings
- `.editorconfig` - Editor settings

### Server
- `.eslintrc.json` - ESLint rules (Node.js focused)
- `.prettierrc` - Prettier formatting
- `.prettierignore` - Prettier exclusions
- `.eslintignore` - ESLint exclusions
- `tsconfig.json` - TypeScript strict settings
- `.editorconfig` - Editor settings

## 🎓 Best Practices

1. **Always run lint before committing**
   ```bash
   npm run lint:fix && npm run format
   ```

2. **Check TypeScript types regularly**
   ```bash
   npm run type-check
   ```

3. **Use meaningful variable names** - Avoids needing to ignore unused params

4. **Enable format-on-save in your IDE** - Automatic formatting reduces friction

5. **Review ESLint errors** - They often catch real bugs, not just style issues

## 🚀 CI/CD Integration

Add to your CI/CD pipeline:

```bash
# Client
npm run type-check
npm run lint
npm run format:check

# Server
npm run type-check
npm run lint
npm run format:check
```

This ensures all code meets quality standards before merging.
