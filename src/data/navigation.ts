export interface NavLink {
  label: string;
  href: string;
}

export const primaryNav: NavLink[] = [
  { label: "Collections", href: "/collections" },
  { label: "Customization", href: "/customization" },
  { label: "Loyalty Program", href: "/loyalty" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export const categoryLinks: NavLink[] = [
  { label: "Welcome Gifts", href: "/collections/tech-gifts" },
  { label: "Festive Gifts", href: "/collections/festive-gifts" },
  { label: "Tech Gifts", href: "/collections/tech-gifts" },
  { label: "Sustainable Gifts", href: "/collections/sustainable-gifts" },
  { label: "Vouchers", href: "/collections/vouchers" },
  { label: "Premium Gifts", href: "/collections/premium-gifts" },
];

export const footerNav = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "How We Work", href: "/how-we-work" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  offerings: categoryLinks,
};
