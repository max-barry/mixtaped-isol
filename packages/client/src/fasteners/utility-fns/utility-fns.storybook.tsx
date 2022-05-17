import styled from "@emotion/styled";

import { rhythm } from "../styles";

/** Temporary UI for the story */
export const StoryToggleButton: React.FC<{
  children: React.ReactNode;
  disabled?: boolean;
  onClick(): void;
}> = ({ children, disabled = false, onClick }) => {
  const Button = styled.button`
    margin-bottom: ${rhythm(1)};
    background-color: gainsboro;
    padding: 4px 8px;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
  `;
  return (
    <Button onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
};
