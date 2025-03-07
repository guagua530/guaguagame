/**
 * 游戏主逻辑
 */
class Game {
    constructor() {
        console.log("Game constructor called");
        
        // 获取画布和上下文
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        
        // 游戏实体
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.effects = [];
        
        // 游戏统计
        this.score = 0;
        this.kills = 0;
        this.time = 0;
        this.wave = 1;
        this.difficulty = 1;
        
        // 敌人生成
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = 0.5; // 降低初始生成速率
        this.maxEnemies = 10; // 降低初始最大敌人数量
        
        // 波次控制
        this.waveTimer = 0;
        this.waveDuration = 45; // 减少每波持续时间
        this.waveBreak = false;
        this.waveBreakDuration = 15; // 增加波次间隔时间
        this.waveBreakTimer = 0;
        
        // 技能选择
        this.skillSelectionActive = false;
        
        // 输入处理
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false
        };
        
        // 绑定事件处理器
        this.bindEventHandlers();
        
        // 初始化UI
        this.initUI();
        
        // 监听投射物效果事件
        document.addEventListener('projectileEffect', (e) => {
            console.log("Projectile effect event triggered");
            const effects = e.detail.effects;
            if (Array.isArray(effects)) {
                effects.forEach(effect => this.addEffect(effect));
            } else {
                this.addEffect(effects);
            }
        });
        
        // 监听投射物分裂事件
        document.addEventListener('projectileSplit', (e) => {
            console.log("Projectile split event triggered");
            const splitProjectiles = e.detail.projectiles;
            splitProjectiles.forEach(projectile => this.addProjectile(projectile));
        });

        // 监听敌人射击事件
        document.addEventListener('enemyShoot', (e) => {
            console.log("Enemy shoot event triggered");
            const projectile = e.detail.projectile;
            this.addProjectile(projectile);
        });
        
