console.log('! angular.component.es6');

angular.component = function (component, template, scope, controller) {
    var moduleName = component.split('.');

    if (moduleName.length > 1) {
        component = moduleName[1];
        moduleName = moduleName[0];
    }
    else
        moduleName = 'app';

    angular.module(moduleName).directive(component, function () {
        return {
            controllerAs: component,
            scope:        scope,
            template:     template,
            controller:   controller
        };
    });

};
