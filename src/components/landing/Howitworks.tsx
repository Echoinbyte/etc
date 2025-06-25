"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  LayoutTemplate,
  Users2,
  Sparkles,
  Hammer,
  Bug,
  Send,
  ArrowRight,
  RefreshCcw,
  CheckCircle,
  Rocket,
  Code,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { ExtendedButton } from "@/components/shared/ExtendedButton";

function HowItWorks() {
  interface StepFlowItem {
    icon: ReactNode;
    title: string;
    description: string;
    image?: string;
    extraDetails?: string;
    animateStyle?: string;
  }

  interface SprintPhase {
    name: string;
    icon: ReactNode;
  }

  const stepFlowItems: StepFlowItem[] = [
    {
      icon: <LayoutTemplate className="h-10 w-10" />,
      title: "Template Modules",
      description: "Powerful layout components tailored for email",
      extraDetails:
        "Prebuilt email blocks that scale across devices and email platforms.",
      image: "/assets/step-module.svg",
      animateStyle: "group-hover:scale-110",
    },
    {
      icon: <Hammer className="h-10 w-10" />,
      title: "Responsive Framework",
      description: "Tested designs across all clients",
      extraDetails:
        "Zero hacks, full compatibility with Gmail, Outlook, Apple Mail, and more.",
      image: "/assets/step-framework.svg",
      animateStyle: "group-hover:rotate-45",
    },
    {
      icon: <Users2 className="h-10 w-10" />,
      title: "Community Collaboration",
      description: "Built with input from email experts",
      extraDetails: "Join a network of devs who craft top-notch email tools.",
      image: "/assets/step-community.svg",
      animateStyle: "group-hover:scale-110",
    },
  ];

  const sprintPhases: SprintPhase[] = [
    { name: "Design", icon: <Sparkles className="h-4 w-4" /> },
    { name: "Code", icon: <Code className="h-4 w-4" /> },
    { name: "Test", icon: <Bug className="h-4 w-4" /> },
    { name: "Publish", icon: <Send className="h-4 w-4" /> },
  ];

  const [progressValue, setProgressValue] = useState<number>(0);
  const [currentSprint, setCurrentSprint] = useState<number>(1);
  const totalSprints = 3;

  const animationRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0); // to avoid frequent re-renders

  const animateProgress = useCallback(() => {
    const duration = 5000; // 5 seconds

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min((elapsed / duration) * 100, 100);

      // Only update state when there's a noticeable visual change (e.g., 0.5%)
      if (Math.abs(progress - progressRef.current) >= 0.5) {
        progressRef.current = progress;
        setProgressValue(progress);
      }

      if (progress >= 100) {
        intervalRef.current = setTimeout(() => {
          setCurrentSprint((prev) => (prev < totalSprints ? prev + 1 : 1));
          setProgressValue(0);
          progressRef.current = 0;
          startTimeRef.current = null;
          animationRef.current = requestAnimationFrame(animate);
        }, 500); // slight pause before next sprint
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [totalSprints]);

  useEffect(() => {
    animateProgress();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (intervalRef.current !== null) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animateProgress]);

  return (
    <section id="technology" className="bg-background py-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
            How ETC Works
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Building Better{" "}
            <span
              className={
                "text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text"
              }
            >
              Email Templates
            </span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            ETC combines powerful components with developer-friendly tools to
            help you create beautiful, responsive emails in minutes instead of
            hours.
          </p>
        </div>
        <div className="bg-card rounded-xl shadow-lg border border-border p-8 mb-10 transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stepFlowItems.map((item, index) => (
              <HoverCard key={index}>
                <HoverCardTrigger asChild>
                  <div className="group bg-gradient-to-br from-card to-muted rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border h-full cursor-pointer">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`bg-muted rounded-full p-4 mb-4 text-primary ${
                          item.animateStyle ? item.animateStyle : ""
                        } transition-transform duration-1000`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 md:w-96 shadow-lg bg-popover text-popover-foreground border-border">
                  <div className="flex gap-4 items-center">
                    <div className="w-56 h-24 relative overflow-hidden bg-foreground">
                      <Image
                        src={item.image || "/brand/etc.svg"}
                        alt={item.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-secondary">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.extraDetails}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>

          <div className="relative h-16 mb-10">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-border to-secondary"></div>
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full -mt-3">
              <div className="bg-secondary rounded-full p-1">
                <ArrowRight className="w-5 h-5 text-secondary-foreground rotate-90" />
              </div>
            </div>

            <div className="md:hidden flex justify-center items-center h-full">
              <div className="w-1/3 h-0.5 bg-border"></div>
              <div className="bg-secondary rounded-full p-1 mx-2">
                <ArrowRight className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="w-1/3 h-0.5 bg-border"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-muted to-card rounded-lg p-6 mb-10 shadow-md border border-border">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-foreground">
                    Template Development Process
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-full px-2 py-1 text-xs bg-primary/10 text-primary font-medium">
                    Sprint {currentSprint}/{totalSprints}
                  </span>
                  <RefreshCcw className="h-5 w-5 text-secondary animate-rotate" />
                </div>
              </div>

              <p className="text-muted-foreground mb-4">
                Our iterative approach ensures templates are tested across all
                major email clients
              </p>

              <div className="relative mb-2">
                <Progress value={progressValue} className="h-3 bg-muted" />
              </div>

              <div
                className={cn(
                  "grid gap-1 mt-4 grid-cols-2 gap-y-2 md:grid-cols-4"
                )}
              >
                {sprintPhases.map((phase, index) => (
                  <div
                    key={index}
                    className={cn(
                      "text-center p-2 rounded transition-all border",
                      progressValue >= (index / sprintPhases.length) * 100 &&
                        progressValue <
                          ((index + 1) / sprintPhases.length) * 100
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted border-border"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "rounded-full p-1 mb-1",
                          progressValue >= (index / sprintPhases.length) * 100
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {phase.icon}
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {phase.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-2">
                <div className="flex items-center">
                  <div className="bg-secondary/20 rounded-full p-1 mr-2 shrink-0">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    User feedback integrated at every stage
                  </span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center mt-2 sm:mt-0">
                  <span className="mr-2">Continuous improvement</span>
                  <div className="flex space-x-1">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse animation-delay-200"></span>
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-pulse animation-delay-400"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-16 mb-10">
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-border to-secondary"></div>
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full -mt-3">
              <div className="bg-secondary rounded-full p-1">
                <ArrowRight className="w-5 h-5 text-secondary-foreground rotate-90" />
              </div>
            </div>

            <div className="md:hidden flex justify-center items-center h-full">
              <div className="w-1/3 h-0.5 bg-border"></div>
              <div className="bg-secondary rounded-full p-1 mx-2">
                <ArrowRight className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="w-1/3 h-0.5 bg-border"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-card via-muted to-card rounded-lg p-8 max-w-xl mx-auto text-center shadow-md hover:shadow-lg transition-all duration-300 border border-border">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-slow"></div>
              <div className="relative bg-card rounded-full p-4 border border-border shadow-md">
                <Rocket className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Your Email, Perfected
            </h3>
            <p className="text-muted-foreground">
              Ready to use templates that deliver results
            </p>
            <div className="flex justify-center mt-4 space-x-2">
              <span className="inline-block w-3 h-3 rounded-full bg-primary animate-pulse"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-secondary animate-pulse animation-delay-200"></span>
              <span className="inline-block w-3 h-3 rounded-full bg-muted-foreground animate-pulse animation-delay-400"></span>
            </div>
          </div>
        </div>{" "}
        <div className="text-center flex items-center justify-center gap-4">
          <ExtendedButton link={"/community"} variant={"secondary"} size={"lg"}>
            Browse Our ETC Library
          </ExtendedButton>
          <ExtendedButton link={"/docs"} variant={"ghost"} size={"lg"}>
            View Documentation
          </ExtendedButton>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
