
import { useState } from "react";
import { Copy, Highlighter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Article } from "@/services/googleSheetsService";
import { toast } from "@/hooks/use-toast";
import speechService from "@/services/speechService";
import { ArticleActions } from "./ArticleActions";
import { ArticleHighlighter } from "./ArticleHighlighter";
import { ArticleAnnotations } from "./ArticleAnnotations";
import { ArticleAIExplanation } from "./ArticleAIExplanation";

interface ArticleCardProps {
  article: Article;
  lawName: string;
}

export function ArticleCard({ article, lawName }: ArticleCardProps) {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightColor, setHighlightColor] = useState("#FFEB3B");
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleNarration = () => {
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

  const handleCopy = () => {
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
  
  const toggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };
  
  const handleExplain = () => {
    setShowExplanation(true);
  };

  return (
    <Card className={article.isNumbered ? "article-card" : "mt-8 mb-4"}>
      {article.isNumbered && (
        <span className="article-number">Art. {article.number}</span>
      )}
      
      <CardContent className={article.isNumbered ? "pt-8" : "text-legislation"}>
        {/* Top Actions */}
        <div className="flex gap-2 mb-4">
          <ArticleActions
            onExplain={handleExplain}
            onNarrate={handleNarration}
            isNarrating={isNarrating}
            onFavorite={toggleFavorite}
            isFavorited={isFavorited}
            onAnnotate={toggleAnnotations}
            showAnnotations={showAnnotations}
          />
        </div>
        
        {/* Article Text with Highlighter */}
        <ArticleHighlighter
          text={article.text}
          articleId={article.number}
          lawName={lawName}
          isHighlighting={isHighlighting}
          highlightColor={highlightColor}
          onHighlightEnd={() => setIsHighlighting(false)}
        />
        
        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            <Copy size={14} />
            Copiar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHighlighting(true)}
            className="flex items-center gap-1"
          >
            <Highlighter size={14} />
            Grifar
          </Button>
        </div>
        
        {/* Annotations Component - Show when toggled */}
        {showAnnotations && (
          <ArticleAnnotations
            articleId={article.number}
            lawName={lawName}
          />
        )}
        
        {/* AI Explanation Component */}
        <ArticleAIExplanation
          articleNumber={article.number}
          articleText={article.text}
          lawName={lawName}
        />
      </CardContent>
    </Card>
  );
}
