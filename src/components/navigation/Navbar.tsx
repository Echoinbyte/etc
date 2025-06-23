import React from "react";
import Image from "next/image";
import ETC from "../../../public/brand/etc.svg";
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
import { Menu } from "@/types";

function Navbar() {
  return (
    <>
      <header
        className={
          "bg-secondary-foreground text-secondary h-16 sticky top-[-1px] z-50 flex items-center justify-between px-16"
        }
      >
        <div className="logo">
          <Image src={ETC} alt={"ETC Logo"} width={36} height={36} />
        </div>
        <NavigationMenu className="flex flex-row justify-between items-center gap-8">
          <NavigationMenuList>
            {Object.entries(navigationItems).map(([key, value]) => {
              return (
                <NavigationMenuItem key={key}>
                  {value.href ? (
                    // <Link href={value.href} passHref>
                    <NavigationMenuLink
                      href={value.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {value.name}
                    </NavigationMenuLink>
                  ) : (
                    // </Link>
                    <NavigationMenuTrigger>{value.name}</NavigationMenuTrigger>
                  )}
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {value.menu
                        ? value.menu.map((menuItem: Menu) => (
                            <Link
                              href={menuItem.href}
                              key={menuItem.href}
                              className={
                                "flex-block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted"
                              }
                            >
                              <h4
                                className={
                                  "text-lg font-medium text-secondary leading-none mb-2"
                                }
                              >
                                {menuItem.title}
                              </h4>
                              <p
                                className={
                                  "line-clamp-2 text-sm text-muted-foreground leading-snug"
                                }
                              >
                                {menuItem.description}
                              </p>
                            </Link>
                          ))
                        : null}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="signature flex flex-row justify-between items-center gap-4">
          <Link href={"/sign-in"}>
            <button
              className={
                "cursor-pointer py-2 px-6 bg-transparent font-bold rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
              }
            >
              <span>Sign in</span>
            </button>
          </Link>
          <Link href={"/sign-up"}>
            <button
              className={
                "cursor-pointer py-2 px-6 bg-transparent font-bold border-2 border-secondary rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
              }
            >
              <span>Get Started &rarr; </span>
            </button>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Navbar;
