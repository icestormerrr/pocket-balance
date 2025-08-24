import {memo} from "react";

export const GradientBlobs = memo(() => {
  return (
    <div aria-hidden className={"pointer-events-none fixed inset-0 z-10 overflow-hidden"}>
      <div
        className={`
        absolute left-1/2 -top-40 h-[48rem] w-[48rem] -translate-x-1/2 blur-3xl
        opacity-20 md:opacity-50
        bg-[radial-gradient(closest-side,#fff,transparent)]
        [mask-image:radial-gradient(closest-side,#000,transparent)]
      `}
      />
    </div>
  );
});

GradientBlobs.displayName = "GradientBlobs";
