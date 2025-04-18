
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bot, Loader2 } from "lucide-react";
import { getArticleExplanation } from "@/services/geminiService";

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
  const [explanation, setExplanation] = useState("");
  const [practicalExample, setPracticalExample] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleExplain = async () => {
    setIsLoading(true);
    try {
      const response = await getArticleExplanation(articleNumber, articleText, lawName);
      setExplanation(response.explanation);
      setPracticalExample(response.practicalExample);
    } catch (error) {
      console.error("Erro ao obter explicação:", error);
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExplain}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : "Explicar"}
        </Button>
      </CardHeader>
      
      <CardContent>
        {explanation ? (
          <Tabs defaultValue="explanation" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explanation">Explicação</TabsTrigger>
              <TabsTrigger value="example">Exemplo Prático</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explanation" className="mt-4">
              <div className="prose prose-invert max-w-none">
                {explanation.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="example" className="mt-4">
              <div className="prose prose-invert max-w-none">
                {practicalExample.split('\n').map((line, index) => (
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
  );
}
