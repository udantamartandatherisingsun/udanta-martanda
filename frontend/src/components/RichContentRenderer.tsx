import React from 'react';

interface RichContentRendererProps {
  content?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content = '',
  className = '',
  style,
}) => {
  // Simple check to determine if the content contains HTML elements
  const isHtml = content.includes('<') && content.includes('>');

  // If the content is HTML, we render it directly.
  // Otherwise, we gracefully replace double newlines with paragraphs or single newlines with brs.
  const renderContent = () => {
    if (isHtml) {
      return { __html: content };
    }
    
    // Legacy plaintext helper: convert double newlines to paragraph breaks, single to br
    const cleanText = content
      .trim()
      .replace(/\n\s*\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    
    return { __html: `<p>${cleanText}</p>` };
  };

  return (
    <div
      className={`lora rich-content ${className}`}
      style={{
        fontSize: '1.15rem',
        lineHeight: '1.85',
        letterSpacing: '0.01em',
        ...style,
      }}
      dangerouslySetInnerHTML={renderContent()}
    />
  );
};

export default RichContentRenderer;
