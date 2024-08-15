const prodArgs = [
  '--log-level=3', // fatal only
  '--start-maximized',
  '--no-default-browser-check',
  '--disable-site-isolation-trials',
  '--no-experiments',
  '--ignore-gpu-blacklist',
  '--ignore-certificate-errors',
  '--ignore-certificate-errors-spki-list',
  '--disable-gpu',
  '--disable-extensions',
  '--disable-default-apps',
  '--enable-features=NetworkService',
  '--disable-setuid-sandbox',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  // Extras
  '--disable-webgl',
  '--disable-threaded-animation',
  '--disable-threaded-scrolling',
  '--disable-in-process-stack-traces',
  '--disable-histogram-customizer',
  '--disable-gl-extensions',
  '--disable-composited-antialiasing',
  '--disable-canvas-aa',
  '--disable-3d-apis',
  '--disable-accelerated-2d-canvas',
  '--disable-accelerated-jpeg-decoding',
  '--disable-accelerated-mjpeg-decode',
  '--disable-app-list-dismiss-on-blur',
  '--disable-accelerated-video-decode',
];

const puppeteerConfig = {
  chroniumArgs: [
    // '--disable-infobars',
    // '--enable-automation',
    '--disable-features=IsolateOrigins,site-per-process',
    '--start-maximized',
    '--window-size=1920,1080',
    // '--proxy-server=190.103.179.7:3128',
    // Extras
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
  ],
};

export { puppeteerConfig };
