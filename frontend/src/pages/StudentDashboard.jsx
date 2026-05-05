import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getQuestions } from "../api/questions.api";
import { getMyAnswers } from "../api/answers.api";

export default function StudentDashboard() {
  const { data: questions, isLoading: qLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions().then((r) => r.data),
  });

  const { data: answers } = useQuery({
    queryKey: ["myAnswers"],
    queryFn: () => getMyAnswers().then((r) => r.data),
  });

  const answeredIds = new Set(answers?.map((a) => a.question_id));
  const totalQuestions = questions?.length ?? 0;
  const answeredCount = answeredIds.size;
  const remainingCount = Math.max(totalQuestions - answeredCount, 0);

  return (
    <div
      style={{
        background: "#FFF8E7",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      {/* Hero Card */}
      <div
        style={{
          background: "#0047FF",
          borderRadius: "14px",
          padding: "40px",
          marginBottom: "32px",
          color: "#FFF8E7",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            fontWeight: "600",
            margin: "0 0 12px 0",
            opacity: 0.9,
          }}
        >
          STUDENT PORTAL
        </p>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            margin: "0 0 12px 0",
            lineHeight: 1.2,
          }}
        >
          Learning Hub
        </h1>
        <p
          style={{
            fontSize: "15px",
            margin: 0,
            opacity: 0.75,
            lineHeight: 1.5,
          }}
        >
          Keep momentum, answer pending questions, and build a stronger
          portfolio with every submission.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "TOTAL QUESTIONS",
            value: totalQuestions,
            icon: "📊",
            desc: "Open tasks in this module",
          },
          {
            label: "SUBMITTED",
            value: answeredCount,
            icon: "✓",
            desc: "Already reviewed by system",
          },
          {
            label: "REMAINING",
            value: remainingCount,
            icon: "📝",
            desc: "Keep a steady pace",
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,71,255,0.12)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    color: "#888888",
                    margin: "0 0 12px 0",
                    fontWeight: "600",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#0A0A1A",
                    margin: "0 0 8px 0",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#555555",
                    margin: 0,
                  }}
                >
                  {stat.desc}
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(0,71,255,0.08)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginLeft: "16px",
                }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Open Questions Section */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(0,71,255,0.1)",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#0A0A1A",
              margin: 0,
            }}
          >
            Open Questions
          </h2>
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "#888888",
              fontWeight: "600",
            }}
          >
            ACTION QUEUE
          </span>
        </div>

        {questions?.length === 0 ? (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              padding: "48px 32px",
              textAlign: "center",
              background: "rgba(0,71,255,0.02)",
              borderRadius: "10px",
              border: "1px dashed rgba(0,71,255,0.15)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "rgba(0,71,255,0.1)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                marginBottom: "16px",
              }}
            >
              📊
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#0A0A1A",
                margin: "0 0 8px 0",
              }}
            >
              No questions available yet.
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#555555",
                margin: 0,
              }}
            >
              Ask your teacher to publish the next assignment set.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {questions.map((q) => (
              <div
                key={q.id}
                style={{
                  padding: "20px 24px",
                  background: "#FAFAFA",
                  border: "1px solid rgba(0,71,255,0.12)",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F5F8FF";
                  e.currentTarget.style.borderColor = "rgba(0,71,255,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FAFAFA";
                  e.currentTarget.style.borderColor = "rgba(0,71,255,0.12)";
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: "#0A0A1A",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {q.title}
                    </h3>
                    <span
                      style={{
                        background: "rgba(0,71,255,0.1)",
                        color: "#0047FF",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Max: {q.max_score}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 12px 0",
                      color: "#888888",
                      fontSize: "13px",
                      lineHeight: "1.5",
                    }}
                  >
                    {(q.prompt || q.description || "").slice(0, 140)}
                    {(q.prompt || q.description || "").length > 140
                      ? "..."
                      : ""}
                  </p>
                  <span
                    style={{
                      color: "#555555",
                      fontSize: "12px",
                    }}
                  >
                    {answeredIds.has(q.id)
                      ? "✓ Already submitted"
                      : "Submission pending"}
                  </span>
                </div>

                {answeredIds.has(q.id) ? (
                  <span
                    style={{
                      background: "rgba(0,71,255,0.1)",
                      color: "#0047FF",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                    }}
                  >
                    Submitted
                  </span>
                ) : (
                  <Link
                    to={`/student/submit/${q.id}`}
                    style={{
                      background: "#0047FF",
                      color: "#FFF8E7",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "700",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      transition: "background 0.2s ease",
                      marginLeft: "16px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#0035CC")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#0047FF")
                    }
                  >
                    Answer Question
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
