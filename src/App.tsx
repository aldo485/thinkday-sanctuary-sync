import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThinkDayProvider } from '@/contexts/ThinkDayContext';
import Dashboard from '@/pages/Dashboard';
import Journal from '@/pages/Journal';
import Settings from '@/pages/Settings';
import GuidedSession from '@/pages/GuidedSession';
import NotFound from '@/pages/NotFound';
import Navigation from '@/components/Navigation';

const queryClient = new QueryClient();

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Smooth app loading animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThinkDayProvider>
          <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen max-w-4xl mx-auto px-6 lg:px-8">
                <main className="flex-1 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/session" element={<GuidedSession />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Navigation />
              </div>
            </BrowserRouter>
          </div>
        </ThinkDayProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;