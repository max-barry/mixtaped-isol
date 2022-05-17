import { useEffect, useRef, useState } from "react";

export function useLazyModule<M>(importer: () => Promise<M>): M | undefined {
  /** Get currently loaded Modules */
  const [module, setModule] = useState<M | undefined>(undefined);

  /** Use a ref to ensure we don't load twice */
  const hasLoadedModule = useRef(!!module);

  /** onMount call the module loader */
  useEffect(() => {
    /** Do this only once */
    if (hasLoadedModule.current) return;
    hasLoadedModule.current = true;
    /** Load the module */
    importer().then(setModule).catch(console.error);
  }, [importer]);

  return module as any;
}
