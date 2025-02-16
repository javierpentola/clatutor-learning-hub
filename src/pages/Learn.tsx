
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Canvas, Circle, Line, Rect, Text } from "fabric";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Square, Circle as CircleIcon, Minus, Type, Trash2, Download } from "lucide-react";

type Shape = "rectangle" | "circle" | "line" | "text" | "draw";

const Draw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape>("draw");
  const [text, setText] = useState("");
  const lineStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#495057";
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;
    canvas.isDrawingMode = selectedShape === "draw";
  }, [selectedShape, canvas]);

  const handleCanvasClick = (e: MouseEvent) => {
    if (!canvas || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedShape === "rectangle") {
      const rect = new Rect({
        left: x - 50,
        top: y - 25,
        fill: "#e9ecef",
        width: 100,
        height: 50,
        stroke: "#495057",
        strokeWidth: 2,
        rx: 8,
        ry: 8,
      });
      canvas.add(rect);
    } else if (selectedShape === "circle") {
      const circle = new Circle({
        left: x - 25,
        top: y - 25,
        fill: "#e9ecef",
        radius: 25,
        stroke: "#495057",
        strokeWidth: 2,
      });
      canvas.add(circle);
    } else if (selectedShape === "text" && text) {
      const fabricText = new Text(text, {
        left: x,
        top: y,
        fontSize: 20,
        fill: "#212529",
      });
      canvas.add(fabricText);
    }

    canvas.renderAll();
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    canvasElement.addEventListener("click", handleCanvasClick);
    return () => {
      canvasElement.removeEventListener("click", handleCanvasClick);
    };
  }, [canvas, selectedShape, text]);

  const handleClear = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
    toast("¡Lienzo limpiado!");
  };

  const handleDownload = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement("a");
    link.download = "notas.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("¡Notas descargadas!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Modo Dibujo - Toma notas visuales</h1>
        
        <div className="mb-6 flex gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="text">Texto</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe el texto a añadir"
              className="w-64"
            />
          </div>
          
          <div className="space-x-2">
            <Button
              variant={selectedShape === "draw" ? "default" : "outline"}
              onClick={() => setSelectedShape("draw")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Dibujo Libre
            </Button>
            <Button
              variant={selectedShape === "rectangle" ? "default" : "outline"}
              onClick={() => setSelectedShape("rectangle")}
            >
              <Square className="w-4 h-4 mr-2" />
              Rectángulo
            </Button>
            <Button
              variant={selectedShape === "circle" ? "default" : "outline"}
              onClick={() => setSelectedShape("circle")}
            >
              <CircleIcon className="w-4 h-4 mr-2" />
              Círculo
            </Button>
            <Button
              variant={selectedShape === "text" ? "default" : "outline"}
              onClick={() => setSelectedShape("text")}
            >
              <Type className="w-4 h-4 mr-2" />
              Texto
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Descargar
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <canvas ref={canvasRef} className="border border-gray-200 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
};

export default Draw;
