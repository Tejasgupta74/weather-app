import {
  Sun,
  Moon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
}

export function WeatherIcon({ name, className = 'w-5 h-5' }: WeatherIconProps) {
  switch (name) {
    case 'Sun':
      return <Sun className={className} aria-hidden="true" />;
    case 'Moon':
      return <Moon className={className} aria-hidden="true" />;
    case 'Cloud':
      return <Cloud className={className} aria-hidden="true" />;
    case 'CloudFog':
      return <CloudFog className={className} aria-hidden="true" />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} aria-hidden="true" />;
    case 'CloudRain':
      return <CloudRain className={className} aria-hidden="true" />;
    case 'CloudSnow':
      return <CloudSnow className={className} aria-hidden="true" />;
    case 'CloudLightning':
      return <CloudLightning className={className} aria-hidden="true" />;
    default:
      return <Sun className={className} aria-hidden="true" />;
  }
}
