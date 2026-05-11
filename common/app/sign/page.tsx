"use client";

import { useState } from "react";
import Link from "next/link";

const ROLES = [
  { value: "founder", label: "Founder / operator" },
  { value: "investor", label: "Investor" },
  { value: "counsel", label: "In-house or external counsel" },
  { value: "policymaker", label: "Policymaker / civil servant" },
  { value: "academic", label: "Academic / researcher" },
  { value: "other", label: "Other" },
];

export default function SignPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong");
      }
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <section className="container-prose py-24 text-center">
        <h1 className="text-3xl tracking-tight">Signed.</h1>
        <p className="mt-4 text-[color:var(--muted)]">
          You're on the list. We'll be in touch as Common evolves.
        </p>
        <div className="mt-8">
          <Link href="/signatories" className="text-sm">
            See the wall →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-prose py-20">
      <h1 className="text-3xl md:text-4xl tracking-tight">Sign the manifesto.</h1>
      <p className="mt-4 text-[color:var(--muted)] leading-relaxed">
        Add your name to the call for an integrated legal architecture for Africa's startup economy:
        a Pan-African Startup Entity, a Startup Passport, surgical national reforms, and an enhanced AU Model Law.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-6">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <div className="grid md:grid-cols-2 gap-6">
          <SelectField label="Role" name="role" required options={ROLES} />
          <Field label="Country (where you work)" name="country" required placeholder="e.g. Nigeria" />
        </div>
        <Field label="Organisation (optional)" name="organization" />
        <Field label="One-line message (optional, public)" name="message" textarea />
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="showPublicly" defaultChecked className="mt-1" />
          <span>Show my name on the public signatory wall.</span>
        </label>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium disabled:opacity-50"
          >
            {status === "submitting" ? "Signing…" : "Sign"}
          </button>
          {error && <span className="text-sm text-[color:var(--accent)]">{error}</span>}
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm">{label}{required && <span className="text-[color:var(--accent)]"> *</span>}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={2}
          placeholder={placeholder}
          className="border hairline bg-transparent px-3 py-2 outline-none focus:border-foreground"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="border hairline bg-transparent px-3 py-2 outline-none focus:border-foreground"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm">{label}{required && <span className="text-[color:var(--accent)]"> *</span>}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="border hairline bg-transparent px-3 py-2 outline-none focus:border-foreground"
      >
        <option value="" disabled>Select one…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
