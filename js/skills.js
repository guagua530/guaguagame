/**
 * 技能系统
 */

// 所有可用技能的定义
const SKILLS = {
    // 被动技能 - 属性提升类
    health_boost: {
        id: 'health_boost',
        name: '生命强化',
        description: '增加50点最大生命值',
        type: 'passive',
        rarity: 'common',
        icon: '❤️',
        apply: (player) => {
            player.maxHealth += 50;
            player.health += 50;
        }
    },
    speed_boost: {
        id: 'speed_boost',
        name: '速度提升',
        description: '移动速度提高25%',
        type: 'passive',
        rarity: 'common',
        icon: '👟',
        apply: (player) => {
            player.moveSpeed *= 1.25;
        }
    },
    attack_speed: {
        id: 'attack_speed',
        name: '攻击速度',
        description: '攻击速度提高30%',
        type: 'passive',
        rarity: 'uncommon',
        icon: '⚡',
        apply: (player) => {
            player.attackSpeed *= 1.3;
        }
    },
    damage_boost: {
        id: 'damage_boost',
        name: '伤害提升',
        description: '攻击伤害提高25%',
        type: 'passive',
        rarity: 'uncommon',
        icon: '💪',
        apply: (player) => {
            player.attackDamage *= 1.25;
        }
    },
    range_boost: {
        id: 'range_boost',
        name: '攻击范围',
        description: '攻击范围提高20%',
        type: 'passive',
        rarity: 'common',
        icon: '🔍',
        apply: (player) => {
            player.attackRange *= 1.2;
        }
    },
    
    // 投射物效果类
    explosive: {
        id: 'explosive',
        name: '爆炸弹',
        description: '你的攻击命中时产生爆炸，对周围敌人造成50%伤害',
        type: 'projectile',
        rarity: 'rare',
        icon: '💥',
        apply: (player) => {
            // 在player.attack方法中应用
        }
    },
    homing: {
        id: 'homing',
        name: '追踪弹',
        description: '你的攻击会自动追踪敌人',
        type: 'projectile',
        rarity: 'uncommon',
        icon: '🎯',
        apply: (player) => {
            // 在player.attack方法中应用
        }
    },
    split: {
        id: 'split',
        name: '分裂弹',
        description: '你的攻击命中敌人后分裂成3个较小的投射物',
        type: 'projectile',
        rarity: 'rare',
        icon: '🔱',
        apply: (player) => {
            // 在player.attack方法中应用
        }
    },
    poison: {
        id: 'poison',
        name: '毒性攻击',
        description: '你的攻击使敌人中毒，3秒内每0.5秒受到10%伤害',
        type: 'projectile',
        rarity: 'uncommon',
        icon: '☠️',
        apply: (player) => {
            // 在player.attack方法中应用
        }
    },
    frost: {
        id: 'frost',
        name: '冰冻攻击',
        description: '你的攻击使敌人冰冻2秒，无法移动',
        type: 'projectile',
        rarity: 'uncommon',
        icon: '❄️',
        apply: (player) => {
            // 在player.attack方法中应用
        }
    },
    lightning: {
        id: 'lightning',
        name: '闪电链',
        description: '你的攻击可以在敌人之间跳跃，最多连接3个目标',
        type: 'projectile',
        rarity: 'rare',
        icon: '⚡',
        apply: (player) => {
            // 在player.attack方法中应用
        }
    },
    
    // 主动技能
    dash: {
        id: 'dash',
        name: '冲刺',
        description: '按空格键冲刺，冷却时间减少50%',
        type: 'active',
        rarity: 'uncommon',
        icon: '💨',
        apply: (player) => {
            // 冲刺冷却时间减半
            player.dashCooldown *= 0.5;
        }
    },
    heal: {
        id: 'heal',
        name: '治疗',
        description: '每30秒自动恢复20%最大生命值',
        type: 'active',
        rarity: 'rare',
        icon: '💊',
        cooldown: 30,
        apply: (player, game) => {
            const healAmount = player.maxHealth * 0.2;
            player.heal(healAmount);
            
            // 创建治疗效果
            return {
                type: 'heal',
                x: player.x,
                y: player.y,
                radius: player.radius * 2,
                duration: 1,
                alpha: 1
            };
        }
    },
    shield: {
        id: 'shield',
        name: '护盾',
        description: '受到致命伤害时，获得3秒无敌并恢复30%生命值，冷却时间60秒',
        type: 'active',
        rarity: 'epic',
        icon: '🛡️',
        cooldown: 60,
        apply: (player) => {
            player.invulnerableTime = 3;
            player.heal(player.maxHealth * 0.3);
        }
    }
};

// 根据稀有度获取技能颜色
function getSkillColor(rarity) {
    switch (rarity) {
        case 'common':
            return '#3498db'; // 蓝色
        case 'uncommon':
            return '#2ecc71'; // 绿色
        case 'rare':
            return '#9b59b6'; // 紫色
        case 'epic':
            return '#f39c12'; // 橙色
        case 'legendary':
            return '#e74c3c'; // 红色
        default:
            return '#ffffff'; // 白色
    }
}

