import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  username?: string;
  specialty?: string;
  crm?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  return {
    user: user as User | undefined,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: (user as User)?.role === 'admin'
  };
}