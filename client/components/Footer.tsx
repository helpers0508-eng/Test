import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-sm text-[#617589] dark:text-white/60 border-t border-solid border-t-[#e0cfff] dark:border-t-primary-dark/30 mt-10 px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-[#111418] dark:text-white mb-3">Company</h3>
          <ul>
            <li className="mb-2">
              <Link href={ROUTES.ABOUT} className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link href={ROUTES.CAREERS} className="hover:text-primary">
                Careers
              </Link>
            </li>
            <li>
              <Link href={ROUTES.PRESS} className="hover:text-primary">
                Press
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-[#111418] dark:text-white mb-3">Help & Support</h3>
          <ul>
            <li className="mb-2">
              <Link href={ROUTES.FAQ} className="hover:text-primary">
                FAQ
              </Link>
            </li>
            <li className="mb-2">
              <Link href={ROUTES.CONTACT} className="hover:text-primary">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href={ROUTES.HELP} className="hover:text-primary">
                Help Center
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-[#111418] dark:text-white mb-3">Legal</h3>
          <ul>
            <li className="mb-2">
              <Link href={ROUTES.TERMS} className="hover:text-primary">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href={ROUTES.PRIVACY} className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-[#111418] dark:text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary" aria-label="Facebook">
              <svg className="feather feather-facebook" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="hover:text-primary" aria-label="Twitter">
              <svg className="feather feather-twitter" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" className="hover:text-primary" aria-label="Instagram">
              <svg className="feather feather-instagram" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8 pt-8 border-t border-solid border-t-[#e0cfff] dark:border-t-primary-dark/30">
        <p>© {currentYear} Helpers. All rights reserved.</p>
      </div>
    </footer>
  );
}


