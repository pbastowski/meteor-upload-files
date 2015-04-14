'use strict';

console.log('! app.js');

angular.module('app', ['angular-meteor'])
    .directive('pbChange', pbChange)
    .controller('app', appController)
    .filter('keys', ($log) => ((input, logIt) => { logIt && $log.debug(input); return Object.keys(input);}))
    .filter('fil1', ($q) => ((input) => 'filter ' + input))
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
function pbChange() {
    return {
        restrict: 'A',
        scope:    {pbChange: '&'},
        link:     link
    }

    function link(scope, el) {
        el.bind('change', function (evt) {
            if (scope.pbChange && scope.pbChange !== '') {
                scope.$apply(function () {
                    scope.pbChange({'$event': evt});
                });
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


@ngDirective('app')
class xxx {
    scope = {
        a1: '=',
        a2: '@',
        a3: '&'
    }

    template = '<pre>Hello booger!</pre>'

    link(scope, el, attr) {
        console.log('xxx Link');
        el.css({'cursor': 'pointer', '-webkit-user-select': 'none'});
        el.on('click', function () {
            console.log('click');
            if (el.children(0)[0].style.background !=='yellow')
                el.children(0).css('background', 'yellow');
            else
                el.children(0).css('background', '');
            //el[0].style.background = 'yellow !important';
        });
    }

    ///* @ngInject */
    //controller($scope, $element, $attrs) {
    //    console.log('controller');
    //}
}

function ngDirective(module) {

    return function (target) {

        var ddo = new target();

        angular.module(module).directive(target.name, function () {
            return {
                //controllerAs: directiveName,
                scope:      ddo.scope,
                template:   ddo.template,
                controller: ddo.controller,
                link:       ddo.link
            };
        });
    }
}