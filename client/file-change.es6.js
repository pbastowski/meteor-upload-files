@Directive({
    selector: 'fileChange',
    bind:     {fileChange: '&'}
})
@Inject(['$element', '$scope', '@^file-uploads'])
class fileChange {
    constructor($element, $scope) {
        var that = this;

        this.$dependson = (fileUploads) => {
            $element.on('change', evt => {
                if (that.fileChange && typeof that.fileChange === 'function') {
                    $scope.$apply(() => {
                        that.fileChange({'$event': evt});
                    })
                }
            })
        }
    }
}

