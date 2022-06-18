//보일러 플레이트 코드
const AsyncWrapper = {
    wrap: (fn) => {
        return function (req, res, next) {
            fn(req, res, next).catch(next)
        }
    },
}

export default AsyncWrapper
