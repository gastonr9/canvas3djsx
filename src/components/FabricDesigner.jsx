import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import textura from "../assets/3d/tshirt.png";
const FabricDesigner = ({ onUpdateImage }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 512,
      height: 512,
      backgroundColor: "#df3",
    });

    const imageUrl = textura; // Imagen inicial
    fabric.FabricImage.fromURL(imageUrl, (img) => {
      img.set({ left: 0, top: 0, scaleX: 1, scaleY: 1 });
      canvas.add(img);
      canvas.setActiveObject(img);
    });

    const updateTexture = () => {
      const dataURL = canvas.toDataURL({ format: "png" });
      onUpdateImage(dataURL);
    };

    canvas.on("object:modified", updateTexture);
    canvas.on("object:scaling", updateTexture);
    canvas.on("object:moving", updateTexture);
    canvas.on("object:added", updateTexture);

    // Guardar la instancia de canvas para usarla en el handler
    window._fabricCanvas = canvas;

    return () => canvas.dispose();
  }, [onUpdateImage]);

  // Handler para subir imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (f) {
      const data = f.target.result;
      const canvas = window._fabricCanvas;
      fabric.FabricImage.fromURL(data, (img) => {
        img.set({ left: 50, top: 50, scaleX: 1, scaleY: 1 });
        canvas.add(img);
        canvas.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <button onClick={() => fileInputRef.current.click()}>Subir imagen</button>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
    </div>
  );
};

export default FabricDesigner;
