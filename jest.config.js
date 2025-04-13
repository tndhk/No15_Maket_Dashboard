// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Next.jsのエイリアスをJestに理解させる
    '^@/(.*)$': '<rootDir>/src/$1',
    // スタイルやアセットのモック
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**/*',
    '!src/**/__mocks__/**/*',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@clerk|@radix-ui|react-day-picker)/)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  modulePaths: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  verbose: true,
}; 