export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // Make Jest understand absolute imports like "@/utils/axios"
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
};
