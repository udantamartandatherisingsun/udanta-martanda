'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  Strikethrough as StrikethroughIcon, 
  List as ListIcon, 
  ListOrdered as ListOrderedIcon, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code as CodeIcon, 
  Eye as EyeIcon,
  X,
  Plus,
  Heading2,
  Heading3,
  Minus
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write something beautiful...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isCodeView, setIsCodeView] = useState(false);
  
  // Selection tracking
  const savedSelectionRef = useRef<Range | null>(null);

  // Dialog overlays state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState('100'); // percent
  const [imageAlign, setImageAlign] = useState<'center' | 'left' | 'right'>('center');

  // Toolbar active states
  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    orderedList: false,
    unorderedList: false,
    h2: false,
    h3: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync initial and external value changes
  useEffect(() => {
    if (!isMounted || !editorRef.current || isCodeView) return;
    
    // Prevent infinite loop & cursor reset: only update if contents are actually different
    const currentHTML = editorRef.current.innerHTML;
    // Normalize empty strings
    const normalizedValue = value || '';
    const normalizedCurrent = currentHTML === '<br>' || currentHTML === '<p><br></p>' ? '' : currentHTML;
    
    if (normalizedCurrent !== normalizedValue) {
      editorRef.current.innerHTML = normalizedValue;
    }
  }, [value, isMounted, isCodeView]);

  // Handle rich editor content change
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    
    // Clean up empty tags
    if (html === '<br>' || html === '<p><br></p>' || html === '<div><br></div>') {
      html = '';
    }

    // Strip carriage returns and physical newlines to keep raw HTML database clean
    // This stops .replace(/\n/g, '<br/>') on frontend from inserting extra line breaks!
    const cleanHtml = html.replace(/[\r\n]+/g, ' ');
    onChange(cleanHtml);
    checkActiveStates();
  };

  // Save current cursor position / selection range
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  // Restore selection range
  const restoreSelection = () => {
    if (typeof window === 'undefined' || !savedSelectionRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Run format commands (e.g. Bold, Italic)
  const execCommand = (command: string, value: string = '') => {
    if (typeof document === 'undefined') return;
    
    // Focus the editor if not focused
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    document.execCommand(command, false, value);
    handleEditorInput();
    checkActiveStates();
  };

  // Check which formatting styles are active at the current cursor position
  const checkActiveStates = () => {
    if (typeof document === 'undefined') return;
    
    let isH2 = false;
    let isH3 = false;
    
    try {
      const blockValue = document.queryCommandValue('formatBlock');
      isH2 = blockValue === 'h2' || blockValue === '<h2>';
      isH3 = blockValue === 'h3' || blockValue === '<h3>';
    } catch (e) {
      // Fallback node inspection
      if (typeof window !== 'undefined') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          let node = selection.getRangeAt(0).startContainer;
          while (node && node !== editorRef.current) {
            if (node.nodeName === 'H2') isH2 = true;
            if (node.nodeName === 'H3') isH3 = true;
            node = node.parentNode as Node;
          }
        }
      }
    }

    setActiveStates({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikethrough: document.queryCommandState('strikeThrough'),
      orderedList: document.queryCommandState('insertOrderedList'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      h2: isH2,
      h3: isH3,
    });
  };

  // Toggle heading block format
  const toggleHeading = (headingTag: 'h2' | 'h3') => {
    if (isCodeView) return;
    const isCurrentlyActive = headingTag === 'h2' ? activeStates.h2 : activeStates.h3;
    if (isCurrentlyActive) {
      execCommand('formatBlock', '<p>');
    } else {
      execCommand('formatBlock', `<${headingTag}>`);
    }
  };

  // Insert beautiful custom horizontal rule matching premium HSL branding
  const insertHorizontalRule = () => {
    if (isCodeView) return;
    const hrHtml = '<hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(212, 175, 55, 0), rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0)); margin: 32px 0;" />&nbsp;';
    execCommand('insertHTML', hrHtml);
  };

  // Insert link
  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;

    restoreSelection();
    
    // Check if user has text selected
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : '';

    if (selectedText) {
      execCommand('createLink', linkUrl);
    } else {
      // If nothing is selected, insert a styled anchor tag
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--gold); text-decoration: underline; font-weight: 500;">${linkUrl}</a>&nbsp;`;
      execCommand('insertHTML', linkHtml);
    }

    setLinkUrl('');
    setShowLinkDialog(false);
  };

  // Insert image
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    restoreSelection();

    // Build premium styled image HTML with margins, border-radius, alignment & optional custom width
    let alignmentStyle = 'display: block; margin: 24px auto;';
    if (imageAlign === 'left') {
      alignmentStyle = 'float: left; margin: 12px 24px 12px 0; max-width: 50%;';
    } else if (imageAlign === 'right') {
      alignmentStyle = 'float: right; margin: 12px 0 12px 24px; max-width: 50%;';
    }

    const imgHtml = `<img src="${imageUrl}" alt="${imageAlt || 'Article illustration'}" style="width: ${imageWidth}%; height: auto; border-radius: 8px; border: 1px solid var(--border3); box-shadow: 0 10px 30px rgba(0,0,0,0.4); ${alignmentStyle}" />&nbsp;`;
    
    execCommand('insertHTML', imgHtml);

    setImageUrl('');
    setImageAlt('');
    setImageWidth('100');
    setImageAlign('center');
    setShowImageDialog(false);
  };

  // Trigger Link dialog
  const openLinkDialog = () => {
    saveSelection();
    setShowImageDialog(false);
    setShowLinkDialog(!showLinkDialog);
  };

  // Trigger Image dialog
  const openImageDialog = () => {
    saveSelection();
    setShowLinkDialog(false);
    setShowImageDialog(!showImageDialog);
  };

  if (!isMounted) {
    return <div style={{ height: '300px', background: 'var(--bg)', border: '1px solid var(--border3)', borderRadius: '4px' }} />;
  }

  return (
    <div 
      className="rich-text-editor" 
      style={{ 
        border: '1px solid var(--border3)', 
        borderRadius: '6px', 
        background: 'var(--bg2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Editor Toolbar */}
      <div 
        className="editor-toolbar" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          gap: '4px',
          padding: '8px', 
          borderBottom: '1px solid var(--border3)', 
          background: 'var(--bg1)',
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}
      >
        <button
          type="button"
          onClick={() => execCommand('bold')}
          disabled={isCodeView}
          style={{
            background: activeStates.bold ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.bold ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Bold"
        >
          <BoldIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand('italic')}
          disabled={isCodeView}
          style={{
            background: activeStates.italic ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.italic ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Italic"
        >
          <ItalicIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand('underline')}
          disabled={isCodeView}
          style={{
            background: activeStates.underline ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.underline ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand('strikeThrough')}
          disabled={isCodeView}
          style={{
            background: activeStates.strikethrough ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.strikethrough ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Strikethrough"
        >
          <StrikethroughIcon size={16} />
        </button>

        <div style={{ width: '1px', height: '18px', background: 'var(--border3)', margin: '0 6px' }} />

        <button
          type="button"
          onClick={() => toggleHeading('h2')}
          disabled={isCodeView}
          style={{
            background: activeStates.h2 ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.h2 ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Subheading (H2)"
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => toggleHeading('h3')}
          disabled={isCodeView}
          style={{
            background: activeStates.h3 ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.h3 ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Minor Heading (H3)"
        >
          <Heading3 size={16} />
        </button>

        <div style={{ width: '1px', height: '18px', background: 'var(--border3)', margin: '0 6px' }} />

        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          disabled={isCodeView}
          style={{
            background: activeStates.orderedList ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.orderedList ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Ordered List (Key Pointers)"
        >
          <ListOrderedIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          disabled={isCodeView}
          style={{
            background: activeStates.unorderedList ? 'var(--bg3)' : 'none',
            border: 'none',
            color: activeStates.unorderedList ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Unordered List (Bullet Points)"
        >
          <ListIcon size={16} />
        </button>

        <button
          type="button"
          onClick={insertHorizontalRule}
          disabled={isCodeView}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Insert Separator (HR)"
        >
          <Minus size={16} />
        </button>

        <div style={{ width: '1px', height: '18px', background: 'var(--border3)', margin: '0 6px' }} />

        <button
          type="button"
          onClick={openLinkDialog}
          disabled={isCodeView}
          style={{
            background: showLinkDialog ? 'var(--bg3)' : 'none',
            border: 'none',
            color: showLinkDialog ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>

        <button
          type="button"
          onClick={openImageDialog}
          disabled={isCodeView}
          style={{
            background: showImageDialog ? 'var(--bg3)' : 'none',
            border: 'none',
            color: showImageDialog ? 'var(--gold)' : 'var(--ink2)',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isCodeView ? 0.3 : 1,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Insert Multiple Images Inline"
        >
          <ImageIcon size={16} />
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }} />

        {/* Mode Toggles */}
        <button
          type="button"
          onClick={() => {
            if (isCodeView) {
              setIsCodeView(false);
            } else {
              setIsCodeView(true);
              setShowLinkDialog(false);
              setShowImageDialog(false);
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink3)',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontFamily: 'var(--mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            borderRight: '1px solid var(--border3)'
          }}
          title="Toggle Raw HTML/Visual"
        >
          {isCodeView ? (
            <>
              <EyeIcon size={14} /> Visual Mode
            </>
          ) : (
            <>
              <CodeIcon size={14} /> HTML View
            </>
          )}
        </button>
      </div>

      {/* Dialog: Link Form */}
      {showLinkDialog && (
        <form 
          onSubmit={handleInsertLink}
          style={{ 
            background: 'var(--bg3)', 
            padding: '12px 16px', 
            borderBottom: '1px solid var(--border3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--gold)', textTransform: 'uppercase' }}>Insert Hyperlink</span>
            <button type="button" onClick={() => setShowLinkDialog(false)} style={{ background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer' }}><X size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="url" 
              placeholder="https://example.com" 
              required
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{ 
                flex: 1, 
                background: 'var(--bg)', 
                border: '1px solid var(--border3)', 
                padding: '8px 12px', 
                color: 'var(--ink)', 
                fontSize: '13px', 
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              style={{ 
                background: 'var(--gold)', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 16px', 
                fontSize: '12px', 
                fontWeight: 600, 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Add Link
            </button>
          </div>
        </form>
      )}

      {/* Dialog: Image Form */}
      {showImageDialog && (
        <form 
          onSubmit={handleInsertImage}
          style={{ 
            background: 'var(--bg3)', 
            padding: '16px', 
            borderBottom: '1px solid var(--border3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--gold)', textTransform: 'uppercase' }}>Insert Image Inline</span>
            <button type="button" onClick={() => setShowImageDialog(false)} style={{ background: 'none', border: 'none', color: 'var(--ink3)', cursor: 'pointer' }}><X size={14} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--ink3)', marginBottom: '4px', fontFamily: 'var(--mono)' }}>Image Source URL</label>
              <input 
                type="url" 
                placeholder="https://example.com/image.jpg" 
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border3)', 
                  padding: '8px 12px', 
                  color: 'var(--ink)', 
                  fontSize: '13px', 
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', color: 'var(--ink3)', marginBottom: '4px', fontFamily: 'var(--mono)' }}>Alternate Description (Alt Text)</label>
              <input 
                type="text" 
                placeholder="Indian heritage site or documentary scene..." 
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                style={{ 
                  width: '100%', 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border3)', 
                  padding: '8px 12px', 
                  color: 'var(--ink)', 
                  fontSize: '13px', 
                  borderRadius: '4px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink2)', fontFamily: 'var(--mono)' }}>Width:</span>
              <select 
                value={imageWidth} 
                onChange={(e) => setImageWidth(e.target.value)}
                style={{ 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border3)', 
                  padding: '6px 12px', 
                  color: 'var(--ink)', 
                  fontSize: '12px', 
                  borderRadius: '4px',
                  outline: 'none'
                }}
              >
                <option value="100">Full Width (100%)</option>
                <option value="75">Large (75%)</option>
                <option value="50">Medium (50%)</option>
                <option value="33">Small (33%)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--ink2)', fontFamily: 'var(--mono)' }}>Alignment:</span>
              <select 
                value={imageAlign} 
                onChange={(e) => setImageAlign(e.target.value as any)}
                style={{ 
                  background: 'var(--bg)', 
                  border: '1px solid var(--border3)', 
                  padding: '6px 12px', 
                  color: 'var(--ink)', 
                  fontSize: '12px', 
                  borderRadius: '4px',
                  outline: 'none'
                }}
              >
                <option value="center">Centered Block</option>
                <option value="left">Float Left (Wrap Text)</option>
                <option value="right">Float Right (Wrap Text)</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={{ 
                marginLeft: 'auto',
                background: 'var(--gold)', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 16px', 
                fontSize: '12px', 
                fontWeight: 600, 
                borderRadius: '4px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} /> Insert Image
            </button>
          </div>
        </form>
      )}

      {/* Editor Content Area */}
      {isCodeView ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter custom HTML code here..."
          style={{
            width: '100%',
            height: '350px',
            background: 'var(--bg)',
            border: 'none',
            padding: '16px',
            color: 'var(--ink2)',
            fontFamily: 'var(--mono)',
            fontSize: '13px',
            lineHeight: '1.6',
            outline: 'none',
            resize: 'vertical'
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          onBlur={handleEditorInput}
          onMouseUp={checkActiveStates}
          onKeyUp={checkActiveStates}
          onFocus={checkActiveStates}
          style={{
            width: '100%',
            minHeight: '350px',
            background: 'var(--bg)',
            color: 'var(--ink)',
            padding: '20px 24px',
            fontSize: '15px',
            lineHeight: '1.8',
            fontFamily: 'var(--body)',
            outline: 'none',
            overflowY: 'auto',
            border: 'none'
          }}
          data-placeholder={placeholder}
        />
      )}

      {/* Inline styling to support placeholder, custom focus styles, and formatting */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--ink4);
          cursor: text;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          transition: outline 0.1s ease;
        }
        [contenteditable] img:hover {
          outline: 2px solid var(--gold);
        }
        [contenteditable] a {
          color: var(--gold);
          text-decoration: underline;
        }
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 24px;
          margin-bottom: 16px;
        }
        [contenteditable] li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}
