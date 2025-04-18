
// Serviço de narração de texto por voz
const apiKey = 'AIzaSyCX26cgIpSd-BvtOLDdEQFa28_wh_HX1uk';
const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
let audioElement: HTMLAudioElement | null = null;

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

const speak = async (text: string, onEnd?: () => void, onStart?: () => void): Promise<boolean> => {
  try {
    // Stop any ongoing speech first
    stop();
    
    const requestBody = {
      input: { text: processText(text) },
      voice: {
        languageCode: 'pt-BR',
        name: 'pt-BR-Wavenet-E'
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('Failed to generate speech');

    const data = await response.json();
    audioElement = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
    
    audioElement.onended = () => {
      if (onEnd) onEnd();
    };

    audioElement.onplay = () => {
      if (onStart) onStart();
    };

    await audioElement.play();
    return true;
  } catch (error) {
    console.error('Error in speech synthesis:', error);
    return false;
  }
};

const stop = () => {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement = null;
  }
};

export default {
  speak,
  processText,
  stop
};
