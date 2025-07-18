export default {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
    moduleNameMapper: {
        '^@$': '<rootDir>/src',
        '^@/(.*)\\.(?!jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/src/$1',
        '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.ts',
        '.*\\.(css|less|scss)$': 'identity-obj-proxy',
        '^.+\\.svg\\?react$': 'jest-transformer-svg',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.svg\\?react$': 'jest-transformer-svg',
        '^.+\\.svg$': 'jest-transformer-svg'
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts'
    ],
}