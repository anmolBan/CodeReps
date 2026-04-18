import { AuthScreen } from "../AuthScreen";

export default function SignIn() {
  return (
    <AuthScreen
      badge="Welcome back"
      title="Pick up your streak where you left it."
      description="Sign in to jump back into daily problems, contests, saved progress, and your latest rating climb."
      primaryAction="Sign in to CodeReps"
      alternatePrompt="New here?"
      alternateLabel="Create an account"
      alternateHref="/signup"
      footerHint="Keep me signed in on this device"
      sideHeading="Get back into the rhythm of solving."
      sideDescription="One login away from your active streak, your next challenge, and a dashboard built to keep your momentum real."
      statLabel="Current streak"
      statValue="18 days"
      highlights={[
        "Jump straight into your recommended problem set.",
        "Revisit editorials, bookmarks, and past submissions.",
        "Track rating changes across daily rounds and contests.",
      ]}
      fields={[
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
      ]}
    />
  );
}
