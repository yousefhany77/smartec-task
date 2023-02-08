import { useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import React, { useRef } from "react";
interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}
function useSelectArea({ canvasRef }: Props) {
  const resizeSelectionAreaRef = useRef<HTMLSpanElement>(null);

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
      },
    }
  );

  return {
    bind,
    x,
    y,
    width,
    height,
  };
}

export default useSelectArea;
