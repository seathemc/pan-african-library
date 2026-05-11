import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b hairline">
      <div className="container-wide flex items-center justify-between py-4 text-sm">
        <Link href="/" className="no-underline font-semibold tracking-tight">
          Common
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/acts" className="no-underline">Startup acts</Link>
          <Link href="/entity" className="no-underline">Entity</Link>
          <Link href="/signatories" className="no-underline">Signatories</Link>
          <Link
            href="/sign"
            className="no-underline rounded-full border hairline px-4 py-1.5 hover:bg-foreground hover:text-background transition-colors"
          >
            Sign
          </Link>
        </nav>
      </div>
    </header>
  );
}
