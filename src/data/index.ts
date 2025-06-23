import {NavigationItems} from "@/types";

export const navigationItems: NavigationItems = {
    home: {
        name: "Home",
        menu: [
            {
                title: "Start",
                description: "Jump into your personalized homepage.",
                href: "/"
            },
            {
                title: "Overview",
                description: "See what’s happening on etc.",
                href: "/home"
            }
        ]
    },
    community: {
        name: "Community",
        href: "/community",
    },
    contribute: {
        name: "Contribute",
        menu: [
            {
                title: "Publish",
                description: "Write and share your own content.",
                href: "/publish"
            },
            {
                title: "Help Out",
                description: "Contribute ideas, code, or feedback.",
                href: "/contribute"
            }
        ]
    },
    knowMore: {
        name: "Know More",
        menu: [
            {
                title: "About",
                description: "Learn more about etc and our mission.",
                href: "/about"
            },
            {
                title: "Contact",
                description: "Reach out to us with questions or feedback.",
                href: "/contact"
            }
        ]
    }
};
