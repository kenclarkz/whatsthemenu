import Link from "next/link";
import NewRecipeForm from "./NewRecipeForm";

export const metadata = { title: "New recipe" };

export default async function NewRecipePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="animate-fade-up">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft transition hover:text-tomato"
        >
          ← Back to recipes
        </Link>
        <h1 className="mt-3 font-display text-4xl font-black md:text-5xl">
          Add a <span className="text-gradient-warm">family classic</span>
        </h1>
        <p className="mt-1 text-ink-soft">
          If it wins the vote, it goes on the plan — and straight onto the
          grocery list.
        </p>
      </header>
      <NewRecipeForm error={error} />
    </div>
  );
}
