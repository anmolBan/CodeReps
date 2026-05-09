"use client";
import { useRouter } from "next/navigation";
import styles from "./ProblemCard.module.css";

export default function ProblemCard({
    problemId,
    title,
    difficulty,
    tags,
    solved,
    index,
}: {
    problemId: string;
    title: string;
    difficulty: string;
    tags: string[];
    solved: boolean;
    index?: number;
}) {
    const router = useRouter();
    const diffKey = difficulty?.toLowerCase() as "easy" | "medium" | "hard";

    function solveOnClickHandler(){
        router.push(`/problem/${title}`);
    }

    return (
        <div className={`${styles.card} ${styles[`accent_${diffKey}`] ?? ""} ${solved ? styles.solved : ""}`}>
            {/* Left accent bar */}
            <div className={`${styles.accentBar} ${styles[diffKey]}`} />

            {/* Number */}
            {index !== undefined && (
                <span className={styles.number}>#{index + 1}</span>
            )}

            {/* Title + tags */}
            <div className={styles.problemInfo}>
                {/* starting letter of each word capitalized, dashes replaced with spaces */}
                <span className={styles.title}>{title.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</span>
                {tags && tags.length > 0 && (
                    <div className={styles.tagsList}>
                        {tags.slice(0, 5).map((tag) => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Difficulty badge */}
            <span className={`${styles.badge} ${styles[diffKey] ?? ""}`}>
                {difficulty}
            </span>

            {/* Status */}
            <div className={styles.statusCheck}>
                {solved ? (
                    <span className={styles.solvedIcon} title="Solved">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="8.5" stroke="#46b6a4" strokeWidth="1.2" />
                            <path d="M5.5 9l2.5 2.5 4.5-5" stroke="#46b6a4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                ) : (
                    <button onClick={solveOnClickHandler} className={styles.solveButton}>
                        <span>Solve</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M2 7h10M8 3l4 4-4 4" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
