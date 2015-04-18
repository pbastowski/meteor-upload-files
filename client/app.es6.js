'use strict';

//import { Inject } from 'lib/angular2'

console.log('! app.js');

angular.module('app', ['angular-meteor'])
    //.directive('pbChange', pbChange)
    .controller('app', appController)
    .filter('keys', ($log) => ((input, logIt) => { logIt && $log.debug(input); return Object.keys(input);}))
    .filter('fil1', ($q) => ((input) => 'filter ' + (input+'').toUpperCase()))
;

function appController($scope, $log, FileUpload) {
    console.log('! app controller');

    $scope.upload = FileUpload.uploadImg;
    $scope.url = FileUpload.url;
    $scope.images = FileUpload.images;

    $scope.takePhoto = takePhoto;

    function takePhoto() {
        MeteorCamera.getPicture(callback);

        function callback(error, data) {
            if (error)
                return $log.error('camera returned an error: ', error);

            FileUpload.uploadImg(data);
        }
    }

}

/**
 * pb-change (directive) - attribute only
 *
 * The ng-change directive in conjunction with ng-model does not support input[type=file]. pb-change does.
 *
 * Usage: <input type="file" pb-change="upload($event)">
 */
@Component()
class pbChange {
    scope = {pbChange: '&'}
    link (scope, el) {
        el.on('change', (evt) => {
            if (scope.pbChange && scope.pbChange !== '') {
                scope.$apply(() => {
                    scope.pbChange({'$event': evt});
                })
            }
        })
    }
}


// The angular.component call below has nothing to do with the file upload
// I am just testing here a function called angular.component, which creates
// directives in a minimalistic way.
angular.component('uploadedImages', '<p><b>Uploaded Images</b></p>', {}, uploadedImages);

function uploadedImages($scope, $element) {
    $element.on('click', toggle);
    $element.css('cursor', 'pointer');

    function toggle() {
        var el = $element.children(0);
        el.css('background-color', el.css('background-color') == 'rgb(255, 255, 0)' ? '' : 'yellow');
    }
}

function getKeys($log) {
    return function (input, logIt) {
        if (logIt) $log.debug(input);
        return Object.keys(input);
    }
}


@Component()
@Template({
    inline:`
        <pre>Hello booger! {{ a1 }}, {{ a2 }}</pre><div ng-transclude></div>
    `
})
class booger {
    scope = {
        a1: '=',
        a2: '@',
        a3: '&'
    }

    transclude = true

    link(scope, el, attr) {
        el.css({'cursor': 'pointer', '-webkit-user-select': 'none'});
        el.on('click', function () {
            if (el.children(0)[0].style.background !=='yellow')
                el.children(0).css('background', 'yellow');
            else
                el.children(0).css('background', '');
        });
    }

    ///* @ngInject */
    //controller($scope, $element, $attrs) {
    //    console.log('controller');
    //}
}

@Controller('app')
class appCtrl {
    constructor ($scope) {
        $scope.test = () => 123
    }
}

@Component({selector: 'another-booger', module: 'app', template: '<h2>testing 123</h2>'})
@Template({
    inline:`
        <h2>Another Booger</h2>
        <p>@template takes precedence over @Component: {{ anotherBooger.abc }}</p>
        <div ng-transclude></div>
    `,
    url: undefined
})
class pbDir {
    scope = { abc: '=' }

    require = 'ngModel'

    transclude = true

    // @template can be used, but you can also specify here any valid ddo property
    //template = '<pre>This is the component</pre>'

    /* @ngInject */
    controller ($q, $scope, $element, $attrs) {
        this.a = 1;
        this.b = 2;
        $scope.a = 43;
        console.log('@ controller 321');
    }
}


