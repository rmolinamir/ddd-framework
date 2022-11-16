export interface Action<Parameter> {
  (param: Parameter): void;
}
