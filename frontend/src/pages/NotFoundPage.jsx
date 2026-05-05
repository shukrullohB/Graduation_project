import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#0A0A1A",
        padding: 24,
      }}
    >
      <h1
        style={{ color: "#0047FF", fontSize: 80, fontWeight: 800, margin: 0 }}
      >
        404
      </h1>
      <h2 style={{ color: "#FFF8E7", fontSize: 24, margin: 0 }}>
        Page Not Found
      </h2>
      <p
        style={{
          color: "rgba(255,248,231,0.5)",
          maxWidth: 720,
          textAlign: "center",
          margin: 0,
        }}
      >
        The page you are looking for does not exist or has been moved. Check the
        URL or return home to continue.
      </p>
      <Link
        to="/"
        style={{
          marginTop: 12,
          background: "#0047FF",
          color: "#0A0A1A",
          fontWeight: 700,
          padding: "10px 18px",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}


