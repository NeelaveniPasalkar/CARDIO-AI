import React from 'react';

interface FormattedMarkdownProps {
  content: string;
}

interface Block {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'ul' | 'ol' | 'p' | 'math';
  items?: string[];
  text?: string;
}

/**
 * Renders inline markdown tokens:
 * - **bold** -> <strong>
 * - *italic* -> <em>
 * - `code` -> <code>
 * - $math$ -> <code className="math-inline">
 */
function renderInlineContent(text: string): React.ReactNode[] {
  // Regex splitting on:
  // 1) **bold**
  // 2) *italic* (not followed by *)
  // 3) `code`
  // 4) $math$
  const tokenRegex = /(\*\*.*?\*\*|\*[^*\n]+?\*|`[^`\n]+?`|\$[^\$\n]+?\$)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      // Recursively check for italics inside bold if needed, or simple text
      return (
        <strong key={index}>
          {inner.startsWith('*') && inner.endsWith('*') && inner.length >= 2
            ? <em>{inner.slice(1, -1)}</em>
            : inner}
        </strong>
      );
    }

    // Italic
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    // Inline Code
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    // Math inline
    if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
      return (
        <code key={index} className="math-inline">
          {part.slice(1, -1).replace(/\\text\{([^}]+)\}/g, '$1')}
        </code>
      );
    }

    // Plain text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Parses markdown into structured blocks:
 * - Headings (#, ##, ###, ####)
 * - Lists (*, -, •, 1., 2.)
 * - Block math ($$...$$)
 * - Paragraphs with newlines (<p>, <br/>)
 */
function parseMarkdownToBlocks(rawText: string): Block[] {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      blocks.push({
        type: 'p',
        text: currentParagraphLines.join('\n'),
      });
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push({
        type: currentList.type,
        items: currentList.items,
      });
      currentList = null;
    }
  };

  let inMathBlock = false;
  let mathLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check multi-line or single-line math block $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'math',
        text: trimmed.slice(2, -2).trim(),
      });
      continue;
    }

    if (trimmed === '$$') {
      if (inMathBlock) {
        // closing
        inMathBlock = false;
        blocks.push({
          type: 'math',
          text: mathLines.join('\n').trim(),
        });
        mathLines = [];
      } else {
        // opening
        flushParagraph();
        flushList();
        inMathBlock = true;
        mathLines = [];
      }
      continue;
    }

    if (inMathBlock) {
      mathLines.push(rawLine);
      continue;
    }

    // Empty line separates paragraphs / lists
    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headings: #, ##, ###, ####, #####, ######
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      let headingText = headingMatch[2].trim();
      // Remove wrapping bold asterisks from headings if present: e.g. "### **Heading**" -> "Heading"
      if (headingText.startsWith('**') && headingText.endsWith('**') && headingText.length >= 4) {
        headingText = headingText.slice(2, -2).trim();
      }
      const type = `h${Math.min(level, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      blocks.push({ type, text: headingText });
      continue;
    }

    // Bullet list items: *, -, •
    const bulletMatch = trimmed.match(/^[\*\-•]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1].trim());
      continue;
    }

    // Numbered list items: 1., 2., 1)
    const numberedMatch = trimmed.match(/^\d+[\.\)]\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberedMatch[1].trim());
      continue;
    }

    // Regular line in paragraph
    flushList();
    currentParagraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content }) => {
  if (!content) return null;

  const blocks = parseMarkdownToBlocks(content);

  return (
    <div className="formatted-markdown">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
          case 'h2':
            return (
              <h3 key={idx} className="md-heading md-h2">
                {renderInlineContent(block.text || '')}
              </h3>
            );
          case 'h3':
            return (
              <h4 key={idx} className="md-heading md-h3">
                {renderInlineContent(block.text || '')}
              </h4>
            );
          case 'h4':
            return (
              <h5 key={idx} className="md-heading md-h4">
                {renderInlineContent(block.text || '')}
              </h5>
            );
          case 'h5':
          case 'h6':
            return (
              <h6 key={idx} className="md-heading md-h5">
                {renderInlineContent(block.text || '')}
              </h6>
            );
          case 'ul':
            return (
              <ul key={idx} className="md-list md-ul">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="md-list-item">
                    {renderInlineContent(item)}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={idx} className="md-list md-ol">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="md-list-item">
                    {renderInlineContent(item)}
                  </li>
                ))}
              </ol>
            );
          case 'math': {
            // Clean common LaTeX \text{...} wrappers for clean display
            const cleanMath = (block.text || '').replace(/\\text\{([^}]+)\}/g, '$1');
            return (
              <div key={idx} className="math-block">
                {cleanMath}
              </div>
            );
          }
          case 'p':
          default: {
            const lines = (block.text || '').split('\n');
            return (
              <p key={idx} className="md-paragraph">
                {lines.map((line, lineIdx) => (
                  <React.Fragment key={lineIdx}>
                    {renderInlineContent(line)}
                    {lineIdx < lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
          }
        }
      })}
    </div>
  );
};
