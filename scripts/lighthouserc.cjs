module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/about',
        'http://localhost:3000/book',
        'http://localhost:3000/essays',
      ],
      settings: {
        onlyCategories: ['performance'],
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'cumulative-layout-shift': ['warn', { aggregationMethod: 'median', maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { aggregationMethod: 'median', maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { aggregationMethod: 'median', maxNumericValue: 200 }],
      },
    },
    upload: {
      outputDir: '.lighthouseci',
      target: 'filesystem',
    },
  },
};
