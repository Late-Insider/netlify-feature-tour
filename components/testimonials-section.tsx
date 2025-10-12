"use client"

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">What People Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "Late helped me reclaim my time and focus on what truly matters.",
              author: "Sarah K.",
              role: "Entrepreneur",
            },
            {
              quote: "The insights are profound yet practical. A game-changer for productivity.",
              author: "Michael R.",
              role: "Creative Director",
            },
            {
              quote: "Finally, a brand that understands the value of intentional living.",
              author: "Jessica L.",
              role: "Life Coach",
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-black border border-zinc-800 p-6 rounded-lg">
              <p className="text-zinc-400 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-zinc-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
