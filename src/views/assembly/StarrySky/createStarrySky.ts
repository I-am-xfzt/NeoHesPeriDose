
export const createStarrySky = () => {
    const bodys: Element = document.body
    const div = <HTMLElement>document.createElement("div")
    div.setAttribute("class", "sky")
    const htmls = `
              <div class="layer1"></div>
              <div class="layer2"></div>
              <div class="layer3"></div>
              <div class="layer4"></div>
              <div class="layer5"></div>
        `
    div.style.width = '100%';
    div.style.height = '100%';
    div.innerHTML = htmls
    bodys.insertBefore(div, bodys.childNodes[0])
}