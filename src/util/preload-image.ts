export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.style.display = "none";
    image.onload = () => {
      document.body.removeChild(image);
      resolve();
    };
    image.onerror = () => {
      document.body.removeChild(image);
      reject();
    };
    document.body.appendChild(image);
  });
}
