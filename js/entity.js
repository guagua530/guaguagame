/**
 * 游戏实体基类
 */
class Entity {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 0;
        this.angle = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isAlive = true;
        this.type = 'entity';
        this.color = '#ffffff';
    }
    
    update(deltaTime) {
        // 基本移动逻辑
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
    }
    
    setVelocity(angle, speed) {
        this.angle = angle;
        this.speed = speed;
        this.velocityX = Math.cos(angle) * speed;
        this.velocityY = Math.sin(angle) * speed;
    }
    
    // 检查与另一个实体的碰撞
    collidesWith(entity) {
        return circleCollision(
            this.x, this.y, this.radius,
            entity.x, entity.y, entity.radius
        );
    }
    
    // 检查是否超出边界
    isOutOfBounds(width, height, margin = 0) {
        return (
            this.x < -margin ||
            this.x > width + margin ||
            this.y < -margin ||
            this.y > height + margin
        );
    }
    
    // 将实体保持在边界内
    keepInBounds(width, height) {
        this.x = clamp(this.x, this.radius, width - this.radius);
        this.y = clamp(this.y, this.radius, height - this.radius);
    }
    
    // 计算到另一个实体的距离
    distanceTo(entity) {
        return distance(this.x, this.y, entity.x, entity.y);
    }
    
    // 计算到某个点的距离
    distanceToPoint(x, y) {
        return distance(this.x, this.y, x, y);
    }
    
    // 计算到另一个实体的角度
    angleTo(entity) {
        return angleBetween(this.x, this.y, entity.x, entity.y);
    }
    
    // 计算到某个点的角度
    angleToPoint(x, y) {
        return angleBetween(this.x, this.y, x, y);
    }
    
    // 朝向某个实体移动
    moveTowards(entity, speed) {
        const angle = this.angleTo(entity);
        this.setVelocity(angle, speed);
    }
    
    // 朝向某个点移动
    moveTowardsPoint(x, y, speed) {
        const angle = this.angleToPoint(x, y);
        this.setVelocity(angle, speed);
    }
    
    // 远离某个实体移动
    moveAwayFrom(entity, speed) {
        const angle = this.angleTo(entity) + Math.PI;
        this.setVelocity(angle, speed);
    }
    
    // 销毁实体
    destroy() {
        this.isAlive = false;
    }
} 