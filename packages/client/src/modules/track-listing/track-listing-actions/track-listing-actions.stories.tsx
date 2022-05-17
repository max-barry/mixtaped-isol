import { up } from "styled-breakpoints";
import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import { Meta, Story } from "@storybook/react";

import { TrackListingActions } from "./track-listing-actions.component";
import { useCallback, useState } from "react";
import { TRACK_LISTING_MODES } from "../track-listing.types";

type Props = PropsOf<typeof TrackListingActions>;

export default {
  title: "Modules/Track Listing/Track Listing Actions",
  component: TrackListingActions
} as Meta;

const Template: Story<Props> = args => {
  /** Track the "mode" of the list */
  const [mode, setMode] = useState<TRACK_LISTING_MODES>("readonly");

  const Container = styled.div`
    ${up("medium")} {
      max-width: 480px;
    }
  `;

  const Content = styled.div`
    width: 100%;
    background-color: gainsboro;
    height: 500px;
  `;

  return (
    <Container>
      <TrackListingActions {...args} mode={mode} onChangeMode={setMode}>
        <Content />
      </TrackListingActions>
    </Container>
  );
};

const args: Omit<Props, "children" | "onChangeMode" | "mode"> = {};

export const Standard = Template.bind({});
Standard.args = args;
