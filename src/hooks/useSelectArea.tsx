import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import React from "react";
import { useCanvasContext } from "../context/canvasContext";
interface Props {
  resizeSelectionAreaRef: React.RefObject<HTMLSpanElement>;
}

/*
  * This hook is responsible for handling the drag and resize events for the selection area.
  * The hook returns the bind function, which is used to bind the drag and resize events to the selection area element.
  * The hook also returns the x, y, width, and height  values of the selection area, which this component uses to position and size the selection area.
  * set function is used to update the x, y, width, and height values of the selection area.
  * the hook gets the canvasRef from the useCanvasContext hook.

  * 
*/
function useSelectArea({ resizeSelectionAreaRef }: Props) {
  const { getCanvasRef } = useCanvasContext();
  const canvasRef = getCanvasRef();
  const [{ x, y, width, height }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    delay: 0,
  }));
  const bind = useDrag(
    (state) => {
      const isResizing = state.event.target === resizeSelectionAreaRef.current;
      if (isResizing) {
        set({
          width: state.offset[0],
          height: state.offset[1],
        });
      } else {
        set({
          x: state.offset[0],
          y: state.offset[1],
        });
      }
    },
    {
      from: (event) => {
        const isResizing = event.target === resizeSelectionAreaRef.current;
        if (isResizing) {
          return [width.get(), height.get()];
        }
        return [x.get(), y.get()];
      },

      bounds: (state) => {
        if (canvasRef) {
          const canvasWidth = canvasRef.current?.clientWidth ?? 0;
          const canvasHeight = canvasRef.current?.clientHeight ?? 0;
          const isResizing =
            state?.event.target === resizeSelectionAreaRef.current;
          if (isResizing) {
            return {
              top: 10,
              left: 10,
              right: canvasWidth - x.get(),
              bottom: canvasHeight - y.get(),
            };
          }
          return {
            top: 0,
            left: 0,
            right: canvasWidth - width.get(),
            bottom: canvasHeight - height.get(),
          };
        }
        return {
          top: 0,
          left: 0,
        };
      },
    }
  );

  return {
    bind,
    x,
    y,
    width,
    height,
    set,
  };
}
export default useSelectArea;
