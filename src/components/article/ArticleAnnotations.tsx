
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileImage, Mic } from "lucide-react";

interface ArticleAnnotationsProps {
  articleId: string;
  lawName: string;
}

export function ArticleAnnotations({ articleId, lawName }: ArticleAnnotationsProps) {
  const [notes, setNotes] = useState("");
  const [recordings, setRecordings] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

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

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Anotações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Adicione suas anotações..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] bg-vade-darker/50"
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
      </CardContent>
    </Card>
  );
}
