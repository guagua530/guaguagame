/**
 * 敌人类
 */
class Enemy extends Entity {
    constructor(x, y, type = 'basic') {
        // 根据敌人类型设置不同的属性
        let radius, health, speed, damage, color, experienceValue;
        
        switch (type) {
            case 'fast':
                radius = 15;
                health = 30;
                speed = 180;
                damage = 10;
                color = '#e74c3c'; // 红色
                experienceValue = 15;
                break;
            case 'tank':
                radius = 30;
                health = 150;
                speed = 80;
                damage = 20;
                color = '#8e44ad'; // 紫色
                experienceValue = 30;
                break;
            case 'ranged':
                radius = 18;
                health = 50;
                speed = 100;
                damage = 15;
                color = '#f39c12'; // 橙色
                experienceValue = 20;
                break;
            case 'boss':
                radius = 50;
                health = 500;
                speed = 60;
                damage = 30;
                color = '#c0392b'; // 深红色
                experienceValue = 100;
                break;
            case 'basic':
            default:
                radius = 20;
                health = 60;
                speed = 120;
                damage = 15;
                color = '#e74c3c'; // 红色
                experienceValue = 10;
                break;
        }
        
        super(x, y, radius);
        
        this.type = 'enemy';
        this.enemyType = type;
        this.health = health;
        this.maxHealth = health;
        this.speed = speed;
        this.damage = damage;
        this.color = color;
        this.experienceValue = experienceValue;
        
        this.targetX = x;
        this.targetY = y;
        this.attackCooldown = 0;
        this.attackRate = 1; // 每秒攻击次数
        
        // 特殊状态
        this.isSlowed = false;
        this.slowDuration = 0;
        this.slowFactor = 1;
        this.isPoisoned = false;
        this.poisonDuration = 0;
        this.poisonDamage = 0;
        this.poisonTickTimer = 0;
        this.isFrozen = false;
        this.freezeDuration = 0;
        
        // 特殊行为
        this.behaviorTimer = 0;
        this.behaviorState = 'chase';
        this.behaviorDuration = 0;
        
        // 射击相关（仅对远程敌人）
        this.canShoot = type === 'ranged' || type === 'boss';
        this.shootCooldown = 0;
        this.shootRate = type === 'boss' ? 2 : 1; // 每秒射击次数
        this.projectileSpeed = 200;
        this.shootRange = 250;
    }
    
    update(deltaTime, player, gameWidth, gameHeight) {
        // 更新状态效果
        this.updateStatusEffects(deltaTime);
        
        // 更新行为状态
        this.updateBehavior(deltaTime, player);
        
        // 根据当前行为状态执行相应的行为
        switch (this.behaviorState) {
            case 'chase':
                this.chasePlayer(player);
                break;
            case 'retreat':
                this.retreatFromPlayer(player);
                break;
            case 'circle':
                this.circleAroundPlayer(player, deltaTime);
                break;
            case 'idle':
                // 不移动
                this.velocityX = 0;
                this.velocityY = 0;
                break;
        }
        
        // 如果是远程敌人，尝试射击
        if (this.canShoot) {
            this.updateShooting(deltaTime, player);
        }
        
        // 更新攻击冷却
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // 保持在游戏边界内
        this.keepInBounds(gameWidth, gameHeight);
        
        // 调用父类的update方法
        super.update(deltaTime);
        
        // 更新目标位置（用于眼睛朝向）
        this.targetX = player.x;
        this.targetY = player.y;
    }
    
    updateStatusEffects(deltaTime) {
        // 处理减速效果
        if (this.isSlowed) {
            this.slowDuration -= deltaTime;
            if (this.slowDuration <= 0) {
                this.isSlowed = false;
                this.slowFactor = 1;
            }
        }
        
        // 处理中毒效果
        if (this.isPoisoned) {
            this.poisonDuration -= deltaTime;
            this.poisonTickTimer += deltaTime;
            
            // 每0.5秒造成一次伤害
            if (this.poisonTickTimer >= 0.5) {
                this.poisonTickTimer = 0;
                this.takeDamage(this.poisonDamage);
            }
            
            if (this.poisonDuration <= 0) {
                this.isPoisoned = false;
            }
        }
        
        // 处理冰冻效果
        if (this.isFrozen) {
            this.freezeDuration -= deltaTime;
            if (this.freezeDuration <= 0) {
                this.isFrozen = false;
            }
        }
    }
    
    updateBehavior(deltaTime, player) {
        // 如果被冰冻，不能改变行为
        if (this.isFrozen) {
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }
        
        // 更新行为计时器
        this.behaviorTimer -= deltaTime;
        
        // 如果行为持续时间结束，随机选择新的行为
        if (this.behaviorTimer <= 0) {
            // 根据敌人类型设置不同的行为概率
            let behaviors;
            
            switch (this.enemyType) {
                case 'fast':
                    behaviors = ['chase', 'chase', 'circle', 'retreat'];
                    break;
                case 'tank':
                    behaviors = ['chase', 'chase', 'chase', 'idle'];
                    break;
                case 'ranged':
                    behaviors = ['retreat', 'retreat', 'circle', 'idle'];
                    break;
                case 'boss':
                    behaviors = ['chase', 'circle', 'idle', 'retreat'];
                    break;
                case 'basic':
                default:
                    behaviors = ['chase', 'chase', 'circle'];
                    break;
            }
            
            // 随机选择行为
            this.behaviorState = randomChoice(behaviors);
            
            // 设置行为持续时间（1-3秒）
            this.behaviorDuration = randomInt(1, 3);
            this.behaviorTimer = this.behaviorDuration;
        }
    }
    
