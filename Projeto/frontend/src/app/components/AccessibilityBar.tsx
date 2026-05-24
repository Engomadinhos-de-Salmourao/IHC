import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, Contrast, Type, X } from 'lucide-react';
import { toast } from 'sonner';

export function AccessibilityBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem('accessibility_fontSize');
    const savedContrast = localStorage.getItem('accessibility_highContrast');
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}%`;
    }
    if (savedContrast === 'true') {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem('accessibility_fontSize', newSize.toString());
      toast.success('Texto aumentado');
    } else {
      toast.info('Tamanho máximo atingido');
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem('accessibility_fontSize', newSize.toString());
      toast.success('Texto diminuído');
    } else {
      toast.info('Tamanho mínimo atingido');
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = '100%';
    localStorage.setItem('accessibility_fontSize', '100');
    toast.success('Tamanho padrão restaurado');
  };

  const toggleHighContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    
    if (newContrast) {
      document.documentElement.classList.add('high-contrast');
      localStorage.setItem('accessibility_highContrast', 'true');
      toast.success('Alto contraste ativado');
    } else {
      document.documentElement.classList.remove('high-contrast');
      localStorage.setItem('accessibility_highContrast', 'false');
      toast.success('Alto contraste desativado');
    }
  };

  if (!isVisible) {
    return (
      <>
        <button
          onClick={() => setIsVisible(true)}
          className="fixed top-0 right-0 z-50 bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          aria-label="Mostrar barra de acessibilidade"
        >
          Acessibilidade
        </button>
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:inline">Acessibilidade:</span>
              
              <div className="flex items-center gap-1 border-r border-gray-700 pr-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  className="text-white hover:bg-gray-800 h-8 px-2"
                  title="Diminuir texto"
                >
                  <ZoomOut className="size-4" />
                  <span className="ml-1 hidden sm:inline text-xs">A-</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFontSize}
                  className="text-white hover:bg-gray-800 h-8 px-2"
                  title="Tamanho padrão"
                >
                  <Type className="size-4" />
                  <span className="ml-1 hidden sm:inline text-xs">{fontSize}%</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  className="text-white hover:bg-gray-800 h-8 px-2"
                  title="Aumentar texto"
                >
                  <ZoomIn className="size-4" />
                  <span className="ml-1 hidden sm:inline text-xs">A+</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHighContrast}
                className={`text-white hover:bg-gray-800 h-8 px-3 ${
                  highContrast ? 'bg-gray-700' : ''
                }`}
                title="Alternar alto contraste"
              >
                <Contrast className="size-4" />
                <span className="ml-2 hidden sm:inline text-xs">
                  {highContrast ? 'Contraste Alto' : 'Contraste'}
                </span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-gray-800 h-8 px-2"
              title="Ocultar barra"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}