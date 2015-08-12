var app = angular.module('app', ['ui.router']);

app.config(['$stateProvider', '$compileProvider',
    function ($stateProvider, $compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }
]);

[
    'fs',
    'path',
    'os',
    'child_process',
    'url',
    'util'
].forEach(function (name) {
    var injectableName = name.replace(/-(\w)/g, function (match, c) {
        return c.toUpperCase();
    });
    app.constant(injectableName, require(name));
});