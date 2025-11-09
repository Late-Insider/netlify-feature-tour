"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Mail } from "lucide-react";

export default function NewsletterSubscribeForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

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
        body: JSON.stringify({ email, source: "newsletter_form" }),
      });

      let payload: any = {};
      try {
        payload = await res.json();
      } catch {
        payload = {};
      }

      // Log once to verify what's coming back
      console.log("[newsletter subscribe] status/payload:", res.status, payload);

      const is2xx = res.status >= 200 && res.status < 300;
      const explicitSuccess = payload?.success === true || payload?.ok === true;
      const noExplicitError =
        typeof payload?.error === "undefined" && typeof payload?.reason === "undefined";
      const emptyBody = Object.keys(payload).length === 0;

      const succeeded = explicitSuccess || (is2xx && (noExplicitError || emptyBody));

      if (succeeded) {
        e.currentTarget.reset();
        setError("");
        setSuccessMessage(
          "Thank you for subscribing! We just sent a confirmation email to your inbox."
        );
        setTimeout(() => setSuccessMessage(""), 6000);
        return;
      }

      const friendly =
        payload?.error ||
        payload?.reason ||
        (res.status === 422
          ? "Please provide a valid email."
          : "Subscription failed. Please try again.");
      setError(friendly);
    } catch {
      setError("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
          <Check className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">Subscribed!</p>
            <p className="text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      <div>
        <Input
          type="email"
          name="email"
          placeholder="Your Email Address"
          required
          className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Subscribing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Subscribe to Newsletter
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-zinc-500">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  );
}
