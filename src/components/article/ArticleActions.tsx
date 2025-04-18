
import { Button } from "@/components/ui/button";
import { Play, Pause, Brain, Copy, Pencil } from "lucide-react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

interface ArticleActionsProps {
  onExplain: () => void;
  onNarrate: () => void;
  onAnnotate: () => void;
  isNarrating: boolean;
  onFavorite: () => void;
  isFavorited: boolean;
  showAnnotations: boolean;
}

export function ArticleActions({
  onExplain,
  onNarrate,
  onAnnotate,
  isNarrating,
  onFavorite,
  isFavorited,
  showAnnotations
}: ArticleActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={onExplain}
        className="flex items-center gap-1 bg-vade-purple-primary hover:bg-vade-purple-primary/80"
      >
        <Brain size={14} />
        Explicar
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNarrate}
        className="flex items-center gap-1"
      >
        {isNarrating ? <Pause size={14} /> : <Play size={14} />}
        {isNarrating ? "Pausar" : "Narrar"}
      </Button>
      
      <Button
        variant={showAnnotations ? "default" : "outline"}
        size="sm"
        onClick={onAnnotate}
        className="flex items-center gap-1"
      >
        <Pencil size={14} />
        Anotações
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onFavorite}
        className="flex items-center gap-1"
      >
        {isFavorited ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
        {isFavorited ? "Favoritado" : "Favoritar"}
      </Button>
    </div>
  );
}
