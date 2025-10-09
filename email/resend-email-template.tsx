interface ResendEmailTemplateProps {
  name: string
  message: string
  subject?: string
}

export function ResendEmailTemplate({ name, message, subject = "New Message" }: ResendEmailTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>{subject}</h1>
        <p style={{ color: "#666", fontSize: "14px", margin: "0" }}>From: {name}</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
        <div style={{ color: "#333", fontSize: "16px", lineHeight: "1.6" }}>
          {message.split("\n").map((line, index) => (
            <p key={index} style={{ margin: "0 0 16px 0" }}>
              {line}
            </p>
          ))}
        </div>
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
          This message was sent from the Late website contact form.
        </p>
      </div>
    </div>
  )
}

export default ResendEmailTemplate
