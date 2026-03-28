import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ContentResult {
  script: string;
  videoPrompts: string;
  metaInfo: string;
  thumbnailPrompt: string;
}

export const generateContentFromGemini = async (story: string, concept: string): Promise<ContentResult> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
당신은 '김쌤의 영웅 라디오' 유튜브 채널을 운영하는 '김쌤' 본인이자 최고의 전문 크리에이터입니다.
가수 '황영웅' 전용 유튜브 대본과 정보를 작성하는 것이 목적입니다. 
⚠️ 주의: 황영웅의 공식 팬덤(팬클럽) 이름은 오직 '파라다이스'입니다. 기사나 대본 내에서 팬들을 칭할 때 절대 타 가수의 팬덤명인 '영웅시대'라는 단어를 쓰지 말고, 무조건 '파라다이스' 또는 '파라다이스 가족 여러분'으로 지칭하세요.

다음의 '스토리'와 '컨셉'을 바탕으로 4가지 항목을 각각 생성해주세요.

**[입력 데이터]**
- 스토리: ${story}
- 선택된 컨셉: ${concept}

**[출력 요구사항 - 반드시 다음 규격을 지키세요]**
1. script (롱폼 대본): 선택한 '${concept}' 분위기에 맞게 시청자에게 직접 말하듯이 구어체로 작성하세요. 본인을 '김쌤'으로 칭하며, 한글 최소 1,500자 분량으로 풍성하게 만들어주세요. 대본의 가장 마지막 부분에는 시청자들에게 'paradise-hero.com' 웹사이트(팬 활동 및 관련 정보) 방문을 유도하고 홍보하는 멘트를 매우 자연스럽게 포함해주세요.
2. videoPrompts (씬별 영상 프롬프트): 구글 flow 등 AI 비디오 생성기에 넣을 영문 프롬프트. 씬별로 명확하게 묘사된 영어 문자열 4개를 작성해주세요.
3. metaInfo (유튜브 제목 및 더보기 설명란):
   - titles: 시선을 끄는 클릭 유발 제목 3개 추천
   - description: 구체적인 유튜브 더보기란 설명. 읽기 편하도록 문단 사이사이에 반드시 '줄바꿈(엔터)'를 넉넉히 넣어서 띄어쓰기 해주세요. 설명의 마지막 줄에는 반드시 'paradise-hero.com' 사이트 방문을 유도하는 멘트와 링크를 넣어주세요.
   - tags: 영상 관련 해시태그 모음. 반드시 최대 5개까지만 제공하세요.
4. thumbnailPrompt (썸네일 프롬프트): Midjourney나 안정화 확산(Stable Diffusion) 같은 이미지 생성 AI에 넣을 썸네일용 영문 프롬프트 1개. 컨셉에 어울리는 강렬하고 눈에 띄는 이미지 묘사.

**[형식]**
반드시 다음 JSON 구조로 응답해야 합니다.
{
  "script": "대본 내용...",
  "videoPrompts": [
    "장면 1 영문 프롬프트...",
    "장면 2 영문 프롬프트..."
  ],
  "metaInfo": {
    "titles": [
      "추천 제목 1...",
      "추천 제목 2...",
      "추천 제목 3..."
    ],
    "description": "영상 설명... (문단 나눔 확행)... 사이트 소개...",
    "tags": ["#태그1", "#태그2", "#태그3", "#태그4", "#태그5"]
  },
  "thumbnailPrompt": "썸네일 영문 프롬프트..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // JSON 파싱 (responseMimeType 적용으로 깔끔하게 넘어옴)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let parsed: any;
    
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = JSON.parse(text); // 백업 파싱
    }

    // React 렌더링 충돌(블랙아웃)을 방지하고 사용자가 복사하기 좋게 예쁜 평문으로 포맷팅
    const formatMetaInfo = (val: any): string => {
      if (!val) return "";
      if (typeof val === 'string') return val;
      if (typeof val === 'object') {
        let result = "";
        if (val.titles && Array.isArray(val.titles)) {
          result += "📌 [추천 제목]\n" + val.titles.map((t: string, i: number) => `${i + 1}. ${t}`).join('\n') + "\n\n";
        }
        if (val.description) {
          result += "📝 [설명 및 해시태그]\n" + val.description + "\n\n";
        }
        if (val.tags && Array.isArray(val.tags)) {
           result += "\n🏷️ " + val.tags.slice(0, 5).join(' ') + "\n";
        }
        return result.trim() || JSON.stringify(val, null, 2);
      }
      return JSON.stringify(val, null, 2);
    };

    const formatPrompts = (val: any): string => {
      if (!val) return "";
      if (Array.isArray(val)) {
        return val.map(v => typeof v === 'string' ? v.trim() : JSON.stringify(v)).join('\n\n');
      }
      if (typeof val === 'string') {
        return val.split('\n').filter(line => line.trim() !== '').join('\n\n');
      }
      return JSON.stringify(val, null, 2);
    };

    const safeParsed: ContentResult = {
      script: typeof parsed.script === 'string' ? parsed.script : JSON.stringify(parsed.script, null, 2),
      videoPrompts: formatPrompts(parsed.videoPrompts),
      metaInfo: formatMetaInfo(parsed.metaInfo),
      thumbnailPrompt: typeof parsed.thumbnailPrompt === 'string' ? parsed.thumbnailPrompt : JSON.stringify(parsed.thumbnailPrompt, null, 2)
    };

    return safeParsed;
  } catch (error) {
    console.error("Gemini API 호출 실패:", error);
    throw error;
  }
};

export const suggestTopicsFromGemini = async (): Promise<string[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
당신은 '김쌤의 영웅 라디오' 유튜브 채널을 운영하는 '김쌤' 본인이자 트로트 가수 '황영웅' 관련 전문 크리에이터입니다.
최근 대중과 팬덤(파라다이스)이 가장 열광할 만한 유튜브 영상 콘텐츠 혹은 블로그 포스팅 주제(기사/이슈 떡밥) 10개를 작성해 주세요. 
황영웅 씨의 음원 기록, 미담, 팬미팅, 전국 정모, 무대 분석, 항후 컴백 행보 등 '당장 영상으로 만들면 시청자가 클릭할 수밖에 없는 자극적이고 흥미로운 기획 주제 혹은 구체적 가상의 기사 헤드라인+리드문' 형태로 작성해 주세요.

**[형식]**
반드시 10개의 문자열로 구성된 JSON 배열(Array) 형태로만 응답하세요. 다른 설명은 절대 넣지 마세요.
[
  "황영웅 팬카페 1만 2천명 대규모 정모, 타 가수들이 긴장하는 진짜 이유",
  "억대 지역 행사 거절하고 팬들을 선택한 황영웅의 역대급 미담 총정리",
  ... (총 10개)
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) return parsed.map(String);
    }
    const parsedBackup = JSON.parse(text);
    return Array.isArray(parsedBackup) ? parsedBackup.map(String) : [];
  } catch (error) {
    console.error("추천 주제 생성 실패:", error);
    throw error;
  }
};

