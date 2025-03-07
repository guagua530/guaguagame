/**
 * 工具函数集合
 */

// 计算两点之间的距离
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// 生成指定范围内的随机整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成随机颜色
function randomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 角度转弧度
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// 弧度转角度
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}

// 计算两点之间的角度（弧度）
function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

// 碰撞检测 - 圆形与圆形
function circleCollision(x1, y1, r1, x2, y2, r2) {
    return distance(x1, y1, x2, y2) < r1 + r2;
}

// 深度复制对象
function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 限制值在指定范围内
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// 线性插值
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// 随机选择数组中的一个元素
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 洗牌数组
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
} 