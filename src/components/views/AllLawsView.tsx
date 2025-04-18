
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLawList, useLawArticles } from "@/services/googleSheetsService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { ScrollText, BookmarkIcon, PencilIcon, Highlighter } from "lucide-react";
import { highlightService } from "@/services/highlightService";

export function AllLawsView() {
  const [view, setView] = useState<"laws" | "favorites" | "annotations">("laws");
  const { laws, loading: loadingLaws } = useLawList();
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const [selectedLawName, setSelectedLawName] = useState<string>("");
  const { articles, loading: loadingArticles } = useLawArticles(selectedLaw ? selectedLawName : null);
  
  const handleSelectLaw = (lawName: string) => {
    setSelectedLaw(lawName);
    setSelectedLawName(lawName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleBack = () => {
    setSelectedLaw(null);
    setSelectedLawName("");
  };
  
  // Get only the most recent highlights (last 10)
  const getRecentHighlights = () => {
    const allHighlights = highlightService.getHighlights();
    return allHighlights
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  };
  
  // Get stored favorites from localStorage
  const getFavorites = () => {
    const favoritesKey = "article_favorites";
    const storedFavorites = localStorage.getItem(favoritesKey);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  };
  
  const renderContent = () => {
    switch (view) {
      case "favorites":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-gradient">Artigos Favoritados</h2>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4">
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <BookmarkIcon className="text-vade-purple-primary" />
                    <h3 className="text-lg font-medium">Seus Favoritos</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Aqui você encontrará todos os artigos que você marcou como favorito.
                    Os favoritos ficarão disponíveis para acesso rápido.
                  </p>
                </CardContent>
              </Card>
              
              {/* Display favorite articles */}
              {getFavorites().length > 0 ? (
                getFavorites().map((favorite: any, index: number) => (
                  <Card key={index} className="p-4">
                    <CardContent>
                      <h4 className="font-medium mb-2">{favorite.lawName} - Art. {favorite.articleId}</h4>
                      <p className="text-muted-foreground line-clamp-3">{favorite.text}</p>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            if (favorite.lawName) {
                              handleSelectLaw(favorite.lawName);
                              setView("laws");
                            }
                          }}
                        >
                          Ver artigo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <BookmarkIcon className="mx-auto mb-2 h-12 w-12 opacity-30" />
                  <p>Nenhum artigo favoritado ainda</p>
                  <p className="text-sm">Favorita artigos para acessá-los rapidamente</p>
                </div>
              )}
            </div>
          </div>
        );
      case "annotations":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-serif text-gradient">Minhas Anotações</h2>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4">
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <PencilIcon className="text-vade-purple-primary" />
                    <h3 className="text-lg font-medium">Suas Anotações</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Aqui você encontrará todas as suas anotações e destaques realizados nos artigos.
                  </p>
                </CardContent>
              </Card>
              
              {/* Display highlighted texts - only the most recent ones */}
              <div className="space-y-4">
                {getRecentHighlights().length > 0 ? (
                  getRecentHighlights().map((highlight, index) => (
                    <Card key={index} className="p-4">
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          {highlight.lawName} - Art. {highlight.articleId}
                        </p>
                        <div className="p-3 rounded-md" style={{ backgroundColor: highlight.color + '40' }}>
                          <p className="italic">"{highlight.text}"</p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(highlight.timestamp).toLocaleString()}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              if (highlight.lawName) {
                                handleSelectLaw(highlight.lawName);
                                setView("laws");
                              }
                            }}
                          >
                            Ver artigo
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Highlighter className="mx-auto mb-2 h-12 w-12 opacity-30" />
                    <p>Nenhuma anotação ou destaque ainda</p>
                    <p className="text-sm">Grifar textos para destacar pontos importantes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <motion.div
            key="law-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2 mb-4">
              <h2 className="text-xl font-serif text-gradient">Leis Disponíveis</h2>
              <p className="text-white/60 mt-1">Selecione uma lei para visualizar seus artigos.</p>
            </div>
            
            {loadingLaws ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl bg-vade-darker/70" />
              ))
            ) : (
              laws.map((law) => (
                <motion.div
                  key={law.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="card-neo cursor-pointer h-full"
                    onClick={() => handleSelectLaw(law.name)}
                  >
                    <CardContent className="flex items-center p-6 h-full">
                      <div className="mr-4">
                        <ScrollText className="h-8 w-8 text-vade-purple-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{law.name}</h3>
                        <p className="text-sm text-white/60">
                          {law.description || "Clique para visualizar os artigos"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button
          variant={view === "laws" ? "default" : "outline"}
          onClick={() => setView("laws")}
        >
          Leis
        </Button>
        <Button
          variant={view === "favorites" ? "default" : "outline"}
          onClick={() => setView("favorites")}
        >
          Favoritos
        </Button>
        <Button
          variant={view === "annotations" ? "default" : "outline"}
          onClick={() => setView("annotations")}
        >
          Anotações
        </Button>
      </div>
      {renderContent()}
    </div>
  );
}
