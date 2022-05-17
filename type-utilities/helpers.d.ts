/**
 * Return every key in a union of interfaces.
 *
 * @since November 2020
 * @see {@link https://stackoverflow.com/a/49402091}
 *
 * @example
 *  type SomeUnion = SomeInterface | AnotherInterface | WhateverInterface
 *  KeysOfUnion<SomeUnion> // keyof SomeInterface ... keyof AnotherInterface ... etc.
 *
 */
type KeysOfUnion<T> = T extends T ? keyof T : never;
