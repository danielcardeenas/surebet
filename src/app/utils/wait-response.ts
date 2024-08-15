import { HTTPResponse, Page } from 'puppeteer';

export function waitForResponse<T>(
  page: Page,
  url: string,
  withFn?: (response: HTTPResponse) => boolean | Promise<boolean>,
): Promise<{ response: T; statusCode: number }> {
  return new Promise(async (resolve) => {
    const response = await page.waitForResponse((response) => {
      return response.url().includes(url);
    });

    // Generate result
    const genResult = async () => {
      const json = await response
        .json()
        .then((r) => r as T)
        .catch(() => null);

      if (json) {
        resolve({ response: json, statusCode: response.status() });
      }
    };

    if (withFn != undefined) {
      if (await withFn(response)) {
        genResult();
      }
    } else {
      genResult();
    }
  });
}

export const jsonable = async (response: HTTPResponse) => {
  try {
    await response.json();
    return true;
  } catch (err) {
    return false;
  }
};
