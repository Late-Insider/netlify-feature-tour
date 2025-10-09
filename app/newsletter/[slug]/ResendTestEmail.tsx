interface ResendTestEmailProps {
  testMessage?: string
  timestamp?: string
}

function ResendTestEmail({
  testMessage = "This is a test email from the Late website.",
  timestamp = new Date().toISOString(),
}: ResendTestEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h1 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>Test Email</h1>
        <p style={{ color: "#666", fontSize: "14px", margin: "0" }}>Sent at: {new Date(timestamp).toLocaleString()}</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e9ecef" }}>
        <div style={{ color: "#333", fontSize: "16px", lineHeight: "1.6" }}>
          <p style={{ margin: "0 0 16px 0" }}>{testMessage}</p>
          <p style={{ margin: "0 0 16px 0" }}>
            If you're receiving this email, it means the email system is working correctly.
          </p>
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
          This is a test email from the Late website email system.
        </p>
      </div>
    </div>
  )
}

export default ResendTestEmail
