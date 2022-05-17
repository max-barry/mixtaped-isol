/**
 * Hook that creates structured client-side logs.
 *
 * Lazy loads all required modules, and will use the native console as a fallback
 * for the interim period before the modules have been lazy loaded.
 *
 * @author Max Barry <@max-barry>
 * @since May 2021
 */
import { useEffect, useMemo, useRef } from "react";

import { BaseLevels } from "anylogger";

import { useLazyModule } from "../use-lazy-module";
import { IS_PRODUCTION } from "../../configuration";

const LOGGING_DEFAULT_LEVEL = IS_PRODUCTION ? "silent" : "trace";

export function useLogger(
  /** The name of the logging target */
  logapp = "default"
) {
  /** Lazy load ulog */
  useLazyModule(() => import(/* webpackChunkName: "ulog" */ "ulog"));

  /** Lazy load anylogger */
  const anylogger = useLazyModule(
    () => import(/* webpackChunkName: "anylogger" */ "anylogger")
  );

  /** Have we set the log level */
  const hasSetDefaultLogLevel = useRef(false);

  /** Create our logger */
  const logger = useMemo(
    () => anylogger && anylogger.default(logapp),
    [anylogger, logapp]
  );

  /** Create a front for the API that will handle whether it's loaded or not */
  const fallback: { [K in keyof BaseLevels]: () => void } = console;

  /** Once you have the logger, set the log level */
  useEffect(() => {
    if (hasSetDefaultLogLevel.current || !logger) return;
    hasSetDefaultLogLevel.current = true;
    typeof localStorage !== "undefined" &&
      localStorage.setItem("log", LOGGING_DEFAULT_LEVEL);
  }, [logger]);

  return logger || fallback;
}
