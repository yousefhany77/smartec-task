import React from "react";
import UploadIcon from "../assets/Upload.svg";
interface InputUploadFileProps extends React.HTMLAttributes<HTMLButtonElement> {
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
function InputUploadFile(props: InputUploadFileProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { handleUpload, className } = props;
  return (
    <>
      <button
        {...props}
        className={`bg-slate-600 text-white font-bold py-2 px-4 rounded-lg h-16 min-w-[10rem] flex items-center justify-center gap-2   transition-colors ease-out duration-200 hover:bg-slate-800 hover:text-white
        ${className}
        `}
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.click();
          }
        }}
      >
        upload
        <img src={UploadIcon} alt="upload Icon" className=" w-5 h-5  " />
      </button>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        onChange={handleUpload}
      />
    </>
  );
}

export default InputUploadFile;
