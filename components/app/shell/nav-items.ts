import type { TFunction } from "i18next";

export type NavItem = {
  key: string;
  /** Appended to /{lang}/app — "" is the dashboard itself. */
  path: string;
  icon: string;
  label: (t: TFunction) => string;
  sellerOnly?: boolean;
  /** Shown in the phone bottom bar; the rest live behind the drawer. */
  inBottomBar?: boolean;
};

/**
 * Order follows the Stitch sidebar. "My Orders" from the mockup is History here —
 * the platform has no orders, it has closed requests and closed offers.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", path: "", icon: "dashboard", label: (t) => t("web.dashboard"), inBottomBar: true },
  {
    key: "market",
    path: "/market",
    icon: "storefront",
    label: (t) => t("web.marketplace"),
    sellerOnly: true,
    inBottomBar: true,
  },
  { key: "requests", path: "/requests", icon: "list_alt", label: (t) => t("tabs.myRequests"), inBottomBar: true },
  { key: "vehicles", path: "/vehicles", icon: "directions_car", label: (t) => t("web.vehicles") },
  { key: "history", path: "/history", icon: "inventory_2", label: (t) => t("tabs.history") },
  { key: "profile", path: "/profile", icon: "person", label: (t) => t("tabs.profile"), inBottomBar: true },
  { key: "settings", path: "/settings", icon: "settings", label: (t) => t("web.settings") },
];

/** Items above the divider in the sidebar; Profile and Settings sit below it. */
export const PRIMARY_NAV_KEYS = new Set(["dashboard", "market", "requests", "vehicles", "history"]);

export function visibleNavItems(isSeller: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.sellerOnly || isSeller);
}
