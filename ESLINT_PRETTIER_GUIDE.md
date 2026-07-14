# ESLint Configuration Guide

## Client (.eslintrc.json)

### Key Rules

#### React-Specific
- `react/react-in-jsx-scope`: OFF (React 17+ auto-imports JSX)
- `react/prop-types`: OFF (Using TypeScript instead)

#### TypeScript Strict Rules
- `@typescript-eslint/no-explicit-any`: ERROR - Requires proper types
- `@typescript-eslint/strict-boolean-expressions`: ERROR - No implicit truthy/falsy
- `@typescript-eslint/no-floating-promises`: ERROR - Must handle promises

#### Code Quality
- `no-unused-vars`: OFF (replaced by @typescript-eslint version)
- `@typescript-eslint/no-unused-vars`: ERROR (with `_` prefix exception)
- `prefer-const`: ERROR - Use const instead of let when possible
- `no-var`: ERROR - Use const/let instead of var
- `eqeqeq`: ERROR - Use === instead of ==
- `curly`: ERROR - Require braces for all control structures

---

## Server (.eslintrc.json)

### Key Differences from Client
- No React rules
- Focused on Node.js best practices
- Relaxed rules for safe patterns common in backends

### Example Server Rules
```json
{
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-assignment": "off"
}
```

These are relaxed for DB operations and middleware patterns.

---

## Common ESLint Errors & Fixes

### Error: "No explicit any"
```typescript
// ❌ Wrong
function process(data: any) {}

// ✅ Fix
function process(data: unknown) {}
// or better
interface DataType {
  name: string;
  value: number;
}
function process(data: DataType) {}
```

### Error: "Strict boolean expressions"
```typescript
// ❌ Wrong
if (user) { }

// ✅ Fix
if (user !== null && user !== undefined) { }
// or
if (user !== null) { }
```

### Error: "No floating promises"
```typescript
// ❌ Wrong
async function load() {
  fetchData(); // Promise not awaited
}

// ✅ Fix
async function load() {
  await fetchData();
}
```

### Error: "No unused variables"
```typescript
// ❌ Wrong
const unused = 'value';

// ✅ Fix - Use it
console.log(unused);

// ✅ Fix - Or prefix with _
const _unused = 'value';
```

---

## Disabling ESLint Rules

### For a Single Line
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = JSON.parse(response);
```

### For a Block
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
const data: any = JSON.parse(response);
const more: any = JSON.parse(other);
/* eslint-enable @typescript-eslint/no-explicit-any */
```

### For a File
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// ... entire file uses any
```

**Note**: Use sparingly and comment why the rule is disabled.

---

## Prettier Configuration

### Key Settings
```json
{
  "semi": true,                    // Require semicolons
  "singleQuote": true,             // Use single quotes
  "printWidth": 100,               // Line length
  "tabWidth": 2,                   // Indent size
  "trailingComma": "es5",          // Trailing commas in ES5
  "bracketSpacing": true,          // { foo } instead of {foo}
  "arrowParens": "always"          // (x) => x instead of x => x
}
```

### Import Order (Client)
```json
{
  "importOrder": [
    "^react",                       // React first
    "^@?\\w",                       // External packages
    "^[./]"                         // Local imports
  ],
  "importOrderSeparation": true     // Blank line between groups
}
```

---

## TypeScript Configuration

### Strict Mode Options (Enabled)
- `strict`: true - All strict type checking options
- `noImplicitAny`: true - No implicit any
- `strictNullChecks`: true - Strict null handling
- `noUnusedLocals`: true - Error on unused variables
- `noImplicitReturns`: true - Require explicit returns

### Path Aliases (Client Example)
```json
{
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
    "@features/*": ["src/features/*"],
    "@store/*": ["src/store/*"]
  }
}
```

**Usage:**
```typescript
// Instead of
import { Button } from '../../../components/ui/Button';

// Use
import { Button } from '@components/ui/Button';
```

---

## Commands Reference

```bash
# Check for issues
npm run lint
npm run type-check

# Auto-fix
npm run lint:fix
npm run format

# Check without fixing
npm run format:check
```

---

## Pro Tips

1. **Run lint:fix before format** - Lint can fix issues, Prettier can't
2. **Enable IDE integration** - Real-time feedback as you code
3. **Use meaningful names** - Reduces need to disable rules
4. **Review warnings** - They often prevent bugs
5. **Keep strict mode on** - It catches real issues early
