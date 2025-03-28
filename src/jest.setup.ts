/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/jest-dom'
import { useCharactersStore } from './store/useStore'
import { CharactersState } from './types'

jest.mock('@/assets/heart-active.svg?react', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('@/assets/heart-inactive.svg?react', () => ({
  __esModule: true,
  default: () => null,
}))

// Mock useStore
jest.mock('@/store/useStore', () => ({
  useCharactersStore: jest.fn(),
}))
const useStoreMock = jest.mocked(useCharactersStore)
export const mockUseStore = (overrides: Partial<CharactersState> = {}) => {
  useStoreMock.mockImplementation((getterFn) => {
    return getterFn({
      ...jest.requireActual('./store/useStore').useCharactersStore(),
      ...overrides,
    })
  })
}

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}))
const useNavigateMock = jest.mocked(require('react-router-dom').useNavigate)
const useLocationMock = jest.mocked(require('react-router-dom').useLocation)
const useParamsMock = jest.mocked(require('react-router-dom').useParams)
export const mockReactRouterDom = (
  overrides: Partial<{
    navigate: jest.Mock
    location: ReturnType<typeof useLocationMock>
    params: ReturnType<typeof useParamsMock>
  }> = {},
) => {
  useNavigateMock.mockReturnValue(overrides.navigate || jest.fn())
  useLocationMock.mockReturnValue(
    overrides.location || { pathname: '/', search: '', hash: '', state: null },
  )
  useParamsMock.mockReturnValue(overrides.params || {})
}

// Mock useAPI
jest.mock('@/hooks/useAPI', () => ({
  useAPI: jest.fn().mockImplementation(() => ({
    isLoading: false,
    error: null,
    characters: [],
    getCharacters: jest.fn().mockResolvedValue({ characters: [], total: 0 }),
    getCharacterById: jest.fn(),
  })),
}))
const useAPIMock = jest.mocked(require('@/hooks/useAPI').useAPI)
export const mockUseAPI = (
  overrides: Partial<ReturnType<typeof useAPIMock>> = {},
) => {
  useAPIMock.mockImplementation(() => ({
    isLoading: false,
    error: null,
    characters: [],
    getCharacters: jest.fn().mockResolvedValue({ characters: [], total: 0 }),
    getCharacterById: jest.fn(),
    ...overrides,
  }))
}

beforeEach(() => {
  mockUseStore()
  mockReactRouterDom()
  mockUseAPI()
})

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
