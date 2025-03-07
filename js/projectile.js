/**
 * 投射物类
 */
class Projectile extends Entity {
    constructor(startX, startY, targetX, targetY, damage, color, speed, isEnemyProjectile = false) {
        super(startX, startY, 5); // 投射物半径为5
        
        this.startX = startX;
        this.startY = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.color = color;
        this.type = 'projectile';
        this.isEnemyProjectile = isEnemyProjectile;
        
        // 计算角度和设置速度
        const angle = angleBetween(startX, startY, targetX, targetY);
        this.setVelocity(angle, speed);
        
        // 特殊效果
        this.piercing = false; // 穿透效果
        this.explosive = false; // 爆炸效果
        this.explosionRadius = 0;
        this.explosionDamage = 0;
        this.homing = false; // 追踪效果
        this.homingStrength = 0;
        this.splitting = false; // 分裂效果
        this.splitCount = 0;
        this.poisonous = false; // 毒性效果
        this.poisonDamage = 0;
        this.poisonDuration = 0;
        this.freezing = false; // 冰冻效果
        this.freezeDuration = 0;
        this.lightning = false; // 闪电效果
        this.chainCount = 0;
        this.chainRange = 0;
        
        // 已击中的敌人（用于穿透效果）
        this.hitEnemies = new Set();
        
        // 生命周期
        this.lifetime = 3; // 3秒后自动销毁
        this.distanceTraveled = 0;
        this.maxDistance = 1000; // 最大飞行距离
    }
    
    update(deltaTime, enemies, player, gameWidth, gameHeight) {
        // 更新生命周期
        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
            return;
        }
        
        // 计算已飞行距离
        const distanceThisFrame = this.speed * deltaTime;
        this.distanceTraveled += distanceThisFrame;
        
        // 检查是否超过最大飞行距离
        if (this.distanceTraveled >= this.maxDistance) {
            this.destroy();
            return;
        }
        
        // 如果有追踪效果，调整方向
        if (this.homing && !this.isEnemyProjectile) {
            this.updateHoming(deltaTime, enemies);
        } else if (this.homing && this.isEnemyProjectile) {
            this.updateHomingToPlayer(deltaTime, player);
        }
        
        // 调用父类的update方法
        super.update(deltaTime);
        
        // 检查是否超出边界
        if (this.isOutOfBounds(gameWidth, gameHeight)) {
            this.destroy();
            return;
        }
        
