import isPropValid from "@emotion/is-prop-valid";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const _Cradle = styled("i", {
  shouldForwardProp: prop =>
    isPropValid(prop as any) && prop !== "preserveColor"
})();

export const Cradle = styled(_Cradle)<{ preserveColor: boolean }>`
  width: 1em;

  ${({ preserveColor }) =>
    !preserveColor &&
    css`
      path:not([fill="none"]) {
        fill: currentColor;
      }
    `}
`;
