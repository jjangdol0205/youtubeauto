import { useState } from 'react';
import { InputSection } from './components/InputSection';
import { OutputCard } from './components/OutputCard';
import { Toast } from './components/Toast';
import { generateContentFromGemini, suggestTopicsFromGemini, type ContentResult } from './api';
import './index.css';

function App() {
  const [story, setStory] = useState('');
  const [concept, setConcept] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // 추천 관련 상태
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [results, setResults] = useState<ContentResult>({
    script: '',
    videoPrompts: '',
    metaInfo: '',
    thumbnailPrompt: ''
  });

  const handleSuggest = async () => {
    setIsSuggesting(true);
    setSuggestedTopics([]); // 상태 초기화 후 로딩
    try {
      const topics = await suggestTopicsFromGemini();
      setSuggestedTopics(topics);
    } catch (error) {
      alert("추천 주제를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerate = async () => {
    if (!story.trim() || !concept) return;
    
    setIsLoading(true);
    // 상태 초기화
    setResults({
      script: '',
      videoPrompts: '',
      metaInfo: '',
      thumbnailPrompt: ''
    });

    try {
      const generated = await generateContentFromGemini(story, concept);
      setResults(generated);
    } catch (error) {
      alert("생성 중 오류가 발생했습니다. 개발자 도구의 콘솔을 확인해주세요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage('클립보드에 복사되었습니다!');
    }).catch(err => {
      console.error("복사에 실패했습니다.", err);
      alert("복사 실패. 수동으로 복사해주세요.");
    });
  };

  return (
    <div style={{
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ 
          color: 'var(--text-primary)', 
          fontSize: '2.5rem', 
          fontWeight: 800,
          background: 'linear-gradient(to right, #fff, var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          유튜브 콘텐츠 원스톱 대시보드
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
          뉴스/스토리 입력 한 번으로 대본부터 프롬프트까지 완벽 자동 생성
        </p>
      </header>

      <main className="main-grid">
        {/* 좌측: 입력부 */}
        <section className="animate-fade-in">
          <InputSection 
            story={story}
            setStory={setStory}
            concept={concept}
            setConcept={setConcept}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            suggestedTopics={suggestedTopics}
            isSuggesting={isSuggesting}
            onSuggest={handleSuggest}
          />
        </section>

        {/* 우측: 출력부 (4개 카드 Grid) */}
        <section className="output-grid">
          <OutputCard 
            title="[카드 1] 롱폼 대본 (1,500자+)" 
            content={results.script} 
            onCopy={handleCopy}
            isLoading={isLoading}
          />
          <OutputCard 
            title="[카드 2] 씬별 영상 프롬프트 (구글 Flow용)" 
            content={results.videoPrompts} 
            onCopy={handleCopy}
            isLoading={isLoading}
          />
          <OutputCard 
            title="[카드 3] 유튜브 제목 & 더보기란" 
            content={results.metaInfo} 
            onCopy={handleCopy}
            isLoading={isLoading}
          />
          <OutputCard 
            title="[카드 4] 썸네일 프롬프트" 
            content={results.thumbnailPrompt} 
            onCopy={handleCopy}
            isLoading={isLoading}
          />
        </section>
      </main>

      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  );
}

export default App;
