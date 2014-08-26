/// <reference path="knockout.debug.js" />
/// <reference path="knockout.recurse.debug.js" />
/// <reference path="knockout.recurse.tests.mocks.js" />
var simpleObj;

QUnit.module('Simple Object: ', {
    setup: function () {
        simpleObj = {
            firstname: 'james',
            lastname: 'hay'
        }
    }
});

QUnit.test('Creates correctly', function () {
    var res = ko.recurse.observeProperties(simpleObj);

    QUnit.equal(res.firstname(), simpleObj.firstname);
    QUnit.equal(res.lastname(), simpleObj.lastname);
});

QUnit.test('Values can be changed', function () {
    var test = 'someone';

    var res = ko.recurse.observeProperties(simpleObj);

    res.firstname(test);
    QUnit.equal(res.firstname(), test);
});

var simpleArr;

QUnit.module('Simple Array: ', {
    setup: function () {
        simpleArr = ['Hello', 'Hi', 'Something'];
    }
});

QUnit.test('Creates correctly', function () {
    var res = ko.recurse.observeArray(simpleArr);

    QUnit.equal(res()[0], simpleArr[0]);
    QUnit.equal(res()[1], simpleArr[1]);
    QUnit.equal(res()[2], simpleArr[2]);
});

QUnit.test('Values can be changed', function () {
    var test = 'Changed';

    var res = ko.recurse.observeArray(simpleArr);

    QUnit.equal(res()[0], simpleArr[0]);

    res()[0] = test;

    QUnit.equal(res()[0], test);
});

QUnit.test('Values can be added', function () {
    var test = 'Added';

    var res = ko.recurse.observeArray(simpleArr);

    var innerArr = res();

    QUnit.equal(innerArr[innerArr.length - 1], simpleArr[simpleArr.length - 1]);

    res.push(test);

    QUnit.equal(innerArr[innerArr.length - 1], test);
});

QUnit.test('Values can be removed', function () {
    var res = ko.recurse.observeArray(simpleArr);

    var innerArr = res();

    QUnit.equal(innerArr[innerArr.length - 1], simpleArr[2]);

    res.pop();

    QUnit.equal(innerArr[innerArr.length - 1], simpleArr[1]);
});

var typedObj;

QUnit.module('Typed object: ', {
    setup: function () {
        typedObj = new KOTest.ModelTypeOne();
    }
})

QUnit.test('Creates correctly', function () {
    var sampleData = {
        firstname: 'james',
        lastname: 'hay'
    };

    var res = ko.recurse.observeProperties(sampleData, undefined, typedObj);

    var resultType = res instanceof KOTest.ModelTypeOne;

    QUnit.ok(resultType);
});

QUnit.test('Has observables', function () {
    var sampleData = {
        firstname: 'james',
        lastname: 'hay'
    };

    var res = ko.recurse.observeProperties(sampleData, undefined, typedObj);

    QUnit.equal(res.firstname(), sampleData.firstname);
});

QUnit.test('Values can be changed', function () {
    var test = "peter";

    var sampleData = {
        firstname: 'james',
        lastname: 'hay'
    };

    var res = ko.recurse.observeProperties(sampleData, undefined, typedObj);

    res.firstname(test);

    QUnit.equal(res.firstname(), test);
});

var nested1;

QUnit.module('Nested object (1): ', {
    setup: function () {
        nested1 = {
            firstname: 'james',
            lastname: 'hay',
            child: {
                firstname: 'peter',
                lastname: 'john'
            }
        }
    }
});

QUnit.test('Creates correctly', function () {
    var res = ko.recurse.observeProperties(nested1);

    QUnit.equal(res.firstname(), nested1.firstname);
    QUnit.equal(res.lastname(), nested1.lastname);
    QUnit.notEqual(res.child, undefined);
    QUnit.notEqual(res.child, null);
});

QUnit.test('Child has observables', function () {
    var res = ko.recurse.observeProperties(nested1);

    QUnit.equal(res.child.firstname(), nested1.child.firstname);
    QUnit.equal(res.child.lastname(), nested1.child.lastname);
});

QUnit.test('Child values can be changed', function () {
    var tFirst = 'sam';
    var tLast = 'jackson';

    var res = ko.recurse.observeProperties(nested1);

    QUnit.equal(res.child.firstname(), nested1.child.firstname);
    QUnit.equal(res.child.lastname(), nested1.child.lastname);

    res.child.firstname(tFirst);
    res.child.lastname(tLast);

    QUnit.equal(res.child.firstname(), tFirst);
    QUnit.equal(res.child.lastname(), tLast);
});

var objArr

QUnit.module('Simple Object w/ array: ', {
    setup: function () {
        objArr = {
            firstname: 'james',
            lastname: 'hay',
            children: [
                'hello',
                'hi',
                'value'
            ]
        };
    }
});

QUnit.test('Creates correctly', function () {
    var res = ko.recurse.observeProperties(objArr);

    QUnit.equal(res.firstname(), objArr.firstname);
    QUnit.equal(res.lastname(), objArr.lastname);
    QUnit.notEqual(res.children, undefined);
    QUnit.notEqual(res.children, null);
});

QUnit.test('Has observable array', function () {
    var res = ko.recurse.observeProperties(objArr);

    var baseArray = res.children();

    QUnit.equal(baseArray[0], objArr.children[0]);
    QUnit.equal(baseArray[1], objArr.children[1]);
    QUnit.equal(baseArray[2], objArr.children[2]);
});

