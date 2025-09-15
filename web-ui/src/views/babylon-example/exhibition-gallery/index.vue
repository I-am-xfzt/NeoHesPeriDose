<template>
  <div class="page-container wh100">
    <canvas id="renderCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  Engine,
  Scene,
  Vector3,
  StandardMaterial,
  SceneLoader,
} from "@babylonjs/core";
nextTick().then(() => {
  let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  let sceneChecked: boolean;
  let sceneLocation: string = "https://www.babylonjs.com/Scenes/";

  // Babylon
  let engine = new Engine(canvas, true, { preserveDrawingBuffer: true });
  let scene: Scene;

  let loadScene = function (then: () => void) {
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
          canvas.style.opacity = '1';
          if (scene.activeCamera) {
            scene.activeCamera.attachControl(canvas);

            if (newScene.activeCamera && newScene.activeCamera.keysUp) {
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

    canvas.style.opacity = '0';
  };

  // Render loop
  let renderFunction = function () {
    // Fps
    let frameCount = 0
    const renderFrequency = 4 // 每 4 帧渲染一次
    // Render scene
    if (scene) {
      if (!sceneChecked) {
        let remaining = scene.getWaitingItemsCount();
        engine.loadingUIText = "Streaming items..." + (remaining ? remaining + " remaining" : "");
        if (remaining === 0) {
          sceneChecked = true;
        }
      }
      if (frameCount % renderFrequency === 0) scene.render();
      frameCount++
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

  loadScene(() => {
    StandardMaterial.BumpTextureEnabled = true;
    scene.collisionsEnabled = true;
    scene.autoClear = true;
    scene.createOrUpdateSelectionOctree();
    scene.getMeshByName("Sol loin")!.useVertexColors = false;
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
