export default abstract class CommandHandler<Command, Result = void> {
  public abstract execute(aCommand: Command): Promise<Result> | Result;
}
