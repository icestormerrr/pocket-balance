import {Outlet} from "@tanstack/react-router";

import {Toaster} from "@/shared/ui/sonner.tsx";

import "@ionic/react/css/core.css";
import {BottomBar} from "./BottomBar/BottomBar.tsx";
import {AnimationWrapper} from "./components/AnimationWrapper/AnimationWrapper.tsx";

export const RootLayout = () => {
  return (
    <div style={{paddingTop: 40}}>
      <AnimationWrapper>
        <Outlet />
      </AnimationWrapper>
      <BottomBar />
      <Toaster />
    </div>
  );
};
