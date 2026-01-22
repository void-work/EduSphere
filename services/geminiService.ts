
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, QuizQuestion, CareerPlan, CuratedPath, MindMapNode } from "../types";

export interface LogicPuzzle {
  type: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
}

export interface NoteEnhancement {
  summary: string;
  keyConcepts: string[];
  suggestedDifficulty: number;
}

export interface IntegrityReport {
  aiScore: number;
  explanation: string;
  detectedPatterns: string[];
}

const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json\n?|```/g, "").trim();
};

// Fix: Implemented generateLogicPuzzle function using gemini-3-flash-preview as requested by the KidsCoach component.
export const generateLogicPuzzle = async (level: number): Promise<LogicPuzzle> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a logic puzzle for a student at difficulty level ${level} (where 1 is simple and 12 is competition grade). 
    The puzzle should be engaging and test logical deduction or lateral thinking.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "The category of the logic puzzle." },
          question: { type: Type.STRING, description: "The puzzle description." },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 multiple choice options." },
          answer: { type: Type.STRING, description: "The exact text of the correct answer option." },
          hint: { type: Type.STRING, description: "A helpful hint for the student." }
        },
        required: ["type", "question", "options", "answer", "hint"]
      }
    }
  });

  return JSON.parse(cleanJsonResponse(response.text || "{}")) as LogicPuzzle;
};

export const generateStudyMaterial = async (
  text: string, 
  className: string, 
  textbookName: string
): Promise<{ flashcards: Flashcard[], quiz: QuizQuestion[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an academic expert creating materials for the course "${className}" using "${textbookName}" as the primary source.
    
    TASK: Perform an ATOMIC DECOMPOSITION of the provided text. 
    1. Create a flashcard for EVERY single technical term, definition, date, formula, and key concept mentioned. 
    2. Generate a 5-question high-level mastery quiz.
    
    TEXT CONTENT:
    \n\n ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                source: { type: Type.STRING }
              },
              required: ["question", "answer", "source"]
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        },
        required: ["flashcards", "quiz"]
      }
    }
  });

  return JSON.parse(cleanJsonResponse(response.text || '{"flashcards":[], "quiz":[]}'));
};

export const enhanceNote = async (content: string): Promise<NoteEnhancement> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these study notes and provide a summary, key concepts, and suggested difficulty: \n\n ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedDifficulty: { type: Type.NUMBER }
        },
        required: ["summary", "keyConcepts", "suggestedDifficulty"]
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "{}")) as NoteEnhancement;
};

export const mapSkillsToCareer = async (skills: string[]): Promise<CareerPlan[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on these skills: ${skills.join(', ')}, suggest 3 high-growth career paths and a learning plan for each.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            description: { type: Type.STRING },
            skillsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["role", "description", "skillsNeeded", "learningSteps"]
        }
      }
    }
  });

  return JSON.parse(cleanJsonResponse(response.text || "[]"));
};

export const analyzeTextIntegrity = async (text: string): Promise<IntegrityReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text for AI-generated patterns and linguistic integrity: \n\n ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          aiScore: { type: Type.NUMBER, description: "Scale 0-100 where 100 is likely AI" },
          explanation: { type: Type.STRING },
          detectedPatterns: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["aiScore", "explanation", "detectedPatterns"]
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "{}")) as IntegrityReport;
};

export const generate3DConceptView = async (concept: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `A photorealistic, highly detailed 3D scientific visualization of: ${concept}. Cinematic lighting, white laboratory background, ultra-high resolution.` }] },
    config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const generateSketch = async (concept: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `A simple, educational blackboard-style sketch explaining: ${concept}.` }] }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const generateInfographic = async (topic: string, content: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A high-end professional educational infographic about: ${topic}. CONTENT: ${content}. STYLE: Elite, minimalist commercial.` }]
    }
  });
  const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return part?.inlineData?.data ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const generateCuratedPath = async (topic: string): Promise<CuratedPath> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a world-class educational curator. Create a structured learning roadmap for the topic: "${topic}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          description: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                synthesis: { type: Type.STRING },
                objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING }
              },
              required: ["title", "synthesis", "objectives", "duration"]
            }
          },
          masteryOutcome: { type: Type.STRING }
        },
        required: ["topic", "description", "modules", "masteryOutcome"]
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "{}")) as CuratedPath;
};

export const generateMindMapData = async (topic: string, content: string): Promise<MindMapNode> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a deep hierarchical decomposition of: TOPIC: "${topic}", CONTENT: "${content}" into a structured mind map.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          description: { type: Type.STRING },
          children: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
                children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type:Type.STRING}, label: {type:Type.STRING} }, required: ["id", "label"] } }
              },
              required: ["id", "label"]
            }
          }
        },
        required: ["id", "label"]
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text || "{}")) as MindMapNode;
};
