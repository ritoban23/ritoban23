module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox for proper scaling
          removeViewBox: false,
          // Keep IDs for potential CSS targeting
          cleanupIds: false,
          // Keep style elements for our decorations
          removeStyleElement: false,
          // Don't remove unknown elements (our custom decorations)
          removeUnknownsAndDefaults: false,
        },
      },
    },
    // Additional optimizations
    'removeDimensions',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-*']
      }
    }
  ],
  floatPrecision: 2,
  transformPrecision: 2
};