
import { useState, useEffect } from "react";
import { FaFont } from "react-icons/fa6";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function FontSizeButton() {
  const [fontSize, setFontSize] = useState(100); // 100% é o tamanho padrão
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  // Update font size in the root element
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-multiplier', `${fontSize / 100}`);
  }, [fontSize]);
  
  // Handle transparency behavior
  useEffect(() => {
    const handleScroll = () => {
      setLastInteraction(Date.now());
      setIsVisible(true);
    };
    
    const handleMouseMove = () => {
      setLastInteraction(Date.now());
      setIsVisible(true);
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Set up transparency timeout
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction > 5000 && !isActive) {
        setIsVisible(false);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [lastInteraction, isActive]);
  
  const changeFontSize = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
  };
  
  return (
    <Popover
      onOpenChange={(open) => {
        setIsActive(open);
        if (open) setIsVisible(true);
      }}
    >
      <PopoverTrigger asChild>
        <Button 
          className={`floating-btn h-12 w-12 bg-vade-purple-primary text-white left-5 bottom-5 transition-opacity duration-500 ${isVisible ? 'opacity-80 hover:opacity-100' : 'opacity-30'}`}
          aria-label="Ajustar tamanho da fonte"
          size="icon"
          onMouseEnter={() => setIsVisible(true)}
        >
          <FaFont className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 glass-panel" side="top">
        <div className="space-y-4">
          <h3 className="font-medium text-white">Tamanho da Fonte</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs">A</span>
            <Slider 
              value={[fontSize]} 
              onValueChange={changeFontSize} 
              min={80} 
              max={150} 
              step={5} 
              className="flex-1"
            />
            <span className="text-base font-bold">A</span>
          </div>
          <p className="text-xs text-white/70">
            Tamanho atual: {fontSize}%
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
