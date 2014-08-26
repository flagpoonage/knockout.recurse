/**
 * Provides recursive functions to build observable object trees.
 */
interface KnockoutRecursor {
    /**
     * Creates a recursively built observable array.
     * 
     * @param array The array to make observable
     * @param mapping The observable mapping for each item in the array
     * @param type The type constructor for each array item
     */
    observeArray: (array: any[], mapping: any, type: any) => KnockoutObservableArray<any>;

    /**
     * Creates a recursively build object with all properties observable.
     * 
     * @param data The object to observe
     * @param mapping The observable mapping for this object
     * @param applyTo An existing object to apply the data and observables to.
     */
    observeProperties: (data: any, mapping: any, applyTo: any) => any;
}

interface KnockoutStatic {
    recurse: KnockoutRecursor;
}

declare module "knockout.recurse" {
    export = recurse;
}
declare var recurse: KnockoutRecursor;
 