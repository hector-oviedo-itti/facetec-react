import { App } from "../src";

declare global {
  interface Window {
    FaceTecAppController: App;
  }
}

export {};
