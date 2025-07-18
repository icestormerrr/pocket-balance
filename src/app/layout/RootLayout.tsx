import "@ionic/react/css/core.css";
import {Outlet} from "@tanstack/react-router";

import {getStatusBarHeight} from "@/shared/lib/styling";
import {Toaster} from "@/shared/ui/sonner";

import {AnimationWrapper} from "./components/AnimationWrapper/AnimationWrapper";
import {BottomBar} from "./components/BottomBar/BottomBar";

export const RootLayout = () => {
  return (
    <div className={`pb-20 box-border`} style={{paddingTop: getStatusBarHeight()}}>
      <div
        style={{height: getStatusBarHeight()}}
        className="fixed top-0 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      />
      <AnimationWrapper>
        <Outlet />
      </AnimationWrapper>
      <BottomBar />
      <Toaster />
    </div>
  );
};
