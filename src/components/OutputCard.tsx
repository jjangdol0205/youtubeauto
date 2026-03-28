import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface OutputCardProps {
  title: string;
  content: string;
  onCopy: (text: string) => void;
  isLoading?: boolean;
}

export const OutputCard: React.FC<OutputCardProps> = ({ title, content, onCopy, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    onCopy(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '1.25rem',
      height: '380px', /* 고정 높이 */
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
        <button 
          onClick={handleCopy}
          disabled={!content || isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            backgroundColor: copied ? 'var(--success-color)' : 'rgba(48, 54, 61, 0.6)',
            color: copied ? '#fff' : 'var(--text-main)',
            border: `1px solid ${copied ? 'var(--success-color)' : 'var(--border-color)'}`,
            borderRadius: '6px',
            fontSize: '0.85rem',
            transition: 'all 0.2s',
            opacity: (!content || isLoading) ? 0.5 : 1,
            cursor: (!content || isLoading) ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
             if(content && !isLoading && !copied) e.currentTarget.style.backgroundColor = 'rgba(48, 54, 61, 0.9)';
          }}
          onMouseLeave={(e) => {
             if(content && !isLoading && !copied) e.currentTarget.style.backgroundColor = 'rgba(48, 54, 61, 0.6)';
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />} 
          {copied ? '복사됨' : '📋 전체 복사하기'}
        </button>
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: 'rgba(5, 7, 10, 0.6)',
        borderRadius: '8px',
        padding: '1rem',
        border: '1px outset rgba(48, 54, 61, 0.3)',
        whiteSpace: 'pre-wrap',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        color: content ? 'var(--text-main)' : 'var(--text-muted)'
      }}>
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            height: '100%', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
           }}>
             <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(88, 166, 255, 0.3)',
                borderTopColor: 'var(--accent-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
             }} />
            <span className="animate-pulse" style={{ animation: 'pulse-glow 2s infinite alternate', color: 'var(--accent-color)' }}>대기중...</span>
          </div>
        ) : (
          content || "대기 중입니다..."
        )}
      </div>
    </div>
  );
};
