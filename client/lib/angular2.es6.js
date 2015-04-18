angular.angular2 = {
    Component: Component,
    Template: Template,
    Inject: Inject,
    Controller: Controller,
    Bootstrap: Bootstrap
}

function Component(options = {}) {
    if (!options.module) options.module = 'app';

    return function (target) {

        // selector is optional, if not specified then the className is used
        options.selector = camelCase(options.selector||'') || target.name+'';

        // The template can be passed in from the @Template decorator
        options.template = target.template || options.template || undefined;
        options.templateUrl = target.templateUrl || options.templateUrl || undefined;

        // Create the angular directive
        // todo: use module and name-spaced directive naming, perhaps from a config file like Greg suggested
        angular.module(options.module)
            .directive(options.selector, function () {
            return {
                restrict:         (options.template+options.templateUrl) ? 'EA' : 'A',
                controllerAs:     options.selector,
                scope:            options['bind'] || {},
                bindToController: true,
                template:         options.template,
                templateUrl:      options.templateUrl,
                controller:       target,
                //transclude:       /ng-transclude/i.test(options.template) || target.transclude,
                transclude:       true
            };
        });
    }

    function camelCase(s) {
        return s.replace(/-(.)/g, function(a,b) { return b.toUpperCase() })
    }
}

function Inject(deps) {
    return function(target) {
        target.$inject = deps;
        return target
    }
}

function Template(options = {}) {
    if (!options.inline) options.inline = undefined;

    return function (target) {
        target.template = options.inline;
        target.templateUrl = options.url;

        // If template contains the new <content> tag then add ng-transclude to it
        // This will be picked up in @Component, where ddo.transclude will be set to true
        // Note: If using options.url, you will have to add ng-transclude yourself to the element you wish to transclude
        // todo: access $templateCache looking for <content> and then add ng-transclude to it, as for an inline template
        if (/\<content\>/i.test(options.inline))
            target.template = target.template.replace(/\<content\>/i, '<content ng-transclude>');

        return target;
    }
}

function Controller(module='app') {
    return function (target) {
        console.log('@ ngController: ', module+target.name.slice(0,1).toUpperCase()+target.name.slice(1));
        target.controllerAs = target.name || '';
        target.bindToController = true;

        angular.module(module)
            .controller(module+target.name.slice(0,1).toUpperCase()+target.name.slice(1), target);
    }
}

function Bootstrap (object) {
    angular.element(document).ready(function() {
        angular.bootstrap()

    })
}

