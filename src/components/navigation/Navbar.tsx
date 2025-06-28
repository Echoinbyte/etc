"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navigationItems } from "@/data";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ExtendedButton } from "@/components/shared/ExtendedButton";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { Menu as MenuType } from "@/types";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <>
      <header className="bg-secondary-foreground text-secondary h-16 sticky top-[-1px] z-50 flex items-center justify-between px-4 md:px-16">
        <div className="logo">
          <Link href="/">
            <Image src={"/brand/etc.svg"} alt={"ETC Logo"} width={36} height={36} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu className="flex flex-row justify-between items-center gap-8">
            <NavigationMenuList>
              {Object.entries(navigationItems).map(([key, value]) => {
                return (
                  <NavigationMenuItem key={key}>
                    {value.href ? (
                      <NavigationMenuLink
                        href={value.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {value.name}
                      </NavigationMenuLink>
                    ) : (
                      <NavigationMenuTrigger>
                        {value.name}
                      </NavigationMenuTrigger>
                    )}
                    {value.menu && (
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {value.menu.map((menuItem: MenuType) => (
                            <Link
                              href={menuItem.href}
                              key={menuItem.href}
                              className="flex-block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                            >
                              <h4 className="text-lg font-medium text-secondary leading-none mb-2">
                                {menuItem.title}
                              </h4>
                              <p className="line-clamp-2 text-sm text-muted-foreground leading-snug">
                                {menuItem.description}
                              </p>
                            </Link>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Authentication & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign out
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/10">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {session.user?.name || "User"}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <ExtendedButton
                  link="/auth/signin"
                  variant="outline"
                  size="sm"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover:border-secondary/80"
                >
                  Get Started
                </ExtendedButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-secondary hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-secondary-foreground z-40">
            <div className="flex flex-col p-4 space-y-4">
              {/* Mobile Navigation */}
              {Object.entries(navigationItems).map(([key, value]) => (
                <div key={key} className="border-b border-secondary/20 pb-4">
                  {value.href ? (
                    <Link
                      href={value.href}
                      className="text-secondary font-medium text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {value.name}
                    </Link>
                  ) : (
                    <div>
                      <h3 className="text-secondary font-medium text-lg mb-2">
                        {value.name}
                      </h3>
                      {value.menu && (
                        <div className="ml-4 space-y-2">
                          {value.menu.map((menuItem: MenuType) => (
                            <Link
                              key={menuItem.href}
                              href={menuItem.href}
                              className="block text-secondary/80 text-sm hover:text-secondary"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {menuItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 space-y-2">
                {session ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 rounded-md bg-secondary/10">
                      <User className="h-4 w-4 text-secondary" />
                      <span className="text-secondary">
                        {session.user?.name || "User"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-secondary text-secondary/80 hover:bg-secondary hover:text-secondary"
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full text-secondary/80 hover:bg-secondary hover:text-secondary"
                      onClick={() => {
                        window.location.href = "/auth/signin";
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign in
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-secondary text-secondary/80 hover:bg-secondary hover:text-secondary"
                      onClick={() => {
                        window.location.href = "/auth/signin";
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
