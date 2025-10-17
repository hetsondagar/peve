import { generateAvatarDataUrl, type AvatarStyle } from '@/lib/avatar';

interface AvatarProps {
  username: string;
  avatarStyle?: AvatarStyle;
  size?: number;
  className?: string;
  showFallback?: boolean;
}

export default function Avatar({ 
  username, 
  avatarStyle = 'botttsNeutral', 
  size = 40, 
  className = '',
  showFallback = true 
}: AvatarProps) {
  const avatarUrl = generateAvatarDataUrl(avatarStyle, username, size);

  return (
    <div className={`flex-shrink-0 ${className}`}>
      <img
        src={avatarUrl}
        alt={`${username}'s avatar`}
        className="rounded-full"
        style={{ width: size, height: size }}
        onError={(e) => {
          if (showFallback) {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold';
            fallback.style.width = `${size}px`;
            fallback.style.height = `${size}px`;
            fallback.textContent = username.charAt(0).toUpperCase();
            target.parentNode?.insertBefore(fallback, target);
          }
        }}
      />
    </div>
  );
}
