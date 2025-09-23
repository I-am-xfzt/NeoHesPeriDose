<template>
  <div class="game-container">
    <canvas id="renderCanvas"></canvas>
    <div class="game-ui">
      <div class="score-display">得分: {{ score }}</div>
      <div class="lives-display">生命: {{ lives }}</div>
      <button class="control-button" @click="startGame" v-if="!isPlaying">开始游戏</button>
      <button class="control-button" @click="restartGame" v-if="isPlaying">重新开始</button>
      <div class="game-message" v-if="gameMessage">{{ gameMessage }}</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="breakout-game">
import { ref, onMounted, onUnmounted } from "vue";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  StandardMaterial,
  MeshBuilder,
  Mesh,
  Color3,
  Color4,
  KeyboardEventTypes,
  PointerEventTypes,
  DynamicTexture,
  AudioEngine,
  Sound,
  DirectionalLight,
  HemisphericLight
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

// 游戏状态
const score = ref(0);
const lives = ref(3);
const isPlaying = ref(false);
const gameMessage = ref("按空格键开始游戏");
const level = ref(1);
const combo = ref(0);
// 音效相关
const audioEngine = ref(null);
const paddleHitSound = ref(null);
const brickHitSound = ref(null);
const wallHitSound = ref(null);
const loseLifeSound = ref(null);
const levelUpSound = ref(null);
const gameOverSound = ref(null);

// 游戏对象
let engine: Engine | null = null;
let scene: Scene | null = null;
let camera: ArcRotateCamera | null = null;

// 游戏对象
let paddle: Mesh | null = null;
let ball: Mesh | null = null;
let bricks: Mesh[] = [];
let walls: Mesh[] = [];

// 球的速度
let ballSpeed = new Vector3(0, 0, 0);

// 游戏配置
const GAME_CONFIG = {
  paddleWidth: 2,
  paddleHeight: 0.2,
  paddleDepth: 1,
  ballSize: 0.3,
  brickWidth: 1,
  brickHeight: 0.4,
  brickDepth: 0.5,
  brickRows: 5,
  brickColumns: 8,
  brickSpacing: 0.2,
  initialBallSpeed: 5,
  paddleSpeed: 8,
  fieldWidth: 10,  // 游戏区域宽度
  fieldHeight: 16  // 游戏区域高度
};

// 初始化游戏
const initGame = () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  engine = new Engine(canvas, true);
  scene = new Scene(engine);
  
  // 初始化音频引擎
  audioEngine.value = new AudioEngine();
  
  // 创建音效（使用内置音效或空音效，实际应用中可替换为真实音频URL）
  paddleHitSound.value = createEmptySound('paddleHit', scene);
  brickHitSound.value = createEmptySound('brickHit', scene);
  wallHitSound.value = createEmptySound('wallHit', scene);
  loseLifeSound.value = createEmptySound('loseLife', scene);
  levelUpSound.value = createEmptySound('levelUp', scene);
  gameOverSound.value = createEmptySound('gameOver', scene);
  
  // 设置相机 - 调整视角以便更好地查看游戏
  camera = new ArcRotateCamera(
    'camera', 
    0, 
    Math.PI / 3, 
    20, 
    new Vector3(0, 5, 0), 
    scene
  );
  camera.attachControl(canvas, true);
    
    // 设置主要光源 - 使用方向光提供更好的整体照明
    const mainLight = new DirectionalLight('mainLight', new Vector3(-1, -2, -1), scene);
    mainLight.intensity = 1.5;
    
    // 设置环境光
    const ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5;
    ambientLight.groundColor = new Color3(0.2, 0.2, 0.2);
    
    // 设置环境
    const skybox = MeshBuilder.CreateBox('skybox', { size: 100 }, scene);
    const skyMaterial = new SkyMaterial('skyMaterial', scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.turbidity = 5;
    skyMaterial.luminance = 1.5;
    skyMaterial.rayleigh = 2;
    skyMaterial.mieCoefficient = 0.005;
    skyMaterial.mieDirectionalG = 0.8;
    skyMaterial.sunPosition = new Vector3(-100, 50, -50);
    skybox.material = skyMaterial;
    
    // 添加地面网格以增强视觉深度感
    const ground = MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);
    ground.position.y = -GAME_CONFIG.fieldHeight;
    ground.rotation.x = -Math.PI / 2;
    
    const groundMaterial = new StandardMaterial('groundMaterial', scene);
    groundMaterial.diffuseColor = new Color3(0.15, 0.15, 0.2);
    groundMaterial.specularColor = new Color3(0, 0, 0);
    groundMaterial.roughness = 0.9;
    ground.material = groundMaterial;
    
    // 创建游戏边界
    createWalls();
    
    // 创建挡板
    createPaddle();
    
    // 创建砖块
    createBricks();
    
    // 监听键盘和鼠标事件
    setupControls();
    
    // 处理窗口大小变化
    window.addEventListener('resize', () => {
      engine?.resize();
    });
    
    // 启动渲染循环
    engine.runRenderLoop(() => {
      scene.render();
    });
  }

