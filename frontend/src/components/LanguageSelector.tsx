import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LanguageCode } from '../utils/translations';

interface LanguageSelectorProps {
  variant?: 'dark' | 'light' | 'pill';
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'light',
  compact = false,
}) => {
  const { language, setLanguage, languages, currentLanguageOption, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-blue-900/80 hover:bg-blue-800 text-white border-blue-700/60 shadow-sm';
      case 'pill':
        return 'bg-blue-50 text-blue-900 hover:bg-blue-100 border-blue-200 shadow-sm';
      case 'light':
      default:
        return 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${getButtonStyles()}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t('language', 'Change Language')}
      >
        <Globe className={`w-3.5 h-3.5 ${variant === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
        <span className="text-sm leading-none">{currentLanguageOption.flag}</span>
        {!compact && (
          <span className="font-extrabold tracking-tight">
            {currentLanguageOption.nativeName}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 focus:outline-none z-50 py-1.5 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {t('language', 'Select Language')}
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.5 rounded">
              8 Languages
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {languages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 font-black'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold leading-tight text-slate-900">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{lang.name}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-700 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