// 获取随机技能选项
function getRandomSkillOptions(player) {
    // 获取所有可用技能
    const availableSkills = Object.values(SKILLS).filter(skill => {
        // 过滤掉已经拥有的最高等级技能
        const existingSkill = player.skills.find(s => s.id === skill.id);
        return !existingSkill || existingSkill.level < 5;
    });
    
    // 如果没有足够的可用技能，返回所有可用技能
    if (availableSkills.length <= 3) {
        return availableSkills;
    }
    
    // 根据稀有度分配权重
    const weightedSkills = availableSkills.map(skill => {
        let weight;
        switch (skill.rarity) {
            case 'common':
                weight = 100;
                break;
            case 'uncommon':
                weight = 60;
                break;
            case 'rare':
                weight = 30;
                break;
            case 'epic':
                weight = 10;
                break;
            case 'legendary':
                weight = 3;
                break;
            default:
                weight = 1;
                break;
        }
        return { skill, weight };
    });
    
    // 选择3个技能
    const selectedSkills = [];
    for (let i = 0; i < 3; i++) {
        if (weightedSkills.length === 0) break;
        
        // 计算总权重
        const totalWeight = weightedSkills.reduce((sum, item) => sum + item.weight, 0);
        
        // 随机选择一个技能
        let randomWeight = Math.random() * totalWeight;
        let selectedIndex = 0;
        
        for (let j = 0; j < weightedSkills.length; j++) {
            randomWeight -= weightedSkills[j].weight;
            if (randomWeight <= 0) {
                selectedIndex = j;
                break;
            }
        }
        
        // 添加到已选技能
        selectedSkills.push(weightedSkills[selectedIndex].skill);
        
        // 从可选技能中移除
        weightedSkills.splice(selectedIndex, 1);
    }
    
    return selectedSkills;
}

