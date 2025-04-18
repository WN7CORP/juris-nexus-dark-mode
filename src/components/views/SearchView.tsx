
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLawList, fetchArticleByNumber, Article } from "@/services/googleSheetsService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Search, Bot, Loader2 } from "lucide-react";

export function SearchView() {
  const { laws, loading: loadingLaws } = useLawList();
  const [selectedLaw, setSelectedLaw] = useState<string | null>(null);
  const [articleNumber, setArticleNumber] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [foundArticle, setFoundArticle] = useState<Article | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const selectedLawName = laws.find(law => law.id === selectedLaw)?.name || "";
  
  const searchArticle = async () => {
    if (!selectedLaw || !articleNumber.trim()) {
      setSearchError("Selecione uma lei e informe o número do artigo.");
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    setFoundArticle(null);
    
    try {
      const lawName = laws.find(law => law.id === selectedLaw)?.name || "";
      const article = await fetchArticleByNumber(lawName, articleNumber);
      
      if (article) {
        setFoundArticle(article);
      } else {
        setSearchError(`Artigo ${articleNumber} não encontrado na lei ${lawName}.`);
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      setSearchError("Ocorreu um erro na busca. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-vade-purple-primary/10 to-transparent opacity-50 pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lei</label>
            <Select 
              value={selectedLaw || ""} 
              onValueChange={setSelectedLaw}
              disabled={loadingLaws}
            >
              <SelectTrigger className="bg-vade-darker border-white/10">
                <SelectValue placeholder="Selecione a lei" />
              </SelectTrigger>
              <SelectContent className="bg-vade-darker border-white/10">
                {laws.map(law => (
                  <SelectItem key={law.id} value={law.id}>
                    {law.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Artigo</label>
            <Input 
              type="text" 
              placeholder="Número do artigo" 
              value={articleNumber}
              onChange={e => setArticleNumber(e.target.value)}
              className="bg-vade-darker border-white/10"
              disabled={isSearching}
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={searchArticle}
              className="btn-primary w-full"
              disabled={isSearching || !selectedLaw || !articleNumber.trim()}
            >
              {isSearching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Buscar
            </Button>
          </div>
        </div>
        
        {searchError && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-3 bg-destructive/20 border border-destructive/50 rounded-md text-sm"
          >
            {searchError}
          </motion.div>
        )}
      </motion.div>
      
      <AnimatePresence>
        {foundArticle ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-serif">
              <span className="text-vade-purple-light">{selectedLawName}</span>
            </h2>
            <ArticleCard article={foundArticle} lawName={selectedLawName} />
          </motion.div>
        ) : !isSearching && !searchError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bot className="mx-auto h-16 w-16 text-vade-purple-primary/30 mb-4" />
            <h2 className="text-xl font-medium text-white/80 mb-2">Bem-vindo ao VADE MECUM PRO</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Selecione uma lei e informe o número do artigo para começar a busca.
              Todos os artigos contam com explicações detalhadas do Gemini.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
