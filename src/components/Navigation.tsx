import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <footer className="py-6 mt-8">
      <nav className="flex justify-center space-x-1 mb-6">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Button
            key={path}
            variant="ghost"
            onClick={() => navigate(path)}
            className={cn(
              "relative px-6 py-2 transition-all duration-200",
              location.pathname === path
                ? "text-primary after:absolute after:bottom-0 after:left-1/2 after:w-full after:h-0.5 after:bg-primary after:transform after:-translate-x-1/2 after:transition-all after:duration-200"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </nav>
      
      <p className="text-center text-xs text-muted-foreground">
        Your data is saved privately on this device and is never sent to a server.
      </p>
    </footer>
  );
};

export default Navigation;