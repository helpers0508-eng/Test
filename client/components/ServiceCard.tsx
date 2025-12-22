import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

interface ServiceCardProps {
  id: string | number;
  name: string;
  description: string;
  image: string;
  price?: string;
  category?: string;
}

export default function ServiceCard({
  id,
  name,
  description,
  image,
  price,
  category: _category
}: ServiceCardProps) {
  return (
    <Link 
      href={`${ROUTES.SERVICES}/${id}`}
      className="flex flex-col gap-3 pb-3 group"
    >
      <div 
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl shadow-sm transition-transform hover:scale-[1.02]"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-label={name}
      />
      <div>
        <p className="text-[#111418] dark:text-white text-base font-medium leading-normal">
          {name}
        </p>
        <p className="text-[#617589] dark:text-white/70 text-sm font-normal leading-normal">
          {description}
        </p>
        {price && (
          <p className="text-primary font-bold mt-1">
            {price}
          </p>
        )}
      </div>
    </Link>
  );
}


