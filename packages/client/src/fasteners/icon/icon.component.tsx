/**
 * Master <Icon /> component that will lazy-load an icon from our raw SVGs.
 * The component takes two props: the top level directory, and the name of the icon itself.
 * The typings will ensure that only icons inside of the correct collection directory are correct.
 *
 * @example
 *  <Icon collection="communication" name="speaker" />
 *
 * @see {@link https://fonts.google.com/icons}
 *
 * @author Max Barry <@max-barry>
 * @since May 2021
 */
import { HTMLProps, lazy, Suspense, useMemo } from "react";

import { Cradle } from "./icon.styles";
import { AvailableIcons } from "./svgs/icon.types";

interface Props<C extends keyof AvailableIcons> extends HTMLProps<SVGElement> {
  /** Top level directory containing the icons we're after */
  collection: C;
  /** Name of icon within the collection directory */
  name: KeysOfUnion<AvailableIcons[C]>;
  /** Preserve colors and don't overwrite */
  preserveColor?: boolean;
}

export const Icon = <C extends keyof AvailableIcons>({
  name,
  collection,
  preserveColor = false,
  ...props
}: Props<C>) => {
  /** Lazy load the component */
  const Component = useMemo(
    () => lazy(() => import(`./svgs/${collection}/${name}/${name}.component`)),
    [collection, name]
  );

  return (
    <Suspense fallback={null}>
      <Cradle
        preserveColor={preserveColor}
        as={Component}
        {...(props as any)}
      />
    </Suspense>
  );
};
