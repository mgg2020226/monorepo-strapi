import { ArrowUpRight, Layers, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { ActionCard, Button } from "@/types/strapi.types";

interface BentoServicesProps {
  title?: string;
  description?: string;
  view_all_button?: Button;
  cards: ActionCard[];
}

export function BentoServices({
  title,
  description,
  view_all_button,
  cards,
}: BentoServicesProps) {
  if (!cards || cards.length === 0) return null;

  // Split: first featured card is large, rest are small
  const featuredCard = cards.find((c) => c.featured) ?? cards[0];
  const otherCards = cards.filter((c) => c !== featuredCard);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      {/* Section header */}
      {(title || description) && (
        <div className="text-center mb-16">
          {title && (
            <h2 className="text-3xl font-semibold text-brand-primary mb-4">
              {title}
            </h2>
          )}
          <div className="h-1 w-20 bg-brand-primary mx-auto mb-6" />
          {description && (
            <p className="max-w-2xl mx-auto text-brand-foreground">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
        {/* Featured large card */}
        <Card className="md:col-span-8 md:row-span-2 glass overflow-hidden rounded-lg group hover:shadow-lg transition-shadow relative">
          <CardContent className="relative p-10 flex-1 flex flex-col">
            <div className="size-16 bg-brand-accent rounded-xl flex items-center justify-center mb-6">
              <Layers className="size-8 text-brand-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-brand-primary mb-4">
              {featuredCard.title}
            </h3>
            {featuredCard.description && (
              <p className="text-foreground max-w-md leading-relaxed mb-8">
                {featuredCard.description}
              </p>
            )}
            {featuredCard.button && (
              <Link
                href={featuredCard.button.href}
                target={featuredCard.button.isExternal ? "_blank" : undefined}
                rel={
                  featuredCard.button.isExternal
                    ? "noopener noreferrer"
                    : undefined
                }
                className="text-brand-primary font-bold flex items-center gap-2 hover:underline text-sm mt-auto"
              >
                {featuredCard.button.label}
                <ArrowUpRight className="size-4" />
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Small cards */}
        {otherCards.map((card) =>
          card.accent ? (
            <Card
              key={card.id}
              className="md:col-span-4 card-hero p-8 flex flex-col justify-center items-center text-start"
            >
              <CardContent className="flex flex-col px-0 w-full">
                <Layers className="size-10 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                {card.description && (
                  <p className="text-sm text-white/80">{card.description}</p>
                )}
                {featuredCard.button && (
                  <Link
                    href={featuredCard.button.href}
                    target={
                      featuredCard.button.isExternal ? "_blank" : undefined
                    }
                    rel={
                      featuredCard.button.isExternal
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-white font-bold flex items-center gap-2 hover:underline text-sm mt-2"
                  >
                    {featuredCard.button.label}
                    <ArrowUpRight className="size-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card
              key={card.id}
              className="md:col-span-4 glass-card p-8 hover:shadow-lg transition-shadow flex flex-col"
            >
              {" "}
              <CardContent className="px-0 flex flex-col">
                <div className="size-12 bg-brand-accent rounded-lg flex items-center justify-center mb-6">
                  <Layers className="size-6 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-primary mb-2">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="text-sm text-foreground">{card.description}</p>
                )}
                {featuredCard.button && (
                  <Link
                    href={featuredCard.button.href}
                    target={
                      featuredCard.button.isExternal ? "_blank" : undefined
                    }
                    rel={
                      featuredCard.button.isExternal
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-brand-primary font-bold flex items-center gap-2 hover:underline text-sm mt-2"
                  >
                    {featuredCard.button.label}
                    <ArrowUpRight className="size-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {view_all_button && (
        <div className="flex justify-center mt-10">
          <Link
            href={view_all_button.href}
            target={view_all_button.isExternal ? "_blank" : undefined}
            rel={view_all_button.isExternal ? "noopener noreferrer" : undefined}
            className="text-brand-primary font-bold flex items-center gap-2"
          >
            {view_all_button.label}
            <LayoutGrid className="size-5" />
          </Link>
        </div>
      )}
    </section>
  );
}
