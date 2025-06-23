export interface Menu {
  title: string;
  description?: string;
  href: string;
}

export interface NavigationItem {
  name: string;
  href?: string;
  menu?: Menu[];
}

export interface NavigationItems {
  home: NavigationItem;
  community: NavigationItem;
  contribute: NavigationItem;
  knowMore: NavigationItem;
}
