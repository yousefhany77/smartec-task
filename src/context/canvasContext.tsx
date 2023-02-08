import {
  useContext,
  createContext,
  useRef,
  useCallback,
  ReactNode,
} from "react";

type TCanvasRef = React.RefObject<HTMLCanvasElement>;
type TCanvasContext = {
  getCanvasRef: () => React.MutableRefObject<TCanvasRef | undefined> | null;
  setCanvasRef: (canvasRef: TCanvasRef) => void;
};

const CanvasContext = createContext<TCanvasContext>({
  getCanvasRef: () => null,
  setCanvasRef(canvasRef) {},
});

export const useCanvasContext = () => useContext(CanvasContext);

export default function CanvasProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const canvasRef = useRef<TCanvasRef>();
  const getCanvasRef = useCallback(() => {
    return canvasRef;
  }, []);
  const setCanvasRef = useCallback((ref: TCanvasRef) => {
    canvasRef.current = ref;
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        getCanvasRef,
        setCanvasRef,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

