import "valtio";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
  function snapshot<T extends object>(proxyObject: T): T;
}
