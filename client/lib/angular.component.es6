console.log('! angular.component.es6');

angular.component = function (component, template, scope, controller) {
    var module = component.split('.');

    if (module.length > 1) {
        component = module[1];
        module = module[0];
    }
    else
        module = 'app';

    angular.module(module).directive(component, function () {
        return {
            controllerAs: component,
            scope:        scope,
            template:     template,
            controller:   controller
        };
    });

};

