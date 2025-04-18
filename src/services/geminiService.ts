
import { GoogleGenerativeAI } from "@google/generative-ai";

// Esta é uma chave de API pública para demonstração. Em produção, use variáveis de ambiente.
// https://makersuite.google.com/app/apikey
const API_KEY = "AIzaSyDvJ23IolKwjdxAnTv7l8DwLuwGRZ_tIR8";
const MODEL_NAME = "gemini-pro";

// Inicializar a API do Gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

interface GeminiResponse {
  explanation: string;
  practicalExample: string;
}

// Prompt para explicação técnica de artigo
const getTechnicalExplanationPrompt = (articleNumber: string, articleText: string, lawName: string) => `
Como especialista jurídico, forneça uma explicação técnica e aprofundada do seguinte artigo:

Lei: ${lawName}
Artigo ${articleNumber}: ${articleText}

Explique o artigo de forma técnica e detalhada, voltada a profissionais do Direito, considerando:
1. O significado e interpretação jurídica
2. Conceitos importantes e termos técnicos presentes no texto
3. Implicações legais e doutrinárias
4. Contexto na legislação brasileira e jurisprudência relevante

Use linguagem técnica-jurídica apropriada para profissionais da área.
`;

// Prompt para explicação simplificada de artigo
const getSimplifiedExplanationPrompt = (articleNumber: string, articleText: string, lawName: string) => `
Como especialista jurídico, forneça uma explicação simples e acessível do seguinte artigo:

Lei: ${lawName}
Artigo ${articleNumber}: ${articleText}

Explique o artigo de forma simplificada, para leigos em Direito, considerando:
1. O significado básico do artigo em linguagem cotidiana
2. Explicação de termos jurídicos de forma simples
3. Implicações práticas para cidadãos comuns
4. Por que esta lei existe e como afeta a vida das pessoas

Evite termos técnicos e use analogias sempre que possível para facilitar a compreensão.
`;

// Prompt para exemplo prático
const getPracticalExamplePrompt = (articleNumber: string, articleText: string, lawName: string) => `
Como especialista jurídico, forneça um exemplo prático e concreto de aplicação do seguinte artigo:

Lei: ${lawName}
Artigo ${articleNumber}: ${articleText}

Elabore um cenário real e específico onde este artigo seria aplicado, ilustrando:
1. A situação detalhada com personagens e contexto
2. Como o artigo se aplica a esta situação específica
3. O resultado ou consequência jurídica
4. Se possível, mencione um caso real ou jurisprudência relevante

Seja didático e específico no exemplo, utilizando uma linguagem acessível.
`;

// Função para explicar um artigo e fornecer exemplo prático
export async function getArticleExplanation(
  articleNumber: string, 
  articleText: string, 
  lawName: string,
  type: "technical" | "simplified" = "technical"
): Promise<GeminiResponse> {
  try {
    // Seleciona o prompt baseado no tipo de explicação solicitada
    const explanationPrompt = type === "technical" 
      ? getTechnicalExplanationPrompt(articleNumber, articleText, lawName)
      : getSimplifiedExplanationPrompt(articleNumber, articleText, lawName);
    
    // Solicita explicação
    const explanationResult = await model.generateContent(explanationPrompt);
    const explanation = explanationResult.response.text();

    // Solicita exemplo prático
    const exampleResult = await model.generateContent(
      getPracticalExamplePrompt(articleNumber, articleText, lawName)
    );
    const practicalExample = exampleResult.response.text();

    return {
      explanation,
      practicalExample
    };
  } catch (error) {
    console.error("Erro ao solicitar resposta do Gemini:", error);
    return {
      explanation: "Não foi possível gerar uma explicação para este artigo no momento.",
      practicalExample: "Não foi possível gerar um exemplo prático para este artigo no momento."
    };
  }
}

// Função para responder dúvidas sobre um artigo
export async function askQuestionAboutArticle(
  question: string,
  articleNumber: string,
  articleText: string,
  lawName: string
): Promise<string> {
  try {
    const prompt = `
Como especialista jurídico, responda à seguinte dúvida sobre este artigo:

Lei: ${lawName}
Artigo ${articleNumber}: ${articleText}

Dúvida do usuário: ${question}

Forneça uma resposta clara, didática e juridicamente precisa, baseada especificamente no contexto deste artigo.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao solicitar resposta para dúvida:", error);
    return "Não foi possível obter uma resposta para sua dúvida no momento. Por favor, tente novamente mais tarde.";
  }
}

// Função para gerar anotações automáticas
export async function generateAutomaticNotes(
  articleNumber: string,
  articleText: string,
  lawName: string
): Promise<string> {
  try {
    const prompt = `
Como especialista jurídico, gere anotações estruturadas sobre o seguinte artigo:

Lei: ${lawName}
Artigo ${articleNumber}: ${articleText}

Crie anotações didáticas e organizadas que incluam:
1. Pontos principais do artigo
2. Palavras-chave e conceitos importantes
3. Conexões com outros princípios ou normas jurídicas
4. Possíveis interpretações 
5. Dicas para memorização

Organize as anotações de forma clara e objetiva, como um resumo estruturado para estudo.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Erro ao gerar anotações automáticas:", error);
    return "Não foi possível gerar anotações automáticas para este artigo no momento.";
  }
}

export default {
  getArticleExplanation,
  askQuestionAboutArticle,
  generateAutomaticNotes
};
