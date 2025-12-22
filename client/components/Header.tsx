import Link from 'next/link';
import _Image from 'next/image';
import { ROUTES } from '@/lib/constants';

interface HeaderProps {
  showAuthButtons?: boolean;
  currentPath?: string;
}

export default function Header({ showAuthButtons = true, currentPath: _currentPath }: HeaderProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e0cfff] dark:border-b-primary-dark/30 px-4 sm:px-10 py-3">
      <div className="flex items-center gap-4 text-[#111418] dark:text-white">
        <Link href={ROUTES.HOME} className="flex items-center gap-4">
          <img 
            src="/logo.jpeg" 
            alt="Helpers Logo" 
            className="h-6 w-auto object-contain"
          />
          <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            Helpers
          </h2>
        </Link>
      </div>
      
      <div className="flex flex-1 justify-end gap-8">
        <nav className="hidden md:flex items-center gap-9">
          <Link 
            href={ROUTES.SERVICES}
            className="text-[#111418] dark:text-white/80 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
          >
            Browse Services
          </Link>
          <Link 
            href={ROUTES.HELPER_DASHBOARD}
            className="text-[#111418] dark:text-white/80 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
          >
            For Helpers
          </Link>
        </nav>
        
        {showAuthButtons && (
          <div className="flex gap-2">
            <Link
              href={ROUTES.LOGIN}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark/50 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-input-border dark:border-primary-dark/50 hover:bg-input-bg dark:hover:bg-primary-dark/20 transition-colors"
            >
              <span className="truncate">Log In</span>
            </Link>
            <Link
              href={ROUTES.SIGNUP}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"
            >
              <span className="truncate">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}


