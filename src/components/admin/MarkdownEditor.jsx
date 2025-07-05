import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  label,
  rows = 3,
  className = "",
}) {
  const [isPreview, setIsPreview] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && !isPreview) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, isPreview]);

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange({ target: { name: "content", value: newValue } });
      
      // Set cursor position after tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const insertMarkdown = (syntax) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = "";
    let cursorOffset = 0;

    switch (syntax) {
      case "bold":
        newText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case "italic":
        newText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case "code":
        newText = `\`${selectedText}\``;
        cursorOffset = 1;
        break;
      case "link":
        newText = `[${selectedText}](url)`;
        cursorOffset = 3;
        break;
      case "image":
        newText = `![${selectedText}](url)`;
        cursorOffset = 3;
        break;
      case "codeblock":
        newText = `\`\`\`\n${selectedText}\n\`\`\``;
        cursorOffset = 4;
        break;
      case "table":
        newText = `| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |`;
        cursorOffset = 0;
        break;
      case "math":
        newText = `$${selectedText}$`;
        cursorOffset = 1;
        break;
      case "list":
        newText = `- ${selectedText}`;
        cursorOffset = 2;
        break;
      case "numbered":
        newText = `1. ${selectedText}`;
        cursorOffset = 3;
        break;
      case "quote":
        newText = `> ${selectedText}`;
        cursorOffset = 2;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange({ target: { name: "content", value: newValue } });

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + newText.length - cursorOffset;
      textarea.selectionEnd = start + newText.length - cursorOffset;
    }, 0);
  };

  return (
    <div className={`markdown-editor ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm sm:text-base font-bold mb-2 text-gray-800">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => insertMarkdown("bold")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12 6v6h3v2h-3v2H9v-2H6v-2h3V6h3zM7 4V2H3v2h4zm0 12v2H3v-2h4z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("italic")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("code")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Inline Code"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 4.41l2.3 2.3L13 9l-1.4-1.4L13.8 6.7 13 6l-1.4 1.4L10.2 6.7 11 6l-.8.7L9.4 5.3 8 6.7 6.6 5.3 5.8 6l.8.7L5.4 8.4 4 9.8l1.4 1.4L6.2 10.1 5.4 11l.8.7 1.4-1.4L8.8 11.3 9.6 12l.8-.7 1.4 1.4L13 10.3l1.4 1.4L15.8 10l-.8-.7 1.4-1.4L14.6 6.3 13.8 7l-.8-.7z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("codeblock")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Code Block"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("link")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Link"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("image")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Image"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("list")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("numbered")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("quote")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Quote"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("table")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Table"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => insertMarkdown("math")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-800"
            title="Math"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
          </button>
        </div>

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            isPreview
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {isPreview ? "✏️ Edit" : "👁️ Preview"}
        </button>
      </div>

      {/* Editor/Preview Area */}
      <div className={`border-2 rounded-lg overflow-hidden transition-all ${
        isFocused ? "border-indigo-500 shadow-lg" : "border-gray-300"
      }`}>
        {isPreview ? (
          <div className="p-4 bg-white min-h-[120px] prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                div: ({ className, ...props }) => (
                  <div className={`prose prose-sm max-w-none ${className || ''}`} {...props} />
                ),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={a11yDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {value || placeholder}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleTabKey}
            placeholder={placeholder}
            className="w-full p-4 bg-white resize-none outline-none text-gray-800 placeholder-gray-500 font-mono text-sm leading-relaxed"
            style={{ minHeight: `${rows * 1.5}rem` }}
          />
        )}
      </div>

      {/* Character Count */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        {value.length} characters
      </div>
    </div>
  );
} 