// 创建空音效（实际应用中可替换为真实音频）
const createEmptySound = (name, scene) => {
  // 创建一个简单的振荡器声音作为占位符
  const sound = new Sound(
    name,
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YbgGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2PwtN2mypXwuLa6L0BLy+uy8AvzvC08BLy++1z8Avw==",
    scene,
    null,
    { loop: false, autoplay: false, volume: 0.5 }
  );
  return sound;
}

// 创建游戏边界
const createWalls = () => {
  if (!scene) return;
  
  const walls = [];
  const wallThickness = 0.5;
  const wallHeight = GAME_CONFIG.fieldHeight;
  const playAreaWidth = GAME_CONFIG.fieldWidth;
  const playAreaDepth = 5;
  
  // 创建统一的墙壁材质
  const wallMaterial = new StandardMaterial('wallMaterial', scene);
  wallMaterial.diffuseColor = new Color3(0.2, 0.3, 0.4);
  wallMaterial.specularColor = new Color3(0.3, 0.3, 0.3);
  wallMaterial.emissiveColor = new Color3(0.05, 0.05, 0.05);
  wallMaterial.roughness = 0.6;
  
  // 左墙
  const leftWall = MeshBuilder.CreateBox('leftWall', {
    width: wallThickness,
    height: wallHeight,
    depth: playAreaDepth
  }, scene);
  leftWall.position = new Vector3(-playAreaWidth / 2, wallHeight / 2, 0);
  leftWall.material = wallMaterial;
  walls.push(leftWall);
  
  // 右墙
  const rightWall = MeshBuilder.CreateBox('rightWall', {
    width: wallThickness,
    height: wallHeight,
    depth: playAreaDepth
  }, scene);
  rightWall.position = new Vector3(playAreaWidth / 2, wallHeight / 2, 0);
  rightWall.material = wallMaterial;
  walls.push(rightWall);
  
  // 上墙
  const topWall = MeshBuilder.CreateBox('topWall', {
    width: playAreaWidth + wallThickness * 2,
    height: wallThickness,
    depth: playAreaDepth
  }, scene);
  topWall.position = new Vector3(0, wallHeight, 0);
  topWall.material = wallMaterial;
  walls.push(topWall);
  
  // 后墙
  const backWall = MeshBuilder.CreateBox('backWall', {
    width: playAreaWidth,
    height: wallHeight,
    depth: wallThickness
  }, scene);
  backWall.position = new Vector3(0, wallHeight / 2, -playAreaDepth / 2);
  backWall.material = wallMaterial;
  walls.push(backWall);
};

// 创建挡板
const createPaddle = () => {
  if (!scene) return;
  
  paddle = MeshBuilder.CreateBox('paddle', {
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
    depth: GAME_CONFIG.paddleDepth
  }, scene);
  paddle.position = new Vector3(0, 1, 0);
  
  const paddleMaterial = new StandardMaterial('paddleMaterial', scene);
  paddleMaterial.diffuseColor = new Color3(0, 0.7, 1);
  paddleMaterial.specularColor = new Color3(0.5, 0.8, 1);
  paddleMaterial.roughness = 0.3;
  paddleMaterial.metallic = 0.5;
  paddle.material = paddleMaterial;
};

