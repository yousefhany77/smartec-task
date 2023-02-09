import { animated } from "@react-spring/web";
import useSelectArea from "../hooks/useSelectArea";
interface Props extends ReturnType<typeof useSelectArea> {
  resizeSelectionAreaRef: React.RefObject<HTMLSpanElement>;
}

/*
  * This component is responsible for rendering the selection area and the resizer.
  * The resizer is a span element that is rendered inside the selection area.
  * The selection area is rendered using the useSelectArea hook.
  * The useSelectArea hook is responsible for handling the drag and resize events for the selection area. 
  * The hook returns the bind function, which is used to bind the drag and resize events to the selection area element. 
  * The hook also returns the x, y, width, and height values of the selection area, which this component uses to position and size the selection area.
  * The SelectionArea component receives the resizeSelectionAreaRef prop to handle the resize event by setting a reference to the resizer element.
*/ 

function SelectionArea({
  bind,
  height,
  width,
  x,
  y,
  resizeSelectionAreaRef,
}: Props) {
  return (
    <animated.div
      style={{
        x,
        y,
        width,
        height,
      }}
      className="cropped-area"
      {...bind()}
    >
      <span className="resizer bg-purple-600" ref={resizeSelectionAreaRef}></span>
    </animated.div>
  );
}

export default SelectionArea;
