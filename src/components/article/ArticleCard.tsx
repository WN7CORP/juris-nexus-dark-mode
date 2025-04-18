
import { useState } from "react";
import { Play, Pause, Copy, Bookmark, Highlighter, Bot, FileText, FileOutput, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/services/googleSheetsService";
import speechService from "@/services/speechService";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaHighlighter, FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { getArticleExplanation, askQuestionAboutArticle } from "@/services/geminiService";

interface ArticleCardProps {
  article: Article;
  lawName: string;
  onExport?: () => void;
}

export function ArticleCard({ article, lawName, onExport }: ArticleCardProps) {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#FFEB3B");
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiExample, setAiExample] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  const toggleNarration = () => {
    if (isNarrating) {
      speechService.stop();
      setIsNarrating(false);
    } else {
      speechService.speak(
        article.text, 
        () => setIsNarrating(false),
        () => setIsNarrating(true)
      );
    }
  };

  const copyArticleText = () => {
    navigator.clipboard.writeText(article.text);
    toast({
      title: "Texto copiado!",
      description: "O texto do artigo foi copiado para a área de transferência."
    });
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: !isFavorited ? "Artigo favoritado!" : "Artigo removido dos favoritos",
      variant: !isFavorited ? "default" : "destructive"
    });
  };

  const getGeminiExplanation = async () => {
    if (aiExplanation && aiExample) return;
    
    setIsLoadingAI(true);
    try {
      const response = await getArticleExplanation(
        article.number,
        article.text,
        lawName
      );
      
      setAiExplanation(response.explanation);
      setAiExample(response.practicalExample);
    } catch (error) {
      console.error("Erro ao obter explicação:", error);
      toast({
        title: "Erro ao carregar explicação",
        description: "Não foi possível obter a explicação no momento. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const submitQuestion = async () => {
    if (!userQuestion.trim()) return;
    
    setIsSubmittingQuestion(true);
    try {
      const answer = await askQuestionAboutArticle(
        userQuestion,
        article.number,
        article.text,
        lawName
      );
      
      setAiAnswer(answer);
    } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
      toast({
        title: "Erro ao processar pergunta",
        description: "Não foi possível obter uma resposta no momento. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const enableHighlighting = () => {
    setIsHighlighting(true);
  };

  const applyHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;
    
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.backgroundColor = highlightColor;
    span.classList.add("highlighted-text");
    
    try {
      range.surroundContents(span);
      setIsHighlighting(false);
    } catch (e) {
      console.error("Erro ao aplicar destaque:", e);
      toast({
        title: "Não foi possível destacar o texto",
        description: "Tente selecionar um texto contínuo, sem incluir outros destaques.",
        variant: "destructive"
      });
    }
  };

  const renderArticleText = () => {
    return article.text.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (
    <>
      <Card className={article.isNumbered ? "article-card" : "mt-8 mb-4"}>
        {article.isNumbered && (
          <span className="article-number">Art. {article.number}</span>
        )}
        
        <CardContent className={article.isNumbered ? "pt-8" : "text-legislation"}>
          <div 
            className={`article-text text-lg ${isHighlighting ? "cursor-pointer select-text" : ""}`}
            onClick={isHighlighting ? applyHighlight : undefined}
          >
            {renderArticleText()}
          </div>
          
          {article.isNumbered && (
            <div className="flex flex-wrap gap-2 justify-between items-center mt-4 border-t border-white/10 pt-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={toggleNarration}
                >
                  {isNarrating ? <Pause size={14} /> : <Play size={14} />}
                  {isNarrating ? "Pausar" : "Narrar"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={copyArticleText}
                >
                  <Copy size={14} />
                  Copiar
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={enableHighlighting}
                    >
                      <Highlighter size={14} />
                      Destacar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 glass-panel">
                    <div className="space-y-4">
                      <h3 className="font-medium text-white">Cor do Destaque</h3>
                      <div className="grid grid-cols-5 gap-2">
                        {["#FFEB3B", "#4CAF50", "#2196F3", "#E91E63", "#FF9800"].map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-white/20"
                            style={{ backgroundColor: color }}
                            onClick={() => setHighlightColor(color)}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsHighlighting(false)}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={enableHighlighting}
                        >
                          Selecionar Texto
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={toggleFavorite}
                >
                  {isFavorited ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
                  {isFavorited ? "Favoritado" : "Favoritar"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {article.isNumbered && (
        <div className="mt-6 space-y-6">
          <Card className="gemini-feature overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Bot size={24} className="text-vade-purple-primary animate-pulse-soft" />
                <span className="text-gradient">Explicação Gemini</span>
              </CardTitle>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getGeminiExplanation}
                disabled={isLoadingAI}
              >
                {isLoadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : "Explicar"}
              </Button>
            </CardHeader>
            
            <CardContent>
              {isLoadingAI ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-vade-purple-primary mb-2" />
                  <p className="text-vade-purple-light animate-pulse">Gerando explicação...</p>
                </div>
              ) : aiExplanation ? (
                <Tabs defaultValue="explanation" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="explanation">Explicação</TabsTrigger>
                    <TabsTrigger value="example">Exemplo Prático</TabsTrigger>
                  </TabsList>
                  <TabsContent value="explanation" className="mt-4">
                    <div className="prose prose-invert max-w-none">
                      {aiExplanation.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="example" className="mt-4">
                    <div className="prose prose-invert max-w-none">
                      {aiExample.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bot size={36} className="text-vade-purple-primary mb-3" />
                  <p className="text-lg font-medium">Solicite uma explicação detalhada</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique em "Explicar" para obter uma análise jurídica e um exemplo prático deste artigo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-neo">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={20} />
                  Anotações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Adicione suas anotações sobre este artigo..."
                  className="min-h-[150px] bg-vade-darker/50"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <div className="flex flex-col gap-4">
              <Card className="card-neo flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle size={20} />
                    Dúvidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setQuestionDialogOpen(true)}
                    variant="default" 
                    className="w-full"
                  >
                    Perguntar ao Gemini
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="card-neo flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileOutput size={20} />
                    Exportar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={onExport} 
                    variant="default" 
                    className="w-full"
                  >
                    Exportar como PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="glass-panel max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <HelpCircle size={22} />
              Pergunte ao Gemini
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea 
              placeholder="Digite sua dúvida sobre este artigo..."
              className="min-h-[100px] bg-vade-darker/50"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              disabled={isSubmittingQuestion}
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={submitQuestion} 
                className="btn-primary"
                disabled={!userQuestion.trim() || isSubmittingQuestion}
              >
                {isSubmittingQuestion ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                ) : <Bot className="mr-2" />}
                Enviar Pergunta
              </Button>
            </div>
            
            {aiAnswer && (
              <div className="mt-4 p-4 rounded-lg bg-vade-darker/70 border border-vade-purple-primary/30">
                <h3 className="mb-2 font-medium text-gradient">Resposta:</h3>
                <div className="prose prose-invert max-w-none text-sm">
                  {aiAnswer.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AnimatePresence>
        {isHighlighting && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-0 right-0 flex justify-center z-50 px-4"
          >
            <div className="bg-vade-darker/95 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-white/10 flex items-center gap-2">
              <span className="text-sm text-white/80">Selecione o texto para destacar</span>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: highlightColor }} />
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setIsHighlighting(false)}
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
