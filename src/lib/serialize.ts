/**
 * A helper function to safely serialize data that contains BigInts or other
 * non-serializable types by converting them to strings. This is essential when
 * passing data from Server Components to Client Components.
 * @param obj The object to serialize.
 * @returns A new object with BigInts converted to strings.
 */

// A generic type to represent an object that has been serialized.
// It converts types that are not JSON-safe (like BigInt) into strings.
export type Serialized<T> = {
  [P in keyof T]: T[P] extends bigint ? string : T[P];
};

export function safeSerialize<T>(obj: T): Serialized<T> {
  return JSON.parse(
    JSON.stringify(
      obj,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value)
    )
  );
}
