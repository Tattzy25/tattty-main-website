import {
  ArrowRight,
  ArrowLeft,
  Download,
  Edit,
  ImageIcon,
  Plus,
  Settings,
  Trash,
  RefreshCwIcon as Refresh,
  Heart,
  HeartIcon as HeartFilled,
  Facebook,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
  Quote,
  HelpCircle,
  Lightbulb,
  Lock,
  Grid,
  Copy,
  Skull,
  Compass,
  Feather,
  Brain,
  MessageSquare,
  Zap,
  MoreHorizontal,
  User,
  Command,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
  SunMedium,
  Moon,
  Laptop,
  CreditCard,
  File,
  FileText,
  LogOut,
  Mail,
  PlusCircle,
  UserPlus,
  Users,
  Upload,
  Share2,
  Save,
  Search,
  Award,
  Github,
} from "lucide-react"

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  help: HelpCircle,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  google: ({ ...props }) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  ),
  gitHub: Github,
  facebook: Facebook,
  check: ({ ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  loader: Loader2,
  logout: LogOut,
  mail: Mail,
  message: MessageSquare,
  plusCircle: PlusCircle,
  userPlus: UserPlus,
  users: Users,
  file: File,
  fileText: FileText,
  image: ImageIcon,
  heart: Heart,
  heartFilled: HeartFilled,
  download: Download,
  upload: Upload,
  share: Share2,
  edit: Edit,
  copy: Copy,
  grid: Grid,
  home: ({ ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  plus: Plus,
  refresh: Refresh,
  mic: Mic,
  micOff: MicOff,
  save: Save,
  sparkles: Sparkles,
  quote: Quote,
  helpCircle: HelpCircle,
  lightbulb: Lightbulb,
  lock: Lock,
  skull: Skull,
  compass: Compass,
  feather: Feather,
  brain: Brain,
  zap: Zap,
  ellipsisHorizontal: MoreHorizontal,
  search: Search,
  award: Award,
}
