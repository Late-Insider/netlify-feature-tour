interface ResendNewsletterEmailProps {
  commenterName: string
  newsletterTitle: string
  commentContent: string
  newsletterUrl: string
}

export function ResendNewsletterEmail({
  commenterName,
  newsletterTitle,
  commentContent,
  newsletterUrl,
}: ResendNewsletterEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>New Newsletter Comment</h1>
        <p style={{ color: "#666", fontSize: "14px", margin: "0" }}>
          Someone commented on your newsletter: <strong>{newsletterTitle}</strong>
        </p>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
        <h3 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>Comment from {commenterName}:</h3>
        <div
          style={{
            color: "#333",
            fontSize: "16px",
            lineHeight: "1.6",
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          {commentContent.split("\n").map((line, index) => (
            <p key={index} style={{ margin: "0 0 10px 0" }}>
              {line}
            </p>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <a
          href={newsletterUrl}
          style={{
            backgroundColor: "#007bff",
            color: "#ffffff",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block",
            fontSize: "16px",
          }}
        >
          View Comment
        </a>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#666", fontSize: "12px", margin: "0" }}>
          This notification was sent from the Late website.
        </p>
      </div>
    </div>
  )
}

export default ResendNewsletterEmail
