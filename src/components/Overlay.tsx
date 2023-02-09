function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-10  bg-slate-900/60    ">
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {children}
      </span>
    </div>
  );
}

export default Overlay;