function Component(options = {}) {
    if (!options.module) options.module = 'app';

    return function (target) {

        // selector is optional, if not specified then the className is used
        options.selector = camelCase(options.selector||'') || target.name+'';

        // The template can be passed in from the @Template decorator
        options.template = target.template || options.template || undefined;
        options.templateUrl = target.templateUrl || options.templateUrl || undefined;

        // Create an object instance, which is equivalent to the directive definition object (ddo)
        var ddo = new target;

        // private scope, or the how to use the new bind property
/*
        var scope = {};
        angular.forEach(options.bind, function(v, i) {
            scope[i] = '=';
            if (scope[i] !== v) scope[i] += v;
        });
*/
        if (options['bind'])
            ddo.scope = options['bind'];

        // ng-transclude in the template text implies transclude=true (only for inline templates)
        ddo.transclude = /ng-transclude/i.test(options.template) || ddo.transclude;

        // We augment the ddo with the template property
        if (options.template) ddo.template = options.template;

        // Defined a controllerAs to be the same as the options.selector
        ddo.controllerAs = options.selector + '';
        ddo.bindToController = true;

        // And create the angular directive
        // todo: use namespaced directive naming, perhaps from a config file like Greg suggested
        angular.module(options.module).directive(options.selector, () => ddo);
    }

    function camelCase(s) {
        return s.replace(/-(.)/g, function(a,b) { return b.toUpperCase() })
    }
}

function Inject(deps) {
    return function(target) {
        target.deps = deps;
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
        if (/\<content\>/i.test(options.inline))
            target.template = target.template.replace(/\<content\>/i, '<content ng-transclude>');

        return target;
    }
}

function Controller(module='app') {
    return function (target) {
        console.log('@ ngController: ', module+target.name.slice(0,1).toUpperCase()+target.name.slice(1));
        angular.module(module)
            .controller(module+target.name.slice(0,1).toUpperCase()+target.name.slice(1), target);
    }
}

function Bootstrap () {

}

@Component2({
    selector: 'paul-special',
    bind: { xxx: '=' }
})
@Template({
    inline: `
        <pre>Name is {{paulSpecial.xxx}}</pre>
        <content></content>
    `
})
@Inject(['$q', '$http'])
/* @ngInject */
class proto {
    constructor ($element) {
        console.log('! proto: ', this.xxx);
        this.xxx = 'Hello World 2';

        if ($element) {
            $element.css({cursor: 'pointer', 'user-select': 'none'});
            $element.on('click', () => { console.log('click!' + $element[0].tagName) });
        }
    }
}
@Component2({
    selector: 'paul-special2',
    bind: { yyy: '@' }
})
@Template({
    inline: `
        <pre>Name is {{paulSpecial2.yyy}}</pre>
        <content></content>
    `
})
/* @ngInject */
export class fancyProto extends proto {
    constructor ($element) {
        // The super() call below will inherit the click event handler from the parent
        super($element);
    }
}


function Component2(options = {}) {
    if (!options.module) options.module = 'app';

    return function (target) {

        // selector is optional, if not specified then the className is used
        options.selector = camelCase(options.selector||'') || target.name+'';

        // The template can be passed in from the @Template decorator
        options.template = target.template || options.template || undefined;
        options.templateUrl = target.templateUrl || options.templateUrl || undefined;
        console.log('@ Component: template: ', options.template);

        // We create an object instance, which is the traditional directive definition object (ddo)
        var ddo = new target;

        // And create the angular directive
        // todo: use module and namespaced directive naming, perhaps from a config file like Greg suggested
        console.log('@@@@ Component: bind: ', options['bind'], ddo.scope);
        console.log('@@@@ Component: deps: ', JSON.stringify(target.deps));
        angular.module(options.module)
            .directive(options.selector, function () {
            return {
                controllerAs:     options.selector,
                bindToController: true,
                //scope:            ddo.scope,
                scope:            options['bind'] || {},
                template:         options.template,
                templateUrl:      options.templateUrl,
                controller:       target,
                transclude:       /ng-transclude/i.test(options.template) // || ddo.transclude,
                //link:             ddo.link,
                //'require':        ddo['require'],
                //restrict:         ddo.restrict
            };
        });
    }

    function camelCase(s) {
        return s.replace(/-(.)/g, function(a,b) { return b.toUpperCase() })
    }
}

