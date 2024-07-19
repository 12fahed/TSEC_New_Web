import {
  ClipboardEdit,
  FilePlus,
  FileStack,
  GitPullRequestClosed,
  Home,
  LogOut,
  Menu,
  ShoppingCart,
  User,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import Image from "next/image";
import DevsDark from "@/public/images/devs-dark.png";
import DevsLight from "@/public/images/devs-light.png";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useUser } from "@/providers/UserProvider";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

const MobileHeader = ({ userType }: { userType: string }) => {
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
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="flex w-screen h-14 items-center justify-between gap-4 border-b  px-4 mt-3 lg:h-[60px] lg:px-6  md:hidden lg:hidden">

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col w-[50%]">
          
          {/* Links */}
          <nav className="grid gap-2 text-sm font-medium mt-[20%] space-y-3">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Conditional Links */}
            {userType === "faculty" && (
              <>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Create New Notes
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Past Notes
                </Link>
              </>
            )}
            {userType === "committee" && (
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
              >
                <ShoppingCart className="h-4 w-4" />
                Create New Event
              </Link>
            )}
            {userType === "admin" && (
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
              >
                <ShoppingCart className="h-4 w-4" />
                Approve Events
              </Link>
            )}
            {userType === "railway" && (
              <>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FilePlus className="h-4 w-4" />
                  Create New Pass
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <ClipboardEdit className="h-4 w-4" />
                  Update Pass
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <FileStack className="h-4 w-4" />
                  Pending Requests
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                >
                  <GitPullRequestClosed className="h-4 w-4" />
                  Approved/Rejected Requests
                </Link>
              </>
            )}
            {(userType === "admin" ||
              userType === "faculty" ||
              userType === "principal") && (
                <>
                  <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Create New Notifications
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 transition-all hover:text-blue-600"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Past Notifications
                  </Link>
                </>
              )}
          </nav>

          {/* Account Dropdown */}
          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="ml-4">
                  <User className="mr-2 h-4 w-4" />
                  {`${user?.name}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetContent>
        
      </Sheet>

      <div className="flex float-right space-x-3">
        <Image src={theme == "dark" ? DevsDark : DevsLight} alt="logo" width={60} height={60} className="justify-end" />
        <ModeToggle />
      </div>


    </header>
  )
}

export default MobileHeader;
