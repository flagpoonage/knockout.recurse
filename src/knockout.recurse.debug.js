(function () {
    var _isArray = function (obj) {
        // Utility function to check whether the parameter is a javascript array
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var _isObject = function (obj) {
        // Utility function to check whether the parameter is a javascript object.
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    var _layerArrayFunctions = function (array, mapping, type) {
        // Hold the knockout generated push method.
        var ogPush = array.push;

        // Hold the knockout generated splice method.
        var ogSplice = array.splice;

        // Hold the knockout generated unshift method.
        var ogUnshift = array.unshift;

        array.push = (function (t, m) {
            // Layer the knockout push function with the custom function that will 
            // create class instances before pushing them into the knockout array.
            return function () {
                var createArray = [];
                if (arguments !== undefined && arguments !== null) {
                    for (var i = 0; i < arguments.length; i++) {
                        // Create the a new object of the supplied type and build it recursively using the mapping                        
                        var outObj = arguments[i] instanceof t ? arguments[i] : new t();
                        outObj = ko.recurse.observeProperties(arguments[i], m, outObj);
                        createArray.push(outObj);
                    }
                }

                // Pass the newly constructed class instances to the original knockout function
                return ogPush.apply(this, createArray);
            }
        }).call(array, type, mapping);

        array.splice = (function (t, m) {
            // Layer the knockout splice function with the custom function that
            // will create new class instances before splicing them into the array.
            return function (start, deleteCount) {
                var spliceArgs = [start, deleteCount];
                if (arguments !== undefined && arguments !== null) {
                    for (var i = 0; i < (arguments.length - 2) ; i++) {
                        // Create the a new object of the supplied type and build it recursively using the mapping             
                        var outObj = arguments[i] instanceof t ? arguments[i] : new t();
                        outObj = ko.recurse.observeProperties(arguments[i + 2], m, outObj);
                        spliceArgs.push(outObj);
                    }
                }

                // Pass the newly constructed class instances to the original knockout function
                return ogSplice.apply(this, spliceArgs);
            }
        }).call(array, type, mapping);

        array.unshift = (function (t, m) {
            // Layer the knockout unshift function with the custom function
            // that will create new class instances before prepending them into the array.
            return function () {
                var createArray = [];
                if (arguments !== undefined && arguments !== null) {
                    for (var i = 0; i < arguments.length; i++) {
                        // Create the a new object of the supplied type and build it recursively using the mapping             
                        var outObj = arguments[i] instanceof t ? arguments[i] : new t();
                        outObj = ko.recurse.observeProperties(arguments[i], m, outObj);
                        createArray.push(outObj);
                    }
                }

                // Pass the newly constructed class instances to the original knockout function
                return ogUnshift.apply(this, createArray);
            }
        }).call(array, type, mapping);

        return array;
    }

    // Recurse plugin
    var recurse = {
        // Creates an observable array, recursively mapping all objects, properties and arrays to observables.
        observeArray: function (array, mapping, type) {
            var v = [];
            var tDef = (type !== undefined && type !== null);
            if (tDef) {
                for (var i = 0; i < array.length; i++) {
                    // For each item in the supplied array create a new instance of the type parameter
                    // and recursively make its properties observable, then push to the output array             
                    var outObj = array[i] instanceof type ? array[i] : new type();
                    t = ko.recurse.observeProperties(array[i], mapping, outObj);
                    v.push(t);
                }
            }
            else {
                for (var i = 0; i < array.length; i++) {
                    // For each item in the supplied array, recursively map its properties to observables
                    // then push the object to the output array.
                    if (_isObject(array[i])) {
                        var t = ko.recurse.observeProperties(array[i], mapping);
                        v.push(t);
                    }
                    else if (_isArray(array[i])) {
                        var t = ko.recurse.observeArray(array[i], mapping);
                        v.push(t);
                    }
                    else {
                        v.push(array[i]);
                    }
                }
            }

            // The output array should now contain the properly constructed objects according to the mapping.
            // Make the array an observable.
            var obsArr = ko.observableArray(v);

            if (tDef) {
                // If a type constructor was defined, all objects in this array are of a certain type. In order
                // to ensure that new objects creates are of the same type, we need to layer the knockout add functions
                // (which are push, splice and unshift) with the functionality to create new objects of the type parameter.
                obsArr = _layerArrayFunctions(obsArr, mapping, type);
            }

            // Return the observable array.
            return obsArr;
        },

        // Iterates through an objects properties and makes them observable.
        observeProperties: function (data, mapping, applyTo) {
            var out = applyTo || {};
            mapping = mapping || {};
            for (var i in data) {
                var subMap = {}, ignore = false, type = null;
                if (mapping[i] !== undefined && mapping[i] !== null) {
                    subMap = mapping[i].mapping;
                    ignore = mapping[i].ignore || false;
                    type = mapping[i].type;
                }

                if (ignore) {
                    // If tagged with the ignore property, the recursion of this object will end here.
                    out[i] = data[i];
                }
                else {
                    if (_isArray(data[i])) {
                        // Converts the data array to an observable array.
                        out[i] = ko.recurse.observeArray(data[i], subMap, type);
                    }
                    else {
                        if (type !== null) {
                            // Creates new object of the parameter type and makes all its properties observable.
                            var outObj = data[i] instanceof type ? data[i] : new type();
                            out[i] = ko.recurse.observeProperties(data[i], subMap, new type());
                        }
                        else if (_isObject(data[i])) {
                            // Creates a new object and makes all its properties observable.
                            out[i] = ko.recurse.observeProperties(data[i], subMap);
                        }
                        else {
                            // If this property is a value type, we simply make it a knockout observable.
                            out[i] = ko.observable(data[i]);
                        }
                    }
                }
            }

            // Return the recursed object.
            return out;
        }
    }

    // Add the recurse plugin to the knockout object.
    if (this.ko === undefined || this.ko === null) {
        this.ko = {
            recurse: recurse
        };
    }
    else {
        this.ko.recurse = recurse;
    }
}).call(this);