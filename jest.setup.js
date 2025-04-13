import '@testing-library/jest-dom';

// モックの定義
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  })),
  useParams: jest.fn(() => ({})),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Clerk認証モック
jest.mock('@clerk/nextjs', () => ({
  auth: jest.fn(() => ({ userId: 'test-user-id' })),
  currentUser: jest.fn(() => ({ id: 'test-user-id', role: 'admin' })),
  ClerkProvider: ({ children }) => <>{children}</>,
  useAuth: jest.fn(() => ({ userId: 'test-user-id', isLoaded: true, isSignedIn: true })),
  useUser: jest.fn(() => ({ user: { id: 'test-user-id', fullName: 'Test User' }, isLoaded: true })),
}));

// グローバルな変数の設定
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})); 