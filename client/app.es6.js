'use strict';

//import { Inject } from 'lib/angular2'
angular.extend(this, angular.angular2);

//SetModuleName('test01');
SetModuleName(this.moduleName);

console.log('! app.js');

angular.module('app', ['angular-meteor', 'client/app']);

@Controller()
class appCtrl {
    constructor ($scope) {
        $scope.test = () => 123
    }
}

@Filter()
class keys {
    constructor ($log) {
        return ((input, logIt) => { logIt && $log.debug(input); return Object.keys(input);})
    }
}

@Filter()
class fil1 {
    prefix = 'filter '
    constructor (prefix) {
        if (prefix) this.prefix = prefix;
        else prefix = this.prefix;

        return function(input) {
            return prefix + (input + '').toUpperCase();
        }
    }
}

@Filter()
class fil2 extends fil1 {
    constructor () {
        return super('other ');
    }
}

@Service()
class service1 {
    hello = 'this is'
    world = 'a test'
}

@Service()
class service2 {
    hello = 'hello'
    world = 'world'
    test() {
        return this.hello + ' ' + this.world;
    }
}

@Controller()
@Inject(['$scope', '$log', 'FileUpload'])
class appController {
    constructor($scope, $log, FileUpload) {

        $scope.upload = FileUpload.uploadImg;
        $scope.url = FileUpload.url;
        $scope.images = FileUpload.images;
        this.test = 'testing 123...';

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
}



/**
 * pb-change (directive) - attribute only
 *
 * The ng-change directive in conjunction with ng-model does not support input[type=file]. pb-change does.
 *
 * Usage: <input type="file" pb-change="upload($event)">
 */
@Component({
    bind: { fileChange: '&' }
})
class fileChange {
    constructor ($element, $scope) {
        $element.on('change', (evt) => {
            if (this.fileChange && this.fileChange !== '') {
                $scope.$apply(() => {
                    this.fileChange({'$event': evt});
                })
            }
        })
    }
}


@Component()
@Template({ inline:'<p><b>Uploaded Images</b></p>'})
class uploadedImages {

    constructor ($scope, $element) {
        $element.on('click', toggle);
        $element.css('cursor', 'pointer');

        function toggle() {
            var el = $element.children(0);
            el.css('background-color', el.css('background-color') == 'rgb(255, 255, 0)' ? '' : 'yellow');
        }
    }
}

function getKeys($log) {
    return function (input, logIt) {
        if (logIt) $log.debug(input);
        return Object.keys(input);
    }
}


@Component({
    bind : {
        a1: '=',
        a2: '@',
        a3: '&'
    }
})
@Template({
    url: 'client/booger.html'
})
@Inject(['$element'])
class booger {
    constructor($element) {
        $element.css({'cursor': 'pointer', '-webkit-user-select': 'none'});
        $element.on('click', function () {
            if ($element.children(0)[0].style.background !=='yellow')
                $element.children(0).css('background', 'yellow');
            else
                $element.children(0).css('background', '');
        });
    }
}

@Component({
    selector: 'another-booger',
    bind: { abc: '=' }
})
@Template({
    inline:`
        <h2>Another Booger</h2>
        <p>@template takes precedence over @Component: {{ anotherBooger.abc }}</p>
        <content></content>
    `,
    url: undefined
})
@Inject(['$element'])
class pbDir extends booger {
    // @Template can be used, but you can also specify here any valid ddo property
    //template = '<pre>This is the component</pre>'

    constructor ($element) {
        super($element);
        this.a = 1;
        this.b = 2;
        console.log('- controller 321');
    }
}


@Component({
    selector: 'paul-special',
    bind: { xxx: '=' }
})
@Template({
    inline: `
        <h2>paul-special</h2>
        <pre>Name is {{paulSpecial.xxx}}</pre>
        <content></content>
    `
})
@Inject(['$element'])
class proto {
    constructor ($element) {
        //console.log('! proto: ', this.xxx);
        this.xxx = 'Hello World 2';

        if ($element) {
            $element.css({cursor: 'pointer', 'user-select': 'none'});
            $element.on('click', () => { console.log('click!' + $element[0].tagName) });
        }
    }
}
@Component({
    selector: 'paul-special2',
    bind: { yyy: '@' },
    services: [ 'service1', service2 ]
})
@Template({
    inline: `
        <h2>paul-special 2</h2>
        <pre>Name is {{paulSpecial2.yyy}}</pre>
        <content></content>
    `
})
export class fancyProto extends proto {
    constructor ($element, service1, service2) {
        // The super() call below will inherit the click event handler from the parent
        super($element);
        console.log('fancyProto: services: ', service1, service2, service2.test());
    }
}


