/**
 * Times out code execution by the argument passed in milliseconds.
 */
export async function timeout(ms = 1000): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
