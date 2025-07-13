import {Outlet} from "@tanstack/react-router";

import {Toaster} from "@/shared/ui/sonner";

import "@ionic/react/css/core.css";
import {BottomBar} from "./BottomBar/BottomBar";
import {AnimationWrapper} from "./components/AnimationWrapper/AnimationWrapper";

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
