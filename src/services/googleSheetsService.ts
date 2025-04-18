
import { useState, useEffect } from 'react';

// Configuração da API
const API_KEY = 'AIzaSyDvJ23IolKwjdxAnTv7l8DwLuwGRZ_tIR8';
const SPREADSHEET_ID = '1rctu_xg4P0KkMWKbzu7-mgJp-HjCu-cT8DZqNAzln-s';

// Interface para as leis carregadas das abas
export interface Law {
  id: string;
  name: string;
  description?: string;
}

// Interface para os artigos
export interface Article {
  number: string;
  text: string;
  isNumbered: boolean; // Para diferenciar textos numerados e não numerados
}

// Função para buscar todas as abas da planilha (leis disponíveis)
export async function fetchLawList(): Promise<Law[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Erro ao buscar as abas da planilha');
    }
    
    const data = await response.json();
    return data.sheets.map((sheet: any) => ({
      id: sheet.properties.sheetId.toString(),
      name: sheet.properties.title
    }));
  } catch (error) {
    console.error('Erro ao buscar lista de leis:', error);
    throw error;
  }
}

// Função para buscar artigos de uma lei específica
export async function fetchLawArticles(sheetName: string): Promise<Article[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}!A:B?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar artigos da lei ${sheetName}`);
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Converter as linhas em objetos de artigos
    return rows.map((row: any[]) => {
      const hasNumber = row[0] && row[0].trim() !== '';
      return {
        number: hasNumber ? row[0] : '',
        text: row[1] || '',
        isNumbered: hasNumber
      };
    });
  } catch (error) {
    console.error(`Erro ao buscar artigos da lei ${sheetName}:`, error);
    throw error;
  }
}

// Função para buscar um artigo específico por número
export async function fetchArticleByNumber(sheetName: string, articleNumber: string): Promise<Article | null> {
  try {
    const articles = await fetchLawArticles(sheetName);
    const article = articles.find(art => 
      art.isNumbered && art.number?.toString().trim() === articleNumber.trim()
    );
    
    return article || null;
  } catch (error) {
    console.error(`Erro ao buscar artigo ${articleNumber} da lei ${sheetName}:`, error);
    throw error;
  }
}

// Hook para carregar a lista de leis
export function useLawList() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadLaws() {
      try {
        setLoading(true);
        const lawList = await fetchLawList();
        setLaws(lawList);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
    
    loadLaws();
  }, []);
  
  return { laws, loading, error };
}

// Hook para carregar artigos de uma lei
export function useLawArticles(sheetName: string | null) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadArticles() {
      if (!sheetName) return;
      
      try {
        setLoading(true);
        const articlesList = await fetchLawArticles(sheetName);
        setArticles(articlesList);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
    
    loadArticles();
  }, [sheetName]);
  
  return { articles, loading, error };
}
