"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";

export default function NewsletterSection() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();

    try {
      if (!email) {
        setError("Please enter your email address.");
        return;
      }

      const res = await fetch("/api/subscribe/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "newsletter_hero_section", // track where it came from
        }),
      });

      // ✅ Consider any 2xx a success
      if (res.ok) {
        setIsSubmitted(true);
        return;
      }

      // Non-2xx → try to surface a friendly message
      let payload: any = {};
      try {
        payload = await res.json();
      } catch {}
      setError(
        payload?.error ||
          payload?.reason ||
          (res.status === 422
            ? "Please provide a valid email."
            : "Something went wrong. Please try again.")
      );
    } catch {
      setError("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6 shadow-lg shadow-purple-500/30">
            <Mail className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">WEEKLY INSIGHTS</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join our community and receive thoughtful perspectives on
            intentional living, delivered every week.
          </p>

          {!isSubmitted ? (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl shadow-purple-500/20 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name (optional)"
                  className="bg-white/90 dark:bg-white/90 border-0 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-purple-300 h-12"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  required
                  className="bg-white/90 dark:bg-white/90 border-0 text-gray-900 placeholder:text-gray-600 focus:ring-2 focus:ring-purple-300 h-12"
                />

                {error && (
                  <div className="bg-red-500/20 border border-red-300 text-white px-4 py-3 rounded-lg backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-purple-900 hover:bg-purple-50 font-bold py-3 h-12 shadow-lg shadow-white/20 hover:shadow-white/40 transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin" />
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>

                <p className="text-xs text-purple-200">
                  No spam. Unsubscribe at any time.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl shadow-purple-500/20 border border-white/20 animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white rounded-full p-3 shadow-lg shadow-white/30">
                  <Check className="w-8 h-8 text-purple-900" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Thanks for subscribing!</h3>
              <p className="text-purple-100">
                We just sent a confirmation email to your inbox. You’ll receive
                our next issue soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
