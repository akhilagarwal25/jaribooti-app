declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';

  interface LucideProps extends SvgProps {
    size?: number;
    strokeWidth?: number;
    color?: string;
  }

  export const Home: ComponentType<LucideProps>;
  export const ShoppingCart: ComponentType<LucideProps>;
  export const User: ComponentType<LucideProps>;
  export const Grid: ComponentType<LucideProps>;
  export const Search: ComponentType<LucideProps>;
  export const ChevronLeft: ComponentType<LucideProps>;
  export const ChevronRight: ComponentType<LucideProps>;
  export const Plus: ComponentType<LucideProps>;
  export const Minus: ComponentType<LucideProps>;
  export const Trash2: ComponentType<LucideProps>;
  export const Check: ComponentType<LucideProps>;
  export const CheckCircle2: ComponentType<LucideProps>;
  export const Package: ComponentType<LucideProps>;
  export const ShoppingBag: ComponentType<LucideProps>;
  export const LogOut: ComponentType<LucideProps>;
  export const Settings: ComponentType<LucideProps>;
  export const Package: ComponentType<LucideProps>;
  export const MapPin: ComponentType<LucideProps>;
  export const CreditCard: ComponentType<LucideProps>;
  export const Eye: ComponentType<LucideProps>;
  export const EyeOff: ComponentType<LucideProps>;
  export const X: ComponentType<LucideProps>;
  export const AlertCircle: ComponentType<LucideProps>;
  export const Loader2: ComponentType<LucideProps>;
  export const Mail: ComponentType<LucideProps>;
  export const Lock: ComponentType<LucideProps>;
  export const Phone: ComponentType<LucideProps>;
  export const ArrowLeft: ComponentType<LucideProps>;
  export const ArrowRight: ComponentType<LucideProps>;
  export const Globe: ComponentType<LucideProps>;
}
