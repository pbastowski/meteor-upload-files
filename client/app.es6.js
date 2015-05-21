'use strict';

// Expose all angular2-now functions on window
angular.extend(window, angular2now);
angular2now.options({ controllerAs: 'vm' });

angular.module('file-uploads', ['angular-meteor']);

@Component('file-uploads')
@View({ templateUrl: 'client/app.html'})
@Inject(['$scope', '$log', 'FileUpload'])
class App {
    constructor($scope, $log, FileUpload) {
        var that = this;

        that.upload =    FileUpload.uploadImg;
        that.url =       FileUpload.url;
        that.images =    FileUpload.images;
        that.takePhoto = takePhoto;

        function takePhoto() {
            MeteorCamera.getPicture(callback);

            function callback(error, data) {
                if (error)
                    return $log.error('camera returned an error: ', error);

                FileUpload.uploadImg(data);
            }
        }

    }
}

bootstrap(App);