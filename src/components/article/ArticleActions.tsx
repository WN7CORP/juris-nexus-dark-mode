
import { Button } from "@/components/ui/button";
import { Play, Pause, Bot } from "lucide-react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

interface ArticleActionsProps {
  onExplain: () => void;
  onNarrate: () => void;
  isNarrating: boolean;
  onFavorite: () => void;
  isFavorited: boolean;
}

export function ArticleActions({
  onExplain,
  onNarrate,
  isNarrating,
  onFavorite,
  isFavorited
}: ArticleActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={onExplain}
        className="flex items-center gap-1 bg-vade-purple-primary hover:bg-vade-purple-primary/80"
      >
        <Bot size={14} />
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
