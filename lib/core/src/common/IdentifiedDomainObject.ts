import Identity from './Identity';

/**
 * An Identified Domain Object is any object implementing an `id` property of type `Identity`.
 */
export default abstract class IdentifiedDomainObject<Id extends Identity> {
  public abstract id: Id;
}
