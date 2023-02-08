import React from "react";
import useSelectArea from "../hooks/useSelectArea";

function SelectionArea() {
  const { bind } = useSelectArea();
  return <div>SelectionArea</div>;
}

export default SelectionArea;
