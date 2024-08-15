export const preloadScript = 
`
Object.defineProperty(navigator, 'languages', {
  get: function () {
    return ['es-MX', 'es-419', 'es', 'en-US', 'ja'];
  },
});

Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return [
      {
        description: 'Portable Document Format',
        filename: 'internal-pdf-viewer',
        length: 1,
        name: 'Chrome PDF Plugin',
        'application/x-google-chrome-pdf': {
          description: 'Portable Document Format',
          suffixes: 'pdf',
          type: 'application/x-google-chrome-pdf',
        },
      },
    ];
  },
});

Object.defineProperty(navigator, 'webdriver', { get: () => false, });
`