import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses inline markdown tokens:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Bold Italic: ***text***
 * - Inline Code: `code`
 * - Links: [label](url)
 */
export function renderInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match tokens: bold-italic, bold, code, link, italic
  const tokenRegex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|___[^_]+___|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*|(?<!\w)_[^_]+_(?!\w))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('***') && token.endsWith('***') && token.length > 6) {
      parts.push(
        <strong key={match.index} className="font-extrabold italic text-slate-900 dark:text-white">
          {token.slice(3, -3)}
        </strong>
      );
    } else if ((token.startsWith('**') && token.endsWith('**') && token.length > 4) ||
               (token.startsWith('__') && token.endsWith('__') && token.length > 4)) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      parts.push(
        <code
          key={match.index}
          className="font-mono text-[11px] sm:text-xs bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-slate-700/80"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const closingBracket = token.indexOf('](');
      const label = token.substring(1, closingBracket);
      const url = token.substring(closingBracket + 2, token.length - 1);
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {label}
        </a>
      );
    } else if ((token.startsWith('*') && token.endsWith('*') && token.length > 2) ||
               (token.startsWith('_') && token.endsWith('_') && token.length > 2)) {
      parts.push(
        <em key={match.index} className="italic text-slate-800 dark:text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Robust, lightweight Markdown renderer for Chat & AI responses.
 * Parses code blocks, headers, bullet lists, numbered lists, blockquotes, and inline formatting.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let index = 0;

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = '';

  let listType: 'ul' | 'ol' | null = null;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listType && listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 pl-5 list-decimal text-slate-800 dark:text-slate-200 marker:font-bold marker:text-blue-600 dark:marker:text-blue-400">
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-5 list-disc text-slate-800 dark:text-slate-200 marker:text-blue-600 dark:marker:text-blue-400">
            {listItems}
          </ul>
        );
      }
      listType = null;
      listItems = [];
    }
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    // 1. Code Block Fence
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <div key={`codeblock-${elements.length}`} className="my-3 overflow-x-auto rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-xs border border-slate-800 shadow-sm">
            {codeBlockLang && (
              <div className="text-[10px] uppercase font-bold text-slate-400 pb-1 mb-1 border-b border-slate-800">
                {codeBlockLang}
              </div>
            )}
            <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
          </div>
        );
        codeBlockLines = [];
        codeBlockLang = '';
        inCodeBlock = false;
      } else {
        // Start code block
        flushList();
        inCodeBlock = true;
        codeBlockLang = trimmed.replace(/^```/, '').trim();
      }
      index++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      index++;
      continue;
    }

    // 2. Empty line
    if (trimmed === '') {
      flushList();
      index++;
      continue;
    }

    // 3. Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${elements.length}`} className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-3 mb-1">
          {renderInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
      index++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-3.5 mb-1.5">
          {renderInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
      index++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="font-black text-lg sm:text-xl text-slate-900 dark:text-white mt-4 mb-2">
          {renderInlineMarkdown(trimmed.substring(2))}
        </h2>
      );
      index++;
      continue;
    }

    // 4. Blockquotes
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`quote-${elements.length}`} className="my-2 pl-3 border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 py-1.5 rounded-r-lg text-xs italic text-slate-700 dark:text-slate-300">
          {renderInlineMarkdown(trimmed.substring(2))}
        </blockquote>
      );
      index++;
      continue;
    }

    // 5. Ordered List Items (e.g. "1. Item", "2. Item")
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (listType && listType !== 'ol') {
        flushList();
      }
      listType = 'ol';
      listItems.push(
        <li key={`li-${listItems.length}`} className="leading-relaxed">
          {renderInlineMarkdown(olMatch[2])}
        </li>
      );
      index++;
      continue;
    }

    // 6. Unordered List Items (e.g. "- Item", "* Item", "• Item")
    const ulMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (ulMatch) {
      if (listType && listType !== 'ul') {
        flushList();
      }
      listType = 'ul';
      listItems.push(
        <li key={`li-${listItems.length}`} className="leading-relaxed">
          {renderInlineMarkdown(ulMatch[1])}
        </li>
      );
      index++;
      continue;
    }

    // 7. Regular Paragraph line
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="my-1.5 leading-relaxed text-slate-800 dark:text-slate-200">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
    index++;
  }

  // Final flush
  flushList();

  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <div key={`codeblock-final`} className="my-3 overflow-x-auto rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-xs border border-slate-800 shadow-sm">
        <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
      </div>
    );
  }

  return (
    <div className={`markdown-body space-y-1 ${className}`}>
      {elements}
    </div>
  );
};
