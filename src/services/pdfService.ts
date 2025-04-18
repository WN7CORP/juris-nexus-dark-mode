
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Article } from './googleSheetsService';

interface ExportParams {
  article: Article;
  lawName: string;
  explanation?: string;
  practicalExample?: string;
  userNotes?: string;
}

export async function generateArticlePDF(params: ExportParams): Promise<string> {
  const { article, lawName, explanation, practicalExample, userNotes } = params;
  
  // Criar um elemento temporário para renderizar o conteúdo do PDF
  const element = document.createElement('div');
  element.className = 'pdf-container';
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.width = '800px';
  
  // Montar o conteúdo HTML do PDF
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #9b87f5; font-size: 22px; margin-bottom: 5px;">VADE MECUM PRO</h1>
      <h2 style="color: #444; font-size: 18px; margin-top: 0;">${lawName}</h2>
    </div>
    
    <div style="margin-bottom: 30px; padding: 15px; background-color: #f8f8f8; border-left: 4px solid #9b87f5;">
      <h3 style="color: #333; margin-top: 0;">A. ARTIGO ${article.number}</h3>
      <div style="font-size: 16px; line-height: 1.5;">
        ${article.text.split('\n').map(line => `<p>${line}</p>`).join('')}
      </div>
    </div>
    
    ${explanation ? `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">B. BASE LEGAL</h3>
        <div style="font-size: 14px; line-height: 1.5; color: #333;">
          ${explanation.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
      </div>
    ` : ''}
    
    ${practicalExample ? `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">T. TEORIA E EXEMPLO PRÁTICO</h3>
        <div style="font-size: 14px; line-height: 1.5; color: #333;">
          ${practicalExample.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
      </div>
    ` : ''}
    
    ${userNotes ? `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">N. NOTAS</h3>
        <div style="font-size: 14px; font-style: italic; line-height: 1.5; color: #555;">
          ${userNotes.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
      </div>
    ` : ''}
    
    <div style="text-align: center; font-size: 10px; color: #888; margin-top: 30px;">
      <p>Documento gerado pelo VADE MECUM PRO - ${new Date().toLocaleDateString()}</p>
    </div>
  `;
  
  document.body.appendChild(element);
  
  try {
    // Converter o HTML para canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    // Criar um novo documento PDF
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    
    // Gerar o PDF como uma URL de dados
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  } finally {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

export default {
  generateArticlePDF,
};
