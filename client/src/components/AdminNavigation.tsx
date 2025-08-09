import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export function AdminNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex space-x-2">
        <Button
          asChild
          variant={location === '/' ? 'default' : 'outline'}
          size="sm"
          className="bg-gray-800 hover:bg-gray-700 border-gray-600"
        >
          <Link href="/">
            <i className="fas fa-home mr-2" />
            Home
          </Link>
        </Button>
        
        <Button
          asChild
          variant={location === '/dashboard' ? 'default' : 'outline'}
          size="sm"
          className="bg-gray-800 hover:bg-gray-700 border-gray-600"
        >
          <Link href="/dashboard">
            <i className="fas fa-microscope mr-2" />
            Meu Estudo
          </Link>
        </Button>
        
        <Button
          asChild
          variant={location === '/admin' ? 'default' : 'outline'}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Link href="/admin">
            <i className="fas fa-shield-alt mr-2" />
            Admin
          </Link>
        </Button>
      </div>
    </div>
  );
}