"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/race", label: "Race" },
  { href: "/standings", label: "Standings" },
];

export function Navbar() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          <div className="flex items-center gap-1">
            <Image
              className="size-14 p-0"
              src="/logo.png"
              alt="GridLens"
              width={100}
              height={100}
            />
            GridLens
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="px-0">
                <SheetHeader className="pb-2">
                  <SheetTitle className="px-4">
                    <div className="flex items-center gap-1">
                      <Image
                        className="size-14 p-0"
                        src="/logo.png"
                        alt="GridLens"
                        width={100}
                        height={100}
                      />
                      GridLens
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="border-b" />
                <div className="flex flex-col">
                  {links.map((l) => (
                    <SheetClose asChild key={l.href}>
                      <Link
                        href={l.href}
                        className="hover:bg-accent hover:text-accent-foreground px-4 py-3 text-base"
                      >
                        {l.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
