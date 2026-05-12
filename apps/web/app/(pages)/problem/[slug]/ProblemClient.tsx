"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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

const MONACO_LANGUAGE_BY_LANG: Record<Lang, string> = {
    javascript: "javascript",
    python: "python",
    typescript: "typescript",
    java: "java",
    cpp: "cpp",
};

const LANG_MODEL_PATHS: Record<Lang, string> = {
    javascript: "solution.js",
    python: "solution.py",
    typescript: "solution.ts",
    java: "Solution.java",
    cpp: "solution.cpp",
};

const MONACO_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
    automaticLayout: true,
    fontFamily: "var(--font-geist-mono), 'Fira Code', monospace",
    fontSize: 14,
    fontLigatures: true,
    lineHeight: 28,
    minimap: { enabled: false },
    padding: { top: 18, bottom: 24 },
    quickSuggestions: true,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    tabSize: 4,
    wordWrap: "off",
    scrollbar: {
        verticalScrollbarSize: 6,
        horizontalScrollbarSize: 6,
    },
};

const MonacoEditor = dynamic(
    () => import("@monaco-editor/react").then((mod) => mod.default),
    {
        ssr: false,
        loading: () => <div className={styles.editorLoading}>Loading editor...</div>,
    },
);

function getStarterCodeForLang(problem: Problem, lang: Lang) {
    if (!problem.starterCode) return "// No starter code available";
    if (typeof problem.starterCode === "string") return problem.starterCode;
    return problem.starterCode[lang] ?? "// No starter code for this language";
}

function handleEditorWillMount(monaco: Monaco) {
    monaco.editor.defineTheme("code-reps-night", {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "8D869F", fontStyle: "italic" },
            { token: "keyword", foreground: "C084FC" },
            { token: "number", foreground: "FB923C" },
            { token: "string", foreground: "86EFAC" },
            { token: "type", foreground: "67E8F9" },
        ],
        colors: {
            "editor.background": "#080612",
            "editor.foreground": "#F7F3EA",
            "editorCursor.foreground": "#F7F3EA",
            "editor.lineHighlightBackground": "#151021",
            "editor.selectionBackground": "#3B82F64D",
            "editor.inactiveSelectionBackground": "#3B82F633",
            "editorLineNumber.foreground": "#5B556B",
            "editorLineNumber.activeForeground": "#F3C98B",
            "editorGutter.background": "#080612",
            "editorIndentGuide.background1": "#FFFFFF14",
            "editorIndentGuide.activeBackground1": "#FFFFFF26",
        },
    });
}

function CodeView({
    code,
    editorPath,
    language,
    onChange,
}: {
    code: string;
    editorPath: string;
    language: string;
    onChange: (nextCode: string) => void;
}) {
    return (
        <div className={styles.monacoShell}>
            <MonacoEditor
                beforeMount={handleEditorWillMount}
                height="100%"
                language={language}
                loading={<div className={styles.editorLoading}>Loading editor...</div>}
                onChange={(value) => onChange(value ?? "")}
                options={MONACO_OPTIONS}
                path={editorPath}
                theme="code-reps-night"
                value={code}
            />
        </div>
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
    const [draftCodeByLang, setDraftCodeByLang] = useState<Partial<Record<Lang, string>>>({});

    const availableLangs = useMemo(() => {
        if (problem.starterCode && typeof problem.starterCode === "object") {
            return LANGUAGES.filter((l) => l in (problem.starterCode as Record<string, string>));
        }
        return ["javascript"] as Lang[];
    }, [problem.starterCode]);

    const starterCodeForActiveLang = useMemo(
        () => getStarterCodeForLang(problem, activeLang),
        [problem, activeLang],
    );
    const activeMonacoLanguage = MONACO_LANGUAGE_BY_LANG[activeLang];
    const activeEditorPath = `${problem.id}/${LANG_MODEL_PATHS[activeLang]}`;

    const currentCode = draftCodeByLang[activeLang] ?? starterCodeForActiveLang;

    const diffKey = problem.difficulty as "easy" | "medium" | "hard";
    const displayTitle = formatTitle(problem.title);

    const examples: Example[] = useMemo(() => {
        if (!problem.examples) return [];
        return problem.examples;
    }, [problem.examples]);

    useEffect(() => {
        if (availableLangs.includes(activeLang)) return;
        setActiveLang(availableLangs[0] ?? "javascript");
    }, [activeLang, availableLangs]);

    useEffect(() => {
        setDraftCodeByLang({});
    }, [problem.id]);

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
                            <button
                                className={styles.iconBtn}
                                title="Reset code"
                                onClick={() =>
                                    setDraftCodeByLang((prev) => ({
                                        ...prev,
                                        [activeLang]: starterCodeForActiveLang,
                                    }))
                                }
                            >
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
                        <CodeView
                            code={currentCode}
                            editorPath={activeEditorPath}
                            language={activeMonacoLanguage}
                            onChange={(nextCode) =>
                                setDraftCodeByLang((prev) => ({
                                    ...prev,
                                    [activeLang]: nextCode,
                                }))
                            }
                        />
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
