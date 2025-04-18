
import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed right-5 bottom-5 z-50"
        >
          <Button 
            onClick={scrollToTop}
            className="floating-btn h-12 w-12 bg-vade-darker text-white"
            size="icon"
            aria-label="Voltar ao topo"
          >
            <FaArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
