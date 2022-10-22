/**
 * Creates a shader
 * @param {*} source "(x * y) < 3"
 */
function createShader(source) {
    return (x, y, time) => {
        return eval(source);
    }
}