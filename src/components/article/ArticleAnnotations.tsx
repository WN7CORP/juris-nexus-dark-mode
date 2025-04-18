
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileImage, Mic, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ArticleAnnotationsProps {
  articleId: string;
  lawName: string;
}

interface Annotation {
  id: string;
  text: string;
  timestamp: number;
}

export function ArticleAnnotations({ articleId, lawName }: ArticleAnnotationsProps) {
  const [notes, setNotes] = useState("");
  const [recordings, setRecordings] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [savedAnnotations, setSavedAnnotations] = useState<Annotation[]>([]);
  
  const localStorageKey = `annotations_${lawName}_${articleId}`;
  
  useEffect(() => {
    // Load existing annotations
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      setSavedAnnotations(JSON.parse(savedData));
    }
  }, [localStorageKey]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveAnnotation = () => {
    if (!notes.trim()) {
      toast({
        title: "Anotação vazia",
        description: "Por favor, escreva algo para salvar.",
        variant: "destructive"
      });
      return;
    }
    
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: notes,
      timestamp: Date.now()
    };
    
    const updatedAnnotations = [...savedAnnotations, newAnnotation];
    setSavedAnnotations(updatedAnnotations);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedAnnotations));
    
    setNotes("");
    toast({
      title: "Anotação salva!",
      description: "Sua anotação foi salva com sucesso."
    });
  };
  
  const deleteAnnotation = (id: string) => {
    const updatedAnnotations = savedAnnotations.filter(ann => ann.id !== id);
    setSavedAnnotations(updatedAnnotations);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedAnnotations));
    
    toast({
      title: "Anotação excluída",
      description: "A anotação foi removida com sucesso.",
      variant: "destructive"
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Anotações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Adicione suas anotações..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] bg-vade-darker/50 text-lg"
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <FileImage size={16} />
            Adicionar Imagem
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Mic size={16} />
            Gravar Áudio
          </Button>
          
          <Button
            variant="default"
            className="flex items-center gap-2 ml-auto"
            onClick={saveAnnotation}
          >
            <Save size={16} />
            Salvar
          </Button>
        </div>
        
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Anotação ${index + 1}`}
                className="rounded-lg w-full object-cover"
              />
            ))}
          </div>
        )}
        
        {savedAnnotations.length > 0 && (
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-lg font-medium">Anotações Salvas</h3>
            
            {savedAnnotations.map((annotation) => (
              <div key={annotation.id} className="bg-vade-darker/30 p-4 rounded-lg relative group">
                <p className="mb-4 whitespace-pre-wrap">{annotation.text}</p>
                <div className="text-xs text-white/60">
                  {new Date(annotation.timestamp).toLocaleString()}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteAnnotation(annotation.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
