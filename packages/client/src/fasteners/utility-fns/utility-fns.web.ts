import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Measures the size of a DOM element using a resize observer.
 * The hook will re-render every time the size of the measured element changes.
 *
 * This is useful if you need to measure an element that
 * may change in size later as images lazy load etc.
 *
 * Should disconnect the resize observer on unmount.
 *
 * @author Max Barry <mbarry@forhims.com>
 * @since November 2020
 */
export function useMeasure<E extends HTMLElement>(
  _$target: E | React.RefObject<E>,
  resizeObserverCallback?: ResizeObserverCallback
) {
  /** Store in state the boundaries of the measured component */
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });

  /** Get the resize observer on mount of the hook */
  const [ro] = useState(
    () =>
      new ResizeObserver(
        (
          ...args: [entries: ResizeObserverEntry[], observer: ResizeObserver]
        ) => {
          /**
           * Run the resize function.
           * @todo: move to an idle frame callback
           */
          resizeObserverCallback && resizeObserverCallback(...args);
          /** Update the boundaries of the component */
          const [[{ contentRect }]] = args;
          setBounds(contentRect);
        }
      )
  );

  /** onMount connect to the resize observer. */
  useEffect(() => {
    /** Get the target from the ref */
    const $target = "current" in _$target ? _$target.current : _$target;
    /** Observe the target */
    $target && ro.observe($target);
    /** onUnmount you want to disconnect the observer */
    return () => {
      try {
        ro.disconnect();
      } catch (error) {
        console.warn("Could not disconnect the Resize Observer");
      }
    };
  }, [_$target, ro]);

  return bounds;
}

/**
 * Creates a throttling function from a certain timer function.
 *
 * Throttles a function to one of the web's timing function.
 *
 * @deprecated by more modern stuff like useDeferredValue
 *
 * @author Max Barry <@max-barry>
 * @since October 2019
 */
function frameThrottle(timer: "requestAnimationFrame" | "requestIdleCallback") {
  /** Pick from the args the correct timer function */
  const timerFn = {
    requestAnimationFrame: window.requestAnimationFrame,
    requestIdleCallback: window.requestIdleCallback
  }[timer];

  return <F extends (...args: any[]) => void>(fn: F) => {
    /** Put the called function into the queue */
    const queuedCallback = useRef<F | undefined>(undefined);

    /** Create the throttled version of the provided function */
    const throttled = useCallback(
      (...args: any[]) => {
        /** If you have no queued item... */
        if (!queuedCallback.current)
          timerFn(() => {
            const cb = queuedCallback.current;
            queuedCallback.current = undefined;
            if (cb) cb(...args);
          });

        /** Otherwise if you have somethign in the queue, then exchange it for this one */
        queuedCallback.current = fn;
      },
      [fn]
    );

    /** Return the throttled version of our function */
    return throttled;
  };
}

/**
 * useIdleCallback
 *
 * Throttles a function to the next idle frame.
 * Good if your update doesn't matter so much and can wait.
 *
 * @author Max Barry <@max-barry>
 * @since October 2019
 *
 * @see {@link https://nolanlawson.com/2019/08/11/high-performance-input-handling-on-the-web/}
 * @see {@link https://developers.google.com/web/updates/2015/08/using-requestidlecallback#checking_for_requestidlecallback}
 *
 */
export function useIdleCallback(
  /** Function to call on next idle frame */
  fn: (...args: any[]) => void
) {
  return frameThrottle("requestIdleCallback")(fn);
}
