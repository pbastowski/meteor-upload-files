/**
 * FileUpload service
 *
 * Inject it where needed on the client side.
 *
 * Returns a factory with the following members:
 *
 *  images:     $meteor.collection of all the Images
 *  url:        Returns the url of an images array element
 *  uploadImg:  Uploads an image to the server.
 *              Pass in the one of the following objects:
 *              - the event object that triggered the change on input[type=file]
 *              - the DOM element of the input[type=file]
 *              - the file image data, such as that returned by MeteorCamera.
 *
 * Currently I do nothing with the Images object on the server side,
 * but it is none the less needed, otherwise images will not be persisted.
 */

;(function(){

    console.log('! file-upload-service.ng.js');

    //var Images = new FS.Collection('images', {
    //    //stores: [new FS.Store.FileSystem("images", {path: "../../../../../.uploads"})]
    //    stores: [new FS.Store.GridFS('images')]
    //});

    var Issues = new Mongo.Collection('test');

    if ( Meteor.isClient ) {

        // Add the FileUpload service for the Client
        angular.module('app')
            .factory('FileUpload', fileUpload);

        function fileUpload($meteor, $log, $q) {
            return {
                //images:    $meteor.collection(function () { return Images.find() }),
                //issues:    $meteor.collection(function () { return Issues.find() }),
                url:       url,
                uploadImg: uploadImg
            };

            function url(image) {
                return Images.findOne(image._id).url();
            }

            function uploadImg(el) {
                if (el instanceof HTMLElement)
                    var data = el.files[0];
                else if (el instanceof jQuery.Event)
                    data = el.target.files[0];
                else
                    data = el;

                var d = $q.defer();

                Images.insert(data, function (err, fileObj) {
                    if (err)
                        d.reject(err);
                    else
                        d.resolve();
                });

                return d.promise;
            }
        }

    }

}());

