export default function Footer() {
  return (
    <footer className="border-t hairline mt-24">
      <div className="container-wide py-10 text-sm text-[color:var(--muted)] flex flex-col md:flex-row justify-between gap-3">
        <div>Common — open source. MIT license.</div>
        <div>
          Built on the policy paper{" "}
          <em>Integrating Africa's Startup Acts: Building a Legal Architecture for a Single Digital Market</em>.
        </div>
      </div>
    </footer>
  );
}
