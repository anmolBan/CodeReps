import Link from "next/link";
import styles from "./auth.module.css";

type FormField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
};

type AuthScreenProps = {
  badge: string;
  title: string;
  description: string;
  primaryAction: string;
  alternatePrompt: string;
  alternateLabel: string;
  alternateHref: string;
  footerHint: string;
  sideHeading: string;
  sideDescription: string;
  statLabel: string;
  statValue: string;
  highlights: string[];
  fields: FormField[];
};

function GitHubLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={styles.buttonIcon}
      fill="currentColor"
    >
      <path d="M12 .5C5.649.5.5 5.649.5 12A11.5 11.5 0 0 0 8.36 22.06c.575.106.785-.25.785-.556 0-.275-.01-1-.016-1.963-3.181.691-3.853-1.533-3.853-1.533-.52-1.322-1.27-1.674-1.27-1.674-1.038-.71.08-.696.08-.696 1.148.08 1.75 1.178 1.75 1.178 1.02 1.747 2.675 1.242 3.327.95.103-.739.399-1.242.726-1.527-2.54-.289-5.211-1.27-5.211-5.653 0-1.249.446-2.27 1.177-3.07-.118-.289-.51-1.452.112-3.026 0 0 .96-.307 3.146 1.173a10.94 10.94 0 0 1 5.73 0c2.185-1.48 3.144-1.173 3.144-1.173.624 1.574.232 2.737.114 3.026.733.8 1.176 1.821 1.176 3.07 0 4.394-2.675 5.36-5.223 5.643.41.354.776 1.054.776 2.124 0 1.533-.014 2.77-.014 3.147 0 .309.207.668.79.555A11.502 11.502 0 0 0 23.5 12C23.5 5.649 18.351.5 12 .5Z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={styles.buttonIcon}
    >
      <path
        fill="#EA4335"
        d="M12.24 10.286v3.955h5.497c-.242 1.272-.967 2.35-2.004 3.074l3.24 2.513c1.888-1.74 2.977-4.304 2.977-7.363 0-.724-.064-1.42-.183-2.104H12.24Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.965-.894 6.62-2.424l-3.24-2.513c-.9.605-2.05.963-3.38.963-2.596 0-4.793-1.752-5.58-4.108l-3.35 2.587A9.995 9.995 0 0 0 12 22Z"
      />
      <path
        fill="#4A90E2"
        d="M6.42 13.918A5.995 5.995 0 0 1 6.107 12c0-.666.115-1.312.313-1.918L3.07 7.495A9.995 9.995 0 0 0 2 12c0 1.611.384 3.132 1.07 4.505l3.35-2.587Z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.974c1.468 0 2.786.505 3.823 1.496l2.869-2.87C16.96 2.988 14.696 2 12 2a9.995 9.995 0 0 0-8.93 5.495l3.35 2.587C7.206 7.726 9.403 5.974 12 5.974Z"
      />
    </svg>
  );
}

export function AuthScreen({
  badge,
  title,
  description,
  primaryAction,
  alternatePrompt,
  alternateLabel,
  alternateHref,
  footerHint,
  sideHeading,
  sideDescription,
  statLabel,
  statValue,
  highlights,
  fields,
}: AuthScreenProps) {
  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <aside className={styles.showcase}>
          <Link className={styles.brand} href="/">
            CodeReps
          </Link>

          <div className={styles.copyBlock}>
            <p className={styles.badge}>{badge}</p>
            <h1>{sideHeading}</h1>
            <p className={styles.sideDescription}>{sideDescription}</p>
          </div>

          <div className={styles.metricCard}>
            <span>{statLabel}</span>
            <strong>{statValue}</strong>
            <p>Built for coders who want steady progress and sharper instincts.</p>
          </div>

          <div className={styles.highlightList}>
            {highlights.map((item) => (
              <div key={item} className={styles.highlightItem}>
                <span className={styles.highlightDot} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className={styles.formPanel}>
          <div className={styles.formHeader}>
            <Link className={styles.homeLink} href="/">
              Back to home
            </Link>
            <p className={styles.formBadge}>{badge}</p>
            <h2>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          <form className={styles.form}>
            {fields.map((field) => (
              <label key={field.id} className={styles.field}>
                <span>{field.label}</span>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                />
              </label>
            ))}

            <div className={styles.metaRow}>
              <label className={styles.checkbox}>
                <input type="checkbox" name="remember" />
                <span>{footerHint}</span>
              </label>
              <a href="#help" className={styles.textLink}>
                Need help?
              </a>
            </div>

            <button type="submit" className={styles.primaryButton}>
              {primaryAction}
            </button>
          </form>

          <div className={styles.separator}>
            <span />
            <p>or continue with</p>
            <span />
          </div>

          <div className={styles.altActions}>
            <button type="button" className={styles.secondaryButton}>
              <GitHubLogo />
              GitHub
            </button>
            <button type="button" className={styles.secondaryButton}>
              <GoogleLogo />
              Google
            </button>
          </div>

          <p className={styles.switchText}>
            {alternatePrompt}{" "}
            <Link href={alternateHref} className={styles.switchLink}>
              {alternateLabel}
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
