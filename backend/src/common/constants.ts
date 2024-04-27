import { resolve } from "path";

export enum ProviderType {
  POSTMARK = "POSTMARK",
}

export const FONTS_FOLDER = resolve(__dirname, "..", "assets", "fonts");