// 创建砖块
const createBricks = () => {
  if (!scene) return;
  
  bricks = [];
  const totalWidth = GAME_CONFIG.brickColumns * GAME_CONFIG.brickWidth + 
                   (GAME_CONFIG.brickColumns - 1) * GAME_CONFIG.brickSpacing;
  const startX = -totalWidth / 2 + GAME_CONFIG.brickWidth / 2;
  
  const colors = [
    new Color3(1, 0, 0),    // 红色
    new Color3(1, 0.5, 0),  // 橙色
    new Color3(1, 1, 0),    // 黄色
    new Color3(0, 1, 0),    // 绿色
    new Color3(0, 0, 1)     // 蓝色
  ];
  
  for (let row = 0; row < GAME_CONFIG.brickRows; row++) {
    for (let col = 0; col < GAME_CONFIG.brickColumns; col++) {
      const brick = MeshBuilder.CreateBox('brick', {
        width: GAME_CONFIG.brickWidth,
        height: GAME_CONFIG.brickHeight,
        depth: GAME_CONFIG.brickDepth
      }, scene);
      
      brick.position = new Vector3(
        startX + col * (GAME_CONFIG.brickWidth + GAME_CONFIG.brickSpacing),
        8 - row * (GAME_CONFIG.brickHeight + GAME_CONFIG.brickSpacing),
        0
      );
      
      const brickMaterial = new StandardMaterial('brickMaterial', scene);
    brickMaterial.diffuseColor = colors[row % colors.length];
    brickMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    brickMaterial.emissiveColor = new Color3(0.1, 0.1, 0.1);
    brickMaterial.roughness = 0.4;
    brickMaterial.metallic = 0.2;
    brick.material = brickMaterial;
      
      // 为砖块添加自定义属性
      (brick as any).isBrick = true;
      (brick as any).points = (GAME_CONFIG.brickRows - row) * 10;
      
      bricks.push(brick);
    }
  }
};

// 创建球
const createBall = () => {
  if (!scene || !paddle) return;
  
  // 如果已有球，先移除
  if (ball) {
    ball.dispose();
  }
  
  ball = MeshBuilder.CreateSphere('ball', {
    diameter: GAME_CONFIG.ballSize
  }, scene);
  
  ball.position = new Vector3(
    paddle.position.x,
    paddle.position.y + GAME_CONFIG.paddleHeight / 2 + GAME_CONFIG.ballSize / 2,
    0
  );
  
  const ballMaterial = new StandardMaterial('ballMaterial', scene);
  ballMaterial.diffuseColor = new Color3(1, 1, 1);
  ballMaterial.specularColor = new Color3(0.8, 0.8, 1);
  ballMaterial.emissiveColor = new Color3(0.1, 0.1, 0.3);
  ballMaterial.roughness = 0.2;
  ballMaterial.metallic = 0.8;
  ball.material = ballMaterial;
  
  // 重置球的速度
  ballSpeed = new Vector3(0, 0, 0);
};

