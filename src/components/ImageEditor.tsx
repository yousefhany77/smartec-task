import { useRef, useState } from "react";
import useImageEditor from "../hooks/useImageEditor";
import SelectionArea from "./SelectionArea";
import useImage from "../hooks/useImage";
import InputUploadFile from "./InputUploadFile";
import DownloadButton from "./DownloadButton";
import Overlay from "./Overlay";

/*
 *
 * This component is responsible for rendering the image editor.
 * The component contains the controls for the image editor from the `useImageEditor` hook.
 * The component also contains the `useImage` hook, which is responsible for handling the image upload.
 * The component also contains the `SelectionArea` component, which is responsible for rendering the selection area and the resizer.
 *
 */
function ImageEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resizeSelectionAreaRef = useRef<HTMLSpanElement>(null);
  const [loading, setLoading] = useState(false);

  const { contextRef, image, handleImageUpload, hasImage } = useImage({
    canvasRef,
  });
  const {
    deleteSelectedPart,
    isSelecting,
    bind,
    undo,
    width,
    set,
    y,
    x,
    height,
    enterSelectionMode,
    exitSelectionMode,
  } = useImageEditor({
    resizeSelectionAreaRef,
    canvasRef,
    contextRef,
    image,
  });
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    try {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = await getDataURL();
      link.click();
    } finally {
      setLoading(false);
    }
  };

  async function getDataURL(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!canvasRef.current) return;
        resolve(canvasRef.current.toDataURL());
      }, 500);
    });
  }

  return (
    <section className="grid grid-cols-1 gap-y-12  lg:gap-x-8  lg:grid-cols-3 w-full min-h-screen p-10">
      <section
        className={` ${
          hasImage ? "col-span-2" : "col-span-3"
        } bg-zinc-700 rounded-md  overflow-auto p-5  flex justify-center-center relative `}
      >
        <div className=" relative m-auto   ">
          {!hasImage && (
            <Overlay>
              <InputUploadFile handleUpload={handleImageUpload} />
            </Overlay>
          )}
          <canvas
            className=" shadow-md  rounded-md   bg-white "
            width={"800px"}
            height={"600px"}
            ref={canvasRef}
          />
          {isSelecting && (
            <SelectionArea
              resizeSelectionAreaRef={resizeSelectionAreaRef}
              set={set}
              bind={bind}
              height={height}
              width={width}
              x={x}
              y={y}
            />
          )}
        </div>
      </section>
      {hasImage ? (
        <div className="grid grid-cols-1 grid-rows-[1fr_repeat(3,auto)_1fr_auto]  gap-4 items-center justify-center  h-5/6 my-auto  z-[101]">
          <h1 className="font-extrabold text-5xl text-center ">Controls</h1>

          <button
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg h-16  transition-colors ease-out duration-200 hover:bg-purple-800 outline-white hover:text-white"
            onClick={() => undo()}
          >
            Show Selected Area
          </button>
          {/* undo(true) to delete all the shapes on  canvas and redraw the original image */}
          <button
            className="bg-white text-purple-500 font-bold py-2 px-4 rounded-lg h-16  transition-colors ease-out duration-200 hover:bg-slate-800 outline-white hover:text-white"
            onClick={() => undo(true)}
          >
            Show All
          </button>

          {isSelecting ? (
            <div className="flex justify-center w-full gap-2 ">
              <button
                className="bg-red-500 text-white flex-1 font-bold py-2 px-4 rounded-lg h-16  transition-colors ease-out duration-200 hover:bg-red-700 hover:text-white "
                onClick={() => deleteSelectedPart()}
              >
                Hide
              </button>
              <button
                className="bg-slate-600   text-white font-bold py-2 px-4 rounded-lg h-16   transition-colors ease-out duration-200 hover:bg-slate-800 hover:text-white "
                onClick={exitSelectionMode}
              >
                Ignore
              </button>
            </div>
          ) : (
            <button
              className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg h-16   transition-colors ease-out duration-200 hover:bg-slate-800 hover:text-white  "
              onClick={enterSelectionMode}
            >
              Select Area
            </button>
          )}
          <InputUploadFile
            handleUpload={handleImageUpload}
            className="self-end "
          />
          <DownloadButton
            onClick={handleDownload}
            className={`justify-self-end`}
            loading={loading}
          />
        </div>
      ) : null}
    </section>
  );
}

export default ImageEditor;
