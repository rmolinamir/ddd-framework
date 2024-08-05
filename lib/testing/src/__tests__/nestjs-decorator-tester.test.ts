import { describe, expect, test, vi } from 'vitest';
import { faker } from '@faker-js/faker';
import { createParamDecorator } from '@nestjs/common';
import { NestJsDecoratorTester } from '../nestjs-decorator-tester';

describe('JwtClaimsArg', () => {
  test('guard can activate', async () => {
    const data = faker.string.uuid();
    const input = [faker.string.uuid()];

    const CustomArg = vi.fn(
      createParamDecorator((d, i) => {
        expect(d).toBe(data);
        expect(i).toBe(input);
        return [d, i];
      })
    );

    const tester = NestJsDecoratorTester(CustomArg);

    const res = tester(data, input);

    expect(CustomArg).toHaveBeenCalledTimes(1);
    expect(res).toMatchObject([data, input]);
  });
});
