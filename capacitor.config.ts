import type {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.pocketbalance.app",
  appName: "pocket-balance",
  webDir: "dist",
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "LIGHT",
    },
  },
};

export default config;
