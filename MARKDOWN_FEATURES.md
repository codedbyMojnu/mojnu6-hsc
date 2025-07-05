# Markdown Editor Features

## Overview
The application now includes a comprehensive Markdown editor with live preview functionality, similar to GitHub's editor. All form fields in the admin panel support full Markdown editing capabilities.

## Supported Markdown Features

### Basic Text Formatting
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Strikethrough**: `~~text~~`
- **Inline Code**: `` `code` ``

### Headers
```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

### Lists
- **Unordered Lists**: `- item` or `* item`
- **Ordered Lists**: `1. item`
- **Nested Lists**: Indent with spaces

### Links and Images
- **Links**: `[text](url)`
- **Images**: `![alt text](image-url)`

### Code Blocks
- **Fenced Code Blocks**: 
  ````
  ```javascript
  console.log("Hello World!");
  ```
  ````
- **Syntax Highlighting**: Supports all major programming languages

### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Blockquotes
```markdown
> This is a blockquote
> It can span multiple lines
```

### Mathematical Expressions
- **Inline Math**: `$E = mc^2$`
- **Block Math**: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

### GitHub Flavored Markdown (GFM)
- **Task Lists**: `- [x] Completed task`
- **Strikethrough**: `~~deleted text~~`
- **Tables**: Full table support
- **Automatic URL linking**

## Editor Features

### Toolbar
The editor includes a comprehensive toolbar with buttons for:
- Bold, Italic, Code formatting
- Links and Images
- Lists (bulleted and numbered)
- Code blocks
- Tables
- Mathematical expressions
- Blockquotes

### Live Preview
- Toggle between edit and preview modes
- Real-time rendering of Markdown content
- Syntax highlighting for code blocks
- Mathematical expression rendering with KaTeX

### Auto-resize
- Textarea automatically resizes based on content
- Smooth transitions and animations

### Keyboard Shortcuts
- **Tab**: Insert 2 spaces (configurable)
- **Ctrl+B**: Bold (via toolbar)
- **Ctrl+I**: Italic (via toolbar)

## Usage in Admin Panel

### Form Fields with Markdown Support
All fields in the AddQuestionForm now support Markdown:

1. **Question**: Write questions with rich formatting
2. **Options**: Each option can include Markdown
3. **Answer**: Correct answer with formatting
4. **Hint**: Helpful hints with rich text
5. **Explanation**: Detailed explanations with code, math, etc.

### Example Usage
```markdown
# Question Title

What is the **correct** answer to this problem?

## Code Example
```javascript
function calculateSum(a, b) {
  return a + b;
}
```

## Mathematical Formula
The area of a circle is: $A = \pi r^2$

## Options
- **Option A**: `2 + 2 = 4`
- **Option B**: $E = mc^2$
- **Option C**: [Learn more](https://example.com)
- **Option D**: > This is a quote
```

## Technical Implementation

### Dependencies
- `react-markdown`: Core Markdown parsing
- `react-syntax-highlighter`: Code syntax highlighting
- `remark-math`: Mathematical expression support
- `rehype-katex`: KaTeX rendering
- `remark-gfm`: GitHub Flavored Markdown
- `@tailwindcss/typography`: Typography styling

### Components
- `MarkdownEditor`: Full-featured editor with toolbar and preview
- `MarkdownRenderer`: Simple renderer for displaying content

### Styling
- Custom CSS for consistent styling
- Tailwind Typography plugin integration
- KaTeX CSS for mathematical expressions
- Responsive design for all screen sizes

## Database Storage
- Markdown content is stored as-is in the database
- No HTML conversion on the backend
- Pure Markdown format for maximum portability

## Frontend Rendering
- Markdown is parsed and rendered on the frontend
- Consistent styling across all components
- Support for all Markdown features in display mode