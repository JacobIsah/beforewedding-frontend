import { Settings } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { NotificationCenter } from "./NotificationCenter";

interface HeaderProps {
  profileImage: string;
  userName: string;
  onSettingsClick: () => void;
}

export function Header({ profileImage, userName, onSettingsClick }: HeaderProps) {
  return (
    <div className="bg-white border-b border-[var(--color-border)] px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-[var(--color-text-dark)]">Welcome back, {userName}</h1>
        <p className="text-[var(--color-text-gray)] mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationCenter />
        
        <button 
          onClick={onSettingsClick}
          className="p-2 hover:bg-[var(--color-bg-light)] rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-[var(--color-text-gray)]" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
          <ImageWithFallback
            src={profileImage}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-[var(--color-text-dark)]">{userName}</p>
            <p className="text-xs text-[var(--color-text-gray)]">Counselor</p>
          </div>
        </div>
      </div>
    </div>
  );
}