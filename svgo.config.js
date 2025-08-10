module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep IDs for potential CSS targeting
          cleanupIds: false,
          // Don't remove unknown elements (our custom decorations)
          removeUnknownsAndDefaults: false,
        },
      },
    },
    // Keep viewBox for proper scaling
    {
      name: 'removeViewBox',
      active: false
    },
    // Keep style elements for our decorations  
    {
      name: 'removeStyleElement',
      active: false
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