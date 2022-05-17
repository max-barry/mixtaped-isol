import { prettySeconds } from "../../fasteners/utility-fns/utility-fns.human-readable";
import { Duration, Frame, Progress } from "./progress-bar.styles";

interface Props {
  /** Duration as integer */
  duration: number | undefined;
  /** Remaining as integer */
  remaining: number | undefined;
  /** The accent color for the progress */
  color: string | undefined;
}

export const ProgressBar: React.FC<Props> = ({
  color,
  duration = 100,
  remaining = duration - 1
}) => (
  <Frame>
    <Progress value={duration - remaining} max={duration} color={color} />
    <Duration weight="bold" color="secondary">
      {prettySeconds(remaining)}
    </Duration>
  </Frame>
);
