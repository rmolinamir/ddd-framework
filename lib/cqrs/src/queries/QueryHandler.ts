export default abstract class QueryHandler<Query, Result> {
  public abstract handle(aQuery: Query): Promise<Result> | Result;
}
