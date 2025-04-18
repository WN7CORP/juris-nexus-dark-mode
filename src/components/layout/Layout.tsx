import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontSizeButton } from "../ui/FontSizeButton";
import { ScrollTopButton } from "../ui/ScrollTopButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, List } from "lucide-react";
interface LayoutProps {
  children: ReactNode;
}
export default function Layout({
  children
}: LayoutProps) {
  const [viewMode, setViewMode] = useState<"search" | "all">("search");
  return <div className="min-h-screen bg-vade-dark text-white flex flex-col">
      <header className="sticky top-0 z-50 shadow-md backdrop-blur-md bg-vade-darker/80 border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} className="flex items-center">
            <h1 className="font-serif font-bold text-gradient text-sm">
              VADE MECUM PRO
            </h1>
          </motion.div>
          
          <Tabs defaultValue="search" value={viewMode} onValueChange={val => setViewMode(val as "search" | "all")} className="ml-auto">
            <TabsList className="bg-vade-darker/80 border border-white/10">
              <TabsTrigger value="search" className="data-[state=active]:bg-vade-purple-primary data-[state=active]:text-white px-[27px]">
                <Search className="mr-2" /> Pesquisa
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-vade-purple-primary data-[state=active]:text-white">
                <List className="mr-2" /> Ver Tudo
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>
      
      <main className="flex-1 relative container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={viewMode} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }} className="w-full">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <FontSizeButton />
      <ScrollTopButton />
    </div>;
}