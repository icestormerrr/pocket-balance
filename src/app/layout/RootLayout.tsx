import "@ionic/react/css/core.css";
import {Outlet} from "@tanstack/react-router";

import {getStatusBarHeight} from "@/shared/lib/styling";
import {Toaster} from "@/shared/ui/sonner";

import {AnimationWrapper} from "./components/AnimationWrapper/AnimationWrapper";
import {BottomBar} from "./components/BottomBar/BottomBar";
import {GradientBlobs} from "./components/GradientBlobs/GradientBlobs";

export const RootLayout = () => {
  const statusBar = getStatusBarHeight();

  return (
    <div className="pb-20 box-border relative" style={{paddingTop: statusBar}}>
      <GradientBlobs />

      <div
        style={{height: statusBar}}
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