QUnit.test('Values can be added to array', function () {
    var test = 'Someone';
    var res = ko.recurse.observeProperties(objArr);

    res.children.push('Someone');

    var chd = res.children();

    QUnit.notEqual(chd.length, objArr.children.length);
    QUnit.equal(chd[chd.length - 1], test);
});

QUnit.test('Values can be remove from array', function () {
    var test = 'Someone';
    var res = ko.recurse.observeProperties(objArr);

    res.children.pop();

    var chd = res.children();

    QUnit.notEqual(chd.length, objArr.children.length);
    QUnit.equal(chd[chd.length - 1], objArr.children[objArr.children.length - 2]);
});


QUnit.module('Mapping: ', {
    setup: function () {
    }
});

QUnit.test('Nested type', function () {
    var nestedType = {
        firstname: 'james',
        lastname: 'hay',
        child: {
            firstname: 'james-c',
            lastname: 'hay-c'
        }
    };

    var mapping = {
        child: {
            type: KOTest.ModelTypeOne
        }
    };

    var res = ko.recurse.observeProperties(nestedType, mapping);

    QUnit.equal(res.firstname(), nestedType.firstname);
    QUnit.equal(res.lastname(), nestedType.lastname);
    QUnit.equal(res.child.firstname(), nestedType.child.firstname);
    QUnit.equal(res.child.lastname(), nestedType.child.lastname);

    var t = res.child instanceof mapping.child.type;

    QUnit.ok(t);
});

QUnit.test('Nested type array', function () {

    var nestedType = {
        firstname: 'james',
        lastname: 'hay',
        children: [
            {
                firstname: 'james-a',
                lastname: 'hay-a'
            },
            {
                firstname: 'james-b',
                lastname: 'hay-b'
            },
        ]
    };

    var mapping = {
        children: {
            type: KOTest.ModelTypeOne
        }
    };

    var res = ko.recurse.observeProperties(nestedType, mapping);

    var arr = res.children();

    var t1 = arr[0] instanceof mapping.children.type;
    var t2 = arr[1] instanceof mapping.children.type;

    QUnit.ok(t1);
    QUnit.ok(t2);
});

QUnit.test('Root and nested type', function () {

    var nestedType = {
        firstname: 'james',
        lastname: 'hay',
        children: [
            {
                firstname: 'james-a',
                lastname: 'hay-a'
            },
            {
                firstname: 'james-b',
                lastname: 'hay-b'
            },
        ]
    };

    var rootType = KOTest.ModelTypeOne;

    var mapping = {
        children: {
            type: KOTest.ModelTypeOne
        }
    };

    var res = ko.recurse.observeProperties(nestedType, mapping, new rootType());

    var arr = res.children();

    var rt = res instanceof rootType;

    var t1 = arr[0] instanceof mapping.children.type;
    var t2 = arr[1] instanceof mapping.children.type;

    QUnit.ok(rt);
    QUnit.ok(t1);
    QUnit.ok(t2);
});





QUnit.test('Deep nested type', function () {

    var nestedType = {
        firstname: 'james',
        lastname: 'hay',
        children: [
            {
                firstname: 'james-a',
                lastname: 'hay-a',
                child: {
                    firstname: 'deep-james',
                    lastname: 'deep-hay'
                }
            }
        ]
    };

    var mapping = {
        children: {
            mapping: {
                child: {
                    type: KOTest.ModelTypeOne
                }
            }
        }
    };

    var res = ko.recurse.observeProperties(nestedType, mapping);

    var firstChild = res.children()[0];

    var deepChild = firstChild.child;

    var t1 = deepChild instanceof mapping.children.mapping.child.type;

    QUnit.ok(t1);
});

QUnit.test('Standard array push mapped correctly', function () {

    var nestedType = {
        firstname: 'james',
        lastname: 'hay',
        children: [
            {
                firstname: 'james-a',
                lastname: 'hay-a'
            },
            {
                firstname: 'james-b',
                lastname: 'hay-b'
            },
        ]
    };

    var mapping = {
        children: {
            type: KOTest.ModelTypeOne
        }
    };

    var res = ko.recurse.observeProperties(nestedType, mapping);

    var o = {
        firstname: 'james-c',
        lastname: 'hay-c'
    }

    var length = res.children.push(o);

    QUnit.notEqual(length, nestedType.children.length);

    var c = res.children();

    var newObj = c[c.length - 1];

    var t = newObj instanceof KOTest.ModelTypeOne;

    QUnit.ok(t);
    QUnit.equal(newObj.firstname(), o.firstname);
    QUnit.equal(newObj.lastname(), o.lastname);
});

QUnit.test('Typed array push mapped correctly', function () {

    var nestedType = {
        firstname: 'james',
        lastname: 'hay',
        children: [
            {
                firstname: 'james-a',
                lastname: 'hay-a'
            },
            {
                firstname: 'james-b',
                lastname: 'hay-b'
            },
        ]
    };

    var mapping = {
        children: {
            type: KOTest.ModelTypeOne
        }
    };

    var res = ko.recurse.observeProperties(nestedType, mapping);

    var o = new mapping.children.type();

    first = 'james-c';
    last = 'hay-c';

    o.firstname = first;
    o.lastname = last;

    var length = res.children.push(o);

    QUnit.notEqual(length, nestedType.children.length);

    var c = res.children();

    var newObj = c[c.length - 1];

    var t = newObj instanceof KOTest.ModelTypeOne;

    QUnit.ok(t);
    QUnit.equal(newObj.firstname(), first);
    QUnit.equal(newObj.lastname(), last);
})