    chasePlayer(player) {
        // 计算到玩家的角度
        const angle = this.angleTo(player);
        
        // 设置速度（考虑减速效果）
        const currentSpeed = this.speed * this.slowFactor;
        this.setVelocity(angle, currentSpeed);
    }
    
    retreatFromPlayer(player) {
        // 计算远离玩家的角度
        const angle = this.angleTo(player) + Math.PI;
        
        // 设置速度（考虑减速效果）
        const currentSpeed = this.speed * this.slowFactor * 0.7; // 撤退速度稍慢
        this.setVelocity(angle, currentSpeed);
    }
    
    circleAroundPlayer(player, deltaTime) {
        // 计算到玩家的距离和角度
        const dist = this.distanceTo(player);
        const angle = this.angleTo(player);
        
        // 理想的环绕距离
        const idealDistance = 150;
        
        // 计算径向速度（靠近或远离玩家）
        let radialSpeed = 0;
        if (dist > idealDistance + 20) {
            radialSpeed = this.speed * 0.5; // 向玩家靠近
        } else if (dist < idealDistance - 20) {
            radialSpeed = -this.speed * 0.5; // 远离玩家
        }
        
        // 计算切向速度（绕玩家旋转）
        const tangentialSpeed = this.speed * 0.8;
        
        // 计算径向和切向的速度分量
        const radialVx = Math.cos(angle) * radialSpeed;
        const radialVy = Math.sin(angle) * radialSpeed;
        
        // 切向角度（垂直于径向角度）
        const tangentialAngle = angle + Math.PI / 2;
        const tangentialVx = Math.cos(tangentialAngle) * tangentialSpeed;
        const tangentialVy = Math.sin(tangentialAngle) * tangentialSpeed;
        
        // 合并速度分量
        this.velocityX = (radialVx + tangentialVx) * this.slowFactor;
        this.velocityY = (radialVy + tangentialVy) * this.slowFactor;
    }
    
    updateShooting(deltaTime, player) {
        // 更新射击冷却
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // 检查是否可以射击，移除射程限制
        if (this.shootCooldown <= 0) {
            const projectile = this.shoot(player);
            
            // 触发射击事件，将投射物添加到游戏中
            const shootEvent = new CustomEvent('enemyShoot', {
                detail: { projectile: projectile }
            });
            document.dispatchEvent(shootEvent);
            
            // 根据敌人类型设置不同的射击冷却时间
            if (this.enemyType === 'boss') {
                this.shootCooldown = 1.5 / this.shootRate; // Boss射击频率稍低
            } else if (this.enemyType === 'ranged') {
                this.shootCooldown = 1 / this.shootRate;
            } else {
                this.shootCooldown = 2 / this.shootRate; // 其他类型敌人射击频率更低
            }
        }
    }
    
    shoot(player) {
        // 创建敌人投射物
        const projectile = new Projectile(
            this.x, this.y,
            player.x, player.y,
            this.damage,
            this.enemyType === 'boss' ? '#e74c3c' : '#e67e22', // Boss红色，普通敌人橙色
            this.projectileSpeed,
            true // 是敌人的投射物
        );
        
        // 为所有敌人投射物添加追踪能力
        projectile.homing = true;
        
        // 根据敌人类型设置不同的追踪强度
        if (this.enemyType === 'boss') {
            projectile.homingStrength = 0.15; // Boss投射物追踪更强
            projectile.radius = 10;
            projectile.explosive = true;
            projectile.explosionRadius = 50;
            projectile.explosionDamage = this.damage * 0.5;
        } else if (this.enemyType === 'ranged') {
            projectile.homingStrength = 0.1; // 远程敌人投射物追踪中等
        } else {
            projectile.homingStrength = 0.05; // 其他敌人投射物追踪较弱
        }
        
        return projectile;
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        // 检查是否死亡
        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
        }
    }
    
    applyPoison(damage, duration) {
        this.isPoisoned = true;
        this.poisonDuration = duration;
        this.poisonDamage = damage;
        this.poisonTickTimer = 0;
    }
    
    applySlow(factor, duration) {
        this.isSlowed = true;
        this.slowDuration = duration;
        this.slowFactor = factor;
    }
    
    applyFreeze(duration) {
        this.isFrozen = true;
        this.freezeDuration = duration;
        this.velocityX = 0;
        this.velocityY = 0;
    }
    
    // 检查是否与玩家碰撞并造成伤害
    checkPlayerCollision(player) {
        if (this.collidesWith(player) && this.attackCooldown <= 0) {
            player.takeDamage(this.damage);
            this.attackCooldown = 1 / this.attackRate;
            return true;
        }
        return false;
    }
} 