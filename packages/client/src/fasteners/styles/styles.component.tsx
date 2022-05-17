import { Global } from "@emotion/react";

import { cssResetCustom, cssResetStandard } from "./parts/styles.reset";
import { typographicStyles } from "./parts/styles.typography";
import { cssTokens } from "./parts/styles.tokens";

export const GlobalStyles = () => (
  <Global
    styles={[cssTokens, cssResetStandard, cssResetCustom, typographicStyles]}
  />
);
