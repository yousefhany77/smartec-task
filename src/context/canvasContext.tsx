import {
  useContext,
  createContext,
  useRef,
  useCallback,
  ReactNode,
} from "react";

export type TCanvasRef = React.RefObject<HTMLCanvasElement>;
type TCanvasContext = {
  getCanvasRef: () => TCanvasRef | undefined;
  setCanvasRef: (canvasRef: TCanvasRef) => void;
};

const CanvasContext = createContext<TCanvasContext>({
  getCanvasRef: () => undefined,
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
    return canvasRef.current;
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
