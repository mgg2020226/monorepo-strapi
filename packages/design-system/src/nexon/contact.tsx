"use client";

import { useState } from "react";
import { User, Building2, Mail, Phone, PenLine, Send } from "lucide-react";
import type { NexonContactContent } from "./types";

export function NexonContact({ data }: { data: NexonContactContent }) {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (data.formActive === false) return;
    setSending(true);
    setErrorMsg(null);
    try {
      const response = await fetch(`/api/forms/${encodeURIComponent(data.siteSlug)}/${encodeURIComponent(data.formSlug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(data.errorMessage ?? "No se pudo enviar el mensaje");
      setSent(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo enviar el mensaje");
    } finally {
      setSending(false);
    }
  }

  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#133ED8] focus:ring-2 focus:ring-[#133ED8]/10";

  return (
    <section id="contacto" className="w-full bg-[#F4F6FB] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#133ED8" }}
          >
            {data.label}
          </span>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            {data.heading}
          </h2>
          <p className="mt-4 text-base text-gray-500">{data.description}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm" style={{ border: "1px solid rgba(19,62,216,0.08)" }}>
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #133ED8 0%, #50CEFF 100%)" }}
              >
                <Send className="h-7 w-7 text-white" />
              </div>
          <h3 className="text-xl font-bold text-gray-900">{data.successMessage}</h3>
              <p className="text-sm text-gray-500">Nos pondremos en contacto contigo pronto.</p>
              <button
                type="button"
                onClick={() => { setSent(false); setForm({ name: "", company: "", email: "", phone: "", message: "" }); }}
                className="mt-2 text-sm font-medium"
                style={{ color: "#133ED8" }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {data.formActive === false && (
                <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600" role="status">
                  Formulario temporalmente inactivo.
                </p>
              )}
              <fieldset disabled={data.formActive === false} className="space-y-5">

              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {data.nameLabel}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder={data.namePlaceholder}
                      value={form.name}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-company" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {data.companyLabel}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      required
                      placeholder={data.companyPlaceholder}
                      value={form.company}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {data.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder={data.emailPlaceholder}
                      value={form.email}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {data.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      placeholder={data.phonePlaceholder}
                      value={form.phone}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {data.messageLabel}
                </label>
                <div className="relative">
                  <PenLine className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder={data.messagePlaceholder}
                    value={form.message}
                    onChange={handleChange}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#133ED8] focus:ring-2 focus:ring-[#133ED8]/10"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={sending || data.formActive === false}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={{ background: "linear-gradient(90deg, #133ED8 0%, #1a4ff0 100%)" }}
              >
                <Send className="h-4 w-4" />
                {sending ? "Enviando..." : data.formActive === false ? "Formulario inactivo" : data.submitLabel}
              </button>
              </fieldset>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
