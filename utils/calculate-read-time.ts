export function calculateReadTime(content: string): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "")

  // Count words
  const words = text.trim().split(/\s+/).length

  // Average reading speed is 200-250 words per minute
  // We'll use 225 as the average
  const minutes = Math.ceil(words / 225)

  return `${minutes} min read`
}
