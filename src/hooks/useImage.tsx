import React, { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasContext } from "../context/canvasContext";

/*
 * This hook is responsible for handling the image upload event.
 * The hook receives the canvasRef prop to set the canvas reference.
 * The hook returns the handleImageUpload function, which is used to handle the image upload event.
 * The handleImageUpload function is responsible for creating a new Image object and setting the image source to the uploaded image.
 * The handleImageUpload function also sets the canvas reference and draws the image on the canvas.
 * The hook also returns the image ref, which is used to store the uploaded image.
 * The image ref is used to draw the image on the canvas when the user removes the black box.
 * The hook also returns the contextRef, which is used to store the canvas context.
 */

function useImage({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const [hasImage, setHasImage] = useState(false);
  const image = useRef<HTMLImageElement>();
  const { setCanvasRef } = useCanvasContext();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const img = new Image();
      if (!e.target.files) return;
      img.src = URL.createObjectURL(e.target.files[0]);
      img.onload = () => {
        if (!canvasRef) return;
        image.current = img;
        setCanvasRef(canvasRef);
        if (contextRef.current && canvasRef.current) {
          setHasImage(true);
          const maxCanvasWidth = img.width;
          const maxCanvasHeight = img.height;
          canvasRef.current.width = maxCanvasWidth;
          canvasRef.current.height = maxCanvasHeight;
          contextRef.current.drawImage(img, 0, 0);
        }
      };
    },
    []
  );

  useEffect(() => {
    if (!canvasRef) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    contextRef.current = context;
  }, [image.current]);

  return {
    handleImageUpload,
    image,
    contextRef,
    hasImage,
  };
}
export default useImage;
