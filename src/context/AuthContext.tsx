
'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any; // Replace 'any' with a more specific user type if you have one
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <AuthContext.Provider value={{ user, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default function App({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
