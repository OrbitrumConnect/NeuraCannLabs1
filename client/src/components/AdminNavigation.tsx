import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export function AdminNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
      <div className="flex flex-wrap gap-1 md:gap-2 justify-end">
        <Button
          asChild
          variant={location === '/' ? 'default' : 'outline'}
          size="sm"
          className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-xs md:text-sm"
        >
          <Link href="/">
            <i className="fas fa-home mr-1 md:mr-2" />
            <span className="hidden md:inline">Home</span>
          </Link>
        </Button>
        
        <Button
          asChild
          variant={location === '/plans' ? 'default' : 'outline'}
          size="sm"
          className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 border-cyan-400 text-xs md:text-sm"
        >
          <Link href="/plans">
            <i className="fas fa-crown mr-1 md:mr-2" />
            <span className="hidden sm:inline">Planos</span>
          </Link>
        </Button>
        
        <Button
          asChild
          variant={location === '/dashboard' ? 'default' : 'outline'}
          size="sm"
          className="bg-gray-800 hover:bg-gray-700 border-gray-600 text-xs md:text-sm"
        >
          <Link href="/dashboard">
            <i className="fas fa-microscope mr-1 md:mr-2" />
            <span className="hidden sm:inline">Estudo</span>
          </Link>
        </Button>
        
        <Button
          asChild
          variant={location === '/admin' ? 'default' : 'outline'}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm"
        >
          <Link href="/admin">
            <i className="fas fa-shield-alt mr-1 md:mr-2" />
            <span className="hidden md:inline">Admin</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}