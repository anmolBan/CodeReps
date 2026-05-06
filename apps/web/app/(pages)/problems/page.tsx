"use client";

import { useEffect, useMemo, useState } from "react";
import Loading from "../../loading";
import getProblems from "../../../lib/actions/getProblems";
import ProblemCard from "../../../components/ProblemCard";
import styles from "./problems.module.css";

type Difficulty = "All" | "Easy" | "Medium" | "Hard";

export default function ProblemsPage() {
    const [loading, setLoading] = useState(true);
    const [problems, setProblems] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<Difficulty>("All");

    useEffect(() => {
        async function fetchProblems() {
            try {
                const response = await getProblems();
                setProblems(response.problems);
            } catch (error) {
                console.error("Error fetching problems:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProblems();
    }, []);

    const filtered = useMemo(() => {
        return problems.filter((p) => {
            const matchesDiff = activeFilter === "All" || p.difficulty?.toLowerCase() === activeFilter.toLowerCase();
            const q = search.toLowerCase();
            const matchesSearch =
                p.title?.toLowerCase().includes(q) ||
                (Array.isArray(p.tags) && p.tags.some((tag: string) => tag.toLowerCase().includes(q)));
            return matchesDiff && matchesSearch;
        });
    }, [problems, activeFilter, search]);

    if (loading) return <Loading />;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerCopy}>
                        <span className={styles.badge}>Problem Set</span>
                        <h1>Sharpen Your<br />Coding Skills</h1>
                        <p className={styles.description}>
                            Practice algorithmic problems curated from top interview banks.
                            Filter by difficulty, track your progress, and level up.
                        </p>
                    </div>

                </div>

                {/* Controls */}
                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search problems…"
                            className={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterButtons}>
                        {(["All", "Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
                            <button
                                key={d}
                                className={`${styles.filterButton} ${activeFilter === d ? styles.active : ""}`}
                                onClick={() => setActiveFilter(d)}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Problems List */}
                <div className={styles.problemsSection}>
                    <div className={styles.problemsHeader}>
                        <span className={styles.resultsText}>
                            {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
                            {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
                            {search ? ` matching "${search}"` : ""}
                        </span>
                    </div>

                    {filtered.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No problems found</p>
                            <p className={styles.emptyDescription}>Try adjusting your search or filter.</p>
                        </div>
                    ) : (
                        <div className={styles.problemsList}>
                            {filtered.map((problem, i) => (
                                <ProblemCard
                                    key={problem.id}
                                    index={i}
                                    title={problem.title}
                                    difficulty={problem.difficulty}
                                    tags={problem.tags}
                                    solved={problem.solved}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}