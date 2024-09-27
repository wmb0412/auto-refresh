export type AutoRefreshConfig = {
  intervalTime?: number;
  src?: string;
};

type AutoRefreshCallback = () => void;
export async function autoRefresh(cb: AutoRefreshCallback, config?: AutoRefreshConfig) {
  const intervalTime = config?.intervalTime || 20 * 1000;
  const src = config?.src ?? location.origin
  const initHash = await getHash(src);
  const timer = setInterval(async () => {
    const hash = await getHash(src);
    if (hash !== initHash) {
      clearInterval(timer);
      cb?.();
    }
  }, intervalTime);
}

async function getHash(src: string) {
  try {
    const hash = fetch(src + '?t=' + new Date().getTime())
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // 将响应转换为文本
      });
    return hash;
  } catch (error) {}
}
