export default abstract class Presenter<Model, View> {
  public abstract present(model: Model): Promise<Model> | View;
}
