
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLawList, useLawArticles } from "@/services/googleSheetsService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { ScrollText } from "lucide-react";

export function AllLawsView() {
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
  
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedLaw ? (
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
        ) : (
          <motion.div
            key="articles-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-vade-purple-primary/20"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              </div>
              <h2 className="text-xl font-serif text-gradient">{selectedLawName}</h2>
              <div className="w-20" /> {/* Espaçador */}
            </div>
            
            {loadingArticles ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-vade-purple-primary mb-4" />
                <p className="text-white/70">Carregando artigos...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <div key={index}>
                    <ArticleCard 
                      article={article} 
                      lawName={selectedLawName} 
                    />
                  </div>
                ))}
                
                {articles.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-vade-purple-primary/30 mb-4" />
                    <p className="text-white/70">Nenhum artigo encontrado nesta lei.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
