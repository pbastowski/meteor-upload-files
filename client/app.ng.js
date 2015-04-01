;
(function () {
    'use strict';

    console.log('! app.js');

    angular.module('app', ['angular-meteor'])
        .directive('pbChange', pbChange)
        .controller('app', appController)
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
            console.log(' background: ', $element.css('background-color'));
            $element.css('background-color', $element.css('background-color') == 'rgb(255, 255, 0)' ? '' : 'yellow');
        }
    }

}());
