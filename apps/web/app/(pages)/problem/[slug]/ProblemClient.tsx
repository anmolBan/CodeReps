"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./problem.module.css";

type Example = {
    input: string;
    output: string;
    explanation?: string;
    images?: string[];
};

type Problem = {
    id: string;
    title: string;
    difficulty: string;
    solved: boolean;
    tags: string[];
    starterCode: Record<string, string> | string | null;
    description: string;
    constraints: string[];
    followUp: string;
    questionId: string;
    examples?: Example[];
};

const LANGUAGES = ["javascript", "python", "typescript", "java", "cpp"] as const;
type Lang = (typeof LANGUAGES)[number];

const LANG_LABELS: Record<Lang, string> = {
    javascript: "JavaScript",
    python: "Python",
    typescript: "TypeScript",
    java: "Java",
    cpp: "C++",
};

const LANG_DOT_COLORS: Record<Lang, string> = {
    javascript: "#f7df1e",
    python: "#3b82f6",
    typescript: "#60a5fa",
    java: "#f97316",
    cpp: "#a855f7",
};

/* ── Very simple tokenizer for keyword / string / comment colouring ── */
function tokenizeLine(line: string): React.ReactNode[] {
    const keywords = /\b(function|const|let|var|return|if|else|for|while|class|import|export|default|new|this|typeof|instanceof|null|undefined|true|false|async|await|from|of|in|throw|try|catch|finally|void|break|continue|switch|case|def|self|pass|lambda|yield|None|True|False|int|string|boolean|public|private|static|void|extends|implements)\b/g;
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    // Single line comments
    const commentIdx = remaining.search(/(\/\/|#)/);
    let commentSuffix = "";
    if (commentIdx !== -1) {
        commentSuffix = remaining.slice(commentIdx);
        remaining = remaining.slice(0, commentIdx);
    }

    // Strings
    const parts = remaining.split(/(["'`][^"'`]*["'`])/g);
    for (const part of parts) {
        if (/^["'`]/.test(part)) {
            tokens.push(<span key={key++} className={styles.strColor}>{part}</span>);
        } else {
            // Keywords in non-string parts
            const kParts = part.split(keywords);
            for (let i = 0; i < kParts.length; i++) {
                const kp = kParts[i];
                if (!kp) continue;
                if (keywords.test(kp)) {
                    tokens.push(<span key={key++} className={styles.kwColor}>{kp}</span>);
                } else {
                    // Numbers
                    const nParts = kp.split(/(\b\d+\.?\d*\b)/g);
                    for (let j = 0; j < nParts.length; j++) {
                        const np = nParts[j];
                        if (!np) continue;
                        if (/^\d/.test(np)) {
                            tokens.push(<span key={key++} className={styles.numColor}>{np}</span>);
                        } else {
                            tokens.push(<span key={key++}>{np}</span>);
                        }
                    }
                }
            }
            keywords.lastIndex = 0;
        }
    }

    if (commentSuffix) {
        tokens.push(<span key={key++} className={styles.cmtColor}>{commentSuffix}</span>);
    }

    return tokens;
}

function CodeView({ code }: { code: string }) {
    const lines = code.split("\n");
    return (
        <pre className={styles.codeBlock}>
            {lines.map((line, i) => (
                <div key={i}>
                    <span className={styles.lineNumber}>{i + 1}</span>
                    {tokenizeLine(line)}
                </div>
            ))}
        </pre>
    );
}

function formatTitle(raw: string) {
    return raw
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

type Tab = "description" | "submissions";

export default function ProblemClient({ problem }: { problem: Problem }) {
    const [activeTab, setActiveTab] = useState<Tab>("description");
    const [activeLang, setActiveLang] = useState<Lang>("javascript");
    const [outputOpen, setOutputOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const availableLangs = useMemo(() => {
        if (problem.starterCode && typeof problem.starterCode === "object") {
            return LANGUAGES.filter((l) => l in (problem.starterCode as Record<string, string>));
        }
        return ["javascript"] as Lang[];
    }, [problem.starterCode]);

    const currentCode = useMemo(() => {
        if (!problem.starterCode) return "// No starter code available";
        if (typeof problem.starterCode === "string") return problem.starterCode;
        const code = (problem.starterCode as Record<string, string>)[activeLang];
        return code ?? "// No starter code for this language";
    }, [problem.starterCode, activeLang]);

    const diffKey = problem.difficulty as "easy" | "medium" | "hard";
    const displayTitle = formatTitle(problem.title);

    const examples: Example[] = useMemo(() => {
        if (!problem.examples) return [];
        return problem.examples;
    }, [problem.examples]);

    return (
        <div className={styles.shell}>
            {/* ── Top Navbar ── */}
            <nav className={styles.navbar}>
                <div className={styles.navLeft}>
                    <Link href="/problemset" className={styles.backBtn}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 2L4 7l5 5" />
                        </svg>
                        Back
                    </Link>
                    <div className={styles.separator} />
                    <div className={styles.breadcrumb}>
                        <Link href="/problemset">Problems</Link>
                        <span className={styles.breadcrumbSep}>/</span>
                        <span className={styles.breadcrumbCurrent}>{displayTitle}</span>
                    </div>
                </div>

                <div className={styles.navCenter}>
                    <span className={styles.questionId}>#{problem.questionId}</span>
                    <span className={`${styles.diffBadge} ${styles[diffKey]}`}>{problem.difficulty}</span>
                </div>

                <div className={styles.navRight}>
                    <button className={styles.runBtn}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="3,1 13,7 3,13" fill="currentColor" stroke="none" />
                        </svg>
                        Run
                    </button>
                    <button className={styles.submitBtn}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M2 7h10M8 3l4 4-4 4" />
                        </svg>
                        Submit
                    </button>
                </div>
            </nav>

            {/* ── Split Panel ── */}
            <main className={styles.main}>
                {/* ── Left: Description ── */}
                <section className={styles.leftPanel}>
                    <div className={styles.panelTabs}>
                        <button
                            className={`${styles.tab} ${activeTab === "description" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("description")}
                        >
                            Description
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === "submissions" ? styles.activeTab : ""}`}
                            onClick={() => setActiveTab("submissions")}
                        >
                            Submissions
                        </button>
                    </div>

                    <div className={styles.panelScrollable}>
                        {activeTab === "description" && (
                            <>
                                <h1 className={styles.problemTitle}>{displayTitle}</h1>

                                <div className={styles.metaRow}>
                                    <span className={`${styles.metaDiffBadge} ${styles[diffKey]}`}>
                                        {problem.difficulty}
                                    </span>
                                    <span className={styles.metaDot} />
                                    <span className={styles.metaId}>Q-{problem.questionId}</span>
                                    {problem.solved && (
                                        <>
                                            <span className={styles.metaDot} />
                                            <span style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 600 }}>Solved</span>
                                        </>
                                    )}
                                </div>

                                {problem.tags.length > 0 && (
                                    <div className={styles.tagsRow}>
                                        {problem.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className={styles.divider} />

                                <div
                                    className={styles.descriptionBody}
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    {problem.description}
                                </div>

                                {examples.length > 0 && (
                                    <div className={styles.examplesSection}>
                                        <p className={styles.examplesSectionTitle}>Examples</p>
                                        {examples.map((ex, i) => (
                                            <div key={i} className={styles.exampleCard}>
                                                <div className={styles.exampleHeader}>
                                                    <span className={styles.exampleDot} />
                                                    Example {i + 1}
                                                </div>
                                                <div className={styles.exampleBody}>
                                                    <div className={styles.exampleRow}>
                                                        <span className={styles.exampleLabel}>Input</span>
                                                        <div className={styles.exampleValue}>{ex.input}</div>
                                                    </div>
                                                    <div className={styles.exampleRow}>
                                                        <span className={styles.exampleLabel}>Output</span>
                                                        <div className={styles.exampleValue}>{ex.output}</div>
                                                    </div>
                                                    {ex.explanation && (
                                                        <div className={styles.exampleRow}>
                                                            <span className={styles.exampleLabel}>Explanation</span>
                                                            <p className={styles.exampleExplanation}>{ex.explanation}</p>
                                                        </div>
                                                    )}
                                                    {Array.isArray(ex.images) && ex.images.length > 0 && ex.images.some(s => typeof s === "string" && s.trim().length > 0) && (
                                                        <div className={styles.exampleRow}>
                                                            <span className={styles.exampleLabel}>Visual</span>
                                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                                                                {ex.images.map((src, j) => (
                                                                    <img
                                                                        key={j}
                                                                        src={src}
                                                                        alt={`Example ${i + 1} illustration ${j + 1}`}
                                                                        style={{
                                                                            width: "100%",
                                                                            maxWidth: 520,
                                                                            maxHeight: 400,
                                                                            objectFit: "contain",
                                                                            borderRadius: 10,
                                                                            border: "1px solid rgba(255,255,255,0.09)",
                                                                            background: "rgba(255,255,255,0.04)",
                                                                            padding: 8,
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {problem.constraints.length > 0 && (
                                    <div className={styles.examplesSection}>
                                        <p className={styles.examplesSectionTitle}>Constraints</p>
                                        <div className={styles.exampleCard}>
                                            <div className={styles.exampleBody}>
                                                {problem.constraints.map((c, i) => (
                                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: "1.7em" }}>
                                                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(243,201,139,0.6)", flexShrink: 0 }} />
                                                        <code style={{
                                                            fontFamily: "var(--font-geist-mono), monospace",
                                                            fontSize: "0.88rem",
                                                            color: "rgba(247,243,234,0.82)",
                                                            lineHeight: 1.7,
                                                        }}>{c}</code>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {problem.followUp && (
                                    <div className={styles.examplesSection}>
                                        <p className={styles.examplesSectionTitle}>Follow-up</p>
                                        <div className={styles.exampleCard}>
                                            <div className={styles.exampleBody}>
                                                <p className={styles.exampleExplanation}>{problem.followUp}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "submissions" && (
                            <div style={{ paddingTop: 40, textAlign: "center", color: "rgba(247,243,234,0.35)", fontSize: "0.95rem" }}>
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto 16px", display: "block", opacity: 0.25 }}>
                                    <rect x="8" y="12" width="32" height="4" rx="2" fill="currentColor" />
                                    <rect x="8" y="22" width="24" height="4" rx="2" fill="currentColor" />
                                    <rect x="8" y="32" width="16" height="4" rx="2" fill="currentColor" />
                                </svg>
                                No submissions yet
                            </div>
                        )}
                    </div>
                </section>

                {/* ── Right: Code Editor ── */}
                <section className={styles.rightPanel}>
                    <div className={styles.editorTopBar}>
                        <div className={styles.editorTopLeft}>
                            <div style={{ position: "relative" }}>
                                <button
                                    className={styles.langSelect}
                                    onClick={() => setLangMenuOpen((v) => !v)}
                                >
                                    <span
                                        className={styles.langDot}
                                        style={{ background: LANG_DOT_COLORS[activeLang], boxShadow: `0 0 6px ${LANG_DOT_COLORS[activeLang]}99` }}
                                    />
                                    {LANG_LABELS[activeLang]}
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 2, opacity: 0.5 }}>
                                        <path d="M2 4l4 4 4-4" />
                                    </svg>
                                </button>

                                {langMenuOpen && (
                                    <div style={{
                                        position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 20,
                                        background: "#1a1628", border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: 12, padding: "6px", minWidth: 148,
                                        boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                                        backdropFilter: "blur(24px)",
                                    }}>
                                        {availableLangs.map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => { setActiveLang(lang); setLangMenuOpen(false); }}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: 8,
                                                    width: "100%", padding: "8px 12px", border: "none",
                                                    borderRadius: 8, background: activeLang === lang ? "rgba(255,255,255,0.08)" : "transparent",
                                                    color: activeLang === lang ? "#f7f3ea" : "rgba(247,243,234,0.6)",
                                                    fontSize: "0.86rem", fontWeight: 500, cursor: "pointer",
                                                    transition: "all 120ms ease",
                                                }}
                                            >
                                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: LANG_DOT_COLORS[lang], flexShrink: 0 }} />
                                                {LANG_LABELS[lang]}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.editorTopRight}>
                            <button className={styles.iconBtn} title="Reset code">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 7a6 6 0 1 0 1.1-3.4" />
                                    <path d="M1 2v3h3" />
                                </svg>
                            </button>
                            <button className={styles.iconBtn} title="Fullscreen">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                    <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={styles.codeArea}>
                        <CodeView code={currentCode} />
                    </div>

                    {/* Output bar */}
                    <div className={styles.outputBar}>
                        <div className={styles.outputHeader} onClick={() => setOutputOpen((v) => !v)}>
                            <span className={`${styles.outputHeaderDot}`} />
                            Console
                            <svg
                                width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" style={{ marginLeft: "auto", opacity: 0.4, transform: outputOpen ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}
                            >
                                <path d="M2 4l4 4 4-4" />
                            </svg>
                        </div>
                        {outputOpen && (
                            <p className={styles.outputPlaceholder}>Run your code to see output here…</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
