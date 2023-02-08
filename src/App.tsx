import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
export default function App() {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>();

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
  const selectedAreaRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const resizeSelectionAreaRef = useRef<HTMLSpanElement>(null);
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = new Image();
    if (!e.target.files) return;
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => {
      image.current = img;
      if (contextRef.current && canvasRef.current) {
        const maxCanvasWidth = img.width;
        const maxCanvasHeight = img.height;
        canvasRef.current.width = maxCanvasWidth;
        canvasRef.current.height = maxCanvasHeight;
        contextRef.current.drawImage(img, 0, 0);
      }
    };
  };

  const addBlackBox = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.fillStyle = "blue";
      console.log(width.get(), height.get());
      contextRef.current.fillRect(x.get(), y.get(), width.get(), height.get());
    }
  };

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const addRandomBlackBox = () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.fillStyle = `rgb(${getRandomInt(255)},${getRandomInt(
        255
      )},${getRandomInt(255)}) `;

      const x = canvasRef.current.width / getRandomInt(10);
      const y = canvasRef.current.height / getRandomInt(10);
      contextRef.current.fillRect(x - 50, y - 50, 100, 100);
    }
  };
  const removeBlackBox = (x: number, y: number, square_size: number) => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.clearRect(x, y, square_size, square_size);
      if (image.current) {
        contextRef.current.drawImage(
          image.current,
          x,
          y,
          square_size,
          square_size,
          x,
          y,
          square_size,
          square_size
        );
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    contextRef.current = context;
  }, []);

  const enterDeleteMode = useCallback(() => {
    setIsSelecting(true);
    set({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
  }, []);

  const exitDeleteMode = useCallback(() => {
    setIsSelecting(false);
  }, []);

  return (
    <section className="grid grid-cols-3 w-full min-h-screen p-10">
      <section className="flex flex-col items-center ">
        <h1 className="font-extrabold text-4xl ">Edit</h1>

        <button
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md mt-4"
          onClick={addRandomBlackBox}
        >
          Add Random Black Box
        </button>
        <button
          className="bg-red-600 text-white font-bold py-2 px-4 rounded-md mt-4"
          onClick={() =>
            removeBlackBox(
              x.get() || 0,
              y.get() || 0,
              width.get() + height.get()
            )
          }
        >
          clear
        </button>
        <input type="file" onChange={handleImage} />
      </section>

      <section className="col-span-2 bg-zinc-700 rounded-md    flex justify-center-center   ">
        <div className=" relative m-auto   ">
          <canvas
            className=" shadow-md  rounded-md    bg-white "
            ref={canvasRef}
          />
          {isSelecting && (
            <animated.div
              style={{
                x,
                y,
                width,
                height,
              }}
              ref={selectedAreaRef}
              className="cropped-area"
              {...bind()}
            >
              <span className="resizer" ref={resizeSelectionAreaRef}></span>
            </animated.div>
          )}
          {isSelecting ? (
            <div className="absolute top-6 right-6 z-[101]">
              <button
                className="bg-red-600 text-white font-bold py-2 px-4 rounded-md m-3 "
                onClick={() => addBlackBox()}
              >
                Delete
              </button>
              <button
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md m-3 "
                onClick={exitDeleteMode}
              >
                Ignore select
              </button>
            </div>
          ) : (
            <button
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md  absolute top-6 right-6 z-[101]"
              onClick={enterDeleteMode}
            >
              Select
            </button>
          )}
        </div>
      </section>
    </section>
  );
}
