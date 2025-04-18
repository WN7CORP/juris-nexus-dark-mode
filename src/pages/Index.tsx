
import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SearchView } from "@/components/views/SearchView";
import { AllLawsView } from "@/components/views/AllLawsView";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"search" | "all">("search");
  
  return (
    <Layout>
      <Tabs 
        defaultValue="search" 
        value={activeTab} 
        onValueChange={(val) => setActiveTab(val as "search" | "all")} 
        className="w-full"
      >
        <TabsContent value="search" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="search-animation"
          >
            <SearchView />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AllLawsView />
          </motion.div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
