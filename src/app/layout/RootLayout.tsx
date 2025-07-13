import "@ionic/react/css/core.css";
import {Outlet} from "@tanstack/react-router";

import {Toaster} from "@/shared/ui/sonner";

import {AnimationWrapper} from "./components/AnimationWrapper/AnimationWrapper";
import {BottomBar} from "./components/BottomBar/BottomBar";

export const RootLayout = () => {
  return (
    <div className="pt-[40px] pb-20 box-border">
      <AnimationWrapper>
        <Outlet />
      </AnimationWrapper>
      <BottomBar />
      <Toaster />
    </div>
  );
};
