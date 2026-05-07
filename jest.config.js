const { createDefaultPreset } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    ...createDefaultPreset().transform,
  },
};