// 设置控制
const setupControls = () => {
  if (!scene || !paddle) return;
  
  let moveDirection = 0;
  let isMouseDown = false;
  let lastMouseX = 0;
  
  // 键盘控制
  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        if (kbInfo.event.key === 'ArrowLeft') {
          moveDirection = -1;
        } else if (kbInfo.event.key === 'ArrowRight') {
          moveDirection = 1;
        }
        break;
      case KeyboardEventTypes.KEYUP:
        if (kbInfo.event.key === 'ArrowLeft' || kbInfo.event.key === 'ArrowRight') {
          moveDirection = 0;
        }
        break;
    }
  });
  
  // 鼠标控制
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERDOWN:
        isMouseDown = true;
        lastMouseX = pointerInfo.event.clientX;
        break;
      case PointerEventTypes.POINTERUP:
        isMouseDown = false;
        break;
      case PointerEventTypes.POINTERMOVE:
        if (isMouseDown || pointerInfo.event.type === 'mousemove') {
          const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
          const rect = canvas.getBoundingClientRect();
          const mouseX = pointerInfo.event.clientX - rect.left;
          const normalizedX = (mouseX / rect.width) * 2 - 1;
          
          // 将鼠标位置映射到游戏区域
          const playAreaWidth = 10 - GAME_CONFIG.paddleWidth;
          const newX = normalizedX * playAreaWidth / 2;
          
          paddle.position = new Vector3(
            Math.max(-playAreaWidth / 2, Math.min(playAreaWidth / 2, newX)),
            paddle.position.y,
            paddle.position.z
          );
        }
        break;
    }
  });
  
  // 更新挡板位置和实现自定义物理
  scene.onBeforeRenderObservable.add(() => {
    if (!paddle || !isPlaying.value) return;
    
    // 随着等级提升增加难度
    const difficultyMultiplier = 1 + (level.value - 1) * 0.2;
    const adjustedPaddleSpeed = GAME_CONFIG.paddleSpeed * difficultyMultiplier;
    const maxBallSpeed = GAME_CONFIG.initialBallSpeed * 2;
    
    // 更新挡板位置
    const playAreaWidth = GAME_CONFIG.fieldWidth - GAME_CONFIG.paddleWidth;
    const newX = paddle.position.x + moveDirection * adjustedPaddleSpeed * scene.getEngine().getDeltaTime() / 1000;
    
    paddle.position = new Vector3(
      Math.max(-playAreaWidth / 2, Math.min(playAreaWidth / 2, newX)),
      paddle.position.y,
      paddle.position.z
    );
    
    // 处理球的移动和碰撞
    if (ball) {
      // 根据难度调整球的速度
      const currentSpeed = ballSpeed.length();
      if (currentSpeed < maxBallSpeed) {
        // 逐渐增加球速
        const targetSpeed = Math.min(
          maxBallSpeed,
          GAME_CONFIG.initialBallSpeed + (score.value / 1000) * 0.5
        );
        if (currentSpeed < targetSpeed) {
          ballSpeed = ballSpeed.normalize().scale(currentSpeed + 0.001);
        }
      }
      
      // 更新球的位置
      const deltaTime = scene.getEngine().getDeltaTime() / 1000;
      ball.position.addInPlace(ballSpeed.scale(deltaTime));
      
      // 检测边界碰撞
      checkBoundaryCollisions();
      
      // 检测与挡板的碰撞
      checkPaddleCollision();
      
      // 检测与砖块的碰撞
      checkBrickCollisions();
    }
  });
};

// 检测边界碰撞
const checkBoundaryCollisions = () => {
  if (!ball) return;
  
  // 左右边界
  const maxX = GAME_CONFIG.fieldWidth / 2;
  if (ball.position.x < -maxX || ball.position.x > maxX) {
    ballSpeed.x = -ballSpeed.x;
    ball.position.x = ball.position.x < -maxX ? -maxX : maxX;
    // 播放墙壁碰撞音效
    wallHitSound.value?.play();
  }
  
  // 上边界
  const maxY = GAME_CONFIG.fieldHeight / 2;
  if (ball.position.y > maxY) {
    ballSpeed.y = -ballSpeed.y;
    ball.position.y = maxY;
    // 播放墙壁碰撞音效
    wallHitSound.value?.play();
  }
  
  // 下边界（球掉落）
  if (ball.position.y < -GAME_CONFIG.fieldHeight / 2) {
    lives.value--;
    // 播放失去生命音效
    loseLifeSound.value?.play();
    
    if (lives.value <= 0) {
      gameOver(false);
    } else {
      createBall();
      isPlaying.value = false;
      gameMessage.value = `准备发球 - 剩余生命: ${lives.value}`;
    }
  }
};

