"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";
import { Lock, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/providers/UserProvider";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/modeToggle";
import LeftSideLinks from "@/components/LeftSideLinks";
import Link from "next/link";

const Header = ({ userType }: { userType: string }) => {
  const { theme } = useTheme();
  const { user, setUser, setLoggedIn } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      router.push("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className={`w-full border-b ${theme} hidden md:flex`}>
      <div className="flex items-center justify-between p-4 w-full">
        <div className="flex items-center">
          <Image
            src={theme == "dark" ? DevsDark : DevsLight}
            alt="logo"
            width={65}
            height={65}
          />
          <div className="ml-5 space-x-6">
            <LeftSideLinks userType={userType} />
          </div>
        </div>
        <div className="flex items-center">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="ml-4">
                <User className="mr-2 h-4 w-4" />
                {`${user?.name}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href="/auth/change-password"
                  className="flex items-center"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem onSelect={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
