import { Prompt } from 'enquirer';

export interface BasePromptOptions {
  name: string | (() => string);
  type: string | (() => string);
  message: string | (() => string) | (() => Promise<string>);
  initial?: unknown;
  required?: boolean;
  format?(value: string): string | Promise<string>;
  result?(value: string): string | Promise<string>;
  skip?: ((state: object) => boolean | Promise<boolean>) | boolean;
  validate?(
    value: string
  ): boolean | Promise<boolean> | string | Promise<string>;
  onSubmit?(
    name: string,
    value: unknown,
    prompt: Prompt
  ): boolean | Promise<boolean>;
  onCancel?(
    name: string,
    value: unknown,
    prompt: Prompt
  ): boolean | Promise<boolean>;
  stdin?: NodeJS.ReadStream;
  stdout?: NodeJS.WriteStream;
}

export interface Choice {
  name: string;
  message?: string;
  value?: string;
  hint?: string;
  disabled?: boolean | string;
}

export interface ArrayPromptOptions extends BasePromptOptions {
  type:
    | 'autocomplete'
    | 'editable'
    | 'form'
    | 'multiselect'
    | 'select'
    | 'survey'
    | 'list'
    | 'scale';
  choices: string[] | Choice[];
  maxChoices?: number;
  muliple?: boolean;
  initial?: number;
  delay?: number;
  separator?: boolean;
  sort?: boolean;
  linebreak?: boolean;
  edgeLength?: number;
  align?: 'left' | 'right';
  scroll?: boolean;
}

export interface BooleanPromptOptions extends BasePromptOptions {
  type: 'confirm';
  initial?: boolean;
}

export interface StringPromptOptions extends BasePromptOptions {
  type: 'input' | 'invisible' | 'list' | 'password' | 'text';
  initial?: string;
  multiline?: boolean;
}

export interface NumberPromptOptions extends BasePromptOptions {
  type: 'numeral';
  min?: number;
  max?: number;
  delay?: number;
  float?: boolean;
  round?: boolean;
  major?: number;
  minor?: number;
  initial?: number;
}

export interface SnippetPromptOptions extends BasePromptOptions {
  type: 'snippet';
  newline?: string;
  template?: string;
}

export interface SortPromptOptions extends BasePromptOptions {
  type: 'sort';
  hint?: string;
  drag?: boolean;
  numbered?: boolean;
}

export type PromptOptions =
  | ArrayPromptOptions
  | BooleanPromptOptions
  | StringPromptOptions
  | NumberPromptOptions
  | SnippetPromptOptions
  | SortPromptOptions;

export type PromptAnswer = {
  [answerKey: PropertyKey]: boolean | string | string[];
};
