//console.log('++++ decorator +++++++++++++++++');
//
//@replaceFn
//class aaaController {
//    xxx () { return this.xxx }
//    @readonly
//    yyy () { return this.yyy }
//
//    constructor ($scope) {
//        this.scope = $scope;
//        console.log('++++ inside aaaController: ', $scope);
//    }
//}
//
//function replaceFn(target) {
//    console.log('++++ decorator: ', '\n    target:', target)
//    //target = function(scope) { console.log('this is a new function'); }
//
//    return target;
//}
//
//function readonly(target, key, descriptor) {
//    console.log('++++ readonly: ',
//        '\n    target:', target,
//        '\n    key:', key,
//        '\n    descriptor:', descriptor);
//    descriptor.writable = false;
//
//    return descriptor;
//}
//
//var a = new aaaController(123);
//a.yyy = 2;
//
//console.log('++++ outside aaaController: ',
//    '\n  a.xxx:', a.xxx(),
//    '\n  a.yyy:', a.yyy());