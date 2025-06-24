"use client";

import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import Image from "next/image";
import { ExtendedButton } from "@/components/shared/ExtendedButton";

function Herosection() {
  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-background text-foreground ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)/8%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--secondary)/8%,transparent_50%)]"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-15 blur-2xl">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/brand/etc.svg')" }}
        ></div>
      </div>

      <div className="relative z-20 py-8 md:h-[calc(100vh-64px)] md:flex md:items-center">
        <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <main className="flex flex-col items-center justify-between gap-12 md:flex-row md:items-center">
            {/* Text Content */}
            <div
              className={`max-w-2xl transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              } transition-all duration-700 delay-100 ease-out md:pr-8`}
            >
              {/* Label */}
              <div className="mb-4 inline-flex items-center rounded-full bg-card/60 px-3 py-1 backdrop-blur-sm border border-border">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary"></span>
                <span className="text-sm font-medium text-muted-foreground">
                  Open Source
                </span>
              </div>
              {/* Heading */}
              <h1 className="font-display bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent md:text-6xl lg:text-7xl">
                Email Template Component
              </h1>
              {/* Description */}
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                ETC simplifies email development with ready-to-use, customizable
                HTML & CSS templates. Preview, publish, and contribute to
                high-quality templates — no configuration needed.
              </p>{" "}
              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <ExtendedButton size="lg">Get Started Free</ExtendedButton>
                <ExtendedButton
                  link={"https://github.com/Echoinbyte/etc"}
                  variant={"outline"}
                  size="lg"
                  external
                >
                  View on GitHub
                </ExtendedButton>
              </div>
              {/* Stats */}
              <div
                className={`mt-12 flex flex-wrap gap-8 text-sm ${
                  isLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity delay-300 duration-700`}
              >
                <div>
                  <div className="font-bold text-2xl text-foreground">20+</div>
                  <div className="text-muted-foreground">Templates</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-foreground">7+</div>
                  <div className="text-muted-foreground">GitHub Stars</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-foreground">
                    99.9%
                  </div>
                  <div className="text-muted-foreground">
                    Client Compatibility
                  </div>
                </div>
              </div>
            </div>

            {/* Image/Visual */}
            <div
              className={`w-full md:w-1/2 flex items-center justify-center transform ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              } transition-all duration-700 delay-200 ease-out`}
            >
              <div className="relative">
                {/* Large logo glow effect */}
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl"></div>

                {/* Email template mockup */}
                <div className="relative bg-card rounded-2xl border border-border shadow-xl p-4 overflow-hidden w-full max-w-md">
                  {/* Email header */}
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground">
                        HTML Email Template
                      </div>
                    </div>
                  </div>

                  {/* Email content mockup */}
                  <div className="bg-background rounded-lg p-4 text-foreground">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="ml-3">
                        <div className="h-4 w-32 bg-muted rounded"></div>
                        <div className="h-3 w-24 bg-muted/50 rounded mt-1"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted/50 rounded"></div>
                      <div className="h-4 w-5/6 bg-muted/50 rounded"></div>
                      <div className="h-4 w-4/6 bg-muted/50 rounded"></div>
                    </div>
                    <div className="mt-4">
                      <div className="h-8 w-28 bg-primary/20 rounded-md"></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-center">
                        <Image
                          src="/brand/etc.svg"
                          width={36}
                          height={36}
                          alt="ETC Logo"
                          className="opacity-70"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Code preview beneath */}
                  <div className="mt-4 bg-background/80 rounded-lg p-3 text-xs font-mono text-muted-foreground overflow-hidden">
                    <div>
                      &lt;<span className="text-primary">div</span>{" "}
                      <span className="text-secondary">class</span>=
                      <span className="text-accent">
                        &#34;email-container&#34;
                      </span>
                      &gt;
                    </div>
                    <div className="pl-4">
                      &lt;<span className="text-primary">header</span>&gt;...
                    </div>
                    <div className="pl-4">
                      &lt;<span className="text-primary">main</span>&gt;...
                    </div>
                    <div className="pl-4">
                      &lt;<span className="text-primary">footer</span>&gt;...
                    </div>
                    <div>
                      &lt;/<span className="text-primary">div</span>&gt;
                    </div>
                  </div>

                  {/* Floating elements for visual flair */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary rounded-full opacity-70 blur-sm"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full opacity-70 blur-sm"></div>
                </div>

                {/* ETC logo floating */}
                <div className="absolute -top-8 -right-8 transform rotate-12">
                  <Image
                    src="/brand/etc.svg"
                    width={76}
                    height={76}
                    alt="Logo of ETC"
                    className="drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}

export default Herosection;
