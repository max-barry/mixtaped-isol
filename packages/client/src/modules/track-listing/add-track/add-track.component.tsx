import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef
} from "react";

import { HeadingThree, Paragraph } from "../../../fasteners/styles";
import { useDominantColor } from "../../../fasteners/use-dominant-color";

import {
  Wrap,
  Frame,
  SearchInput,
  ResultsFrame,
  Result
} from "./add-track.styles";

interface Props {
  /** The current search term */
  searchTerm: string;
  /** What results are returned by this search? */
  results: Pick<Mixtaped.Track, "id" | "name" | "artist" | "artworkUrl100">[];
  /** Call up the API to search */
  onSearch(term: string): void;
  /** Exits the modal */
  onExit(): void;
  /** Selecting the track */
  onSelect(trackId: Mixtaped.Track["id"]): void;
}

export const AddTrackComponent: React.FC<Props> = ({
  searchTerm,
  results,
  onSearch,
  onExit,
  onSelect
}) => {
  /** Ref to attach to the frame itself */
  const $frame = useRef<HTMLDivElement>(null);

  /** onChange of input call up the stack */
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    event => onSearch(event.target.value),
    [onSearch]
  );

  /** If it's a click on the background then exit */
  const onClickBackground: MouseEventHandler<HTMLDivElement> = useCallback(
    event =>
      event.currentTarget.isEqualNode(event.target as HTMLElement) && onExit(),
    [onExit]
  );

  /** Add a handler to exit on esc */
  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      event.key === "Escape" && onExit();
    }

    /** Add this to the window */
    window.addEventListener("keyup", onEscape);

    /** Remove on dismount */
    return () => {
      window.removeEventListener("keyup", onEscape);
    };
  }, [onExit]);

  return (
    <Wrap onClick={onClickBackground}>
      <Frame ref={$frame}>
        <SearchInput
          type="text"
          placeholder="Search for a track..."
          value={searchTerm}
          onChange={onChange}
        />
        <ResultsFrame>
          {!!results.length &&
            results.map(result => (
              <ResultComponent
                key={result.id}
                onSelect={onSelect}
                {...result}
              />
            ))}
          {!results.length && <HeadingThree>No results found :(</HeadingThree>}
        </ResultsFrame>
      </Frame>
    </Wrap>
  );
};

const ResultComponent: React.FC<
  Props["results"][number] & { onSelect: Props["onSelect"] }
> = ({ id: trackId, artworkUrl100: artwork, name, artist, onSelect }) => {
  /** Work out the dominant color in the artwork */
  const { dominant } = useDominantColor(artwork);

  return (
    <Result
      role="button"
      color={dominant}
      onClick={useCallback(() => onSelect(trackId), [onSelect, trackId])}
    >
      <img
        loading="lazy"
        alt=""
        role="presentation"
        draggable={false}
        src={artwork}
      />
      <div>
        <Paragraph weight="bold">{name}</Paragraph>
        <Paragraph weight="medium" color="secondary">
          {artist}
        </Paragraph>
      </div>
    </Result>
  );
};
