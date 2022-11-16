export type MutableObject<T> = { -readonly [P in keyof T]: T[P] };
