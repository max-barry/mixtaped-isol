import { PropsOf } from "@emotion/react";
import { Meta, Story } from "@storybook/react";

import { Icon } from "./icon.component";

type Props = PropsOf<typeof Icon>;

export default {
  title: "Fasteners/Icon",
  component: Icon
} as Meta;

export const Primary: Story<Props> = () => (
  <Icon collection="action" name="3d_rotation" />
);
