const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")
  setSuccessMessage("")

  const fd = new FormData(e.currentTarget)
  const email = String(fd.get("email") ?? "").trim()

  try {
    if (!email) {
      setError("Please enter your email address.")
      return
    }

    const res = await fetch("/api/subscribe/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "newsletter_form" }),
    })

    const payload = await res.json().catch(() => ({} as any))
    if (!res.ok || payload?.success !== true) {
      setError(payload?.error || "Subscription failed. Please try again.")
      return
    }

    e.currentTarget.reset()
    setSuccessMessage("Thanks for subscribing! We just sent you an email confirmation.")
    setTimeout(() => setSuccessMessage(""), 5000)
  } catch {
    setError("Failed to subscribe. Please try again later.")
  } finally {
    setIsLoading(false)
  }
}
