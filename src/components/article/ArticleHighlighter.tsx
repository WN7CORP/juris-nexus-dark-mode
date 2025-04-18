
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { highlightService } from "@/services/highlightService";
import { toast } from "@/hooks/use-toast";

interface ArticleHighlighterProps {
  text: string;
  articleId: string;
  lawName: string;
  isHighlighting: boolean;
  highlightColor: string;
  onHighlightEnd: () => void;
}

export function ArticleHighlighter({
  text,
  articleId,
  lawName,
  isHighlighting,
  highlightColor,
  onHighlightEnd
}: ArticleHighlighterProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const applyHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;
    
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.backgroundColor = highlightColor;
    span.classList.add("highlighted-text");
    
    try {
      range.surroundContents(span);
      highlightService.saveHighlight({
        articleId,
        lawName,
        text: selection.toString(),
        color: highlightColor,
        timestamp: Date.now()
      });
      toast({
        title: "Texto grifado!",
        description: "O destaque foi salvo com sucesso."
      });
      onHighlightEnd();
    } catch (e) {
      console.error("Erro ao aplicar destaque:", e);
    }
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`article-text text-lg ${isHighlighting ? "cursor-pointer select-text" : ""}`}
        onClick={isHighlighting ? applyHighlight : undefined}
      >
        {text.split('\n').map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
      </div>
      
      <AnimatePresence>
        {isHighlighting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-0 right-0 flex justify-center z-50 px-4"
          >
            <div className="bg-vade-darker/95 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-white/10 flex items-center gap-2">
              <span className="text-sm text-white/80">Selecione o texto para grifar</span>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: highlightColor }} />
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={onHighlightEnd}
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
