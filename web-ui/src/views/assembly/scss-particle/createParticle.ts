import { nextTick } from "vue";
import '@/styles/scss-particle.scss';
export const createParticle = (eleDom: HTMLDivElement) => {
  if(eleDom.querySelector('.sky')) return;
  nextTick().then(() => {
    const div = <HTMLElement>document.createElement("div");
    div.setAttribute("class", "sky absolute posZero");
    const htmls = `
              <div class="layer1"></div>
              <div class="layer2"></div>
              <div class="layer3"></div>
              <div class="layer4"></div>
              <div class="layer5"></div>
        `;
    div.style.width = "100%";
    div.style.height = "100%";
    div.innerHTML = htmls;
    eleDom.insertBefore(div, eleDom.childNodes[0]);
  });
};
