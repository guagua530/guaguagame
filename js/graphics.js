/**
 * 图形渲染相关函数
 */

// 绘制玩家
function drawPlayer(ctx, player) {
    ctx.save();
    
    // 绘制玩家光环效果（如果有特殊技能）
    if (player.skills.length > 0) {
        // 创建光环渐变
        const auraGradient = ctx.createRadialGradient(
            player.x, player.y, player.radius,
            player.x, player.y, player.radius + 15
        );
        auraGradient.addColorStop(0, 'rgba(243, 156, 18, 0.3)');
        auraGradient.addColorStop(1, 'rgba(243, 156, 18, 0)');
        
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加光环粒子效果
        const particleCount = 8;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time;
            const distance = player.radius + 10 + Math.sin(time * 2 + i) * 5;
            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;
            const size = 2 + Math.sin(time * 3 + i) * 1;
            
            ctx.fillStyle = 'rgba(255, 204, 0, 0.7)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 绘制玩家阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // 绘制人物身体 - 使用更像人的形状
    const bodyColor = '#4263eb';
    const headRadius = player.radius * 0.4;
    const bodyHeight = player.radius * 1.2;
    const shoulderWidth = player.radius * 1.2;
    
    // 计算朝向角度
    const dirAngle = player.angle;
    
    // 绘制身体（躯干）
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(
        player.x, 
        player.y + headRadius * 0.8, 
        shoulderWidth / 2, 
        bodyHeight / 2, 
        0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 绘制头部
    const headGradient = ctx.createRadialGradient(
        player.x - headRadius * 0.2, 
        player.y - headRadius * 0.2, 
        0,
        player.x, 
        player.y - headRadius * 0.5, 
        headRadius
    );
    headGradient.addColorStop(0, '#f8d9b4'); // 皮肤色
    headGradient.addColorStop(1, '#e8c39e');
    
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(
        player.x, 
        player.y - headRadius * 0.5, 
        headRadius, 
        0, Math.PI * 2
    );
    ctx.fill();
    
    // 绘制眼睛
    const eyeRadius = headRadius * 0.2;
    const eyeOffsetX = Math.cos(dirAngle) * headRadius * 0.5;
    const eyeOffsetY = Math.sin(dirAngle) * headRadius * 0.5;
    
    // 左眼
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(
        player.x - eyeOffsetY * 0.5 + eyeOffsetX * 0.3, 
        player.y - headRadius * 0.5 + eyeOffsetY * 0.3, 
        eyeRadius, 
        0, Math.PI * 2
    );
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    ctx.arc(
        player.x + eyeOffsetY * 0.5 + eyeOffsetX * 0.3, 
        player.y - headRadius * 0.5 + eyeOffsetY * 0.3, 
        eyeRadius, 
        0, Math.PI * 2
    );
    ctx.fill();
    
    // 眼球
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(
        player.x - eyeOffsetY * 0.5 + eyeOffsetX * 0.5, 
        player.y - headRadius * 0.5 + eyeOffsetY * 0.5, 
        eyeRadius * 0.6, 
        0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(
        player.x + eyeOffsetY * 0.5 + eyeOffsetX * 0.5, 
        player.y - headRadius * 0.5 + eyeOffsetY * 0.5, 
        eyeRadius * 0.6, 
        0, Math.PI * 2
    );
    ctx.fill();
    
    // 绘制头发
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(
        player.x, 
        player.y - headRadius * 0.8, 
        headRadius * 1.1, 
        Math.PI, Math.PI * 2
    );
    ctx.fill();
    
    // 绘制手臂
    const armLength = player.radius * 0.8;
    const handRadius = headRadius * 0.3;
    
    // 左手臂
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = headRadius * 0.4;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(
        player.x - shoulderWidth / 2 * 0.8, 
        player.y + headRadius * 0.5
    );
    
    const leftHandX = player.x - shoulderWidth / 2 * 0.8 - Math.cos(dirAngle - 0.5) * armLength;
    const leftHandY = player.y + headRadius * 0.5 + Math.sin(dirAngle - 0.5) * armLength;
    
    ctx.lineTo(leftHandX, leftHandY);
    ctx.stroke();
    
    // 右手臂（持武器的手）
    ctx.beginPath();
    ctx.moveTo(
        player.x + shoulderWidth / 2 * 0.8, 
        player.y + headRadius * 0.5
    );
    
    const rightHandX = player.x + shoulderWidth / 2 * 0.8 + Math.cos(dirAngle) * armLength;
    const rightHandY = player.y + headRadius * 0.5 + Math.sin(dirAngle) * armLength;
    
    ctx.lineTo(rightHandX, rightHandY);
    ctx.stroke();
    
    // 绘制手
    ctx.fillStyle = '#f8d9b4';
    ctx.beginPath();
    ctx.arc(leftHandX, leftHandY, handRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightHandX, rightHandY, handRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制腿
    const legLength = player.radius * 0.9;
    const footRadius = headRadius * 0.3;
    
    // 左腿
    ctx.strokeStyle = '#3b56d9'; // 裤子颜色
    ctx.lineWidth = headRadius * 0.5;
    
    ctx.beginPath();
    ctx.moveTo(
        player.x - shoulderWidth / 4, 
        player.y + bodyHeight / 2
    );
    
    const leftFootX = player.x - shoulderWidth / 4 - Math.cos(dirAngle - 0.2) * legLength * 0.3;
    const leftFootY = player.y + bodyHeight / 2 + legLength;
    
    ctx.lineTo(leftFootX, leftFootY);
    ctx.stroke();
    
    // 右腿
    ctx.beginPath();
    ctx.moveTo(
        player.x + shoulderWidth / 4, 
        player.y + bodyHeight / 2
    );
    
    const rightFootX = player.x + shoulderWidth / 4 + Math.cos(dirAngle - 0.2) * legLength * 0.3;
    const rightFootY = player.y + bodyHeight / 2 + legLength;
    
    ctx.lineTo(rightFootX, rightFootY);
    ctx.stroke();
    
    // 绘制脚
    ctx.fillStyle = '#333'; // 鞋子颜色
    ctx.beginPath();
    ctx.ellipse(
        leftFootX, 
        leftFootY, 
        footRadius * 1.5, 
        footRadius, 
        0, 0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(
        rightFootX, 
        rightFootY, 
        footRadius * 1.5, 
        footRadius, 
        0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 绘制武器
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    // 武器主体
    const weaponLength = player.radius * 1.5;
    const weaponX = rightHandX + Math.cos(dirAngle) * weaponLength;
    const weaponY = rightHandY + Math.sin(dirAngle) * weaponLength;
    
    ctx.beginPath();
    ctx.moveTo(rightHandX, rightHandY);
    ctx.lineTo(weaponX, weaponY);
    ctx.stroke();
    
    // 武器发光效果
    ctx.shadowColor = '#4263eb';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = 'rgba(66, 99, 235, 0.5)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(rightHandX, rightHandY);
    ctx.lineTo(weaponX, weaponY);
    ctx.stroke();
    
    // 武器末端
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(weaponX, weaponY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // 绘制玩家等级
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.level, player.x, player.y - player.radius - 15);
    
    // 如果玩家处于冲刺状态，添加冲刺效果
    if (player.isDashing) {
        // 冲刺轨迹
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#4263eb';
        
        // 计算冲刺方向
        const dashAngle = Math.atan2(player.velocityY, player.velocityX);
        
        // 绘制多个残影
        for (let i = 1; i <= 3; i++) {
            const distance = i * 15;
            const x = player.x - Math.cos(dashAngle) * distance;
            const y = player.y - Math.sin(dashAngle) * distance;
            
            // 简化的人物残影
            ctx.beginPath();
            ctx.arc(x, y - headRadius * 0.5, headRadius * 0.8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.ellipse(
                x, 
                y + headRadius * 0.8, 
                shoulderWidth / 2 * 0.8, 
                bodyHeight / 2 * 0.8, 
                0, 0, Math.PI * 2
            );
            ctx.fill();
        }
        
        // 恢复透明度
        ctx.globalAlpha = 1;
    }
    
    // 如果玩家处于无敌状态，添加无敌效果
    if (player.invulnerableTime > 0) {
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        
        // 绘制无敌护盾
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        
        // 添加闪烁效果
        if (Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 恢复透明度
        ctx.globalAlpha = 1;
    }
    
    ctx.restore();
}

// 绘制敌人
function drawEnemy(ctx, enemy) {
    ctx.save();
    
    // 根据敌人类型设置不同的视觉效果
    let primaryColor, secondaryColor, detailColor, particleColor;
    let hasParticles = false;
    let hasGlow = false;
    let monsterType = '';
    
    switch (enemy.enemyType) {
        case 'fast':
            primaryColor = '#e74c3c';
            secondaryColor = '#c0392b';
            detailColor = '#ff6b6b';
            particleColor = 'rgba(231, 76, 60, 0.7)';
            hasParticles = true;
            monsterType = 'spider'; // 蜘蛛型怪物
            break;
        case 'tank':
            primaryColor = '#8e44ad';
            secondaryColor = '#6c3483';
            detailColor = '#a569bd';
            hasGlow = true;
            monsterType = 'golem'; // 石头人
            break;
        case 'ranged':
            primaryColor = '#f39c12';
            secondaryColor = '#d35400';
            detailColor = '#f5b041';
            particleColor = 'rgba(243, 156, 18, 0.7)';
            hasParticles = true;
            monsterType = 'wizard'; // 巫师
            break;
        case 'boss':
            primaryColor = '#c0392b';
            secondaryColor = '#922b21';
            detailColor = '#e74c3c';
            particleColor = 'rgba(192, 57, 43, 0.7)';
            hasParticles = true;
            hasGlow = true;
            monsterType = 'demon'; // 恶魔
            break;
        case 'basic':
        default:
            primaryColor = '#e74c3c';
            secondaryColor = '#c0392b';
            detailColor = '#ff6b6b';
            monsterType = 'slime'; // 史莱姆
            break;
    }
    
    // 如果敌人被冰冻，改变颜色
    if (enemy.isFrozen) {
        primaryColor = '#3498db';
        secondaryColor = '#2980b9';
        detailColor = '#85c1e9';
        particleColor = 'rgba(52, 152, 219, 0.7)';
    }
    
    // 如果敌人中毒，改变颜色
    if (enemy.isPoisoned) {
        primaryColor = '#2ecc71';
        secondaryColor = '#27ae60';
        detailColor = '#7dcea0';
        particleColor = 'rgba(46, 204, 113, 0.7)';
    }
    
    // 绘制敌人阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // 根据怪物类型绘制不同的形状
    switch (monsterType) {
        case 'slime':
            drawSlimeMonster(ctx, enemy, primaryColor, secondaryColor, detailColor);
            break;
        case 'spider':
            drawSpiderMonster(ctx, enemy, primaryColor, secondaryColor, detailColor);
            break;
        case 'golem':
            drawGolemMonster(ctx, enemy, primaryColor, secondaryColor, detailColor);
            break;
        case 'wizard':
            drawWizardMonster(ctx, enemy, primaryColor, secondaryColor, detailColor);
            break;
        case 'demon':
            drawDemonMonster(ctx, enemy, primaryColor, secondaryColor, detailColor);
            break;
        default:
            // 默认绘制圆形怪物
            const bodyGradient = ctx.createRadialGradient(
                enemy.x - enemy.radius * 0.3, enemy.y - enemy.radius * 0.3, 0,
                enemy.x, enemy.y, enemy.radius
            );
            bodyGradient.addColorStop(0, primaryColor);
            bodyGradient.addColorStop(1, secondaryColor);
            
            ctx.fillStyle = bodyGradient;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 绘制敌人边缘
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // 如果是Boss，添加额外的视觉效果
    if (enemy.enemyType === 'boss') {
        // 绘制Boss光环
        const bossAuraGradient = ctx.createRadialGradient(
            enemy.x, enemy.y, enemy.radius,
            enemy.x, enemy.y, enemy.radius * 1.3
        );
        bossAuraGradient.addColorStop(0, 'rgba(192, 57, 43, 0.3)');
        bossAuraGradient.addColorStop(1, 'rgba(192, 57, 43, 0)');
        
        ctx.fillStyle = bossAuraGradient;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制Boss标记
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BOSS', enemy.x, enemy.y - enemy.radius - 15);
    }
    
    // 绘制敌人眼睛
    const eyeRadius = enemy.radius / 4;
    const eyeDistance = enemy.radius / 2;
    const eyeAngle = angleBetween(enemy.x, enemy.y, enemy.targetX, enemy.targetY);
    
    const leftEyeX = enemy.x + Math.cos(eyeAngle - 0.5) * eyeDistance;
    const leftEyeY = enemy.y + Math.sin(eyeAngle - 0.5) * eyeDistance;
    const rightEyeX = enemy.x + Math.cos(eyeAngle + 0.5) * eyeDistance;
    const rightEyeY = enemy.y + Math.sin(eyeAngle + 0.5) * eyeDistance;
    
    // 眼白
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼球
    const pupilSize = eyeRadius / 2;
    const pupilOffset = eyeRadius / 4;
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(
        leftEyeX + Math.cos(eyeAngle) * pupilOffset,
        leftEyeY + Math.sin(eyeAngle) * pupilOffset,
        pupilSize, 0, Math.PI * 2
    );
    ctx.arc(
        rightEyeX + Math.cos(eyeAngle) * pupilOffset,
        rightEyeY + Math.sin(eyeAngle) * pupilOffset,
        pupilSize, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 眼睛高光
    const highlightSize = pupilSize / 2;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(
        leftEyeX + Math.cos(eyeAngle - 0.5) * pupilOffset,
        leftEyeY + Math.sin(eyeAngle - 0.5) * pupilOffset,
        highlightSize, 0, Math.PI * 2
    );
    ctx.arc(
        rightEyeX + Math.cos(eyeAngle - 0.5) * pupilOffset,
        rightEyeY + Math.sin(eyeAngle - 0.5) * pupilOffset,
        highlightSize, 0, Math.PI * 2
    );
    ctx.fill();
    
    // 如果是远程敌人，绘制武器
    if (enemy.canShoot) {
        ctx.strokeStyle = detailColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        const weaponLength = enemy.radius * 1.2;
        const weaponX = enemy.x + Math.cos(eyeAngle) * weaponLength;
        const weaponY = enemy.y + Math.sin(eyeAngle) * weaponLength;
        
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(weaponX, weaponY);
        ctx.stroke();
        
        // 武器末端
        ctx.fillStyle = detailColor;
        ctx.beginPath();
        ctx.arc(weaponX, weaponY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 如果敌人有粒子效果
    if (hasParticles) {
        const time = Date.now() * 0.001;
        const particleCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + time;
            const distance = enemy.radius * 1.2;
            const x = enemy.x + Math.cos(angle) * distance;
            const y = enemy.y + Math.sin(angle) * distance;
            const size = 2 + Math.sin(time * 3 + i) * 1;
            
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 如果敌人有发光效果
    if (hasGlow) {
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius + 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 重置阴影
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
    
    // 敌人血条
    const healthBarWidth = enemy.radius * 2;
    const healthBarHeight = 5;
    const healthBarX = enemy.x - healthBarWidth / 2;
    const healthBarY = enemy.y - enemy.radius - 10;
    
    // 血条背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // 血条填充
    const healthGradient = ctx.createLinearGradient(
        healthBarX, healthBarY,
        healthBarX + healthBarWidth, healthBarY
    );
    healthGradient.addColorStop(0, '#ff3434');
    healthGradient.addColorStop(1, '#ff5757');
    
    ctx.fillStyle = healthGradient;
    const currentHealthWidth = (enemy.health / enemy.maxHealth) * healthBarWidth;
    ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
    
    // 血条边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // 如果敌人被减速，添加减速效果
    if (enemy.isSlowed && !enemy.isFrozen) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制减速图标
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⏱️', enemy.x, enemy.y - enemy.radius - 20);
    }
    
    // 如果敌人被冰冻，添加冰冻效果
    if (enemy.isFrozen) {
        // 冰冻光环
        ctx.globalAlpha = 0.5;
        const iceGradient = ctx.createRadialGradient(
            enemy.x, enemy.y, enemy.radius * 0.8,
            enemy.x, enemy.y, enemy.radius * 1.3
        );
        iceGradient.addColorStop(0, 'rgba(52, 152, 219, 0.3)');
        iceGradient.addColorStop(1, 'rgba(52, 152, 219, 0)');
        
        ctx.fillStyle = iceGradient;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 冰晶效果
        ctx.globalAlpha = 0.7;
        const crystalCount = 6;
        
        for (let i = 0; i < crystalCount; i++) {
            const angle = (i / crystalCount) * Math.PI * 2;
            const x = enemy.x + Math.cos(angle) * enemy.radius * 0.8;
            const y = enemy.y + Math.sin(angle) * enemy.radius * 0.8;
            
            ctx.fillStyle = '#85c1e9';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8);
            ctx.lineTo(x + Math.cos(angle + 0.5) * 5, y + Math.sin(angle + 0.5) * 5);
            ctx.closePath();
            ctx.fill();
        }
        
        // 冰冻图标
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❄️', enemy.x, enemy.y - enemy.radius - 20);
    }
    
    // 如果敌人中毒，添加中毒效果
    if (enemy.isPoisoned) {
        // 毒气效果
        ctx.globalAlpha = 0.3;
        const poisonGradient = ctx.createRadialGradient(
            enemy.x, enemy.y, enemy.radius * 0.8,
            enemy.x, enemy.y, enemy.radius * 1.3
        );
        poisonGradient.addColorStop(0, 'rgba(46, 204, 113, 0.3)');
        poisonGradient.addColorStop(1, 'rgba(46, 204, 113, 0)');
        
        ctx.fillStyle = poisonGradient;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius * 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // 毒气泡效果
        ctx.globalAlpha = 0.5;
        const bubbleCount = 4;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < bubbleCount; i++) {
            const angle = (i / bubbleCount) * Math.PI * 2 + time;
            const distance = enemy.radius * 1.1 + Math.sin(time * 2 + i) * 3;
            const x = enemy.x + Math.cos(angle) * distance;
            const y = enemy.y + Math.sin(angle) * distance - Math.sin(time + i) * 5;
            const size = 3 + Math.sin(time * 3 + i) * 1;
            
            ctx.fillStyle = 'rgba(46, 204, 113, 0.7)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 中毒图标
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☠️', enemy.x, enemy.y - enemy.radius - 20);
    }
    
    ctx.restore();
}

// 绘制投射物
function drawProjectile(ctx, projectile) {
    ctx.save();
    
    // 根据投射物特性设置不同的视觉效果
    let trailColor = projectile.color;
    let glowColor = projectile.color;
    let particleColor = projectile.color;
    
    // 根据特殊效果调整颜色
    if (projectile.piercing) {
        glowColor = '#9b59b6'; // 紫色
    } else if (projectile.explosive) {
        glowColor = '#e67e22'; // 橙色
    } else if (projectile.homing) {
        glowColor = '#3498db'; // 蓝色
    } else if (projectile.splitting) {
        glowColor = '#f1c40f'; // 黄色
    } else if (projectile.poisonous) {
        glowColor = '#2ecc71'; // 绿色
    } else if (projectile.freezing) {
        glowColor = '#3498db'; // 蓝色
    } else if (projectile.lightning) {
        glowColor = '#9b59b6'; // 紫色
    }
    
    // 绘制投射物轨迹
    const trailLength = 30; // 轨迹长度
    const trailWidth = projectile.radius * 1.5; // 轨迹宽度
    
    // 计算轨迹方向
    const angle = Math.atan2(projectile.velocityY, projectile.velocityX);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    
    // 创建轨迹渐变
    const trailGradient = ctx.createLinearGradient(
        projectile.x, projectile.y,
        projectile.x - dx * trailLength, projectile.y - dy * trailLength
    );
    trailGradient.addColorStop(0, trailColor);
    trailGradient.addColorStop(1, 'transparent');
    
    // 绘制轨迹
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(
        projectile.x - dy * trailWidth / 2,
        projectile.y + dx * trailWidth / 2
    );
    ctx.lineTo(
        projectile.x + dy * trailWidth / 2,
        projectile.y - dx * trailWidth / 2
    );
    ctx.lineTo(
        projectile.x - dx * trailLength + dy * trailWidth / 4,
        projectile.y - dy * trailLength - dx * trailWidth / 4
    );
    ctx.lineTo(
        projectile.x - dx * trailLength - dy * trailWidth / 4,
        projectile.y - dy * trailLength + dx * trailWidth / 4
    );
    ctx.closePath();
    
    ctx.fillStyle = trailGradient;
    ctx.fill();
    
    // 绘制投射物发光效果
    ctx.globalAlpha = 1;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 15;
    
    // 绘制投射物主体
    const bodyGradient = ctx.createRadialGradient(
        projectile.x - projectile.radius * 0.3, projectile.y - projectile.radius * 0.3, 0,
        projectile.x, projectile.y, projectile.radius
    );
    bodyGradient.addColorStop(0, '#ffffff');
    bodyGradient.addColorStop(0.6, projectile.color);
    bodyGradient.addColorStop(1, glowColor);
    
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制投射物边缘
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // 绘制投射物内部细节
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(
        projectile.x - projectile.radius * 0.3,
        projectile.y - projectile.radius * 0.3,
        projectile.radius * 0.3,
        0, Math.PI * 2
    );
    ctx.fill();
    
    // 添加特殊效果粒子
    const time = Date.now() * 0.001;
    
    // 根据投射物特性添加不同的粒子效果
    if (projectile.piercing) {
        // 穿透效果 - 紫色尾迹
        drawProjectileParticles(ctx, projectile, '#9b59b6', 5, 0.7, time);
    } else if (projectile.explosive) {
        // 爆炸效果 - 橙色火花
        drawProjectileParticles(ctx, projectile, '#e67e22', 6, 0.8, time);
    } else if (projectile.homing) {
        // 追踪效果 - 蓝色尾迹
        drawProjectileParticles(ctx, projectile, '#3498db', 4, 0.6, time);
    } else if (projectile.splitting) {
        // 分裂效果 - 黄色尾迹
        drawProjectileParticles(ctx, projectile, '#f1c40f', 5, 0.7, time);
    } else if (projectile.poisonous) {
        // 毒性效果 - 绿色气泡
        drawProjectileParticles(ctx, projectile, '#2ecc71', 6, 0.7, time);
    } else if (projectile.freezing) {
        // 冰冻效果 - 蓝色冰晶
        drawProjectileParticles(ctx, projectile, '#3498db', 4, 0.6, time);
    } else if (projectile.lightning) {
        // 闪电效果 - 紫色电弧
        drawProjectileParticles(ctx, projectile, '#9b59b6', 5, 0.7, time);
        
        // 额外添加电弧效果
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#9b59b6';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            const arcAngle = angle + (Math.random() - 0.5) * 1;
            const arcLength = projectile.radius * 3;
            
            ctx.beginPath();
            ctx.moveTo(projectile.x, projectile.y);
            
            let x = projectile.x;
            let y = projectile.y;
            
            for (let j = 0; j < 3; j++) {
                const segmentLength = arcLength / 3;
                const offsetAngle = arcAngle + (Math.random() - 0.5) * 1;
                
                x += Math.cos(offsetAngle) * segmentLength;
                y += Math.sin(offsetAngle) * segmentLength;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
    }
    
    ctx.restore();
}

// 辅助函数：绘制投射物粒子效果
function drawProjectileParticles(ctx, projectile, color, count, alpha, time) {
    ctx.globalAlpha = alpha;
    
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + time * 2;
        const distance = projectile.radius * 1.2;
        const x = projectile.x + Math.cos(angle) * distance;
        const y = projectile.y + Math.sin(angle) * distance;
        const size = 2 + Math.sin(time * 3 + i) * 1;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制技能效果
function drawSkillEffect(ctx, effect) {
    ctx.save();
    
    switch (effect.type) {
        case 'explosion':
            // 绘制爆炸效果
            drawExplosionEffect(ctx, effect);
            break;
            
        case 'lightning':
            // 绘制闪电效果
            drawLightningEffect(ctx, effect);
            break;
            
        case 'heal':
            // 绘制治疗效果
            drawHealEffect(ctx, effect);
            break;
    }
    
    ctx.restore();
}

// 绘制爆炸效果
function drawExplosionEffect(ctx, effect) {
    // 创建爆炸渐变
    const gradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, effect.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, ' + effect.alpha + ')');
    gradient.addColorStop(0.2, 'rgba(255, 149, 0, ' + effect.alpha + ')');
    gradient.addColorStop(0.6, 'rgba(255, 94, 58, ' + effect.alpha + ')');
    gradient.addColorStop(1, 'rgba(255, 94, 58, 0)');
    
    // 绘制爆炸主体
    ctx.globalAlpha = effect.alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加爆炸光晕
    ctx.shadowColor = 'rgba(255, 94, 58, ' + effect.alpha + ')';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加爆炸碎片
    const fragmentCount = 12;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < fragmentCount; i++) {
        const angle = (i / fragmentCount) * Math.PI * 2;
        const distance = effect.radius * (0.3 + Math.random() * 0.7);
        const x = effect.x + Math.cos(angle) * distance;
        const y = effect.y + Math.sin(angle) * distance;
        const size = 2 + Math.random() * 4;
        
        ctx.fillStyle = 'rgba(255, 255, 255, ' + effect.alpha * 0.8 + ')';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加爆炸波纹
    ctx.strokeStyle = 'rgba(255, 255, 255, ' + effect.alpha * 0.5 + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 149, 0, ' + effect.alpha * 0.7 + ')';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius * 0.9, 0, Math.PI * 2);
    ctx.stroke();
}

// 绘制闪电效果
function drawLightningEffect(ctx, effect) {
    // 设置闪电基本样式
    ctx.globalAlpha = effect.alpha;
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // 添加发光效果
    ctx.shadowColor = '#3498db';
    ctx.shadowBlur = 15;
    
    // 创建锯齿状闪电路径
    let x = effect.startX;
    let y = effect.startY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // 计算闪电总长度
    const totalDistance = distance(effect.startX, effect.startY, effect.endX, effect.endY);
    const segmentCount = Math.ceil(totalDistance / 20);
    
    // 创建锯齿状闪电路径
    for (let i = 0; i < segmentCount; i++) {
        const progress = i / segmentCount;
        const targetX = effect.startX + (effect.endX - effect.startX) * progress;
        const targetY = effect.startY + (effect.endY - effect.startY) * progress;
        
        // 添加随机偏移
        const perpX = -(effect.endY - effect.startY) / totalDistance;
        const perpY = (effect.endX - effect.startX) / totalDistance;
        
        const offset = (Math.random() - 0.5) * 30 * Math.sin(progress * Math.PI);
        
        x = targetX + perpX * offset;
        y = targetY + perpY * offset;
        
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(effect.endX, effect.endY);
    ctx.stroke();
    
    // 添加闪电分支
    const branchCount = 2;
    const branchChance = 0.6;
    
    for (let i = 1; i < segmentCount - 1; i++) {
        if (Math.random() < branchChance) {
            const progress = i / segmentCount;
            const branchX = effect.startX + (effect.endX - effect.startX) * progress;
            const branchY = effect.startY + (effect.endY - effect.startY) * progress;
            
            const branchLength = totalDistance * 0.3 * Math.random();
            const branchAngle = Math.atan2(effect.endY - effect.startY, effect.endX - effect.startX) + 
                                (Math.random() - 0.5) * Math.PI;
            
            const branchEndX = branchX + Math.cos(branchAngle) * branchLength;
            const branchEndY = branchY + Math.sin(branchAngle) * branchLength;
            
            ctx.beginPath();
            ctx.moveTo(branchX, branchY);
            
            let bx = branchX;
            let by = branchY;
            
            const branchSegments = 3;
            for (let j = 1; j <= branchSegments; j++) {
                const bp = j / branchSegments;
                const btx = branchX + (branchEndX - branchX) * bp;
                const bty = branchY + (branchEndY - branchY) * bp;
                
                const bperpX = -(branchEndY - branchY) / branchLength;
                const bperpY = (branchEndX - branchX) / branchLength;
                
                const boffset = (Math.random() - 0.5) * 15 * Math.sin(bp * Math.PI);
                
                bx = btx + bperpX * boffset;
                by = bty + bperpY * boffset;
                
                ctx.lineTo(bx, by);
            }
            
            ctx.stroke();
        }
    }
    
    // 添加闪电光晕
    ctx.globalAlpha = effect.alpha * 0.3;
    ctx.lineWidth = 8;
    ctx.shadowBlur = 25;
    
    ctx.beginPath();
    ctx.moveTo(effect.startX, effect.startY);
    ctx.lineTo(effect.endX, effect.endY);
    ctx.stroke();
    
    // 添加闪电端点效果
    ctx.globalAlpha = effect.alpha * 0.8;
    ctx.fillStyle = '#3498db';
    
    ctx.beginPath();
    ctx.arc(effect.startX, effect.startY, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(effect.endX, effect.endY, 5, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制治疗效果
function drawHealEffect(ctx, effect) {
    // 创建治疗光环渐变
    const gradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, effect.radius
    );
    gradient.addColorStop(0, 'rgba(46, 204, 113, ' + effect.alpha * 0.7 + ')');
    gradient.addColorStop(0.7, 'rgba(46, 204, 113, ' + effect.alpha * 0.3 + ')');
    gradient.addColorStop(1, 'rgba(46, 204, 113, 0)');
    
    // 绘制治疗光环
    ctx.globalAlpha = effect.alpha;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加治疗光晕
    ctx.shadowColor = 'rgba(46, 204, 113, ' + effect.alpha + ')';
    ctx.shadowBlur = 20;
    
    // 绘制治疗十字
    const crossSize = effect.radius * 0.7;
    const crossWidth = crossSize * 0.3;
    
    ctx.fillStyle = 'rgba(255, 255, 255, ' + effect.alpha + ')';
    
    // 水平部分
    ctx.beginPath();
    ctx.rect(
        effect.x - crossSize / 2,
        effect.y - crossWidth / 2,
        crossSize,
        crossWidth
    );
    ctx.fill();
    
    // 垂直部分
    ctx.beginPath();
    ctx.rect(
        effect.x - crossWidth / 2,
        effect.y - crossSize / 2,
        crossWidth,
        crossSize
    );
    ctx.fill();
    
    // 添加治疗粒子
    const particleCount = 12;
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time;
        const distance = effect.radius * (0.3 + 0.5 * Math.sin(time * 2 + i));
        const x = effect.x + Math.cos(angle) * distance;
        const y = effect.y + Math.sin(angle) * distance - Math.sin(time + i) * 5;
        const size = 3 + Math.sin(time * 3 + i) * 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, ' + effect.alpha * 0.8 + ')';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加上升的小十字
    const miniCrossCount = 8;
    
    for (let i = 0; i < miniCrossCount; i++) {
        const angle = (i / miniCrossCount) * Math.PI * 2;
        const distance = effect.radius * 0.6;
        const x = effect.x + Math.cos(angle) * distance;
        const y = effect.y + Math.sin(angle) * distance - (time * 30) % effect.radius;
        const size = 5;
        
        ctx.fillStyle = 'rgba(46, 204, 113, ' + effect.alpha * 0.7 + ')';
        
        // 小十字的水平部分
        ctx.beginPath();
        ctx.rect(x - size / 2, y - size / 6, size, size / 3);
        ctx.fill();
        
        // 小十字的垂直部分
        ctx.beginPath();
        ctx.rect(x - size / 6, y - size / 2, size / 3, size);
        ctx.fill();
    }
}

// 绘制背景网格
function drawGrid(ctx, width, height, cellSize) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // 绘制垂直线
    for (let x = 0; x <= width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // 绘制水平线
    for (let y = 0; y <= height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    ctx.restore();
}

// 绘制经验值条
function drawExperienceBar(ctx, player, x, y, width, height) {
    ctx.save();
    
    // 经验值条背景阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // 背景
    const bgGradient = ctx.createLinearGradient(x, y, x + width, y);
    bgGradient.addColorStop(0, '#2c3e50');
    bgGradient.addColorStop(1, '#34495e');
    
    // 绘制主经验条背景
    ctx.fillStyle = bgGradient;
    roundedRect(ctx, x, y, width, height, height/2);
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 经验值填充
    const expRatio = player.experience / player.experienceToNextLevel;
    const fillWidth = width * expRatio;
    
    // 经验条渐变 - 根据等级调整颜色
    const expGradient = ctx.createLinearGradient(x, y, x + width, y);
    if (player.level < 5) {
        // 初始等级使用较柔和的颜色
        expGradient.addColorStop(0, '#2ecc71');
        expGradient.addColorStop(1, '#27ae60');
    } else if (player.level < 10) {
        // 中等等级使用较强烈的颜色
        expGradient.addColorStop(0, '#3498db');
        expGradient.addColorStop(1, '#2980b9');
    } else {
        // 高等级使用炫丽的渐变
        expGradient.addColorStop(0, '#3498db');
        expGradient.addColorStop(0.5, '#9b59b6');
        expGradient.addColorStop(1, '#e74c3c');
    }
    
    // 裁剪区域（圆角）
    ctx.beginPath();
    ctx.moveTo(x + height/2, y);
    ctx.lineTo(x + width - height/2, y);
    ctx.arc(x + width - height/2, y + height/2, height/2, -Math.PI/2, Math.PI/2);
    ctx.lineTo(x + height/2, y + height);
    ctx.arc(x + height/2, y + height/2, height/2, Math.PI/2, -Math.PI/2);
    ctx.closePath();
    ctx.clip();
    
    // 绘制经验值填充
    ctx.fillStyle = expGradient;
    ctx.fillRect(x, y, fillWidth, height);
    
    // 添加分段标记
    const segmentCount = 10; // 将经验条分成10段
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i < segmentCount; i++) {
        const segX = x + (width * i / segmentCount);
        ctx.beginPath();
        ctx.moveTo(segX, y);
        ctx.lineTo(segX, y + height);
        ctx.stroke();
    }
    
    // 添加光泽效果
    const shineGradient = ctx.createLinearGradient(x, y, x, y + height);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
    
    ctx.fillStyle = shineGradient;
    ctx.fillRect(x, y, fillWidth, height);
    
    // 添加经验值粒子效果
    const time = Date.now() * 0.001;
    if (expRatio > 0.1) { // 只在有一定经验值时显示粒子
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 3; i++) {
            const particleX = x + fillWidth - Math.random() * 20;
            const particleY = y + height/2 + Math.sin(time * 3 + i) * height/3;
            const particleSize = 2 + Math.sin(time * 2 + i) * 1;
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    
    // 绘制经验值文本
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 文本阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // 当前等级（带有边框效果）
    const levelText = `Lv.${player.level}`;
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;
    ctx.strokeText(levelText, x - 30, y + height/2);
    ctx.fillText(levelText, x - 30, y + height/2);
    
    // 经验值信息（百分比显示）
    const percentage = Math.floor(expRatio * 100);
    const expText = `${Math.floor(player.experience)}/${player.experienceToNextLevel} (${percentage}%)`;
    ctx.fillText(expText, x + width/2, y + height/2);
    
    // 绘制等级提升特效
    if (player.isLevelingUp) {
        const glowIntensity = (Math.sin(time * 10) + 1) / 2;
        
        // 发光效果
        ctx.globalAlpha = glowIntensity * 0.5;
        const glowGradient = ctx.createRadialGradient(
            x + fillWidth, y + height/2, 0,
            x + fillWidth, y + height/2, height * 2
        );
        glowGradient.addColorStop(0, '#f1c40f');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x + fillWidth, y + height/2, height * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 星星粒子（减少数量以提高性能）
        ctx.globalAlpha = glowIntensity;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 + time * 3;
            const distance = height * (1 + Math.sin(time * 5 + i));
            const starX = x + fillWidth + Math.cos(angle) * distance;
            const starY = y + height/2 + Math.sin(angle) * distance;
            
            // 简化的星星绘制
            ctx.fillStyle = '#f1c40f';
            ctx.beginPath();
            ctx.arc(starX, starY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    ctx.restore();
}

// 绘制游戏统计信息
function drawStats(ctx, game, x, y) {
    ctx.save();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    
    ctx.fillText(`时间: ${Math.floor(game.time / 60)}:${(game.time % 60).toString().padStart(2, '0')}`, x, y);
    ctx.fillText(`击杀: ${game.kills}`, x, y + 20);
    ctx.fillText(`得分: ${game.score}`, x, y + 40);
    
    ctx.restore();
}

// 绘制史莱姆怪物
function drawSlimeMonster(ctx, enemy, primaryColor, secondaryColor, detailColor) {
    const x = enemy.x;
    const y = enemy.y;
    const radius = enemy.radius;
    const time = Date.now() * 0.001;
    const wobble = Math.sin(time * 3) * radius * 0.1;
    
    // 绘制史莱姆身体（波动的半圆形）
    const bodyGradient = ctx.createRadialGradient(
        x - radius * 0.2, y - radius * 0.3, 0,
        x, y, radius
    );
    bodyGradient.addColorStop(0, primaryColor);
    bodyGradient.addColorStop(1, secondaryColor);
    
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    
    // 绘制波动的上半部分
    ctx.moveTo(x - radius, y);
    
    // 左侧曲线
    ctx.bezierCurveTo(
        x - radius, y - radius * 0.5 + wobble,
        x - radius * 0.5, y - radius - wobble,
        x, y - radius
    );
    
    // 右侧曲线
    ctx.bezierCurveTo(
        x + radius * 0.5, y - radius - wobble,
        x + radius, y - radius * 0.5 + wobble,
        x + radius, y
    );
    
    // 底部平坦部分（略微波动）
    ctx.lineTo(x + radius, y + radius * 0.7 + wobble * 0.5);
    ctx.lineTo(x - radius, y + radius * 0.7 + wobble * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // 绘制史莱姆眼睛
    const eyeRadius = radius * 0.2;
    const eyeY = y - radius * 0.3;
    const eyeAngle = angleBetween(x, eyeY, enemy.targetX, enemy.targetY);
    const eyeDistance = radius * 0.4;
    
    // 左眼
    const leftEyeX = x - eyeDistance;
    const leftEyeY = eyeY;
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 右眼
    const rightEyeX = x + eyeDistance;
    const rightEyeY = eyeY;
    
    ctx.beginPath();
    ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼球
    const pupilRadius = eyeRadius * 0.6;
    const pupilOffset = eyeRadius * 0.3;
    const leftPupilX = leftEyeX + Math.cos(eyeAngle) * pupilOffset;
    const leftPupilY = leftEyeY + Math.sin(eyeAngle) * pupilOffset;
    const rightPupilX = rightEyeX + Math.cos(eyeAngle) * pupilOffset;
    const rightPupilY = rightEyeY + Math.sin(eyeAngle) * pupilOffset;
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(leftPupilX, leftPupilY, pupilRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightPupilX, rightPupilY, pupilRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制史莱姆嘴巴（微笑）
    ctx.strokeStyle = detailColor;
    ctx.lineWidth = radius * 0.1;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.arc(x, y - radius * 0.1, radius * 0.5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    
    // 绘制史莱姆表面的气泡
    const bubbleCount = 5;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < bubbleCount; i++) {
        const angle = Math.random() * Math.PI;
        const distance = Math.random() * radius * 0.8;
        const bubbleX = x + Math.cos(angle) * distance;
        const bubbleY = y - radius * 0.5 + Math.sin(angle) * distance;
        const bubbleRadius = radius * (0.05 + Math.random() * 0.1);
        
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制蜘蛛怪物
function drawSpiderMonster(ctx, enemy, primaryColor, secondaryColor, detailColor) {
    const x = enemy.x;
    const y = enemy.y;
    const radius = enemy.radius;
    const time = Date.now() * 0.001;
    
    // 计算朝向角度
    const targetAngle = angleBetween(x, y, enemy.targetX, enemy.targetY);
    
    // 绘制身体
    const bodyGradient = ctx.createRadialGradient(
        x - radius * 0.2, y - radius * 0.2, 0,
        x, y, radius * 0.8
    );
    bodyGradient.addColorStop(0, primaryColor);
    bodyGradient.addColorStop(1, secondaryColor);
    
    // 绘制蜘蛛身体（椭圆形）
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 0.8, radius * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制蜘蛛头部
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(
        x + Math.cos(targetAngle) * radius * 0.5,
        y + Math.sin(targetAngle) * radius * 0.5,
        radius * 0.5,
        0, Math.PI * 2
    );
    ctx.fill();
    
    // 绘制蜘蛛眼睛（多只眼睛）
    const eyeCount = 6;
    const eyeRadius = radius * 0.1;
    const eyeDistance = radius * 0.3;
    const eyeY = y + Math.sin(targetAngle) * radius * 0.5;
    const eyeBaseX = x + Math.cos(targetAngle) * radius * 0.5;
    
    ctx.fillStyle = '#fff';
    
    for (let i = 0; i < eyeCount; i++) {
        const eyeAngle = targetAngle + (i - (eyeCount - 1) / 2) * 0.2;
        const eyeX = eyeBaseX + Math.cos(eyeAngle + Math.PI / 2) * eyeDistance * (i % 2 === 0 ? 0.5 : 1);
        const eyeY2 = eyeY + Math.sin(eyeAngle + Math.PI / 2) * eyeDistance * (i % 2 === 0 ? 0.5 : 1);
        
        ctx.beginPath();
        ctx.arc(eyeX, eyeY2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // 眼球
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(
            eyeX + Math.cos(targetAngle) * eyeRadius * 0.3,
            eyeY2 + Math.sin(targetAngle) * eyeRadius * 0.3,
            eyeRadius * 0.6,
            0, Math.PI * 2
        );
        ctx.fill();
        
        ctx.fillStyle = '#fff';
    }
    
    // 绘制蜘蛛腿（8条）
    const legCount = 8;
    const legLength = radius * 1.5;
    const legWidth = radius * 0.15;
    
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = legWidth;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < legCount; i++) {
        const legAngle = targetAngle + Math.PI / 2 + (i / legCount) * Math.PI * 2;
        const legPhase = time * 3 + i * (Math.PI / 4);
        const legMovement = Math.sin(legPhase) * 0.2;
        
        // 腿的第一段
        const joint1X = x + Math.cos(legAngle) * radius * 0.8;
        const joint1Y = y + Math.sin(legAngle) * radius * 0.8;
        
        // 腿的第二段（关节）
        const joint2Angle = legAngle + legMovement;
        const joint2X = joint1X + Math.cos(joint2Angle) * legLength * 0.5;
        const joint2Y = joint1Y + Math.sin(joint2Angle) * legLength * 0.5;
        
        // 腿的第三段（末端）
        const joint3Angle = joint2Angle - legMovement * 2;
        const joint3X = joint2X + Math.cos(joint3Angle) * legLength * 0.7;
        const joint3Y = joint2Y + Math.sin(joint3Angle) * legLength * 0.7;
        
        // 绘制腿
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(joint1X, joint1Y, joint2X, joint2Y);
        ctx.quadraticCurveTo(
            joint2X + (joint3X - joint2X) * 0.3,
            joint2Y + (joint3Y - joint2Y) * 0.3,
            joint3X, joint3Y
        );
        ctx.stroke();
    }
    
    // 绘制蜘蛛獠牙
    const fangLength = radius * 0.3;
    const fangWidth = radius * 0.1;
    const fangBaseX = x + Math.cos(targetAngle) * radius * 0.9;
    const fangBaseY = y + Math.sin(targetAngle) * radius * 0.9;
    const fangSpacing = radius * 0.3;
    
    ctx.fillStyle = detailColor;
    
    // 左獠牙
    ctx.save();
    ctx.translate(fangBaseX - fangSpacing / 2, fangBaseY);
    ctx.rotate(targetAngle + Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-fangWidth / 2, fangLength);
    ctx.lineTo(fangWidth / 2, fangLength);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // 右獠牙
    ctx.save();
    ctx.translate(fangBaseX + fangSpacing / 2, fangBaseY);
    ctx.rotate(targetAngle - Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-fangWidth / 2, fangLength);
    ctx.lineTo(fangWidth / 2, fangLength);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// 绘制石头人怪物
function drawGolemMonster(ctx, enemy, primaryColor, secondaryColor, detailColor) {
    const x = enemy.x;
    const y = enemy.y;
    const radius = enemy.radius;
    const time = Date.now() * 0.001;
    
    // 计算朝向角度
    const targetAngle = angleBetween(x, y, enemy.targetX, enemy.targetY);
    
    // 石头人身体由多个石块组成
    
    // 绘制主体（躯干）
    const bodyWidth = radius * 1.4;
    const bodyHeight = radius * 1.6;
    
    // 身体阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    // 身体渐变
    const bodyGradient = ctx.createLinearGradient(
        x - bodyWidth / 2, y - bodyHeight / 2,
        x + bodyWidth / 2, y + bodyHeight / 2
    );
    bodyGradient.addColorStop(0, primaryColor);
    bodyGradient.addColorStop(1, secondaryColor);
    
    // 绘制身体
    ctx.fillStyle = bodyGradient;
    roundedRect(ctx, x - bodyWidth / 2, y - bodyHeight / 2, bodyWidth, bodyHeight, radius * 0.3);
    
    // 绘制头部
    const headSize = radius * 0.9;
    const headX = x;
    const headY = y - bodyHeight / 2 - headSize / 2 + radius * 0.2;
    
    // 头部渐变
    const headGradient = ctx.createLinearGradient(
        headX - headSize / 2, headY - headSize / 2,
        headX + headSize / 2, headY + headSize / 2
    );
    headGradient.addColorStop(0, primaryColor);
    headGradient.addColorStop(1, secondaryColor);
    
    // 绘制头部
    ctx.fillStyle = headGradient;
    roundedRect(ctx, headX - headSize / 2, headY - headSize / 2, headSize, headSize, radius * 0.2);
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 绘制眼睛
    const eyeSize = radius * 0.25;
    const eyeY = headY;
    const eyeSpacing = radius * 0.4;
    
    // 眼睛发光效果
    ctx.shadowColor = detailColor;
    ctx.shadowBlur = 10;
    
    // 左眼
    ctx.fillStyle = detailColor;
    ctx.beginPath();
    ctx.arc(headX - eyeSpacing / 2, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    ctx.arc(headX + eyeSpacing / 2, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // 绘制石头纹理
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    
    // 身体纹理
    for (let i = 0; i < 5; i++) {
        const crackX = x - bodyWidth / 2 + Math.random() * bodyWidth;
        const crackY = y - bodyHeight / 2 + Math.random() * bodyHeight;
        const crackLength = radius * (0.3 + Math.random() * 0.5);
        const crackAngle = Math.random() * Math.PI * 2;
        
        ctx.beginPath();
        ctx.moveTo(crackX, crackY);
        ctx.lineTo(
            crackX + Math.cos(crackAngle) * crackLength,
            crackY + Math.sin(crackAngle) * crackLength
        );
        ctx.stroke();
    }
    
    // 头部纹理
    for (let i = 0; i < 3; i++) {
        const crackX = headX - headSize / 2 + Math.random() * headSize;
        const crackY = headY - headSize / 2 + Math.random() * headSize;
        const crackLength = radius * (0.2 + Math.random() * 0.3);
        const crackAngle = Math.random() * Math.PI * 2;
        
        ctx.beginPath();
        ctx.moveTo(crackX, crackY);
        ctx.lineTo(
            crackX + Math.cos(crackAngle) * crackLength,
            crackY + Math.sin(crackAngle) * crackLength
        );
        ctx.stroke();
    }
    
    // 绘制手臂
    const armWidth = radius * 0.5;
    const armLength = radius * 1.2;
    const shoulderY = y - bodyHeight / 2 + radius * 0.5;
    
    // 左臂
    const leftArmAngle = targetAngle - Math.PI / 2 + Math.sin(time * 2) * 0.2;
    const leftShoulderX = x - bodyWidth / 2;
    
    ctx.fillStyle = secondaryColor;
    ctx.save();
    ctx.translate(leftShoulderX, shoulderY);
    ctx.rotate(leftArmAngle);
    roundedRect(ctx, -armWidth / 4, 0, armWidth, armLength, radius * 0.2);
    
    // 左手
    const handSize = radius * 0.6;
    ctx.translate(armWidth / 2, armLength);
    ctx.rotate(Math.sin(time * 2) * 0.3);
    roundedRect(ctx, -handSize / 2, 0, handSize, handSize, radius * 0.1);
    ctx.restore();
    
    // 右臂
    const rightArmAngle = targetAngle + Math.PI / 2 - Math.sin(time * 2) * 0.2;
    const rightShoulderX = x + bodyWidth / 2;
    
    ctx.fillStyle = secondaryColor;
    ctx.save();
    ctx.translate(rightShoulderX, shoulderY);
    ctx.rotate(rightArmAngle);
    roundedRect(ctx, -armWidth * 3/4, 0, armWidth, armLength, radius * 0.2);
    
    // 右手
    ctx.translate(armWidth / 2, armLength);
    ctx.rotate(-Math.sin(time * 2) * 0.3);
    roundedRect(ctx, -handSize / 2, 0, handSize, handSize, radius * 0.1);
    ctx.restore();
    
    // 绘制腿
    const legWidth = radius * 0.6;
    const legLength = radius * 0.9;
    const hipY = y + bodyHeight / 2 - radius * 0.2;
    
    // 左腿
    const leftHipX = x - bodyWidth / 4;
    ctx.fillStyle = secondaryColor;
    roundedRect(ctx, leftHipX - legWidth / 2, hipY, legWidth, legLength, radius * 0.2);
    
    // 右腿
    const rightHipX = x + bodyWidth / 4;
    roundedRect(ctx, rightHipX - legWidth / 2, hipY, legWidth, legLength, radius * 0.2);
    
    // 绘制能量光环（坦克特有）
    if (enemy.isAlive) {
        ctx.globalAlpha = 0.3 + Math.sin(time * 3) * 0.1;
        const glowGradient = ctx.createRadialGradient(
            x, y, radius * 0.8,
            x, y, radius * 2
        );
        glowGradient.addColorStop(0, detailColor);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制能量粒子
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = detailColor;
        
        for (let i = 0; i < 8; i++) {
            const particleAngle = time * 2 + i * (Math.PI / 4);
            const distance = radius * (1.3 + Math.sin(time * 5 + i) * 0.3);
            const particleX = x + Math.cos(particleAngle) * distance;
            const particleY = y + Math.sin(particleAngle) * distance;
            const particleSize = radius * (0.1 + Math.sin(time * 3 + i) * 0.05);
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
}

// 辅助函数：绘制圆角矩形
function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// 绘制巫师怪物(远程攻击型)
function drawWizardMonster(ctx, enemy, primaryColor, secondaryColor, detailColor) {
    const x = enemy.x;
    const y = enemy.y;
    const radius = enemy.radius;
    const time = Date.now() * 0.001;
    
    // 计算朝向角度
    const targetAngle = angleBetween(x, y, enemy.targetX, enemy.targetY);
    
    // 绘制斗篷
    const cloakWidth = radius * 2;
    const cloakHeight = radius * 2.2;
    
    // 斗篷摆动效果
    const swayAmount = Math.sin(time * 2) * radius * 0.1;
    
    // 斗篷渐变
    const cloakGradient = ctx.createLinearGradient(
        x - cloakWidth/2, y - cloakHeight/2,
        x + cloakWidth/2, y + cloakHeight/2
    );
    cloakGradient.addColorStop(0, primaryColor);
    cloakGradient.addColorStop(1, secondaryColor);
    
    ctx.fillStyle = cloakGradient;
    
    // 绘制斗篷主体
    ctx.beginPath();
    ctx.moveTo(x - cloakWidth/2 + swayAmount, y - cloakHeight/2);
    ctx.quadraticCurveTo(
        x, y - cloakHeight/2,
        x + cloakWidth/2 + swayAmount, y - cloakHeight/2
    );
    ctx.lineTo(x + cloakWidth/2 + swayAmount * 2, y + cloakHeight/2);
    ctx.quadraticCurveTo(
        x, y + cloakHeight/2 - radius * 0.3,
        x - cloakWidth/2 + swayAmount * 2, y + cloakHeight/2
    );
    ctx.closePath();
    ctx.fill();
    
    // 绘制头部(兜帽)
    const hoodSize = radius * 0.8;
    const hoodY = y - cloakHeight/2 + hoodSize/2;
    
    // 兜帽渐变
    const hoodGradient = ctx.createRadialGradient(
        x, hoodY, 0,
        x, hoodY, hoodSize
    );
    hoodGradient.addColorStop(0, primaryColor);
    hoodGradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    
    ctx.fillStyle = hoodGradient;
    ctx.beginPath();
    ctx.arc(x, hoodY, hoodSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制眼睛(发光效果)
    const eyeSpacing = radius * 0.3;
    const eyeY = hoodY + radius * 0.1;
    const eyeSize = radius * 0.15;
    
    // 眼睛发光
    ctx.shadowColor = detailColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = detailColor;
    
    // 左眼
    ctx.beginPath();
    ctx.arc(x - eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    ctx.arc(x + eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // 绘制法杖
    const staffLength = radius * 2;
    const staffWidth = radius * 0.15;
    const staffAngle = targetAngle + Math.PI/4 + Math.sin(time * 3) * 0.1;
    const staffX = x + Math.cos(staffAngle) * radius * 0.8;
    const staffY = y + Math.sin(staffAngle) * radius * 0.8;
    
    // 法杖主体
    ctx.save();
    ctx.translate(staffX, staffY);
    ctx.rotate(staffAngle);
    
    // 法杖渐变
    const staffGradient = ctx.createLinearGradient(0, -staffLength/2, 0, staffLength/2);
    staffGradient.addColorStop(0, '#8B4513');
    staffGradient.addColorStop(1, '#654321');
    
    ctx.fillStyle = staffGradient;
    roundedRect(ctx, -staffWidth/2, -staffLength/2, staffWidth, staffLength, staffWidth/2);
    
    // 法杖顶端宝石
    const gemSize = radius * 0.4;
    ctx.translate(0, -staffLength/2);
    
    // 宝石发光效果
    ctx.shadowColor = detailColor;
    ctx.shadowBlur = 15;
    
    // 宝石渐变
    const gemGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gemSize);
    gemGradient.addColorStop(0, '#fff');
    gemGradient.addColorStop(0.5, detailColor);
    gemGradient.addColorStop(1, primaryColor);
    
    ctx.fillStyle = gemGradient;
    ctx.beginPath();
    ctx.arc(0, 0, gemSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制能量光环
    ctx.globalAlpha = 0.3 + Math.sin(time * 4) * 0.1;
    const glowSize = gemSize * 2;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
    glowGradient.addColorStop(0, detailColor);
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    ctx.globalAlpha = 1;
    
    // 绘制能量粒子
    if (enemy.isAlive) {
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = detailColor;
        
        for (let i = 0; i < 5; i++) {
            const particleAngle = time * 3 + i * (Math.PI * 2 / 5);
            const particleDistance = radius * (1 + Math.sin(time * 5 + i) * 0.2);
            const particleX = staffX + Math.cos(particleAngle) * particleDistance;
            const particleY = staffY - staffLength/2 + Math.sin(particleAngle) * particleDistance;
            const particleSize = radius * 0.1 * (0.5 + Math.sin(time * 3 + i) * 0.5);
            
            ctx.beginPath();
            ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
}

// 绘制恶魔怪物
function drawDemonMonster(ctx, enemy, primaryColor, secondaryColor, detailColor) {
    const x = enemy.x;
    const y = enemy.y;
    const radius = enemy.radius;
    const time = Date.now() * 0.001;
    
    // 绘制恶魔头部
    const headSize = radius * 0.8;
    const headX = x;
    const headY = y - headSize / 2;
    
    // 头部渐变
    const headGradient = ctx.createLinearGradient(
        headX - headSize / 2, headY - headSize / 2,
        headX + headSize / 2, headY + headSize / 2
    );
    headGradient.addColorStop(0, primaryColor);
    headGradient.addColorStop(1, secondaryColor);
    
    // 绘制头部
    ctx.fillStyle = headGradient;
    roundedRect(ctx, headX - headSize / 2, headY - headSize / 2, headSize, headSize, radius * 0.2);
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // 绘制眼睛
    const eyeSize = radius * 0.25;
    const eyeY = headY;
    const eyeSpacing = radius * 0.4;
    
    // 眼睛发光效果
    ctx.shadowColor = detailColor;
    ctx.shadowBlur = 10;
    
    // 左眼
    ctx.fillStyle = detailColor;
    ctx.beginPath();
    ctx.arc(headX - eyeSpacing / 2, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    ctx.arc(headX + eyeSpacing / 2, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // 绘制恶魔身体
    const bodyWidth = radius * 1.2;
    const bodyHeight = radius * 1.4;
    
    // 身体阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    // 身体渐变
    const bodyGradient = ctx.createLinearGradient(
        x - bodyWidth / 2, y - bodyHeight / 2,
        x + bodyWidth / 2, y + bodyHeight / 2
    );
    bodyGradient.addColorStop(0, primaryColor);
    bodyGradient.addColorStop(1, secondaryColor);
    
    // 绘制身体
    ctx.fillStyle = bodyGradient;
    roundedRect(ctx, x - bodyWidth / 2, y - bodyHeight / 2, bodyWidth, bodyHeight, radius * 0.3);
    
    // 绘制恶魔手臂
    const armWidth = radius * 0.5;
    const armLength = radius * 1.2;
    const shoulderY = y - bodyHeight / 2 + radius * 0.5;
    
    // 左臂
    const leftArmAngle = Math.PI / 4 + Math.sin(time * 2) * 0.2;
    const leftShoulderX = x - bodyWidth / 2;
    
    ctx.fillStyle = secondaryColor;
    ctx.save();
    ctx.translate(leftShoulderX, shoulderY);
    ctx.rotate(leftArmAngle);
    roundedRect(ctx, -armWidth / 4, 0, armWidth, armLength, radius * 0.2);
    
    // 左手
    const handSize = radius * 0.6;
    ctx.translate(armWidth / 2, armLength);
    ctx.rotate(Math.sin(time * 2) * 0.3);
    roundedRect(ctx, -handSize / 2, 0, handSize, handSize, radius * 0.1);
    ctx.restore();
    
    // 右臂
    const rightArmAngle = Math.PI / 4 - Math.sin(time * 2) * 0.2;
    const rightShoulderX = x + bodyWidth / 2;
    
    ctx.fillStyle = secondaryColor;
    ctx.save();
    ctx.translate(rightShoulderX, shoulderY);
    ctx.rotate(rightArmAngle);
    roundedRect(ctx, -armWidth * 3/4, 0, armWidth, armLength, radius * 0.2);
    
    // 右手
    ctx.translate(armWidth / 2, armLength);
    ctx.rotate(-Math.sin(time * 2) * 0.3);
    roundedRect(ctx, -handSize / 2, 0, handSize, handSize, radius * 0.1);
    ctx.restore();
    
    // 绘制恶魔腿
    const legWidth = radius * 0.6;
    const legLength = radius * 0.9;
    const hipY = y + bodyHeight / 2 - radius * 0.2;
    
    // 左腿
    const leftHipX = x - bodyWidth / 4;
    ctx.fillStyle = secondaryColor;
    roundedRect(ctx, leftHipX - legWidth / 2, hipY, legWidth, legLength, radius * 0.2);
    
    // 右腿
    const rightHipX = x + bodyWidth / 4;
    roundedRect(ctx, rightHipX - legWidth / 2, hipY, legWidth, legLength, radius * 0.2);
    
    // 绘制恶魔尾巴
    const tailLength = radius * 1.5;
    const tailWidth = radius * 0.2;
    const tailX = x + Math.cos(Math.PI / 4) * tailLength;
    const tailY = y + Math.sin(Math.PI / 4) * tailLength;
    
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tailX + tailWidth, tailY);
    ctx.lineTo(tailX + tailWidth * 0.7, tailY + tailWidth * 0.7);
    ctx.lineTo(tailX, tailY + tailWidth);
    ctx.closePath();
    ctx.fill();
    
    // 绘制恶魔爪子
    const clawWidth = radius * 0.2;
    const clawLength = radius * 0.5;
    const clawX = x + Math.cos(Math.PI / 4) * tailLength;
    const clawY = y + Math.sin(Math.PI / 4) * tailLength;
    
    ctx.fillStyle = detailColor;
    ctx.beginPath();
    ctx.moveTo(clawX, clawY);
    ctx.lineTo(clawX + clawWidth, clawY);
    ctx.lineTo(clawX + clawWidth * 0.7, clawY + clawLength);
    ctx.lineTo(clawX, clawY + clawLength);
    ctx.closePath();
    ctx.fill();
    
    // 绘制恶魔翅膀
    const wingWidth = radius * 1.2;
    const wingHeight = radius * 1.5;
    const wingX = x + Math.cos(Math.PI / 4) * tailLength;
    const wingY = y + Math.sin(Math.PI / 4) * tailLength;
    
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.moveTo(wingX, wingY);
    ctx.lineTo(wingX + wingWidth, wingY);
    ctx.lineTo(wingX + wingWidth * 0.7, wingY + wingHeight);
    ctx.lineTo(wingX, wingY + wingHeight);
    ctx.closePath();
    ctx.fill();
}

// 绘制忍者怪物(快速移动型)
function drawNinjaMonster(ctx, enemy, primaryColor, secondaryColor, detailColor) {
    const x = enemy.x;
    const y = enemy.y;
    const radius = enemy.radius;
    const time = Date.now() * 0.001;
    
    // 计算朝向角度
    const targetAngle = angleBetween(x, y, enemy.targetX, enemy.targetY);
    
    // 绘制忍者身体
    const bodyWidth = radius * 1.2;
    const bodyHeight = radius * 1.4;
    
    // 身体渐变
    const bodyGradient = ctx.createLinearGradient(
        x - bodyWidth/2, y - bodyHeight/2,
        x + bodyWidth/2, y + bodyHeight/2
    );
    bodyGradient.addColorStop(0, primaryColor);
    bodyGradient.addColorStop(1, secondaryColor);
    
    // 绘制身体
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(x, y, bodyWidth/2, bodyHeight/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制头部
    const headSize = radius * 0.6;
    const headY = y - bodyHeight/2;
    
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(x, headY, headSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制忍者面罩
    ctx.fillStyle = secondaryColor;
    ctx.beginPath();
    ctx.arc(x, headY, headSize * 0.9, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制眼睛
    const eyeSpacing = radius * 0.25;
    const eyeY = headY;
    const eyeSize = radius * 0.12;
    
    // 眼睛发光效果
    ctx.shadowColor = detailColor;
    ctx.shadowBlur = 5;
    ctx.fillStyle = detailColor;
    
    // 左眼
    ctx.beginPath();
    ctx.ellipse(x - eyeSpacing, eyeY, eyeSize, eyeSize/2, targetAngle, 0, Math.PI * 2);
    ctx.fill();
    
    // 右眼
    ctx.beginPath();
    ctx.ellipse(x + eyeSpacing, eyeY, eyeSize, eyeSize/2, targetAngle, 0, Math.PI * 2);
    ctx.fill();
    
    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // 绘制围巾
    const scarfWidth = radius * 1.4;
    const scarfHeight = radius * 0.4;
    const scarfY = headY + headSize * 0.7;
    
    // 围巾飘动效果
    const scarfWave = Math.sin(time * 5) * radius * 0.2;
    
    ctx.fillStyle = detailColor;
    ctx.beginPath();
    ctx.moveTo(x - scarfWidth/2, scarfY);
    ctx.quadraticCurveTo(
        x, scarfY + scarfHeight + scarfWave,
        x + scarfWidth/2 + scarfWave, scarfY
    );
    ctx.lineTo(x + scarfWidth/2, scarfY + scarfHeight);
    ctx.quadraticCurveTo(
        x, scarfY + scarfHeight * 2,
        x - scarfWidth/2, scarfY + scarfHeight
    );
    ctx.closePath();
    ctx.fill();
    
    // 绘制手臂
    const armWidth = radius * 0.3;
    const armLength = radius * 0.8;
    
    // 手臂摆动效果
    const armSwing = Math.sin(time * 10) * Math.PI/4;
    
    // 左臂
    ctx.fillStyle = primaryColor;
    ctx.save();
    ctx.translate(x - bodyWidth/2, y - bodyHeight/4);
    ctx.rotate(-Math.PI/4 + armSwing);
    roundedRect(ctx, -armWidth/2, 0, armWidth, armLength, armWidth/2);
    ctx.restore();
    
    // 右臂
    ctx.save();
    ctx.translate(x + bodyWidth/2, y - bodyHeight/4);
    ctx.rotate(Math.PI/4 - armSwing);
    roundedRect(ctx, -armWidth/2, 0, armWidth, armLength, armWidth/2);
    ctx.restore();
    
    // 绘制腿
    const legWidth = radius * 0.35;
    const legLength = radius * 0.9;
    
    // 腿部摆动效果
    const legSwing = Math.sin(time * 10) * Math.PI/6;
    
    // 左腿
    ctx.fillStyle = primaryColor;
    ctx.save();
    ctx.translate(x - bodyWidth/4, y + bodyHeight/2);
    ctx.rotate(legSwing);
    roundedRect(ctx, -legWidth/2, 0, legWidth, legLength, legWidth/2);
    ctx.restore();
    
    // 右腿
    ctx.save();
    ctx.translate(x + bodyWidth/4, y + bodyHeight/2);
    ctx.rotate(-legSwing);
    roundedRect(ctx, -legWidth/2, 0, legWidth, legLength, legWidth/2);
    ctx.restore();
    
    // 绘制速度线条效果
    if (enemy.isMoving) {
        ctx.strokeStyle = detailColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        
        const speedLines = 8;
        const maxLength = radius * 2;
        
        for (let i = 0; i < speedLines; i++) {
            const angle = (i / speedLines) * Math.PI * 2;
            const length = maxLength * (0.5 + Math.random() * 0.5);
            const startDistance = radius * (1 + Math.random() * 0.5);
            
            const startX = x + Math.cos(angle) * startDistance;
            const startY = y + Math.sin(angle) * startDistance;
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    // 绘制残影效果
    if (enemy.isMoving) {
        const afterimageCount = 3;
        ctx.globalAlpha = 0.2;
        
        for (let i = 1; i <= afterimageCount; i++) {
            const offset = i * radius * 0.5;
            const angle = targetAngle + Math.PI; // 残影在移动方向的反方向
            
            const afterimageX = x + Math.cos(angle) * offset;
            const afterimageY = y + Math.sin(angle) * offset;
            
            // 绘制残影身体
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.ellipse(afterimageX, afterimageY, bodyWidth/2, bodyHeight/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 绘制残影头部
            const afterimageHeadY = afterimageY - bodyHeight/2;
            ctx.beginPath();
            ctx.arc(afterimageX, afterimageHeadY, headSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
    }
} 