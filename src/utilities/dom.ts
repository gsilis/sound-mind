export function removeFromParent(...elements: HTMLElement[]) {
  elements.forEach((element) => {
    if (element.parentElement) element.parentElement.removeChild(element)
  })
}