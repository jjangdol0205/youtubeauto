import React from 'react';
import { Rocket, Sparkles, MessageSquareDot } from 'lucide-react';

const CONCEPTS = [
  "🎯 사이다 팩트폭격",
  "💖 감동 미담",
  "🏆 기록 경신",
  "🎤 무대 분석",
  "📺 방송 복귀 기대",
  "🌟 선한 영향력",
  "🔥 긴급 투표 총공격"
];

interface InputSectionProps {
  story: string;
  setStory: (story: string) => void;
  concept: string;
  setConcept: (concept: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  suggestedTopics: string[];
  isSuggesting: boolean;
  onSuggest: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  story, 
  setStory, 
  concept, 
  setConcept, 
  onGenerate, 
  isLoading,
  suggestedTopics,
  isSuggesting,
  onSuggest
}) => {
  return (
    <div className="glass-panel" style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    }}>
      {/* 1. 스토리 입력창 및 추천 기능 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="story-input" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            1. 뉴스 기사나 이슈 입력
          </label>
          <button
            onClick={onSuggest}
            disabled={isSuggesting || isLoading}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              backgroundColor: 'rgba(88, 166, 255, 0.1)',
              color: 'var(--accent-color)',
              border: '1px solid var(--accent-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: (isSuggesting || isLoading) ? 'wait' : 'pointer',
              opacity: (isSuggesting || isLoading) ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => !(isSuggesting || isLoading) && (e.currentTarget.style.backgroundColor = 'rgba(88, 166, 255, 0.2)')}
            onMouseLeave={(e) => !(isSuggesting || isLoading) && (e.currentTarget.style.backgroundColor = 'rgba(88, 166, 255, 0.1)')}
          >
            <Sparkles size={16} className={isSuggesting ? "animate-pulse" : ""} />
            {isSuggesting ? "AI가 주제 고민 중..." : "✨ 핫이슈 10개 추천받기"}
          </button>
        </div>

        {/* 추천 결과 표시 영역 */}
        {(suggestedTopics.length > 0 || isSuggesting) && (
          <div className="animate-slide-up" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(48, 54, 61, 0.3)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(88, 166, 255, 0.4)',
            marginBottom: '0.5rem'
          }}>
            {isSuggesting ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-main)', padding: '0.5rem' }}>
                 <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(88, 166, 255, 0.3)',
                    borderTopColor: 'var(--accent-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                 }} />
                 <span className="animate-pulse">황영웅 관련 유튜브 떡밥, 최신 분석 주제 10개를 뽑아오고 있습니다...</span>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem', paddingLeft: '0.3rem' }}>
                  💡 마음에 드는 주제를 클릭하시면 바로 아래 입력창에 텍스트가 덮어쓰기 됩니다.
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {suggestedTopics.map((topic, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setStory(topic)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 0.8rem',
                          backgroundColor: 'rgba(5, 7, 10, 0.4)',
                          border: '1px solid rgba(88, 166, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.6rem',
                          fontSize: '0.95rem',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(88, 166, 255, 0.1)';
                          e.currentTarget.style.borderColor = 'var(--accent-color)';
                          e.currentTarget.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(5, 7, 10, 0.4)';
                          e.currentTarget.style.borderColor = 'rgba(88, 166, 255, 0.2)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <MessageSquareDot size={18} style={{ marginTop: '1px', flexShrink: 0, color: 'var(--accent-color)' }} />
                        <span style={{ lineHeight: 1.4 }}>{topic}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <textarea
          id="story-input"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="여기에 오늘 다룰 내용이나 뉴스 기사를 자유롭게 붙여넣으세요..."
          style={{
            width: '100%',
            height: '250px',
            backgroundColor: 'rgba(5, 7, 10, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            color: 'var(--text-main)',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>

      {/* 2. 컨셉 선택기 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          2. 콘텐츠 분위기(컨셉) 선택
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          {CONCEPTS.map((c) => (
            <button
              key={c}
              onClick={() => setConcept(c)}
              style={{
                padding: '0.8rem 1.2rem',
                borderRadius: '30px',
                border: `1px solid ${concept === c ? 'var(--accent-color)' : 'var(--border-color)'}`,
                backgroundColor: concept === c ? 'rgba(88, 166, 255, 0.15)' : 'rgba(48, 54, 61, 0.3)',
                color: concept === c ? 'var(--accent-color)' : 'var(--text-main)',
                fontWeight: concept === c ? 700 : 500,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1)',
                transform: concept === c ? 'scale(1.05)' : 'scale(1)',
                boxShadow: concept === c ? 'var(--shadow-glow)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (concept !== c) e.currentTarget.style.backgroundColor = 'rgba(48, 54, 61, 0.7)';
              }}
              onMouseLeave={(e) => {
                if (concept !== c) e.currentTarget.style.backgroundColor = 'rgba(48, 54, 61, 0.3)';
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 실행 버튼 */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !story.trim() || !concept}
        style={{
          marginTop: '1rem',
          width: '100%',
          padding: '1.2rem',
          borderRadius: 'var(--radius-md)',
          background: (isLoading || !story.trim() || !concept) 
            ? 'rgba(48, 54, 61, 0.5)' 
            : 'linear-gradient(135deg, var(--accent-hover), var(--accent-color))',
          color: (isLoading || !story.trim() || !concept) ? 'var(--text-muted)' : '#fff',
          fontSize: '1.4rem',
          fontWeight: 700,
          border: 'none',
          boxShadow: (isLoading || !story.trim() || !concept) ? 'none' : '0 10px 20px rgba(88, 166, 255, 0.3)',
          cursor: (isLoading || !story.trim() || !concept) ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.8rem',
          transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && story.trim() && concept) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(88, 166, 255, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && story.trim() && concept) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(88, 166, 255, 0.3)';
          }
        }}
      >
        <Rocket size={24} className={isLoading ? "animate-pulse" : ""} />
        {isLoading ? '콘텐츠 생성 중...' : '🚀 콘텐츠 원클릭 자동 생성'}
      </button>
    </div>
  );
};
