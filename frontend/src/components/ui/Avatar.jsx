import { clsx } from 'clsx';

export default function Avatar({ src, name, size = 'md', className }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className={clsx('rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-semibold', sizes[size], className)}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 text-black">
          {initials}
        </div>
      )}
    </div>
  );
}
