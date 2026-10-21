import "server-only"

import type { Data } from "@repo/strapi-types"
import {
  Building2,
  CircleDollarSign,
  UsersRound,
  WalletCards,
} from "lucide-react"

import { Container } from "../elementary/Container"

const metricIcons = [Building2, UsersRound, WalletCards, CircleDollarSign]

export function BancalivStatistics({
  component,
}: {
  component: Data.Component<"sections.statistics">
}) {
  return (
    <section className="bancaliv-metrics">
      <Container>
        <div className="px-4 py-12 sm:px-8 lg:py-16">
          {component.title && (
            <header className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {component.title}
              </h2>
              {component.description && (
                <p className="mt-4 leading-relaxed text-[var(--bancaliv-muted)]">
                  {component.description}
                </p>
              )}
            </header>
          )}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {component.figures?.map((figure, index) => {
              const Icon = metricIcons[index % metricIcons.length] ?? Building2

              return (
                <article
                  className="bancaliv-metrics__card"
                  key={figure.id ?? `${figure.number}-${index}`}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-8 text-[var(--bancaliv-pink)]"
                  />
                  <p className="mt-3 text-3xl font-extrabold text-[var(--bancaliv-pink)]">
                    {figure.prefix}
                    {figure.number}
                    {figure.suffix}
                  </p>
                  {figure.description && (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--bancaliv-muted)]">
                      {figure.description}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
