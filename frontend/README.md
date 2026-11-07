# CarDeals CMS

Luxury automotive content management and dealership intelligence platform built with Next.js and Tailwind CSS.

## Color Palette System

All previous default colors have been removed. The project strictly adheres to the following 5-color palette:

| Token / Role | Hex Code | Swatch | CSS Variable | Tailwind Utility |
| :--- | :--- | :---: | :--- | :--- |
| **Primary Background & Canvas** | `#101820` | <span style="background-color: #101820; display: inline-block; width: 16px; height: 16px; border-radius: 3px; border: 1px solid #343A40;"></span> | `--color-primary-dark` / `--background` | `bg-[#101820]` / `bg-dark` |
| **Primary Foreground & Text** | `#F5F5F5` | <span style="background-color: #F5F5F5; display: inline-block; width: 16px; height: 16px; border-radius: 3px; border: 1px solid #343A40;"></span> | `--color-primary-light` / `--foreground` | `text-[#F5F5F5]` / `text-light` |
| **Luxury Brand Accent & Glow** | `#C5A059` | <span style="background-color: #C5A059; display: inline-block; width: 16px; height: 16px; border-radius: 3px; border: 1px solid #343A40;"></span> | `--color-gold` / `--accent` | `text-[#C5A059]` / `bg-gold` |
| **Surface Cards & Dividers** | `#343A40` | <span style="background-color: #343A40; display: inline-block; width: 16px; height: 16px; border-radius: 3px; border: 1px solid #343A40;"></span> | `--color-charcoal` / `--card` / `--border` | `bg-[#343A40]` / `border-charcoal` |
| **Destructive, Logout & Alert** | `#B83232` | <span style="background-color: #B83232; display: inline-block; width: 16px; height: 16px; border-radius: 3px; border: 1px solid #343A40;"></span> | `--color-crimson` / `--destructive` | `text-[#B83232]` / `bg-crimson` |

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the dashboard.
