# Angular Formatting Setup

This project uses **Prettier** and **ESLint** for code formatting and linting.

## Configuration Files

- `.prettierrc.json` - Prettier formatting rules
- `.eslintrc.json` - ESLint linting rules
- `.prettierignore` - Files to ignore when formatting
- `.editorconfig` - Editor configuration (already existed)

## Available Scripts

### Formatting
```bash
# Format all files
npm run format

# Check formatting without making changes
npm run format:check
```

### Linting
```bash
# Run ESLint
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix
```

## VS Code Integration

The `.vscode/settings.json` file is configured to:
- Format on save using Prettier
- Auto-fix ESLint issues on save
- Use Prettier as the default formatter for TypeScript, HTML, SCSS, and JSON files

## Formatting Rules

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for TypeScript
- **Semicolons**: Required
- **Line Length**: 100 characters
- **Trailing Commas**: ES5 style
- **Arrow Parens**: Avoid parentheses when possible

## ESLint Rules

- Enforces Angular component and directive naming conventions
- TypeScript strict mode recommendations
- Warns on unused variables (with `_` prefix exception)
- Angular template accessibility checks

## Usage Tips

1. **Before committing**: Run `npm run format` and `npm run lint:fix`
2. **VS Code**: Files will auto-format on save if you have the Prettier extension installed
3. **CI/CD**: Add `npm run format:check` and `npm run lint` to your CI pipeline

## Required VS Code Extensions

- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
