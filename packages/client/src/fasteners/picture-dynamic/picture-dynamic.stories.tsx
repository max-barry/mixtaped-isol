import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import { Meta, Story } from "@storybook/react";
import { up } from "styled-breakpoints";

import { PictureDynamic } from "./picture-dynamic.component";

type Props = PropsOf<typeof PictureDynamic>;

export default {
  title: "Fasteners/Picture Dynamic",
  component: PictureDynamic
} as Meta;

const Container = styled.div`
  ${up("medium")} {
    max-width: 800px;
  }
`;

const Template: Story<Props> = args => (
  <Container>
    <PictureDynamic {...args} />
  </Container>
);

const args: Props = {
  src: "storybook/mountain-vista.jpeg",
  alt: "A picture of a car and a mountain",
  /** Size at mobile breakpoint, size at medium breakpoint and larger */
  sizes: [400, 800]
};

export const Standard = Template.bind({});
Standard.args = args;
