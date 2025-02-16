
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Canvas, Circle, Line, Rect, Text, TEvent } from "fabric";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Shape = "rectangle" | "circle" | "line" | "text";

const Learn = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape>("rectangle");
  const [text, setText] = useState("");
  const lineStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    setCanvas(fabricCanvas);

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleMouseDown = (event: TEvent) => {
    if (!canvas || !event.pointer) return;

    const pointer = event.pointer;

    if (selectedShape === "line") {
      lineStartRef.current = { x: pointer.x, y: pointer.y };
      return;
    }

    if (selectedShape === "rectangle") {
      const rect = new Rect({
        left: pointer.x - 50,
        top: pointer.y - 25,
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
        left: pointer.x - 25,
        top: pointer.y - 25,
        fill: "#e9ecef",
        radius: 25,
        stroke: "#495057",
        strokeWidth: 2,
      });
      canvas.add(circle);
    } else if (selectedShape === "text" && text) {
      const fabricText = new Text(text, {
        left: pointer.x,
        top: pointer.y,
        fontSize: 20,
        fill: "#212529",
      });
      canvas.add(fabricText);
    }

    canvas.renderAll();
  };

  const handleMouseMove = (event: TEvent) => {
    if (!canvas || !event.pointer || !lineStartRef.current || selectedShape !== "line") return;
  };

  const handleMouseUp = (event: TEvent) => {
    if (!canvas || !event.pointer || !lineStartRef.current || selectedShape !== "line") return;

    const line = new Line([
      lineStartRef.current.x,
      lineStartRef.current.y,
      event.pointer.x,
      event.pointer.y
    ], {
      stroke: "#495057",
      strokeWidth: 2,
    });

    canvas.add(line);
    canvas.renderAll();
    lineStartRef.current = null;
  };

  const handleClear = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
    toast("Canvas cleared!");
  };

  const handleDownload = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1 // Added the required multiplier property
    });
    
    const link = document.createElement("a");
    link.download = "diagram.png";
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("Diagram downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Learn - Diagram Creator</h1>
        
        <div className="mb-6 flex gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to add"
              className="w-64"
            />
          </div>
          
          <div className="space-x-2">
            <Button
              variant={selectedShape === "rectangle" ? "default" : "outline"}
              onClick={() => setSelectedShape("rectangle")}
            >
              Rectangle
            </Button>
            <Button
              variant={selectedShape === "circle" ? "default" : "outline"}
              onClick={() => setSelectedShape("circle")}
            >
              Circle
            </Button>
            <Button
              variant={selectedShape === "line" ? "default" : "outline"}
              onClick={() => setSelectedShape("line")}
            >
              Line
            </Button>
            <Button
              variant={selectedShape === "text" ? "default" : "outline"}
              onClick={() => setSelectedShape("text")}
            >
              Text
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              Download
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

export default Learn;
