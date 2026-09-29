import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-start justify-center px-5 md:px-10">
      <h1 className="text-[30vw] font-semibold leading-none tracking-tighter md:text-[20vw]">404</h1>
      <Link href="/" className="mt-6 text-lg underline underline-offset-8">
        Terug naar home
      </Link>
    </section>
  );
}
