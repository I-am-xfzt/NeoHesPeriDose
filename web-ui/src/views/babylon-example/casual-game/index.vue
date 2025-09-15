<template>
  <div class="page-container wh100">
    <canvas id="renderCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  StandardMaterial,
  // ActionManager,
  SceneLoader,
  Axis,
  Color3,
  Color4,
  MultiMaterial,
  CubicEase,
  Mesh,
  ParticleSystem,
  EasingFunction,
  BloomEffect,
  DefaultRenderingPipeline,
  Texture,
  Tools,
  PostProcess,
  ShaderMaterial,
  Effect,
  GlowLayer,
  SceneSerializer,
  RefractionPostProcess
} from "@babylonjs/core";
import "@babylonjs/inspector";
import "@babylonjs/core/Debug/debugLayer";
import { SkyMaterial } from "@babylonjs/materials";
nextTick().then(() => {
  let canvas = document.getElementById("renderCanvas");

  // UI
  let cameraPanel = document.getElementById("cameraPanel");

  let sceneChecked;
  let sceneLocation = "https://www.babylonjs.com/Scenes/";

  // Babylon
  let engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
  let scene;

  let previousPickedMesh;
  let onPointerDown = function (evt, pickResult) {
    if (!panelIsClosed) {
      panelIsClosed = true;
    }

    if (pickResult.hit) {
      if (evt.ctrlKey) {
        if (previousPickedMesh) {
          previousPickedMesh.showBoundingBox = false;
        }

        pickResult.pickedMesh.showBoundingBox = true;

        // Emit particles
        let particleSystem = new ParticleSystem("particles", 400, scene);
        particleSystem.particleTexture = new Texture("Assets/Flare.png", scene);
        particleSystem.minAngularSpeed = -0.5;
        particleSystem.maxAngularSpeed = 0.5;
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;
        particleSystem.minLifeTime = 0.5;
        particleSystem.maxLifeTime = 2.0;
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1.0;
        particleSystem.emitter = pickResult.pickedPoint;
        particleSystem.emitRate = 400;
        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.minEmitBox = new Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new Vector3(0, 0, 0);
        particleSystem.direction1 = new Vector3(-1, -1, -1);
        particleSystem.direction2 = new Vector3(1, 1, 1);
        particleSystem.color1 = new Color4(1, 0, 0, 1);
        particleSystem.color2 = new Color4(0, 1, 1, 1);
        particleSystem.gravity = new Vector3(0, -5, 0);
        particleSystem.disposeOnStop = true;
        particleSystem.targetStopDuration = 0.1;
        particleSystem.start();

        previousPickedMesh = pickResult.pickedMesh;
      } else {
        let dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
        dir.normalize();
        pickResult.pickedMesh.applyImpulse(dir.scale(10), pickResult.pickedPoint);
        status.innerHTML = "";
      }
    }
  };

  let loadScene = function (sceneLocation, then) {
    sceneChecked = false;

    SceneLoader.ForceFullSceneLoadingForIncremental = true;

    engine.resize();

    let dlCount = 0;
    SceneLoader.Load(
      sceneLocation + "Espilit" + "/",
      "Espilit.binary.babylon",
      engine,
      function (newScene) {
        scene = newScene;
        scene.executeWhenReady(function () {
          canvas.style.opacity = 1;
          if (scene.activeCamera) {
            scene.activeCamera.attachControl(canvas);

            if (newScene.activeCamera.keysUp) {
              newScene.activeCamera.keysUp.push(90); // Z
              newScene.activeCamera.keysUp.push(87); // W
              newScene.activeCamera.keysDown.push(83); // S
              newScene.activeCamera.keysLeft.push(65); // A
              newScene.activeCamera.keysLeft.push(81); // Q
              newScene.activeCamera.keysRight.push(69); // E
              newScene.activeCamera.keysRight.push(68); // D
            }
          }

          if (then) {
            then();
          }
        });
      },
      function (evt) {
        if (evt.lengthComputable) {
          engine.loadingUIText = "Loading, please wait..." + ((evt.loaded * 100) / evt.total).toFixed() + "%";
        } else {
          dlCount = evt.loaded / (1024 * 1024);
          engine.loadingUIText = "Loading, please wait..." + Math.floor(dlCount * 100.0) / 100.0 + " MB already loaded.";
        }
      }
    );

    canvas.style.opacity = 0;
  };

  // Render loop
  let renderFunction = function () {
    // Fps

    // Render scene
    if (scene) {
      if (!sceneChecked) {
        let remaining = scene.getWaitingItemsCount();
        engine.loadingUIText = "Streaming items..." + (remaining ? remaining + " remaining" : "");

        if (remaining === 0) {
          sceneChecked = true;
        }
      }

      scene.render();
    }
  };

  // Launch render loop
  engine.runRenderLoop(renderFunction);

  // Resize
  window.addEventListener("resize", function () {
    engine.resize();
  });

  // UI
  let panelIsClosed = true;

  engine.enableOfflineSupport = false;

  loadScene(sceneLocation, function () {
    StandardMaterial.BumpTextureEnabled = true;
    scene.collisionsEnabled = true;
    scene.autoClear = true;
    scene.createOrUpdateSelectionOctree();
    scene.getMeshByName("Sol loin").useVertexColors = false;
    scene.gravity.scaleInPlace(0.5);

    // var postProcess = new RefractionPostProcess(
    //   "Refraction",
    //   "/scenes/customs/refMap.jpg",
    //   new Color3(1.0, 1.0, 1.0),
    //   0.5,
    //   0.5,
    //   1.0,
    //   scene.cameras[1]
    // );
  });
});
</script>

<style>
#renderCanvas {
  width: 100%;
  height: 100%;
}
</style>
