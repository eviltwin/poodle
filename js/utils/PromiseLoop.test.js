/*global dessert, troop, sntls, evan, bookworm, milkman, shoehine, candystore, poodle, $ */
/*global module, test, asyncTest, start, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("PromiseLoop");

    test("Retry on fail with a resolved promise", function () {
        expect(2);

        poodle.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $.Deferred().resolve('foo');
            })
            .done(function (arg) {
                equal(arg, 'foo', "should return a resolved promise");
            });
    });

    test("Retry on fail with no retries", function () {
        expect(2);

        poodle.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler");
                return $.Deferred().reject('foo');
            })
            .fail(function (arg) {
                equal(arg, 'foo', "should return a failed promise");
            });
    });

    test("Retry on fail with no retry handler", function () {
        expect(3);

        poodle.PromiseLoop
            .retryOnFail(function () {
                ok(true, "should call handler"); // will be hit 2x
                return $.Deferred().reject('foo');
            }, 1)
            .fail(function (arg) {
                equal(arg, 'foo', "should return a failed promise");
            });
    });

    test("Retry on fail with retry handler", function () {
        expect(2);

        var promises = [
                $.Deferred().reject('foo'),
                $.Deferred().resolve('bar')
            ],
            i = 0,
            retryIndices = [];

        poodle.PromiseLoop
            .retryOnFail(function () {
                return promises[i++];
            }, 2, function (retryIndex) {
                retryIndices.push(retryIndex);
            })
            .done(function (arg) {
                equal(arg, 'bar', "should return first resolved promise");
            });

        deepEqual(retryIndices, [0], "should call retry handler passing retry index");
    });
}());
