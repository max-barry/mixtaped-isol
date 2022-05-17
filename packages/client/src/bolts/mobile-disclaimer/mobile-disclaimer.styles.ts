import styled from "@emotion/styled";
import { up } from "styled-breakpoints";

import { headingThree, rhythm } from "../../fasteners/styles";

export const Frame = styled.div`
  ${headingThree};

  min-height: 100vh;
  min-width: 100vw;
  background-color: var(--colors-neutral-10);

  position: relative;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${rhythm(1)};

  font-weight: 600;

  ${up("medium")} {
    display: none;
  }
`;