        console.log("Game constructor completed");
    }
    
    resizeCanvas() {
        console.log("Resizing canvas");
        
        try {
            // 获取容器大小
            const container = document.getElementById('game-container');
            console.log("Container dimensions:", container.clientWidth, "x", container.clientHeight);
            
            // 设置画布大小
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            
            // 更新游戏区域大小
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            
            console.log("Canvas resized to:", this.width, "x", this.height);
            
            // 如果玩家存在，确保玩家在画布中央
            if (this.player) {
                this.player.x = this.width / 2;
                this.player.y = this.height / 2;
                console.log("Player repositioned to center:", this.player.x, this.player.y);
            }
        } catch (error) {
            console.error("Error resizing canvas:", error);
        }
    }
    
    bindEventHandlers() {
        console.log("Binding event handlers");
        
        // 键盘按下事件
        window.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                    this.keys.w = true;
                    break;
                case 'a':
                    this.keys.a = true;
                    break;
                case 's':
                    this.keys.s = true;
                    break;
                case 'd':
                    this.keys.d = true;
                    break;
                case ' ':
                    this.keys.space = true;
                    break;
                case 'p':
                    this.togglePause();
                    break;
            }
        });
        
        // 键盘松开事件
        window.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w':
                    this.keys.w = false;
                    break;
                case 'a':
                    this.keys.a = false;
                    break;
                case 's':
                    this.keys.s = false;
                    break;
                case 'd':
                    this.keys.d = false;
                    break;
                case ' ':
                    this.keys.space = false;
                    break;
            }
        });
        
        // 开始按钮点击事件
        const startButton = document.getElementById('start-button');
        console.log("Start button:", startButton);
        
        if (startButton) {
            // 移除可能存在的旧事件监听器
            startButton.removeEventListener('click', this.startGame);
            
            // 定义事件处理函数
            this.startGame = () => {
                console.log("Start button clicked directly");
                this.start();
            };
            
            // 添加新的事件监听器
            startButton.addEventListener('click', this.startGame);
            
            // 直接在按钮上添加内联事件处理
            startButton.onclick = () => {
                console.log("Start button onclick triggered");
                this.start();
            };
        } else {
            console.error("Start button not found!");
        }
        
        // 重新开始按钮点击事件
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                console.log("Restart button clicked");
                this.restart();
            });
        } else {
            console.error("Restart button not found!");
        }
        
        console.log("Event handlers bound");
    }
    
    initUI() {
        // 隐藏游戏结束界面
        document.getElementById('game-over').classList.add('hidden');
        
        // 隐藏技能选择界面
        document.getElementById('skill-container').classList.add('hidden');
    }
    
    start() {
        console.log("Game start method called");
        
        try {
            // 隐藏开始界面
            const startScreen = document.getElementById('start-screen');
            console.log("Start screen:", startScreen);
            
            if (startScreen) {
                startScreen.classList.add('hidden');
                console.log("Start screen hidden");
            } else {
                console.error("Start screen not found!");
            }
            
            // 创建玩家
            this.player = new Player(this.width / 2, this.height / 2);
            console.log("Player created:", this.player);
            
            // 重置游戏状态
            this.isRunning = true;
            this.isPaused = false;
            this.gameOver = false;
            this.enemies = [];
            this.projectiles = [];
            this.effects = [];
            this.score = 0;
            this.kills = 0;
            this.time = 0;
            this.wave = 1;
            this.difficulty = 1;
            
            console.log("Game state reset");
            
            // 暂停游戏，显示初始技能选择
            this.skillSelectionActive = true;
            showSkillSelection(this.player, (selectedSkill) => {
                // 添加选择的技能
                this.player.addSkill(selectedSkill);
                
                // 应用技能效果
                if (selectedSkill.apply) {
                    const effect = selectedSkill.apply(this.player, this);
                    if (effect) {
                        effect.initialDuration = effect.duration;
                        this.effects.push(effect);
                    }
                }
                
                // 恢复游戏
                this.skillSelectionActive = false;
                
                // 开始游戏循环
                this.lastTime = performance.now();
                requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
            });
            
            // 立即渲染一帧
            this.render();
            console.log("Initial frame rendered");
            
            console.log("Game started, waiting for initial skill selection");
            
        } catch (error) {
            console.error("Error in start method:", error);
        }
    }
    
    restart() {
        // 隐藏游戏结束界面
        document.getElementById('game-over').classList.add('hidden');
        
        // 重新开始游戏
        this.start();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    
    gameLoop(timestamp) {
        try {
            // 如果游戏未运行，不执行游戏循环
            if (!this.isRunning) {
                return;
            }
            
            // 计算时间增量
            if (!this.lastTime) {
                this.lastTime = timestamp;
            }
            const deltaTime = (timestamp - this.lastTime) / 1000; // 转换为秒
            this.lastTime = timestamp;
            
            // 如果游戏暂停或正在选择技能，不更新游戏状态
            if (this.isPaused || this.skillSelectionActive) {
                if (this.debug) {
                    console.log("Game loop skipped due to", 
                                this.isPaused ? "game paused" : "skill selection active");
                }
                requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
                return;
            }
            
            try {
                // 更新游戏状态
                this.update(deltaTime);
            } catch (updateError) {
                console.error("Error in game update:", updateError);
            }
            
            try {
                // 渲染游戏
                this.render();
            } catch (renderError) {
                console.error("Error in game render:", renderError);
            }
            
            // 继续游戏循环
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        } catch (error) {
            console.error("Critical error in game loop:", error);
            // 尝试继续游戏循环，避免完全崩溃
            this.lastTime = performance.now();
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }
    
    update(deltaTime) {
        // 限制调试输出频率
        this.debugTimer = (this.debugTimer || 0) + deltaTime;
        const shouldLog = this.debugTimer > 1; // 每秒输出一次调试信息
        
        if (shouldLog) {
            console.log("Updating game state, delta time:", deltaTime);
            this.debugTimer = 0;
        }
        
        // 更新游戏时间
        this.time += deltaTime;
        
        // 更新波次
        this.updateWave(deltaTime);
        
        // 更新玩家
        if (this.player && this.player.isAlive) {
            // 更新玩家控制
            this.player.controls.up = this.keys.w;
            this.player.controls.left = this.keys.a;
            this.player.controls.down = this.keys.s;
            this.player.controls.right = this.keys.d;
            this.player.controls.dash = this.keys.space;
            
            // 更新玩家
            this.player.update(deltaTime, this.width, this.height, this.enemies);
            
            if (shouldLog) {
                console.log("Player position:", this.player.x, this.player.y);
            }
        } else if (this.player && !this.player.isAlive && !this.gameOver) {
            // 玩家死亡，游戏结束
            console.log("Player died, ending game");
            this.endGame();
        }
        
        // 更新敌人
        this.updateEnemies(deltaTime);
        
        // 更新投射物
        this.updateProjectiles(deltaTime);
        
        // 更新特效
        this.updateEffects(deltaTime);
        
        // 生成敌人
        this.spawnEnemies(deltaTime);
        
        // 更新UI
        try {
            this.updateUI();
        } catch (uiError) {
            console.error("Error updating UI:", uiError);
        }
    }
    
    updateWave(deltaTime) {
        // 波次进行中
        this.waveTimer += deltaTime;
        
        if (this.waveTimer >= this.waveDuration) {
            // 结束当前波次，直接开始下一波
            this.waveTimer = 0;
            this.wave++;
            
            // 动态调整难度和生成参数
            this.difficulty = 1 + (this.wave - 1) * 0.15; // 降低每波难度增长
            
            // 第4波后大幅增加怪物数量
            if (this.wave > 4) {
                // 使用更激进的指数增长，最大数量提高到80
                this.maxEnemies = Math.min(15 + Math.floor(Math.pow(this.wave - 3, 1.8) * 3), 80);
                
                // 增加生成速率，最快0.3秒生成一个
                this.enemySpawnRate = 0.8 + Math.min((this.wave - 4) * 0.5, 3);
                
                console.log(`波次${this.wave}: 最大敌人数量=${this.maxEnemies}, 生成速率=${this.enemySpawnRate}/秒`);
            } else {
                this.maxEnemies = 10 + Math.floor(this.wave * 1.5);
                this.enemySpawnRate = 0.5 + (this.wave - 1) * 0.2;
            }
            
            // 如果是第3波的倍数，生成Boss
            if (this.wave % 3 === 0) {
                this.spawnBoss();
            }
        }
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // 更新敌人
            enemy.update(deltaTime, this.player, this.width, this.height);
            
            // 检查敌人是否死亡
            if (!enemy.isAlive) {
                // 增加分数和击杀数
                this.score += enemy.experienceValue * 10;
                this.kills++;
                
                // 玩家获得经验
                if (this.player) {
                    this.player.gainExperience(enemy.experienceValue);
                }
                
                // 移除敌人
                this.enemies.splice(i, 1);
            } else {
                // 检查与玩家的碰撞
                if (this.player && enemy.checkPlayerCollision(this.player)) {
                    // 敌人碰撞玩家造成伤害，在Enemy类中处理
                }
            }
        }
    }
    
    updateProjectiles(deltaTime) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            // 更新投射物
            projectile.update(deltaTime, this.enemies, this.player, this.width, this.height);
            
            // 检查投射物是否销毁
            if (!projectile.isAlive) {
                // 移除投射物
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    updateEffects(deltaTime) {
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            
            // 更新效果持续时间
            effect.duration -= deltaTime;
            
            // 更新效果透明度
            effect.alpha = effect.duration / effect.initialDuration;
            
            // 检查效果是否结束
            if (effect.duration <= 0) {
                // 移除效果
                this.effects.splice(i, 1);
            }
        }
    }
    
    spawnEnemies(deltaTime) {
        // 如果敌人数量已达上限，不生成新敌人
        if (this.enemies.length >= this.maxEnemies) return;
        
        // 更新敌人生成计时器
        this.enemySpawnTimer += deltaTime;
        
        // 根据当前波次调整生成间隔
        const spawnInterval = 1 / (this.enemySpawnRate * this.difficulty);
        
        // 检查是否应该生成敌人
        if (this.enemySpawnTimer < spawnInterval) return;
        
        this.enemySpawnTimer = 0;
        
        // 第4波后每次生成多个敌人，数量随波次增加
        let spawnCount = 1;
        if (this.wave > 4) {
            // 最多同时生成5个敌人
            spawnCount = Math.min(Math.floor(1 + (this.wave - 4) / 2), 5);
        }
        
        for (let i = 0; i < spawnCount; i++) {
            if (this.enemies.length >= this.maxEnemies) break;
            
            // 根据波数动态调整敌人类型概率
            let enemyType;
            const rand = Math.random();
            
            if (this.wave < 3) {
                // 前3波主要是基础敌人
                if (rand < 0.8) {
                    enemyType = 'basic';
                } else if (rand < 0.9) {
                    enemyType = 'fast';
                } else {
                    enemyType = 'tank';
                }
            } else if (this.wave < 6) {
                // 3-6波增加远程敌人
                if (rand < 0.5) {
                    enemyType = 'basic';
                } else if (rand < 0.7) {
                    enemyType = 'fast';
                } else if (rand < 0.85) {
                    enemyType = 'tank';
                } else {
                    enemyType = 'ranged';
                }
            } else {
                // 6波以后各种敌人均衡出现
                if (rand < 0.3) {
                    enemyType = 'basic';
                } else if (rand < 0.5) {
                    enemyType = 'fast';
                } else if (rand < 0.7) {
                    enemyType = 'tank';
                } else {
                    enemyType = 'ranged';
                }
            }
            
            // 随机生成位置（在屏幕外）
            let x, y;
            const side = Math.floor(Math.random() * 4);
            
            switch (side) {
                case 0: // 上
                    x = Math.random() * this.width;
                    y = -50;
                    break;
                case 1: // 右
                    x = this.width + 50;
                    y = Math.random() * this.height;
                    break;
                case 2: // 下
                    x = Math.random() * this.width;
                    y = this.height + 50;
                    break;
                case 3: // 左
                    x = -50;
                    y = Math.random() * this.height;
                    break;
            }
            
            // 创建敌人
            const enemy = new Enemy(x, y, enemyType);
            
            // 为敌人分配唯一ID
            enemy.id = Date.now() + Math.random();
            
            // 添加到敌人列表
            this.enemies.push(enemy);
        }
    }
    
    spawnBoss() {
        // 在屏幕中央生成Boss
        const boss = new Enemy(this.width / 2, -100, 'boss');
        
        // 为Boss分配唯一ID
        boss.id = Date.now() + Math.random();
        
        // 添加到敌人列表
        this.enemies.push(boss);
    }
    
    updateUI() {
        // 更新血条
        const healthFill = document.getElementById('health-fill');
        if (this.player && healthFill) {
            const healthPercent = (this.player.health / this.player.maxHealth) * 100;
            healthFill.style.width = `${healthPercent}%`;
        }
        
        // 更新等级
        const levelElement = document.getElementById('level');
        if (this.player && levelElement) {
            levelElement.textContent = this.player.level;
        }
        
        // 更新经验条
        const expFill = document.getElementById('exp-fill');
        const expCurrent = document.getElementById('exp-current');
        const expNext = document.getElementById('exp-next');
        
        if (this.player && expFill && expCurrent && expNext) {
            const expPercent = (this.player.experience / this.player.experienceToNextLevel) * 100;
            expFill.style.width = `${expPercent}%`;
            expCurrent.textContent = Math.floor(this.player.experience);
            expNext.textContent = this.player.experienceToNextLevel;
        }
        
        // 更新波次信息
        const waveNumber = document.getElementById('wave-number');
        const waveTimer = document.querySelector('.wave-timer-fill');
        
        if (waveNumber) {
            waveNumber.textContent = this.wave;
        }
        
        if (waveTimer) {
            if (this.waveBreak) {
                const waveBreakPercent = (this.waveBreakTimer / this.waveBreakDuration) * 100;
                waveTimer.style.width = `${waveBreakPercent}%`;
                waveTimer.style.background = 'linear-gradient(to right, #f39c12, #f1c40f)';
            } else {
                const wavePercent = (this.waveTimer / this.waveDuration) * 100;
                waveTimer.style.width = `${wavePercent}%`;
                waveTimer.style.background = 'linear-gradient(to right, #4263eb, #42a5f5)';
            }
        }
        
        // 更新游戏统计信息
        const gameTime = document.getElementById('game-time');
        const killCount = document.getElementById('kill-count');
        const scoreElement = document.getElementById('score');
        
        if (gameTime) {
            // 格式化时间为 MM:SS
            const minutes = Math.floor(this.time / 60);
            const seconds = Math.floor(this.time % 60);
            gameTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (killCount) {
            killCount.textContent = this.kills;
        }
        
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
    }
    
    render() {
        try {
            // 清空画布
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // 绘制背景
            this.ctx.fillStyle = '#1a1a2e'; // 深蓝色背景
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // 绘制网格 - 使用渐变效果
            const gridGradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
            gridGradient.addColorStop(0, 'rgba(52, 73, 94, 0.1)');
            gridGradient.addColorStop(1, 'rgba(44, 62, 80, 0.1)');
            this.ctx.strokeStyle = gridGradient;
            
            // 绘制网格线
            const gridSize = 50;
            this.ctx.beginPath();
            for(let x = 0; x <= this.width; x += gridSize) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
            }
            for(let y = 0; y <= this.height; y += gridSize) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
            }
            this.ctx.stroke();
            
            // 绘制特效（在实体下方的）
            this.effects.forEach(effect => {
                if (effect.type !== 'lightning') {
                    drawSkillEffect(this.ctx, effect);
                }
            });
            
            // 绘制敌人
            this.enemies.forEach(enemy => {
                drawEnemy(this.ctx, enemy);
            });
            
            // 绘制玩家
            if (this.player) {
                drawPlayer(this.ctx, this.player);
            }
            
            // 绘制投射物
            this.projectiles.forEach(projectile => {
                drawProjectile(this.ctx, projectile);
            });
            
            // 绘制特效（在实体上方的）
            this.effects.forEach(effect => {
                if (effect.type === 'lightning') {
                    drawSkillEffect(this.ctx, effect);
                }
            });
            
            // 绘制UI元素
            if (this.player) {
                // 绘制生命值条 - 添加发光效果
                const healthBarWidth = 200;
                const healthBarHeight = 15;
                const healthBarX = 10;
                const healthBarY = 10;
                
                // 绘制血条背景
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                roundedRect(this.ctx, healthBarX, healthBarY, healthBarWidth, healthBarHeight, 5);
                this.ctx.fill();
                
                // 绘制血条
                const healthPercent = this.player.health / this.player.maxHealth;
                const healthGradient = this.ctx.createLinearGradient(healthBarX, 0, healthBarX + healthBarWidth, 0);
                healthGradient.addColorStop(0, '#e74c3c');
                healthGradient.addColorStop(1, '#c0392b');
                
                this.ctx.fillStyle = healthGradient;
                roundedRect(this.ctx, healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight, 5);
                this.ctx.fill();
                
                // 添加血条发光效果
                this.ctx.shadowColor = '#e74c3c';
                this.ctx.shadowBlur = 10;
                this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
                roundedRect(this.ctx, healthBarX, healthBarY, healthBarWidth, healthBarHeight, 5);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                
                // 绘制生命值文本
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    `${Math.ceil(this.player.health)} / ${this.player.maxHealth}`,
                    healthBarX + healthBarWidth / 2,
                    healthBarY + healthBarHeight - 3
                );
            }
            
            // 绘制波次和时间信息
            this.ctx.save();
            // 波次信息
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(
                `波次: ${this.wave}`,
                this.width - 20,
                30
            );
            
            // 时间信息
            this.ctx.font = 'bold 18px Arial';
            this.ctx.fillText(
                `时间: ${this.formatTime(this.time)}`,
                this.width - 20,
                60
            );
            
            // 击杀信息
            this.ctx.fillText(
                `击杀: ${this.kills}`,
                this.width - 20,
                90
            );
            
            this.ctx.restore();
            
            // 如果游戏暂停，显示暂停信息
            if (this.isPaused && !this.skillSelectionActive) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(0, 0, this.width, this.height);
                
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 36px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('游戏暂停', this.width / 2, this.height / 2);
            }
            
        } catch (error) {
            console.error("渲染错误:", error);
        }
    }
    
    // 格式化时间显示
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    endGame() {
        this.gameOver = true;
        this.isRunning = false;
        
        // 显示游戏结束界面
        const gameOverElement = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const finalTimeElement = document.getElementById('final-time');
        const finalKillsElement = document.getElementById('final-kills');
        const finalLevelElement = document.getElementById('final-level');
        
        // 更新最终分数
        if (finalScoreElement) {
            finalScoreElement.textContent = this.score;
        }
        
        // 更新最终时间
        if (finalTimeElement) {
            const minutes = Math.floor(this.time / 60);
            const seconds = Math.floor(this.time % 60);
            finalTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // 更新最终击杀数
        if (finalKillsElement) {
            finalKillsElement.textContent = this.kills;
        }
        
        // 更新最终等级
        if (finalLevelElement && this.player) {
            finalLevelElement.textContent = this.player.level;
        }
        
        // 显示游戏结束界面，添加动画效果
        if (gameOverElement) {
            gameOverElement.classList.remove('hidden');
            gameOverElement.style.opacity = '0';
            gameOverElement.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                gameOverElement.style.transition = 'all 0.5s ease-out';
                gameOverElement.style.opacity = '1';
                gameOverElement.style.transform = 'scale(1)';
            }, 10);
        }
    }
    
    // 处理玩家升级
    handlePlayerLevelUp() {
        // 暂停游戏
        this.skillSelectionActive = true;
        
        // 显示技能选择界面
        showSkillSelection(this.player, (selectedSkill) => {
            // 添加选择的技能
            this.player.addSkill(selectedSkill);
            
            // 应用技能效果
            if (selectedSkill.apply) {
                const effect = selectedSkill.apply(this.player, this);
                if (effect) {
                    effect.initialDuration = effect.duration;
                    this.effects.push(effect);
                }
            }
            
            // 恢复游戏
            this.skillSelectionActive = false;
        });
    }
    
    // 添加投射物
    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }
    
    // 添加特效
    addEffect(effect) {
        if (effect) {
            effect.initialDuration = effect.duration;
            this.effects.push(effect);
        }
    }
    
    updateShooting(deltaTime, player) {
        // 更新射击冷却
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
        
        // 检查是否可以射击
        if (this.shootCooldown <= 0 && this.distanceTo(player) <= this.shootRange) {
            const projectile = this.shoot(player);
            
            // 触发射击事件，将投射物添加到游戏中
            const shootEvent = new CustomEvent('enemyShoot', {
                detail: { projectile: projectile }
            });
            document.dispatchEvent(shootEvent);
            
            this.shootCooldown = 1 / this.shootRate;
        }
    }
} 