        // 检查碰撞
        if (!this.isEnemyProjectile) {
            this.checkEnemyCollisions(enemies);
        } else {
            this.checkPlayerCollision(player);
        }
    }
    
    updateHoming(deltaTime, enemies) {
        // 如果没有敌人，直接返回
        if (enemies.length === 0) return;
        
        // 寻找最近的敌人
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (const enemy of enemies) {
            // 如果已经击中过这个敌人（穿透效果），跳过
            if (this.piercing && this.hitEnemies.has(enemy.id)) continue;
            
            const dist = this.distanceTo(enemy);
            if (dist < closestDistance) {
                closestDistance = dist;
                closestEnemy = enemy;
            }
        }
        
        // 如果找到了敌人，调整方向
        if (closestEnemy) {
            // 计算当前角度和目标角度
            const currentAngle = Math.atan2(this.velocityY, this.velocityX);
            const targetAngle = this.angleTo(closestEnemy);
            
            // 计算角度差
            let angleDiff = targetAngle - currentAngle;
            
            // 确保角度差在 -PI 到 PI 之间
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            // 根据追踪强度调整角度
            const newAngle = currentAngle + angleDiff * this.homingStrength * deltaTime * 10;
            
            // 设置新的速度
            this.setVelocity(newAngle, this.speed);
        }
    }
    
    updateHomingToPlayer(deltaTime, player) {
        // 计算当前角度和目标角度
        const currentAngle = Math.atan2(this.velocityY, this.velocityX);
        const targetAngle = this.angleTo(player);
        
        // 计算角度差
        let angleDiff = targetAngle - currentAngle;
        
        // 确保角度差在 -PI 到 PI 之间
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        // 根据追踪强度调整角度
        const newAngle = currentAngle + angleDiff * this.homingStrength * deltaTime * 10;
        
        // 设置新的速度
        this.setVelocity(newAngle, this.speed);
    }
    
    checkEnemyCollisions(enemies) {
        for (const enemy of enemies) {
            // 如果已经击中过这个敌人（穿透效果），跳过
            if (this.piercing && this.hitEnemies.has(enemy.id)) continue;
            
            // 检查碰撞
            if (this.collidesWith(enemy)) {
                // 造成伤害
                enemy.takeDamage(this.damage);
                
                // 应用特殊效果
                this.applyEffectsToEnemy(enemy);
                
                // 记录已击中的敌人
                if (this.piercing) {
                    this.hitEnemies.add(enemy.id);
                } else {
                    // 如果有爆炸效果，触发爆炸
                    if (this.explosive) {
                        const explosionEffect = this.explode(enemies);
                        // 触发爆炸效果事件
                        const explosionEvent = new CustomEvent('projectileEffect', {
                            detail: { effects: explosionEffect }
                        });
                        document.dispatchEvent(explosionEvent);
                    }
                    
                    // 如果有分裂效果，触发分裂
                    if (this.splitting) {
                        const splitProjectiles = this.split(enemies);
                        // 触发分裂事件
                        const splitEvent = new CustomEvent('projectileSplit', {
                            detail: { projectiles: splitProjectiles }
                        });
                        document.dispatchEvent(splitEvent);
                    }
                    
                    // 如果有闪电效果，触发闪电链
                    if (this.lightning) {
                        const lightningEffects = this.chainLightning(enemy, enemies);
                        // 触发闪电效果事件
                        const lightningEvent = new CustomEvent('projectileEffect', {
                            detail: { effects: lightningEffects }
                        });
                        document.dispatchEvent(lightningEvent);
                    }
                    
                    // 非穿透投射物击中后销毁
                    this.destroy();
                    break;
                }
            }
        }
    }
    
    checkPlayerCollision(player) {
        if (this.collidesWith(player)) {
            // 造成伤害
            player.takeDamage(this.damage);
            
            // 如果有爆炸效果，触发爆炸
            if (this.explosive) {
                // 爆炸效果只对玩家造成伤害
                if (this.distanceTo(player) <= this.explosionRadius) {
                    player.takeDamage(this.explosionDamage);
                }
            }
            
            // 销毁投射物
            this.destroy();
        }
    }
    
    applyEffectsToEnemy(enemy) {
        // 应用毒性效果
        if (this.poisonous) {
            enemy.applyPoison(this.poisonDamage, this.poisonDuration);
        }
        
        // 应用冰冻效果
        if (this.freezing) {
            enemy.applyFreeze(this.freezeDuration);
        }
    }
    
    explode(enemies) {
        // 对爆炸范围内的所有敌人造成伤害
        for (const enemy of enemies) {
            // 如果敌人在爆炸范围内
            if (this.distanceToPoint(enemy.x, enemy.y) <= this.explosionRadius) {
                // 造成爆炸伤害
                enemy.takeDamage(this.explosionDamage);
                
                // 应用特殊效果
                this.applyEffectsToEnemy(enemy);
            }
        }
        
        // 创建爆炸效果
        return {
            type: 'explosion',
            x: this.x,
            y: this.y,
            radius: this.explosionRadius,
            duration: 0.5,
            alpha: 1
        };
    }
    
    split(enemies) {
        const splitProjectiles = [];
        
        // 创建分裂的投射物
        for (let i = 0; i < this.splitCount; i++) {
            // 计算随机角度
            const angle = Math.random() * Math.PI * 2;
            
            // 计算目标位置
            const targetX = this.x + Math.cos(angle) * 100;
            const targetY = this.y + Math.sin(angle) * 100;
            
            // 创建新的投射物
            const projectile = new Projectile(
                this.x, this.y,
                targetX, targetY,
                this.damage * 0.5,
                this.color,
                this.speed * 0.8
            );
            
            // 复制特殊效果（除了分裂）
            projectile.piercing = this.piercing;
            projectile.explosive = this.explosive;
            projectile.explosionRadius = this.explosionRadius;
            projectile.explosionDamage = this.explosionDamage;
            projectile.homing = this.homing;
            projectile.homingStrength = this.homingStrength;
            projectile.poisonous = this.poisonous;
            projectile.poisonDamage = this.poisonDamage;
            projectile.poisonDuration = this.poisonDuration;
            projectile.freezing = this.freezing;
            projectile.freezeDuration = this.freezeDuration;
            projectile.lightning = this.lightning;
            projectile.chainCount = this.chainCount;
            projectile.chainRange = this.chainRange;
            
            // 不继承分裂效果，防止无限分裂
            projectile.splitting = false;
            
            splitProjectiles.push(projectile);
        }
        
        return splitProjectiles;
    }
    
    chainLightning(sourceEnemy, enemies) {
        const lightningEffects = [];
        let remainingChains = this.chainCount;
        let currentSource = sourceEnemy;
        let hitEnemies = new Set([sourceEnemy.id]);
        
        while (remainingChains > 0) {
            // 寻找最近的未击中的敌人
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of enemies) {
                // 跳过已击中的敌人
                if (hitEnemies.has(enemy.id)) continue;
                
                const dist = currentSource.distanceTo(enemy);
                if (dist < closestDistance && dist <= this.chainRange) {
                    closestDistance = dist;
                    closestEnemy = enemy;
                }
            }
            
            // 如果找不到更多敌人，结束链
            if (!closestEnemy) break;
            
            // 对找到的敌人造成伤害
            closestEnemy.takeDamage(this.damage * 0.7);
            
            // 应用特殊效果
            this.applyEffectsToEnemy(closestEnemy);
            
            // 创建闪电效果
            lightningEffects.push({
                type: 'lightning',
                startX: currentSource.x,
                startY: currentSource.y,
                endX: closestEnemy.x,
                endY: closestEnemy.y,
                duration: 0.3,
                alpha: 1
            });
            
            // 更新链信息
            hitEnemies.add(closestEnemy.id);
            currentSource = closestEnemy;
            remainingChains--;
        }
        
        return lightningEffects;
    }
} 