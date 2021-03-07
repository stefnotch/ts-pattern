export type ValueOf<a> = a extends any[] ? a[number] : a[keyof a];

export type Values<a extends object> = UnionToTuple<ValueOf<a>>;

/**
 * ### LeastUpperBound
 * An interesting one. A type taking two imbricated sets and returning the
 * smallest one.
 * We need that because sometimes the pattern's infered type holds more
 * information than the value on which we are matching (if the value is any
 * or unknown for instance).
 */

export type LeastUpperBound<a, b> = b extends a ? b : a extends b ? a : never;

/**
 * if a key of an object has the never type,
 * returns never, otherwise returns the type of object
 **/
export type ExcludeIfContainsNever<a> = a extends Map<any, any> | Set<any>
  ? a
  : a extends any[]
  ? ExcludeNeverTuple<a>
  : IsPlainObject<a> extends true
  ? ExcludeNeverObject<Cast<a, object>>
  : a;

type ExcludeNeverTuple<a extends any[]> =
  | (a[0] extends never ? false : true)
  | (a[1] extends never ? false : true)
  | (a[2] extends never ? false : true)
  | (a[3] extends never ? false : true)
  | (a[4] extends never ? false : true) extends true
  ? a
  : never;

type ExcludeNeverObject<a extends object> = {
  [k in keyof a]-?: a[k] extends never ? 'exclude' : 'include';
}[keyof a] extends 'include'
  ? a
  : never;

// from https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type IsUnion<a> = [a] extends [UnionToIntersection<a>] ? false : true;

export type UnionToTuple<T> = UnionToIntersection<
  T extends any ? (t: T) => T : never
> extends (_: any) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

export type Cast<a, b> = a extends b ? a : never;

export type Flatten<xs extends any[]> = xs extends [infer head, ...infer tail]
  ? [...Cast<head, any[]>, ...Flatten<tail>]
  : [];

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type Expect<T extends true> = T;

export type IsAny<a> = [a] extends [never] ? false : Equal<a, any>;

export type Length<it extends any[]> = it['length'];

export type Iterator<
  n extends number,
  it extends any[] = []
> = it['length'] extends n ? it : Iterator<n, [any, ...it]>;

export type Next<it extends any[]> = [any, ...it];
export type Prev<it extends any[]> = it extends [any, ...infer tail]
  ? tail
  : [];

export type Slice<
  xs extends any[],
  it extends any[],
  output extends any[] = []
> = Length<it> extends 0
  ? output
  : xs extends [infer head, ...infer tail]
  ? Slice<tail, Prev<it>, [...output, head]>
  : output;

export type Drop<xs extends any[], n extends any[]> = Length<n> extends 0
  ? xs
  : xs extends [any, ...infer tail]
  ? Drop<tail, Prev<n>>
  : [];

export type ConcatAll<xs> = xs extends [infer head, ...infer tail]
  ? [...Cast<head, any[]>, ...ConcatAll<tail>]
  : [];

type BuiltInObjects =
  | Function
  | Error
  | Date
  | RegExp
  | Generator
  | { readonly [Symbol.toStringTag]: string };

export type IsPlainObject<o> = o extends object
  ? o extends BuiltInObjects
    ? false
    : true
  : false;

export type Compute<a extends any> = a extends BuiltInObjects
  ? a
  : { [k in keyof a]: a[k] } & unknown;

// All :: Bool[] -> Bool
export type All<xs> = xs extends [infer head, ...infer tail]
  ? boolean extends head
    ? false
    : head extends true
    ? All<tail>
    : false
  : true;

export type Or<a extends boolean, b extends boolean> = true extends a | b
  ? true
  : false;

export type WithDefault<a, def> = [a] extends [never] ? def : a;

type IsLiteralString<T extends string> = string extends T ? false : true;
type IsLiteralNumber<T extends number> = number extends T ? false : true;
type IsLiteralBoolean<T extends boolean> = boolean extends T ? false : true;
type IsLiteralBigInt<T extends bigint> = bigint extends T ? false : true;
type IsLiteralSymbol<T extends symbol> = symbol extends T ? false : true;
export type IsLiteral<T> = T extends null | undefined
  ? true
  : T extends string
  ? IsLiteralString<T>
  : T extends number
  ? IsLiteralNumber<T>
  : T extends boolean
  ? IsLiteralBoolean<T>
  : T extends symbol
  ? IsLiteralSymbol<T>
  : T extends bigint
  ? IsLiteralBigInt<T>
  : false;

export type Primitives =
  | number
  | boolean
  | string
  | undefined
  | null
  | symbol
  | bigint;
