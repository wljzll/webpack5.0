
/**
 * 
 * @param {*} target 装饰的目标
 * @param {*} key 装饰的属性
 * @param {*} descriptor 属性描述符
 */
function readonly(target, key, descriptor) {
    console.log(target, key, descriptor);
    descriptor.writable = false;
}

class Circle {
    @readonly PI = 3.14;
}

let c1 = new Circle();
c1.PI = 3.15;
console.log(c1);