import { get } from "http";
import styles from "./page.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

const proofPoints = [
  "Daily challenges",
  "Contest ladders",
  "Interview prep",
  "Competitive coders",
];

const featureCards = [
  {
    eyebrow: "Sharpen fundamentals",
    title: "Practice the patterns that show up when it counts.",
    description:
      "Work through algorithmic problems across arrays, graphs, DP, trees, and greedy strategy with clean explanations and satisfying progression.",
  },
  {
    eyebrow: "Contest mode",
    title: "Train under pressure with ranked rounds and timed sets.",
    description:
      "Build speed, accuracy, and confidence with live contests, performance tracking, and the kind of pacing that turns practice into instinct.",
  },
  {
    eyebrow: "Progress you can feel",
    title: "Turn every solved problem into visible momentum.",
    description:
      "See streaks, ratings, topic mastery, and breakthrough moments in one place so you always know what to attack next.",
  },
  {
    eyebrow: "Built to learn",
    title: "Get unstuck without breaking your flow.",
    description:
      "Use hints, editorials, and solution comparisons to understand why an approach works instead of just memorizing answers.",
  },
];

const timeline = [
  {
    label: "09:10",
    title: "Warm up with a daily problem",
    text: "Start with a focused challenge that wakes up your problem-solving instincts before the rest of the day begins.",
  },
  {
    label: "11:40",
    title: "Climb through tougher patterns",
    text: "Move from easy wins into medium and hard sets with hints, editorials, and topic-focused repetition.",
  },
  {
    label: "16:25",
    title: "Test yourself in contest mode",
    text: "Finish the day in a timed round and watch your rating, speed, and accuracy improve with every session.",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session, "Anmol Bansal");
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.badge}>Competitive programming practice for modern coders</div>
          <nav className={styles.nav}>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#launch">Launch</a>
          </nav>
          <p className={styles.kicker}>CodeReps</p>
          <h1>Train like a competitor. Solve like an engineer.</h1>
          <p className={styles.lead}>
            CodeReps is a programming practice platform built for interview prep,
            daily problem solving, and competitive coding. Solve sharper
            questions, learn faster patterns, and build real confidence one
            challenge at a time.
          </p>
          <div className={styles.ctas}>
            <a className={styles.primaryCta} href="#launch">
              Start solving
            </a>
            <a className={styles.secondaryCta} href="#workflow">
              Explore the journey
            </a>
          </div>
          <div className={styles.proofRow}>
            {proofPoints.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="CodeReps programming platform preview">
          <div className={styles.window}>
            <div className={styles.windowTop}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.windowBody}>
              <div className={styles.signalCard}>
                <p>Daily streak</p>
                <strong>12 problems solved this week</strong>
                <div className={styles.signalBars}>
                  <span className={styles.barTall} />
                  <span className={styles.barMid} />
                  <span className={styles.barShort} />
                  <span className={styles.barMid} />
                </div>
              </div>

              <div className={styles.metricCard}>
                <span>Contest rating</span>
                <strong>1942</strong>
                <p>Consistency across practice sets and live rounds is driving steady improvement.</p>
              </div>

              <div className={styles.activityCard}>
                <div>
                  <p>Graph pathways</p>
                  <span>Hard challenge</span>
                </div>
                <strong>Solved</strong>
              </div>

              <div className={styles.activityCard}>
                <div>
                  <p>Binary search sprint</p>
                  <span>Contest set</span>
                </div>
                <strong>Live now</strong>
              </div>
            </div>
          </div>

          <div className={styles.floatingNote}>
            <span>Momentum</span>
            <strong>Small daily wins compound into speed, intuition, and serious coding confidence.</strong>
          </div>
        </div>
      </section>

      <section className={styles.summaryStrip}>
        <div>
          <span>Smart practice</span>
          <p>Problems are organized to help you build technique instead of just collecting solves.</p>
        </div>
        <div>
          <span>Real competition</span>
          <p>Train with timed rounds and ranking pressure that feels closer to the real thing.</p>
        </div>
        <div>
          <span>Interview ready</span>
          <p>Build the fluency and calm problem-solving style top companies actually look for.</p>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className={styles.sectionHeading}>
          <p>What makes it different</p>
          <h2>A practice platform that feels intense, focused, and worth coming back to.</h2>
        </div>
        <div className={styles.featureGrid}>
          {featureCards.map((card) => (
            <article key={card.title} className={styles.featureCard}>
              <span>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className={styles.workflow}>
        <div className={styles.workflowCopy}>
          <p>See the rhythm</p>
          <h2>From first attempt to contest confidence.</h2>
          <p className={styles.workflowLead}>
            CodeReps is designed to feel like a serious training ground for
            programmers: motivating enough for daily habit building, sharp enough
            for interview prep, and competitive enough to keep ambitious coders locked in.
          </p>
        </div>
        <div className={styles.timeline}>
          {timeline.map((item) => (
            <article key={item.label} className={styles.timelineItem}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="launch" className={styles.launchPanel}>
        <div>
          <p>Ready to launch</p>
          <h2>Give CodeReps a homepage that already feels like a challenge worth taking.</h2>
        </div>
        <a className={styles.launchCta} href="mailto:hello@codereps.dev">
          Join the first contest
        </a>
      </section>
    </main>
  );
}
