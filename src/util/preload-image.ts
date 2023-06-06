export async function preloadImages(
  srcs: string[],
  body: HTMLElement = document.body
): Promise<void> {
  const deduplicatedSrcs = [...new Set(srcs)];
  const promises = await Promise.allSettled(
    deduplicatedSrcs.map((src) => preloadImage(src, body))
  );
  const rejected = promises.filter((promise) => promise.status === "rejected");
  if (rejected.length > 0) {
    console.error("Could not preload some images:", rejected);
  }
}

function preloadImage(
  src: string,
  body: HTMLElement = document.body
): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.style.display = "none";
    image.onload = () => {
      body.removeChild(image);
      resolve();
    };
    image.onerror = () => {
      body.removeChild(image);
      reject();
    };
    body.appendChild(image);
  });
}
