import { useCallback, useState } from "react";

import { PropsOf } from "@emotion/react";

import { Icon } from "../../../fasteners/icon";
import { TRACK_LISTING_MODES } from "../track-listing.types";
import {
  Frame,
  Actions,
  Content,
  EngagedToggle,
  EngagedInput,
  EngagedIcons,
  SecondaryActions,
  SecondaryAction
} from "./track-listing-actions.styles";

type IconComponentProps = PropsOf<typeof Icon>;

interface Props {
  children: React.ReactNode;
  /** The current "mode" */
  mode: TRACK_LISTING_MODES;
  /** Handler to change the mode */
  onChangeMode(mode: TRACK_LISTING_MODES): void;
}

/** Icon props for "done" icon */
const ICON_PROPS_DONE: Pick<IconComponentProps, "name" | "collection"> = {
  collection: "action",
  name: "done"
};

export const TrackListingActions: React.FC<Props> = ({
  children,
  mode,
  onChangeMode
}) => {
  /** Are the actions mode engaged yet? */
  const [isEngaged, setEngaged] = useState(false);

  /** Label properties for our on/off for actions */
  const labelEngaged = isEngaged ? "Stop editing" : "Remix this tape";
  const ariaLabelEngaged = `Turn ${isEngaged ? "off" : "on"} "edit mode"`;
  const forEngaged = "track-listing-actions--engaged";

  /** Callback to reset to readable mode and disengage edit */
  const onSetToReadonly = useCallback(() => {
    setEngaged(false);
    onChangeMode("readonly");
  }, [onChangeMode]);

  /** Callback to build out props for each action */
  const determineActionProps = useCallback(
    (
      targetMode: TRACK_LISTING_MODES,
      targetIcon: Pick<IconComponentProps, "collection" | "name">
    ) => {
      /** What should the onClick do? */
      const onClick =
        mode === targetMode ? onSetToReadonly : () => onChangeMode(targetMode);

      /** What should the icon props be? */
      const icon = mode === targetMode ? ICON_PROPS_DONE : targetIcon;

      return { onClick, icon, mode: targetMode };
    },
    [mode, onChangeMode, onSetToReadonly]
  );

  /** Props for our sort action */
  const sortProps = determineActionProps("draggable", {
    collection: "content",
    name: "sort"
  });

  /** Props for our add action */
  const addProps = determineActionProps("expanding", {
    collection: "content",
    name: "add_circle"
  });

  return (
    <Frame data-engaged={isEngaged} data-mode={mode}>
      <Actions>
        <div>
          <EngagedInput
            type="checkbox"
            id={forEngaged}
            checked={isEngaged}
            onChange={() => setEngaged(current => !current)}
          />
          <EngagedToggle htmlFor={forEngaged} aria-label={ariaLabelEngaged}>
            <EngagedIcons>
              <Icon
                role="presentation"
                collection="communication"
                name="app_registration"
              />
              <Icon role="presentation" collection="content" name="save" />
            </EngagedIcons>
            {labelEngaged}
          </EngagedToggle>
        </div>
        <SecondaryActions>
          <SecondaryAction
            onClick={sortProps.onClick}
            data-secondary-action-for={sortProps.mode}
          >
            <Icon role="presentation" {...sortProps.icon} />
            Sort order
          </SecondaryAction>
          <SecondaryAction
            onClick={addProps.onClick}
            data-secondary-action-for={addProps.mode}
          >
            <Icon role="presentation" {...addProps.icon} />
            Add to tape
          </SecondaryAction>
        </SecondaryActions>
      </Actions>
      <Content>{children}</Content>
    </Frame>
  );
};
