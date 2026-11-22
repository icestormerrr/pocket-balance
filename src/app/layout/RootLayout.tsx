import "@ionic/react/css/core.css";
import {Outlet} from "@tanstack/react-router";

import {getStatusBarHeight} from "@/ui/shared/lib/styling";
import {Toaster} from "@/ui/shared/ui/sonner";

import {BottomBar} from "./components/BottomBar/BottomBar";
import {GradientBlobs} from "./components/GradientBlobs/GradientBlobs";
import classNames from "./root-layout.module.css";

export const RootLayout = () => {
  const statusBar = getStatusBarHeight();

  return (
    <div
      className="relative mx-auto box-border max-w-md"
      style={{paddingTop: statusBar, paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))"}}
    >
      <GradientBlobs />

      <div aria-hidden="true" style={{height: statusBar + 32}} className={classNames.statusBarFade} />

      <Outlet />

      <BottomBar />
      <Toaster />
    </div>
  );
};
