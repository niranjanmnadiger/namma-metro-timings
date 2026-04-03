export function Footer() {
    return (
        <footer
            style={{
                marginTop: "60px",
                padding: "24px 16px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                textAlign: "center",
                color: "#a1a1aa",
                fontSize: "13px",
                lineHeight: "1.8",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            <p style={{ margin: 0 }}>
                #NirusCodes
            </p>

            <p style={{ margin: "8px 0 0 0" }}>
                For suggestions, write to{" "}
                <a
                    href="mailto:niranjanmnadiger@gmail.com"
                    style={{
                        color: "#f5f5f7",
                        textDecoration: "none",
                    }}
                >
                    niranjanmnadiger@gmail.com
                </a>
            </p>

            <div
                style={{
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "18px",
                    flexWrap: "wrap",
                }}
            >
                <a
                    href="https://github.com/niranjanmnadiger/namma-metro-timings"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#d4d4d8",
                        textDecoration: "none",
                    }}
                >
                    GitHub
                </a>

                <span style={{ color: "#52525b" }}>·</span>

                <a
                    href="https://www.linkedin.com/in/niranjan-m-nadiger/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#d4d4d8",
                        textDecoration: "none",
                    }}
                >
                    LinkedIn
                </a>
            </div>
        </footer>
    );
}