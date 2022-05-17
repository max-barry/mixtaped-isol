import { FIXTURE_MIXTAPE_ID } from "./datastores/datastore.firestore";
import { MixtapeDetailPage } from "./experience/mixtape-detail-page";
import { MobileDisclaimer } from "./bolts/mobile-disclaimer";
import { MediaQueryTheme, GlobalStyles } from "./fasteners/styles";

export const ApplicationComponent: React.FC = () => (
  <>
    <MediaQueryTheme>
      <GlobalStyles />
      <MobileDisclaimer />
      {/* mixtaped-isol has a single view of the detail-page rendering our fixture tape */}
      <MixtapeDetailPage mixtapeId={FIXTURE_MIXTAPE_ID} />
    </MediaQueryTheme>
  </>
);
