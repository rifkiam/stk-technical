export const GridOverlay = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none grid grid-cols-12 gap-0 xs:gap-1 sm:gap-2 md:gap-4 xl:gap-6 z-50"
      style={{ opacity: 0.2 }}
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="border-[0.5px] border-gray-500/70"></div>
      ))}
    </div>
  );
};