export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  cardImage: string;
  products: Product[];
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  {
    slug: "welcome-Gifts",
    name: "Welcome Gifts",
    tagline: "First impressions that last",
    description:
      "Curated onboarding experiences designed to make every new hire feel valued from day one.",
    coverImage: img("photo-1589156280159-27698a70f29e"),
    cardImage: img("photo-1589156280159-27698a70f29e", 800),
    products: [
      {
        id: "wk-1",
        title: "Executive Welcome Kit",
        description:
          "Premium onboarding gift box including notebook, insulated bottle, engraved metal pen, welcome card, and branded packaging designed for employee onboarding experiences.",
        image: img("photo-1608156639585-b3a032ef9689"),
      },
      {
        id: "wk-2",
        title: "Desk Essentials Bundle",
        description:
          "Minimalist desk set with leather mouse pad, ceramic mug, premium stationery, and a personalized welcome note in matte-finish packaging.",
        image: img("photo-1514432324607-a09d9b4aefdd"),
      },
      {
        id: "wk-3",
        title: "Remote Starter Pack",
        description:
          "Work-from-home kit featuring wireless earbuds case, laptop stand, blue-light glasses, and a soft-touch branded tote.",
        image: img("photo-1497215728101-856f4ea42174"),
      },
      {
        id: "wk-4",
        title: "Leadership Onboarding Box",
        description:
          "Elevated welcome experience with fountain pen, executive journal, premium tea selection, and embossed gift card holder.",
        image: img("photo-1523293182086-7651a899d37f"),
      },
      {
        id: "wk-5",
        title: "Campus Hire Kit",
        description:
          "Youthful onboarding pack with backpack, water bottle, notebook, and vibrant brand collateral for campus recruitment programs.",
        image: img("photo-1549465220-1a8b9238cd48"),
      },
      
    ],
  },
  {
    slug: "festive-gifts",
    name: "Festive Gifts",
    tagline: "Celebrate every occasion",
    description:
      "Luxury hampers and festive collections that turn seasonal gifting into a memorable brand moment.",
    coverImage: img("photo-1549465220-1a8b9238cd48"),
    cardImage: img("photo-1549465220-1a8b9238cd48", 800),
    products: [
      {
        id: "fg-1",
        title: "Diwali Heritage Hamper",
        description:
          "Artisan sweets, scented candles, brass diya set, and premium dry fruits presented in a lacquered gift box with custom brand sleeve.",
        image: img("photo-1507089947368-19c1da9775ae"),
      },
      {
        id: "fg-2",
        title: "Festive Glow Collection",
        description:
          "Soy wax candles, botanical incense, gourmet chocolates, and a hand-tied ribbon box ideal for client appreciation during festivals.",
        image: img("photo-1514432324607-a09d9b4aefdd"),
      },
      {
        id: "fg-3",
        title: "Corporate Celebration Box",
        description:
          "Curated assortment of premium mithai, decorative lanterns, and a personalized greeting card in gold-foil packaging.",
        image: img("photo-1549465220-1a8b9238cd48"),
      },
      {
        id: "fg-4",
        title: "Winter Warmth Hamper",
        description:
          "Hot chocolate set, wool throw, scented candle trio, and festive cookies in a reusable wooden crate with laser-engraved logo.",
        image: img("photo-1556911220-e15b29be8c8f"),
      },
    ],
  },
  {
    slug: "tech-gifts",
    name: "Tech Gifts",
    tagline: "Innovation meets elegance",
    description:
      "Premium gadgets and smart accessories that reflect your brand's forward-thinking culture.",
    coverImage: img("photo-1590658268037-6bf12165a8df"),
    cardImage: img("photo-1590658268037-6bf12165a8df", 800),
    products: [
      {
        id: "tg-1",
        title: "Wireless Earbuds Pro",
        description:
          "Premium true-wireless earbuds with active noise cancellation, branded charging case, and custom logo engraving on the lid.",
        image: img("photo-1590658268037-6bf12165a8df"),
      },
      {
        id: "tg-2",
        title: "MagSafe Charging Set",
        description:
          "Wireless charging pad, magnetic phone stand, and braided USB-C cable packaged in a sleek matte-black gift box.",
        image: img("photo-1611532736597-de2d4265fba3"),
      },
      {
        id: "tg-3",
        title: "Smart Desk Hub",
        description:
          "Multi-port USB hub, cable organizer, and ambient desk lamp with your brand colors integrated into the product finish.",
        image: img("photo-1527864550417-7fd91fc51a46"),
      },
      {
        id: "tg-4",
        title: "Portable Power Kit",
        description:
          "10,000mAh power bank, travel adapter, and premium tech pouch — ideal for road warriors and field teams.",
        image: img("photo-1609091839311-d5365f9ff1c5"),
      },
    ],
  },
  {
    slug: "sustainable-gifts",
    name: "Sustainable Gifts",
    tagline: "Purpose-driven gifting",
    description:
      "Eco-conscious collections that align your brand with sustainability without compromising on premium quality.",
    coverImage: img("photo-1530595467537-0b5996c41f2d"),
    cardImage: img("photo-1530595467537-0b5996c41f2d", 800),
    products: [
      {
        id: "sg-1",
        title: "Bamboo Essentials Set",
        description:
          "Bamboo cutlery, reusable straw kit, and cork-bound notebook in recycled kraft packaging with soy-ink brand printing.",
        image: img("photo-1612817288484-6f916006741a"),
      },
      {
        id: "sg-2",
        title: "Desk Garden Kit",
        description:
          "Mini terrarium, seed packets, ceramic planter, and care guide — a living gift that grows with your team.",
        image: img("photo-1517594422361-5eeb8ae275a9"),
      },
      {
        id: "sg-3",
        title: "Eco Notebook Collection",
        description:
          "Stone-paper notebooks, plantable seed pencils, and a recycled cotton tote with water-based logo print.",
        image: img("photo-1514432324607-a09d9b4aefdd"),
      },
      {
        id: "sg-4",
        title: "Zero-Waste Starter Pack",
        description:
          "Stainless steel bottle, beeswax wraps, and organic cotton produce bags in compostable gift wrapping.",
        image: img("photo-1605264964528-06403738d6dc"),
      },
    ],
  },
  {
    slug: "vouchers",
    name: "Vouchers",
    tagline: "Choice, delivered elegantly",
    description:
      "Digital and physical reward cards presented with the same premium touch as physical gifts.",
    coverImage: img("photo-1556742049-0cfed4f6a45d"),
    cardImage: img("photo-1556742049-0cfed4f6a45d", 800),
    products: [
      {
        id: "vc-1",
        title: "Premium E-Gift Card",
        description:
          "Branded digital voucher with personalized message, custom denomination, and instant delivery via email or SMS.",
        image: img("photo-1556742049-0cfed4f6a45d"),
      },
      {
        id: "vc-2",
        title: "Luxury Physical Gift Card",
        description:
          "Embossed metal gift card in a velvet-lined presentation box with foil-stamped brand identity.",
        image: img("photo-1563013544-824ae1b704d3"),
      },
      {
        id: "vc-3",
        title: "Multi-Brand Reward Card",
        description:
          "Flexible redemption across 50+ partner brands — perfect for employee recognition programs at scale.",
        image: img("photo-1563986768609-322da13575f3"),
      },
      {
        id: "vc-4",
        title: "Experience Voucher",
        description:
          "Curated dining, wellness, or travel experiences delivered as a premium voucher with custom brand sleeve.",
        image: img("photo-1507525428034-b723cf961d3e"),
      },
    ],
  },
  {
    slug: "premium-gifts",
    name: "Premium Gifts",
    tagline: "For your most valued relationships",
    description:
      "Executive-grade gifts for VIP clients, board members, and leadership — where every detail matters.",
    coverImage: img("photo-1523275335684-37898b6baf30"),
    cardImage: img("photo-1523275335684-37898b6baf30", 800),
    products: [
      {
        id: "pg-1",
        title: "Executive Leather Set",
        description:
          "Full-grain leather portfolio, card holder, and key fob with debossed monogram in a walnut presentation case.",
        image: img("photo-1627123424574-724758594e93"),
      },
      {
        id: "pg-2",
        title: "Heritage Timepiece Box",
        description:
          "Swiss-movement watch with custom case back engraving, presented in a lacquered box with silk lining.",
        image: img("photo-1523275335684-37898b6baf30"),
      },
      {
        id: "pg-3",
        title: "Connoisseur Collection",
        description:
          "Single-origin coffee, crystal decanter set, and artisan chocolates in a hand-finished mahogany gift crate.",
        image: img("photo-1549465220-1a8b9238cd48"),
      },
      {
        id: "pg-4",
        title: "Boardroom Signature Box",
        description:
          "Montblanc-style pen, leather-bound journal, premium cufflinks, and a personalized letter in gold-foil stationery.",
        image: img("photo-1523293182086-7651a899d37f"),
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
