
// Serviço de narração de texto por voz

let speechSynthesis: SpeechSynthesis | null = null;
let speechUtterance: SpeechSynthesisUtterance | null = null;
let isPlaying = false;

// Inicializar o serviço
const init = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
    return true;
  }
  return false;
};

// Processar texto para narração
const processText = (text: string): string => {
  // Remover emojis
  text = text.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F77F}|\u{1F780}-\u{1F7FF}|\u{1F800}-\u{1F8FF}|\u{1F900}-\u{1F9FF}|\u{1FA00}-\u{1FA6F}|\u{1FA70}-\u{1FAFF}|\u{2702}-\u{27B0}|\u{24C2}-\u{1F251}]/gu, ' ');
  
  // Processamento de abreviações comuns
  text = text.replace(/art\./gi, 'artigo');
  text = text.replace(/§/g, 'parágrafo');
  text = text.replace(/inc\./gi, 'inciso');
  text = text.replace(/cf\./gi, 'conforme');
  
  // Processamento de números romanos
  const romanNumerals: Record<string, string> = {
    'I': 'um',
    'II': 'dois',
    'III': 'três',
    'IV': 'quatro',
    'V': 'cinco',
    'VI': 'seis',
    'VII': 'sete',
    'VIII': 'oito',
    'IX': 'nove',
    'X': 'dez',
    'XI': 'onze',
    'XII': 'doze',
    'XIII': 'treze',
    'XIV': 'quatorze',
    'XV': 'quinze',
    'XVI': 'dezesseis',
    'XVII': 'dezessete',
    'XVIII': 'dezoito',
    'XIX': 'dezenove',
    'XX': 'vinte'
  };
  
  // Substituir números romanos apenas quando estiverem isolados
  Object.keys(romanNumerals).forEach(roman => {
    text = text.replace(new RegExp(`\\b${roman}\\b`, 'g'), romanNumerals[roman]);
  });
  
  return text;
};

// Falar o texto
const speak = (text: string, onEnd?: () => void, onStart?: () => void): boolean => {
  if (!init()) return false;
  
  if (isPlaying) {
    stop();
  }
  
  const processedText = processText(text);
  
  speechUtterance = new SpeechSynthesisUtterance(processedText);
  
  // Selecionar voz em português se disponível
  if (speechSynthesis!.getVoices().length > 0) {
    const voices = speechSynthesis!.getVoices();
    const ptVoice = voices.find(voice => 
      voice.lang.includes('pt') || voice.lang.includes('PT')
    );
    
    if (ptVoice) {
      speechUtterance.voice = ptVoice;
    }
  }
  
  // Configurações da voz
  speechUtterance.rate = 1.0;  // velocidade normal
  speechUtterance.pitch = 1.0; // tom normal
  speechUtterance.volume = 1.0; // volume máximo
  speechUtterance.lang = 'pt-BR';
  
  // Eventos
  speechUtterance.onstart = () => {
    isPlaying = true;
    if (onStart) onStart();
  };
  
  speechUtterance.onend = () => {
    isPlaying = false;
    if (onEnd) onEnd();
  };
  
  speechUtterance.onerror = (event) => {
    console.error('Erro na narração:', event);
    isPlaying = false;
    if (onEnd) onEnd();
  };
  
  // Iniciar narração
  speechSynthesis!.speak(speechUtterance);
  return true;
};

// Pausar a narração
const pause = (): boolean => {
  if (!speechSynthesis || !isPlaying) return false;
  
  speechSynthesis.pause();
  isPlaying = false;
  return true;
};

// Resumir a narração
const resume = (): boolean => {
  if (!speechSynthesis || isPlaying) return false;
  
  speechSynthesis.resume();
  isPlaying = true;
  return true;
};

// Parar a narração
const stop = (): boolean => {
  if (!speechSynthesis) return false;
  
  speechSynthesis.cancel();
  isPlaying = false;
  return true;
};

// Verificar se está reproduzindo
const isNarrating = (): boolean => {
  return isPlaying;
};

export default {
  speak,
  pause,
  resume,
  stop,
  isNarrating
};
