"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../../loading";
import getProblems from "../../../lib/actions/getProblems";
import ProblemCard from "../../../components/ProblemCard";
import styles from "./problems.module.css";

type Difficulty = "All" | "Easy" | "Medium" | "Hard";

const PAGE_SIZE = 20;

export default function ProblemSetPage() {
    const [initialLoading, setInitialLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [problems, setProblems] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<Difficulty>("All");

    const sentinelRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true);
    const isInitialLoad = useRef(true);
    // Keep a stable ref to current search/filter/offset so the observer
    // callback always sees the latest values without re-registering.
    const stateRef = useRef({ search, activeFilter, offset, hasMore, isFetchingMore });
    stateRef.current = { search, activeFilter, offset, hasMore, isFetchingMore };

    // Core fetch helper.
    // reset=true  → clear list, start from offset 0 (search/filter change)
    // reset=false → append next page (scroll trigger)
    const fetchPage = useCallback(async (reset: boolean, overrideSearch?: string, overrideFilter?: Difficulty) => {
        const currentSearch = overrideSearch !== undefined ? overrideSearch : stateRef.current.search;
        const currentFilter = overrideFilter !== undefined ? overrideFilter : stateRef.current.activeFilter;
        const currentOffset = reset ? 0 : stateRef.current.offset;

        if (!reset && !stateRef.current.hasMore) return;
        if (!reset && stateRef.current.isFetchingMore) return;

        if (reset) {
            isInitialLoad.current ? setInitialLoading(true) : setIsResetting(true);
        } else {
            setIsFetchingMore(true);
        }

        try {
            const response = await getProblems(
                PAGE_SIZE,
                currentOffset,
                currentSearch,
                currentFilter === "All" ? "all" : currentFilter.toLowerCase()
            );

            setProblems((prev) => reset ? response.problems : [...prev, ...response.problems]);
            setHasMore(response.hasMore ?? false);
            setOffset(currentOffset + response.problems.length);
        } catch (err) {
            console.error("Error fetching problems:", err);
        } finally {
            if (reset) {
                if (isInitialLoad.current) {
                    isInitialLoad.current = false;
                    setInitialLoading(false);
                } else {
                    setIsResetting(false);
                }
            } else {
                setIsFetchingMore(false);
            }
        }
    }, []);

    // Initial load on mount
    useEffect(() => {
        fetchPage(true, "", "All");
    }, [fetchPage]);

    // Re-fetch (reset) when search or filter changes — debounced 300ms
    useEffect(() => {
        // Skip the very first render (handled by mount effect above)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchPage(true, search, activeFilter);
        }, 300);

        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, activeFilter]);

    // IntersectionObserver — fires fetchPage(false) when sentinel enters viewport.
    // Depends on initialLoading so it re-runs after the sentinel mounts.
    useEffect(() => {
        if (initialLoading) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    const { hasMore, isFetchingMore } = stateRef.current;
                    if (hasMore && !isFetchingMore) {
                        fetchPage(false);
                    }
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [fetchPage, initialLoading]);

    // After each fetch completes, check if the sentinel is still visible.
    // If it is, the observer won't re-fire on its own, so we trigger the next page here.
    useEffect(() => {
        if (isFetchingMore || !hasMore) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const rect = sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            fetchPage(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetchingMore]);

    if (initialLoading) return <Loading />;

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
                            placeholder="Search problems or tags…"
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
                            {problems.length} problem{problems.length !== 1 ? "s" : ""} loaded
                            {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
                            {search ? ` matching "${search}"` : ""}
                        </span>
                    </div>

                    {isResetting ? (
                        <p className={styles.loadMoreText}>Searching…</p>
                    ) : problems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No problems found</p>
                            <p className={styles.emptyDescription}>Try adjusting your search or filter.</p>
                        </div>
                    ) : (
                        <div className={styles.problemsList}>
                            {problems.map((problem, i) => (
                                <ProblemCard
                                    key={problem.id}
                                    problemId={problem.id}
                                    index={i}
                                    title={problem.title}
                                    difficulty={problem.difficulty}
                                    tags={problem.tags}
                                    solved={problem.solved}
                                />
                            ))}
                        </div>
                    )}

                    {/* Sentinel + loading indicator */}
                    <div ref={sentinelRef} className={styles.scrollSentinel} />
                    {isFetchingMore && (
                        <p className={styles.loadMoreText}>Loading more problems…</p>
                    )}
                    {!hasMore && problems.length > 0 && (
                        <p className={styles.loadMoreText}>All problems loaded.</p>
                    )}
                </div>
            </div>
        </div>
    );
}