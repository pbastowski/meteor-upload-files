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

export function ngDirective(module) {

    return function (target) {

        var ddo = new target();
        var directiveName = target.name;

        var a = Object.keys(ddo);

        console.log('-- ngDirective: \n target:', a, ddo.scope, ddo.controller);
        angular.module(module).directive(directiveName, function () {
            return {
                //controllerAs: directiveName,
                scope:        ddo.scope,
                template:     ddo.template,
                controller:   ddo.controller
            };
        });
    }
}