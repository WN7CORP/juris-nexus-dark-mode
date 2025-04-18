
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, Brain, Lightbulb } from "lucide-react";
import { getArticleExplanation } from "@/services/geminiService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ArticleAIExplanationProps {
  articleNumber: string;
  articleText: string;
  lawName: string;
}

export function ArticleAIExplanation({
  articleNumber,
  articleText,
  lawName
}: ArticleAIExplanationProps) {
  const [technicalExplanation, setTechnicalExplanation] = useState("");
  const [simplifiedExplanation, setSimplifiedExplanation] = useState("");
  const [practicalExample, setPracticalExample] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("technical");
  
  const handleExplainTechnical = async () => {
    setIsLoading(true);
    try {
      const response = await getArticleExplanation(articleNumber, articleText, lawName, "technical");
      setTechnicalExplanation(response.explanation);
      setPracticalExample(response.practicalExample);
      setActiveTab("technical");
    } catch (error) {
      console.error("Erro ao obter explicação técnica:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExplainSimplified = async () => {
    setIsLoading(true);
    try {
      const response = await getArticleExplanation(articleNumber, articleText, lawName, "simplified");
      setSimplifiedExplanation(response.explanation);
      setPracticalExample(response.practicalExample);
      setActiveTab("simplified");
    } catch (error) {
      console.error("Erro ao obter explicação simplificada:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Bot size={24} className="text-vade-purple-primary animate-pulse-soft" />
          <span className="text-gradient">Explicação Gemini</span>
        </CardTitle>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : "Explicar"}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-vade-darker border-vade-purple-primary/20">
            <DialogHeader>
              <DialogTitle>Escolha o tipo de explicação</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col space-y-4 py-4">
              <Button 
                className="flex items-center gap-2" 
                onClick={handleExplainTechnical}
                disabled={isLoading}
              >
                <Brain size={18} />
                Técnica
                <span className="text-xs text-muted-foreground">(Para profissionais)</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleExplainSimplified}
                disabled={isLoading}
              >
                <Lightbulb size={18} />
                Simplificada
                <span className="text-xs text-muted-foreground">(Para leigos)</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {(technicalExplanation || simplifiedExplanation) ? (
          <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {technicalExplanation && (
                <TabsTrigger value="technical" onClick={() => setActiveTab("technical")}>Técnica</TabsTrigger>
              )}
              {simplifiedExplanation && (
                <TabsTrigger value="simplified" onClick={() => setActiveTab("simplified")}>Simplificada</TabsTrigger>
              )}
              <TabsTrigger value="example">Exemplo Prático</TabsTrigger>
            </TabsList>
            
            {technicalExplanation && (
              <TabsContent value="technical" className="mt-4">
                <div className="prose prose-invert max-w-none">
                  {technicalExplanation.split('\n').map((line, index) => (
                    <p key={index} className="mb-4">{line}</p>
                  ))}
                </div>
              </TabsContent>
            )}
            
            {simplifiedExplanation && (
              <TabsContent value="simplified" className="mt-4">
                <div className="prose prose-invert max-w-none">
                  {simplifiedExplanation.split('\n').map((line, index) => (
                    <p key={index} className="mb-4">{line}</p>
                  ))}
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="example" className="mt-4">
              <div className="prose prose-invert max-w-none">
                {practicalExample.split('\n').map((line, index) => (
                  <p key={index} className="mb-4">{line}</p>
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
  );
}
