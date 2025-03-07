/**
 * 玩家类
 */
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 20); // 玩家半径为20
        this.type = 'player';
        this.color = '#3498db';
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 50; // 降低初始升级所需经验值
        this.attackSpeed = 1; // 每秒攻击次数
        this.attackTimer = 0;
        this.attackDamage = 20;
        this.attackRange = 300; // 攻击范围
        this.moveSpeed = 200; // 移动速度
        this.skills = []; // 已获得的技能
        this.skillEffects = []; // 技能效果
        this.invulnerableTime = 0; // 无敌时间
        this.dashCooldown = 0; // 冲刺冷却
        this.dashDuration = 0; // 冲刺持续时间
        this.isDashing = false;
        
        // 控制状态
        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false,
            dash: false
        };
    }
    
    update(deltaTime, gameWidth, gameHeight, enemies) {
        // 处理无敌时间
        if (this.invulnerableTime > 0) {
            this.invulnerableTime -= deltaTime;
        }
        
        // 处理冲刺冷却
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
        }
        
        // 处理冲刺状态
        if (this.isDashing) {
            this.dashDuration -= deltaTime;
            if (this.dashDuration <= 0) {
                this.isDashing = false;
                this.moveSpeed = 200; // 恢复正常速度
            }
        }
        
        // 处理移动
        this.handleMovement(deltaTime);
        
        // 保持在游戏边界内
        this.keepInBounds(gameWidth, gameHeight);
        
        // 寻找最近的敌人并攻击
        this.findAndAttackEnemy(deltaTime, enemies);
        
        // 更新技能效果
        this.updateSkillEffects(deltaTime);
        
        // 调用父类的update方法
        super.update(deltaTime);
    }
    
    handleMovement(deltaTime) {
        // 根据按键状态计算移动方向
        let dx = 0;
        let dy = 0;
        
        if (this.controls.up) dy -= 1;
        if (this.controls.down) dy += 1;
        if (this.controls.left) dx -= 1;
        if (this.controls.right) dx += 1;
        
        // 如果有移动输入
        if (dx !== 0 || dy !== 0) {
            // 归一化方向向量，确保对角线移动不会更快
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;
            
            // 设置速度
            this.velocityX = dx * this.moveSpeed;
            this.velocityY = dy * this.moveSpeed;
            
            // 更新朝向角度（如果有移动输入）
            this.angle = Math.atan2(dy, dx);
        } else {
            // 没有移动输入时停止
            this.velocityX = 0;
            this.velocityY = 0;
        }
        
        // 处理冲刺
        if (this.controls.dash && this.dashCooldown <= 0 && !this.isDashing) {
            this.dash();
        }
    }
    
    dash() {
        this.isDashing = true;
        this.dashDuration = 0.2; // 冲刺持续0.2秒
        this.dashCooldown = 3; // 冲刺冷却3秒
        this.moveSpeed = 600; // 冲刺时速度提高
        this.invulnerableTime = 0.2; // 冲刺时短暂无敌
    }
    
    findAndAttackEnemy(deltaTime, enemies) {
        // 更新攻击计时器
        this.attackTimer += deltaTime;
        
        // 限制调试输出频率
        this.debugTimer = (this.debugTimer || 0) + deltaTime;
        const shouldLog = this.debugTimer > 1; // 每秒输出一次调试信息
        
        // 如果没有敌人，直接返回
        if (enemies.length === 0) {
            if (shouldLog) {
                console.log("No enemies to attack");
                this.debugTimer = 0;
            }
            return;
        }
        
        if (shouldLog) {
            console.log("Looking for enemies to attack, count:", enemies.length);
            this.debugTimer = 0;
        }
        
        // 寻找最近的敌人
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        for (const enemy of enemies) {
            const dist = this.distanceTo(enemy);
            if (shouldLog) {
                console.log("Enemy distance:", dist, "attack range:", this.attackRange);
            }
            if (dist < closestDistance && dist <= this.attackRange) {
                closestDistance = dist;
                closestEnemy = enemy;
            }
        }
        
        // 如果找到了敌人并且攻击冷却已结束
        if (closestEnemy && this.attackTimer >= 1 / this.attackSpeed) {
            console.log("Attacking enemy at distance:", closestDistance);
            this.attackTimer = 0;
            const projectile = this.attack(closestEnemy);
            
            // 触发攻击事件
            const attackEvent = new CustomEvent('playerAttack', {
                detail: { projectile: projectile }
            });
            document.dispatchEvent(attackEvent);
        } else if (closestEnemy && shouldLog) {
            console.log("Enemy found but attack on cooldown:", this.attackTimer, "of", 1 / this.attackSpeed);
        } else if (shouldLog) {
            console.log("No enemy in range");
        }
    }
    
    attack(enemy) {
        // 创建投射物
        const projectile = new Projectile(
            this.x, this.y,
            enemy.x, enemy.y,
            this.attackDamage,
            '#3498db',
            500 // 投射物速度
        );
        
        // 应用技能效果到投射物
        this.applySkillsToProjectile(projectile);
        
        // 返回创建的投射物
        return projectile;
    }
    
    applySkillsToProjectile(projectile) {
        // 应用技能效果到投射物
        for (const skill of this.skills) {
            switch (skill.id) {
                case 'explosive':
                    projectile.explosive = true;
                    projectile.explosionRadius = 100 + (skill.level || 0) * 20;
                    projectile.explosionDamage = this.attackDamage * (0.5 + (skill.level || 0) * 0.1);
                    break;
                case 'homing':
                    projectile.homing = true;
                    projectile.homingStrength = 0.1 + (skill.level || 0) * 0.02;
                    break;
                case 'split':
                    projectile.splitting = true;
                    projectile.splitCount = 3 + (skill.level || 0);
                    break;
                case 'poison':
                    projectile.poisonous = true;
                    projectile.poisonDamage = this.attackDamage * (0.2 + (skill.level || 0) * 0.05);
                    projectile.poisonDuration = 3 + (skill.level || 0);
                    projectile.color = '#2ecc71';
                    break;
                case 'frost':
                    projectile.freezing = true;
                    projectile.freezeDuration = 2 + (skill.level || 0) * 0.5;
                    projectile.color = '#3498db';
                    break;
                case 'lightning':
                    projectile.lightning = true;
                    projectile.chainCount = 3 + (skill.level || 0);
                    projectile.chainRange = 150 + (skill.level || 0) * 30;
                    projectile.color = '#9b59b6';
                    break;
            }
        }
    }
    
    takeDamage(amount) {
        // 如果处于无敌状态，不受伤害
        if (this.invulnerableTime > 0) return;
        
        this.health -= amount;
        
        // 受伤后短暂无敌
        this.invulnerableTime = 0.5;
        
        // 检查是否死亡
        if (this.health <= 0) {
            this.health = 0;
            this.destroy();
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }
    
    gainExperience(amount) {
        this.experience += amount;
        
        // 检查是否升级
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNextLevel;
        
        // 修改经验值计算公式，使早期升级更容易
        let baseExp = this.experienceToNextLevel;
        if (this.level < 3) {
            // 前3级每级只需要增加20点经验
            baseExp += 20;
        } else if (this.level < 5) {
            // 3-5级每级增加30点经验
            baseExp += 30;
        } else if (this.level < 10) {
            // 5-10级每级增加40点经验
            baseExp += 40;
        } else {
            // 10级以后每级增加50点经验
            baseExp += 50;
        }
        this.experienceToNextLevel = baseExp;
        
        // 提升属性
        this.maxHealth += 10;
        this.health = this.maxHealth;
        this.attackDamage += 5;
        
        // 触发升级事件
        const levelUpEvent = new CustomEvent('playerLevelUp');
        document.dispatchEvent(levelUpEvent);
        
        return true;
    }
    
    addSkill(skill) {
        // 检查是否已经有相同的技能
        const existingSkill = this.skills.find(s => s.id === skill.id);
        if (existingSkill) {
            // 如果技能已达到最高等级，返回false
            if (existingSkill.level >= 5) {
                console.log("技能已达到最高等级:", skill.id);
                return false;
            }
            // 升级已有技能
            existingSkill.level = (existingSkill.level || 1) + 1;
            console.log("技能升级:", skill.id, "当前等级:", existingSkill.level);
            
            // 应用升级效果
            switch (skill.id) {
                case 'health_boost':
                    this.maxHealth += 50 * existingSkill.level;
                    this.health += 50 * existingSkill.level;
                    break;
                case 'speed_boost':
                    this.moveSpeed += 50 * existingSkill.level;
                    break;
                case 'attack_speed':
                    this.attackSpeed += 0.5 * existingSkill.level;
                    break;
                case 'damage_boost':
                    this.attackDamage += 10 * existingSkill.level;
                    break;
                case 'range_boost':
                    this.attackRange += 100 * existingSkill.level;
                    break;
            }
            return true;
        }

        // 添加新技能，初始等级为1
        skill.level = 1;
        this.skills.push(skill);
        console.log("添加新技能:", skill.id, "等级:", skill.level);
        
        // 应用技能效果
        switch (skill.id) {
            case 'health_boost':
                this.maxHealth += 50;
                this.health += 50;
                break;
            case 'speed_boost':
                this.moveSpeed += 50;
                break;
            case 'attack_speed':
                this.attackSpeed += 0.5;
                break;
            case 'damage_boost':
                this.attackDamage += 10;
                break;
            case 'range_boost':
                this.attackRange += 100;
                break;
        }

        return true;
    }
    
    updateSkillEffects(deltaTime) {
        // 更新技能效果，移除已过期的效果
        this.skillEffects = this.skillEffects.filter(effect => {
            effect.duration -= deltaTime;
            return effect.duration > 0;
        });
    }
    
    // 添加技能效果
    addSkillEffect(effect) {
        this.skillEffects.push(effect);
    }
} 