// 创建技能选择UI
function createSkillOptionElement(skill, onSelect, player) {
    const element = document.createElement('div');
    element.className = 'skill-option';
    element.style.borderColor = getSkillColor(skill.rarity);
    
    // 添加光晕效果
    element.style.boxShadow = `0 0 15px ${getSkillColor(skill.rarity)}40`;
    
    // 技能名称
    const nameElement = document.createElement('div');
    nameElement.className = 'skill-name';
    nameElement.innerHTML = `<span>${skill.icon}</span> ${skill.name}`;
    nameElement.style.color = getSkillColor(skill.rarity);
    
    // 检查玩家是否已有此技能
    const existingSkill = player.skills.find(s => s.id === skill.id);
    const currentLevel = existingSkill ? existingSkill.level : 0;
    const nextLevel = currentLevel + 1;
    
    // 添加当前等级信息（如果有）
    if (currentLevel > 0) {
        const levelBadge = document.createElement('div');
        levelBadge.className = 'skill-level';
        levelBadge.textContent = `Lv.${currentLevel}`;
        levelBadge.style.backgroundColor = `${getSkillColor(skill.rarity)}30`;
        levelBadge.style.color = getSkillColor(skill.rarity);
        nameElement.appendChild(levelBadge);
    }
    
    // 技能描述
    const descElement = document.createElement('div');
    descElement.className = 'skill-description';
    
    // 基础描述
    let description = skill.description;
    
    // 添加下一级效果具体数值
    const effectsElement = document.createElement('div');
    effectsElement.className = 'skill-next-level';
    effectsElement.innerHTML = `<span>下一级效果 (Lv.${nextLevel}):</span>`;
    
    // 根据技能类型添加具体效果数值
    const effectsList = document.createElement('ul');
    
    switch (skill.id) {
        case 'health_boost':
            effectsList.innerHTML = `<li>最大生命值 +${50 * nextLevel}</li>`;
            break;
        case 'speed_boost':
            effectsList.innerHTML = `<li>移动速度 +${50 * nextLevel}</li>`;
            break;
        case 'attack_speed':
            effectsList.innerHTML = `<li>攻击速度 +${0.5 * nextLevel}</li>`;
            break;
        case 'damage_boost':
            effectsList.innerHTML = `<li>攻击伤害 +${10 * nextLevel}</li>`;
            break;
        case 'range_boost':
            effectsList.innerHTML = `<li>攻击范围 +${100 * nextLevel}</li>`;
            break;
        case 'explosive':
            effectsList.innerHTML = `
                <li>爆炸范围: ${100 + nextLevel * 20}</li>
                <li>爆炸伤害: ${Math.round(50 + nextLevel * 10)}%</li>
            `;
            break;
        case 'homing':
            effectsList.innerHTML = `<li>追踪强度: ${0.1 + nextLevel * 0.02}</li>`;
            break;
        case 'split':
            effectsList.innerHTML = `<li>分裂数量: ${3 + nextLevel}</li>`;
            break;
        case 'poison':
            effectsList.innerHTML = `
                <li>毒性伤害: ${Math.round(20 + nextLevel * 5)}%</li>
                <li>持续时间: ${3 + nextLevel}秒</li>
            `;
            break;
        case 'frost':
            effectsList.innerHTML = `<li>冰冻时间: ${2 + nextLevel * 0.5}秒</li>`;
            break;
        case 'lightning':
            effectsList.innerHTML = `
                <li>连锁数量: ${3 + nextLevel}</li>
                <li>连锁范围: ${150 + nextLevel * 30}</li>
            `;
            break;
        case 'dash':
            effectsList.innerHTML = `<li>冲刺冷却: -${50 * nextLevel}%</li>`;
            break;
        case 'heal':
            effectsList.innerHTML = `<li>治疗量: ${20 + nextLevel * 5}%</li>`;
            break;
        case 'shield':
            effectsList.innerHTML = `
                <li>无敌时间: ${3 + nextLevel * 0.5}秒</li>
                <li>恢复生命: ${30 + nextLevel * 5}%</li>
            `;
            break;
    }
    
    effectsElement.appendChild(effectsList);
    
    descElement.textContent = description;
    descElement.appendChild(effectsElement);
    
    // 技能稀有度
    const rarityElement = document.createElement('div');
    rarityElement.className = 'skill-rarity';
    rarityElement.textContent = skill.rarity.charAt(0).toUpperCase() + skill.rarity.slice(1);
    rarityElement.style.backgroundColor = `${getSkillColor(skill.rarity)}20`;
    rarityElement.style.color = getSkillColor(skill.rarity);
    rarityElement.style.border = `1px solid ${getSkillColor(skill.rarity)}40`;
    
    // 如果技能已达到最高等级，显示提示
    if (currentLevel === 5) {
        const maxLevelElement = document.createElement('div');
        maxLevelElement.className = 'skill-max-level';
        maxLevelElement.textContent = '已达最高等级';
        maxLevelElement.style.backgroundColor = `${getSkillColor(skill.rarity)}40`;
        maxLevelElement.style.color = getSkillColor(skill.rarity);
        element.appendChild(maxLevelElement);
    }
    
    // 添加元素
    element.appendChild(nameElement);
    element.appendChild(descElement);
    element.appendChild(rarityElement);
    
    // 添加选择效果
    element.addEventListener('mouseover', () => {
        element.style.transform = 'translateY(-5px)';
        element.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.3), 0 0 20px ${getSkillColor(skill.rarity)}60`;
        element.style.borderColor = getSkillColor(skill.rarity);
        element.style.backgroundColor = `${getSkillColor(skill.rarity)}20`;
    });
    
    element.addEventListener('mouseout', () => {
        element.style.transform = '';
        element.style.boxShadow = `0 0 15px ${getSkillColor(skill.rarity)}40`;
        element.style.backgroundColor = '';
    });
    
    element.addEventListener('click', () => {
        // 添加点击动画
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                onSelect(skill);
            }, 150);
        }, 150);
    });
    
    return element;
}

// 显示技能选择界面
function showSkillSelection(player, onSkillSelected) {
    const skillContainer = document.getElementById('skill-container');
    const skillOptions = document.getElementById('skill-options');
    
    // 清空现有选项
    skillOptions.innerHTML = '';
    
    // 获取随机技能选项
    const options = getRandomSkillOptions(player);
    
    // 添加标题动画
    const title = skillContainer.querySelector('h2');
    title.style.animation = 'none';
    void title.offsetWidth; // 触发重绘
    title.style.animation = 'pulse 1s infinite';
    
    // 创建技能选项元素
    options.forEach(skill => {
        const element = createSkillOptionElement(skill, (selectedSkill) => {
            // 添加选择动画
            skillContainer.style.transform = 'scale(0.9)';
            skillContainer.style.opacity = '0';
            
            setTimeout(() => {
                // 隐藏技能选择界面
                skillContainer.classList.add('hidden');
                skillContainer.style.transform = '';
                skillContainer.style.opacity = '';
                
                // 调用选择回调
                onSkillSelected(selectedSkill);
            }, 300);
        }, player);
        
        skillOptions.appendChild(element);
    });
    
    // 显示技能选择界面并添加动画
    skillContainer.classList.remove('hidden');
    skillContainer.style.transform = 'scale(0.9)';
    skillContainer.style.opacity = '0';
    
    setTimeout(() => {
        skillContainer.style.transition = 'all 0.3s ease-out';
        skillContainer.style.transform = 'scale(1)';
        skillContainer.style.opacity = '1';
    }, 10);
    
    // 添加CSS动画
    if (!document.getElementById('skill-animations')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'skill-animations';
        styleElement.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .skill-option {
                transition: all 0.3s ease;
            }
            
            #skill-container {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 9999 !important;
            }
            
            .skill-level {
                font-size: 12px;
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 8px;
                display: inline-block;
            }
            
            .skill-next-level {
                margin-top: 10px;
                font-size: 14px;
                text-align: left;
                padding: 8px;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 5px;
            }
            
            .skill-next-level span {
                font-weight: bold;
                display: block;
                margin-bottom: 5px;
            }
            
            .skill-next-level ul {
                margin: 5px 0 0 15px;
                padding: 0;
            }
            
            .skill-next-level li {
                margin-bottom: 3px;
            }
            
            .skill-max-level {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(styleElement);
    }
} 