// 检测与挡板的碰撞
const checkPaddleCollision = () => {
  if (!ball || !paddle) return;
  
  // 精确的碰撞检测
  const paddleHalfWidth = GAME_CONFIG.paddleWidth / 2;
  const paddleHalfHeight = GAME_CONFIG.paddleHeight / 2;
  const ballRadius = GAME_CONFIG.ballSize / 2;
  
  // 计算球到挡板中心的向量
  const dx = ball.position.x - paddle.position.x;
  const dy = ball.position.y - paddle.position.y;
  
  // 检查球是否与挡板接触
  if (Math.abs(dx) < paddleHalfWidth + ballRadius &&
      Math.abs(dy) < paddleHalfHeight + ballRadius) {
    // 播放挡板碰撞音效
    paddleHitSound.value?.play();
    // 计算碰撞点相对于挡板中心的位置
    const hitOffset = Math.max(-1, Math.min(1, dx / paddleHalfWidth));
    
    // 设置新的速度向量，根据碰撞位置调整角度和速度
    const speed = ballSpeed.length();
    const angle = hitOffset * Math.PI / 3; // -60° 到 60°，提供更大的角度变化
    
    // 考虑挡板的移动对球速的影响
    const paddleVelocityEffect = paddle.position.x - (paddle as any).lastPosition?.x || 0;
    const velocityBonus = Math.max(-0.5, Math.min(0.5, paddleVelocityEffect * 5));
    
    ballSpeed = new Vector3(
      (Math.sin(angle) * 0.7 + velocityBonus) * speed,
      Math.abs(Math.cos(angle)) * speed * 1.1, // 轻微增加垂直速度
      0
    );
    
    // 防止球卡在挡板内
    const overlapX = paddleHalfWidth + ballRadius - Math.abs(dx);
    const overlapY = paddleHalfHeight + ballRadius - Math.abs(dy);
    
    if (overlapX < overlapY) {
      // 主要是水平重叠
      ball.position.x = dx > 0 ? paddle.position.x + paddleHalfWidth + ballRadius : paddle.position.x - paddleHalfWidth - ballRadius;
    } else {
      // 主要是垂直重叠
      ball.position.y = dy > 0 ? paddle.position.y + paddleHalfHeight + ballRadius : paddle.position.y - paddleHalfHeight - ballRadius;
    }
    
    // 重置连击计数
    combo.value = 0;
  }
  
  // 记录挡板位置用于下一次计算
  (paddle as any).lastPosition = paddle.position.clone();
};

// 检测与砖块的碰撞
const checkBrickCollisions = () => {
  if (!ball) return;
  
  for (let i = bricks.length - 1; i >= 0; i--) {
    const brick = bricks[i];
    if (!brick || !(brick as any).isBrick) continue;
    
    // 精确的碰撞检测
    const brickHalfWidth = GAME_CONFIG.brickWidth / 2;
    const brickHalfHeight = GAME_CONFIG.brickHeight / 2;
    const ballRadius = GAME_CONFIG.ballSize / 2;
    
    // 计算球到砖块中心的向量
    const dx = ball.position.x - brick.position.x;
    const dy = ball.position.y - brick.position.y;
    
    // 检查球是否与砖块接触
    if (Math.abs(dx) < brickHalfWidth + ballRadius &&
        Math.abs(dy) < brickHalfHeight + ballRadius) {
      // 计算重叠部分
      const overlapX = brickHalfWidth + ballRadius - Math.abs(dx);
      const overlapY = brickHalfHeight + ballRadius - Math.abs(dy);
      
      // 确定碰撞面并反弹
      if (overlapX < overlapY) {
        // 水平碰撞（左右面）
        ballSpeed.x = -ballSpeed.x;
        
        // 修正球的位置，防止卡在砖块内
        ball.position.x = dx > 0 ? brick.position.x + brickHalfWidth + ballRadius : brick.position.x - brickHalfWidth - ballRadius;
      } else {
        // 垂直碰撞（顶面或底面）
        ballSpeed.y = -ballSpeed.y;
        
        // 修正球的位置，防止卡在砖块内
        ball.position.y = dy > 0 ? brick.position.y + brickHalfHeight + ballRadius : brick.position.y - brickHalfHeight - ballRadius;
      }
      
      // 播放砖块碰撞音效
      brickHitSound.value?.play();
      
      // 增加连击计数
      combo.value++;
      
      // 计算分数，包括连击奖励
      const basePoints = (brick as any).points;
      const comboMultiplier = 1 + Math.min(1, combo.value / 10); // 最多2倍分数
      const pointsEarned = Math.floor(basePoints * comboMultiplier);
      score.value += pointsEarned;
      
      // 创建得分动画效果
      createScorePopup(brick.position, pointsEarned);
      
      // 移除砖块
      brick.dispose();
      bricks.splice(i, 1);
      
      // 检查是否通关
      if (bricks.length === 0) {
        // 升级到下一关
        level.value++;
        // 播放关卡升级音效
        levelUpSound.value?.play();
        
        // 增加生命奖励
        if (level.value % 3 === 0 && lives.value < 5) {
          lives.value++;
          gameMessage.value = `升级奖励！获得额外生命，当前生命：${lives.value}`;
        }
        
        // 创建下一关的砖块
        setTimeout(() => {
          createBricks();
          createBall();
          isPlaying.value = false;
          gameMessage.value = `第 ${level.value} 关 - 点击开始`;
        }, 2000);
      }
      
      // 跳出循环，一次只处理一个碰撞
      break;
    }
  }
};

