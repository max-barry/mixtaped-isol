import { GlobalPlayer } from "../global-player";
import { Frame } from "./vanilla-view.styles";

interface Props {
  children: React.ReactNode;
}

export const VanillaView: React.FC<Props> = ({ children }) => {
  return (
    <Frame>
      {children}
      <GlobalPlayer />
    </Frame>
  );
};
