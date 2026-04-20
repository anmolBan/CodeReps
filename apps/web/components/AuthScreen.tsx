"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import styles from "../app/(auth)/auth.module.css";

type AuthScreenProps = {
  signin: boolean;
};

type FormField = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
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

export default function AuthScreen({ signin }: AuthScreenProps) {
  const content = signin
    ? {
        badge: "Welcome back",
        title: "Pick up your streak where you left it.",
        description:
          "Sign in to jump back into daily problems, contests, saved progress, and your latest rating climb.",
        primaryAction: "Sign in to CodeReps",
        alternatePrompt: "New here?",
        alternateLabel: "Create an account",
        alternateHref: "/signup",
        footerHint: "Keep me signed in on this device",
        sideHeading: "Get back into the rhythm of solving.",
        sideDescription:
          "One login away from your active streak, your next challenge, and a dashboard built to keep your momentum real.",
        statLabel: "Current streak",
        statValue: "18 days",
        fields: [
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
            autoComplete: "email",
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
            autoComplete: "current-password",
          },
        ] satisfies FormField[],
        highlights: [
          "Jump straight into your recommended problem set.",
          "Revisit editorials, bookmarks, and past submissions.",
          "Track rating changes across daily rounds and contests.",
        ],
      }
    : {
        badge: "Create your account",
        title: "Start building coding confidence that compounds.",
        description:
          "Join CodeReps to solve curated challenges, enter contests, and turn steady practice into real competitive progress.",
        primaryAction: "Create your CodeReps account",
        alternatePrompt: "Already have an account?",
        alternateLabel: "Sign in",
        alternateHref: "/signin",
        footerHint: "Send me product updates and contest reminders",
        sideHeading: "Train with purpose from your very first solve.",
        sideDescription:
          "CodeReps gives ambitious programmers a sharper place to practice: focused sets, ranking energy, and the kind of feedback loop that keeps you improving.",
        statLabel: "Problems waiting",
        statValue: "2.4k+",
        fields: [
          {
            id: "name",
            label: "Full name",
            type: "text",
            placeholder: "Your name",
            autoComplete: "name",
          },
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com",
            autoComplete: "email",
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Create a password",
            autoComplete: "new-password",
          },
        ] satisfies FormField[],
        highlights: [
          "Choose guided tracks for interviews, speed, or contest prep.",
          "Build streaks, unlock harder sets, and watch your rating move.",
          "Learn from hints and editorials without losing your momentum.",
        ],
      };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(`${signin ? "signin" : "signup"} form submitted`);
  }

  function handleGitHubClick() {
    console.log(`${signin ? "signin" : "signup"} GitHub auth clicked`);
  }

  function handleGoogleClick() {
    console.log(`${signin ? "signin" : "signup"} Google auth clicked`);
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <aside className={styles.showcase}>
          <Link className={styles.brand} href="/">
            CodeReps
          </Link>

          <div className={styles.copyBlock}>
            <p className={styles.badge}>{content.badge}</p>
            <h1>{content.sideHeading}</h1>
            <p className={styles.sideDescription}>{content.sideDescription}</p>
          </div>

          <div className={styles.metricCard}>
            <span>{content.statLabel}</span>
            <strong>{content.statValue}</strong>
            <p>Built for coders who want steady progress and sharper instincts.</p>
          </div>

          <div className={styles.highlightList}>
            {content.highlights.map((item) => (
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
            <p className={styles.formBadge}>{content.badge}</p>
            <h2>{content.title}</h2>
            <p className={styles.description}>{content.description}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {content.fields.map((field) => (
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
                <span>{content.footerHint}</span>
              </label>
              <a href="#help" className={styles.textLink}>
                Need help?
              </a>
            </div>

            <button type="submit" className={styles.primaryButton}>
              {content.primaryAction}
            </button>
          </form>

          <div className={styles.separator}>
            <span />
            <p>or continue with</p>
            <span />
          </div>

          <div className={styles.altActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleGitHubClick}
            >
              <GitHubLogo />
              GitHub
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleGoogleClick}
            >
              <GoogleLogo />
              Google
            </button>
          </div>

          <p className={styles.switchText}>
            {content.alternatePrompt}{" "}
            <Link href={content.alternateHref} className={styles.switchLink}>
              {content.alternateLabel}
            </Link>
          </p>
        </section>
      </section>
    </main>
  );
}
