export function Inject(deps) {
    return function(target) {
        target.deps = deps;
        return target
    }
}
