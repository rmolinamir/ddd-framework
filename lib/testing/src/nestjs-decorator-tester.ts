import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

export function NestJsDecoratorTester(Decorator: Function) {
  class Tester {
    public execute(@Decorator() value: unknown) {
      return value;
    }
  }

  const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, Tester, 'execute');

  return function <Output, Data = null, Input = {}>(
    data: Data = null as Data,
    input: Input = {} as Input
  ): Output {
    return metadata[Object.keys(metadata)[0]].factory(data, input);
  };
}
