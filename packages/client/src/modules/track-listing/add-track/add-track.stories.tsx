import { up } from "styled-breakpoints";
import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import { Meta, Story } from "@storybook/react";

import _tracks from "../../../datastores/__fixtures__/firestore-tracks.json";
import _artists from "../../../datastores/__fixtures__/firestore-artists.json";

import { AddTrackComponent } from "./add-track.component";
import { useState } from "@storybook/addons";

type Props = PropsOf<typeof AddTrackComponent>;

const results: Props["results"] = _tracks.slice(0, 5).map(track => {
  const artist = _artists.find(artist => artist.artistId === track.artistId)!;

  return {
    ...track,
    artworkUrl100: artist.artworkUrl100,
    artist: artist.collectionName
  };
});

export default {
  title: "Modules/Track Listing/Add Track",
  component: AddTrackComponent
} as Meta;

const Container = styled.div`
  ${up("medium")} {
    max-width: 480px;
  }
`;

const args: Omit<Props, "searchTerm" | "onSearch"> = {
  results,
  onSelect: console.log,
  onExit: () => console.log("onExit")
};

const Template: Story<Props> = args => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Container>
      <AddTrackComponent
        {...args}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
      />
    </Container>
  );
};

export const Standard = Template.bind({});
Standard.args = args;

export const NoResults = Template.bind({});
NoResults.args = { ...args, results: [] };
