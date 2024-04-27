import helmet from "helmet";

import { createModule } from "../common/middleware";

export const HelmetModule = createModule<any>(options => {
  return helmet(options);
});
