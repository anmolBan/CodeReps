import getProblemDetails from "../../../../lib/actions/getProblemDetails";
import ProblemClient from "./ProblemClient";
import styles from "./problem.module.css";
import Link from "next/link";

export default async function ProblemPage({ params }: { params: Promise<{ title: string }> }) {
    const { title } = await params;
    const result = await getProblemDetails(title);

    if (result.status !== 200 || !result.problem) {
        return (
            <div className={styles.shell}>
                <div className={styles.notFound}>
                    <div className={styles.notFoundCode}>404</div>
                    <h1 className={styles.notFoundTitle}>Problem not found</h1>
                    <p className={styles.notFoundDesc}>
                        The problem <strong>&ldquo;{title}&rdquo;</strong> doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/problemset" className={styles.notFoundLink}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 2L4 7l5 5" />
                        </svg>
                        Back to Problems
                    </Link>
                </div>
            </div>
        );
    }

    return <ProblemClient problem={result.problem as any} />;
}