// 创建得分弹出效果
const createScorePopup = (position: Vector3, points: number) => {
  if (!scene) return;
  
  const popup = MeshBuilder.CreatePlane('scorePopup', { size: 1 }, scene);
  popup.position = new Vector3(position.x, position.y + 1, -2); // 显示在前面
  
  // 创建动态纹理显示分数
  const scoreTexture = new DynamicTexture('scoreTexture', { width: 128, height: 64 }, scene, true);
  const ctx = scoreTexture.getContext();
  
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`+${points}`, 64, 32);
    
    if (combo.value > 1) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px Arial';
      ctx.fillText(`连击 ${combo.value}x`, 64, 48);
    }
  }
  
  scoreTexture.update();
  
  const popupMaterial = new StandardMaterial('popupMaterial', scene);
  popupMaterial.diffuseTexture = scoreTexture;
  popupMaterial.opacityTexture = scoreTexture;
  popupMaterial.backFaceCulling = false;
  popup.material = popupMaterial;
  
  // 动画：上升并消失
  const animDuration = 1000;
  const animFrameCount = 30;
  let currentFrame = 0;
  
  const animationInterval = setInterval(() => {
    if (!popup || !scene) {
      clearInterval(animationInterval);
      return;
    }
    
    currentFrame++;
    const progress = currentFrame / animFrameCount;
    
    popup.position.y += 0.05;
    popupMaterial.alpha = 1 - progress;
    
    if (currentFrame >= animFrameCount) {
      clearInterval(animationInterval);
      popup.dispose();
    }
  }, animDuration / animFrameCount);
};

// 开始游戏
const startGame = () => {
  if (!ball || isPlaying.value) return;
  
  isPlaying.value = true;
  gameMessage.value = '';
  
  // 给球一个初始速度
  const angle = (Math.random() - 0.5) * Math.PI / 3; // -30° 到 30°
  const speed = GAME_CONFIG.initialBallSpeed;
  
  ballSpeed = new Vector3(
    Math.sin(angle) * speed,
    Math.cos(angle) * speed,
    0
  );
};

// 重新开始游戏
const restartGame = () => {
  score.value = 0;
  lives.value = 3;
  isPlaying.value = false;
  gameMessage.value = '点击开始游戏';
  
  // 重新创建砖块和球
  createBricks();
  createBall();
};

// 游戏结束
const gameOver = (isWin: boolean) => {
  isPlaying.value = false;
  
  // 播放游戏结束音效
  gameOverSound.value?.play();
  
  if (isWin) {
    gameMessage.value = `恭喜你赢了！最终得分: ${score.value}`;
  } else {
    gameMessage.value = `游戏结束！最终得分: ${score.value}`;
  }
};

// 组件挂载时初始化游戏
onMounted(() => {
  initGame();
  createBall();
  gameMessage.value = '点击开始游戏';
});

// 组件卸载时清理资源
onUnmounted(() => {
  if (engine) {
    engine.dispose();
  }
});
</script>

<style>
.game-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#renderCanvas {
  width: 90%;
  height: 90%;
  max-width: 1200px;
  max-height: 800px;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 150, 255, 0.3);
  border: 2px solid rgba(0, 150, 255, 0.5);
}

.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  pointer-events: none;
  font-family: 'Arial', sans-serif;
}

.score-display,
.lives-display {
  background: linear-gradient(135deg, rgba(50, 50, 100, 0.8) 0%, rgba(30, 30, 80, 0.8) 100%);
  padding: 12px 24px;
  border-radius: 30px;
  min-width: 120px;
  text-align: center;
  border: 2px solid rgba(0, 150, 255, 0.5);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.score-display:hover,
.lives-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 150, 255, 0.4);
}

.control-button {
  pointer-events: all;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.control-button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.5);
}

.control-button:active {
  transform: translateY(0);
}

.game-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 30, 60, 0.9) 100%);
  color: white;
  padding: 30px 60px;
  border-radius: 15px;
  font-size: 32px;
  text-align: center;
  pointer-events: none;
  border: 2px solid rgba(0, 150, 255, 0.7);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 10px 40px rgba(0, 150, 255, 0.4);
  }
  100% {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
}
</style>
