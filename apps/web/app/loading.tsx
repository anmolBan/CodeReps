import styles from "./loading.module.css";

const loadingSteps = [
  "Compiling fresh challenges",
  "Syncing streak signals",
  "Preparing contest arena",
];

export default function Loading() {
  return (
    <main className={styles.page} aria-busy="true" aria-live="polite">
      <div className={styles.glow} />

      <section className={styles.panel}>
        <div className={styles.rings} aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={styles.ringMid} />
          <span className={styles.ringCore} />
          <span className={styles.orbA} />
          <span className={styles.orbB} />
        </div>

        <div className={styles.copy}>
          <p className={styles.badge}>CodeReps</p>
          <h1>Loading your next challenge</h1>
          <p className={styles.description}>
            We&apos;re spinning up the practice arena with fresh momentum,
            warm gradients, and a little competitive energy.
          </p>
        </div>

        <div className={styles.terminal} aria-hidden="true">
          <div className={styles.terminalTop}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.terminalBody}>
            {loadingSteps.map((step) => (
              <div key={step} className={styles.terminalLine}>
                <span className={styles.prompt}>$</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
