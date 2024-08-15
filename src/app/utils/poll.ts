
export function pollUntil<T>(fn: () => Promise<T>, polling = 300, timeout: number = 30000): Promise<T> {
  return new Promise(async function (resolve, reject) {
    const start = Date.now();
    const check = async () => {
      const value = await fn()
      if (value) return resolve(value);
      if (Date.now() - start > timeout) return reject('timeout');
      setTimeout(check, polling);
    };
    check();
  });
}

export function poll<T>(fn: () => Promise<T>, polling: 300): Promise<void> {
  return new Promise(async function (resolve, reject) {
    if (await fn()) return resolve();
    setTimeout(async () => {
      await fn()
    }, polling);
  });
}
