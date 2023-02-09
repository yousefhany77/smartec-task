import React, { useCallback, useEffect, useState } from "react";
import useSelectArea from "./useSelectArea";

interface Props {
  resizeSelectionAreaRef: React.RefObject<HTMLSpanElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
  image: React.MutableRefObject<HTMLImageElement | undefined>;
}
interface Shape {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
/*

  @param x: number
  @param y: number  
  @param shapes: Shape[]
  @returns Shape | null

  Finds the shape closest to the point (x, y) from the shapes array.
  Returns null if the point is not inside any shape.

*/
function locatePoint(x: number, y: number, shapes: Shape[]): Shape | null {
  let closestShape: Shape | null = null;
  let closestDistance = Infinity;

  for (const shape of shapes) {
    if (x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2) {
      const centerX = (shape.x1 + shape.x2) / 2;
      const centerY = (shape.y1 + shape.y2) / 2;
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

      if (distance < closestDistance) {
        closestShape = shape;
        closestDistance = distance;
      }
    }
  }

  return closestShape;
}

/**
 * Custom Hook: useImageEditor
 *
 * Purpose: To add the ability to edit images and specifically delete parts of an image.
 *
 * Props:
 * - resizeSelectionAreaRef: A reference to the selection area element.
 * - canvasRef: A reference to the canvas element.
 * - contextRef: A reference to the context of the canvas element.
 * - image: The image to be edited.
 *
 * State Management:
 * - isSelecting: Keeps track of whether the user is currently selecting an area to delete.
 * - selectedShape: Keeps track of the currently selected shape (if any).
 * - shapes: An array of objects that represent the shapes that have been added to the image (hidden parts).
 *
 * Event Listeners:
 * - An event listener is added to the canvas element to handle the click event.
 *   The click event is used to select the shape that the user clicked on.
 *
 * Returns:
 * - deleteSelectedPart: A function that deletes the selected part of the image.
 * - bind: A function used to bind the drag and resize events to the selection area element.
 * - set: A function used to set the selection area ({x, y, width, and height}).
 * - height: The height of the selection area.
 * - width: The width of the selection area.
 * - x: The x-coordinate of the selection area.
 * - y: The y-coordinate of the selection area.
 * - isSelecting: A boolean that indicates whether the user is currently selecting an area to delete.
 * - exitSelectionMode : A function that exits the selection mode.
 * - enterSelectionMode: A function that enters the selection mode.
 *
 * Dependency Hooks:
 * - useState: To manage the state of `isSelecting` and `selectedShape`.
 * - useRef: To manage the state of `shapes`.
 * - useEffect: To add an event listener to the canvas element.
 * - useSelectArea: A hook responsible for handling the drag and resize events for the selection area.
 *
 */

function useImageEditor({
  resizeSelectionAreaRef,
  canvasRef,
  contextRef,
  image,
}: Props) {
  const { bind, set, height, width, x, y } = useSelectArea({
    resizeSelectionAreaRef,
  });
  const shapes = React.useRef<Shape[]>([]);
  const [selectedShape, setSelectedShape] = React.useState<Shape | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const deleteSelectedPart = useCallback(() => {
    if (contextRef.current && canvasRef) {
      contextRef.current.fillStyle = "black";
      contextRef.current.fillRect(x.get(), y.get(), width.get(), height.get());

      // add the shape to the list of shapes the list contains the coordinates of the shape (x1, y1, x1 + w, y1 + h) that deleted from the image
      if (!shapes.current.includes(selectedShape!)) {
        shapes.current.push({
          x1: x.get(),
          y1: y.get(),
          x2: x.get() + width.get(),
          y2: y.get() + height.get(),
        });
      }
    }
  }, []);

  function removeRectAndReDrawImage(shape: Shape) {
    if (contextRef.current && canvasRef) {
      const { x1, y1, x2, y2 } = shape;
      const x_rect_size = x2 - x1;
      const y_rect_size = y2 - y1;
      contextRef.current.clearRect(x1, y1, x_rect_size, y_rect_size);
      if (image && image.current) {
        // draw the image again and add some padding to the image to cover the black rectangle and the border of the rectangle
        contextRef.current.drawImage(
          image.current,
          x1 - 2,
          y1 - 2,
          x_rect_size + 4,
          y_rect_size + 4,
          x1 - 2,
          y1 - 2,
          x_rect_size + 4,
          y_rect_size + 4
        );
      }
    }
  }
  //
  const undo = useCallback(
    // `undo` function that provides the ability to undo parts of an image that have been deleted.
    // If the showAll parameter is set to true, all shapes will be removed from the image
    // If the showAll parameter is set to false, the currently selected shape will be removed from the image

    (showAll = false) => {
      // If showAll is set to true and there are shapes present in the image, remove all shapes from the image
      if (showAll && shapes.current.length > 0 && canvasRef.current) {
        shapes.current = [];
        removeRectAndReDrawImage({
          x1: 0,
          y1: 0,
          x2: canvasRef.current.width,
          y2: canvasRef.current.height,
        });
        setSelectedShape(null);
        return;
      }
      // If showAll is set to false and a shape is currently selected, remove the selected shape from the image

      if (contextRef.current && canvasRef && selectedShape) {
        removeRectAndReDrawImage(selectedShape);
        shapes.current = shapes.current.filter(
          (shape) => shape !== selectedShape
        );
        setSelectedShape(null);
      }
    },
    // The dependency array includes `selectedShape` to make sure the function is re-created only when `selectedShape` changes.

    [selectedShape]
  );
  const enterSelectionMode = useCallback(() => {
    setIsSelecting(true);
    // set the selection area to the default size (100x100) and position (0,0)
    set({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelecting(false);
  }, []);

  const selectShape = useCallback((shape: Shape): void => {
    if (contextRef.current) {
      set({
        x: shape.x1,
        y: shape.y1,
        width: shape.x2 - shape.x1,
        height: shape.y2 - shape.y1,
      });
      setSelectedShape(shape);
    }
  }, []);

  /**
   * A function that is used to locate a point on the canvas.
   * the function should be used in useCallBack to avoid unnecessary re-renders of the component 
      and to used correctly in the useEffect hook with the event listener
   
   */
  const getMousePosition = useCallback((e: MouseEvent) => {
    // Get the bounding client rectangle of the canvas element

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      let currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      const shape = locatePoint(currentPoint.x, currentPoint.y, shapes.current);
      if (shape) {
        setIsSelecting(true);
        selectShape(shape);
      }
    }
  }, []);
  // The useEffect hook is used to add a click event listener to the canvas element.
  // The click event listener uses the `getMousePosition` function to determine the mouse position on the canvas.

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener("click", getMousePosition);
    }
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("click", getMousePosition);
      }
    };
  }, []);
  return {
    bind,
    set,
    height,
    width,
    x,
    y,
    isSelecting,
    enterSelectionMode,
    exitSelectionMode,
    deleteSelectedPart,
    undo,
  };
}
export default useImageEditor;
