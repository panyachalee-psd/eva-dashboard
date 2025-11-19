import { Bell, Settings, User, Menu, LogOut, UserCircle, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from "react-i18next"; // 👈 i18n hook

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: "en" | "th") => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
      {/* Left Section: Logo + Title */}
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm md:text-lg font-bold">EVA</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base md:text-lg font-semibold text-foreground">
              {t("eva_dashboard")}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {t("integrated_monitoring_system")}
            </p>
          </div>
        </div>

        {!isMobile && (
          <Button variant="ghost" size="sm" onClick={onMenuClick} className="ml-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Right Section: Icons + Profile + Language */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <span
            className="absolute -top-1 -right-1 h-2 w-2 md:h-3 md:w-3 rounded-full"
            style={{ background: "red" }}
          />
        </Button>

        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <Settings className="h-4 w-4 md:h-5 md:w-5" />
        </Button>

        {/* 🌐 Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline text-sm uppercase">
                {i18n.language === "th" ? "TH" : "EN"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-28">
            <DropdownMenuItem onClick={() => changeLanguage("en")}>🇬🇧 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeLanguage("th")}>🇹🇭 ไทย</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 👤 Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-7 w-7 md:h-8 md:w-8 rounded-full p-0">
              <Avatar className="h-7 w-7 md:h-8 md:w-8">
                <AvatarFallback className="bg-primary text-white">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t("admin_user")}</p>
                <p className="text-xs leading-none text-muted-foreground">admin@eva-system.com</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>{t("profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
