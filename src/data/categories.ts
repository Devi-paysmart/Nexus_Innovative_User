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
    coverImage: "/welcome-gifts.jpg",
    cardImage: "/welcome-gifts.jpg",
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
    coverImage: "/festiva.jpg",
    cardImage: "/festiva.jpg",
    products: [
      {
        id: "fg-1",
        title: "Diwali Heritage Hamper",
        description:
          "Artisan sweets, scented candles, brass diya set, and premium dry fruits presented in a lacquered gift box with custom brand sleeve.",
        image: "/fes-diw.jpg",
      },
      {
        id: "fg-2",
        title: "Festive Glow Collection",
        description:
          "Soy wax candles, botanical incense, gourmet chocolates, and a hand-tied ribbon box ideal for client appreciation during festivals.",
        image: "/fes-eid.jpg",
      },
      {
        id: "fg-3",
        title: "Corporate Celebration Box",
        description:
          "Curated assortment of premium mithai, decorative lanterns, and a personalized greeting card in gold-foil packaging.",
        image: "/fes-xmas.jpg",
      },
      {
        id: "fg-4",
        title: "Winter Warmth Hamper",
        description:
          "Hot chocolate set, wool throw, scented candle trio, and festive cookies in a reusable wooden crate with laser-engraved logo.",
        image: "/fes-ligh.jpg",
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
        image: "/tech-char.jpg",
      },
      {
        id: "tg-3",
        title: "Wireless Keyboard & Mouse Combo",
        description:
          "Stylish wireless keyboard and mouse set with honeycomb keycaps, gradient color design, and silent-click technology — perfect for a vibrant branded desk setup.",
        image: "/tech-key.jpg",
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
    coverImage: "/sustain.jpg",
    cardImage: "/sustain.jpg",
    products: [
      {
        id: "sg-1",
        title: "Handcrafted Wooden Mug Set",
        description:
          "Hand-carved wooden mugs with textured exterior and smooth natural interior — an artisan eco-friendly gift that celebrates sustainable craftsmanship.",
        image: "/sus-mug.jpg",
      },
      {
        id: "sg-2",
        title: "Bamboo Toothbrush Collection",
        description:
          "Set of biodegradable bamboo toothbrushes in recycled kraft packaging — a thoughtful zero-waste corporate gift promoting sustainable daily habits.",
        image: "/sus-too.jpg",
      },
      {
        id: "sg-3",
        title: "Artisan Ceramic Vase Duo",
        description:
          "Minimalist abstract ceramic vases with matte earth-tone finish and gold accent — a sculptural desk piece that blends art with sustainability.",
        image: "/sus-tra.jpg",
      },
      {
        id: "sg-4",
        title: "Decorative Elephant Figurines",
        description:
          "Elegant white resin elephant pair with modern minimalist design — a charming desk accessory symbolizing strength, wisdom, and good fortune.",
        image: "/sus-ele.jpg",
      },
    ],
  },
  {
    slug: "vouchers",
    name: "Vouchers",
    tagline: "Choice, delivered elegantly",
    description:
      "Digital and physical reward cards presented with the same premium touch as physical gifts.",
    coverImage: "/vouchers.jpg",
    cardImage: "/vouchers.jpg",
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
        title: "Luxury Rose-Gold Timepiece",
        description:
          "Elegant rose-gold stainless steel watch with midnight blue dial, Roman numeral markers, day-date display, and a premium presentation box — a timeless gift for top executives.",
        image: "/prem-watch.jpg",
      },
      {
        id: "pg-3",
        title: "Floral Candle Gift Box",
        description:
          "Handcrafted scented candle nestled with fresh florals and succulents in a round wooden keepsake box — a luxurious gesture that leaves a lasting impression.",
        image: "/pre-flowe.jpg",
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
