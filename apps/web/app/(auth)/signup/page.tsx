import { AuthScreen } from "../AuthScreen";

export default function SignUp() {
  return (
    <AuthScreen
      badge="Create your account"
      title="Start building coding confidence that compounds."
      description="Join CodeReps to solve curated challenges, enter contests, and turn steady practice into real competitive progress."
      primaryAction="Create your CodeReps account"
      alternatePrompt="Already have an account?"
      alternateLabel="Sign in"
      alternateHref="/signin"
      footerHint="Send me product updates and contest reminders"
      sideHeading="Train with purpose from your very first solve."
      sideDescription="CodeReps gives ambitious programmers a sharper place to practice: focused sets, ranking energy, and the kind of feedback loop that keeps you improving."
      statLabel="Problems waiting"
      statValue="2.4k+"
      highlights={[
        "Choose guided tracks for interviews, speed, or contest prep.",
        "Build streaks, unlock harder sets, and watch your rating move.",
        "Learn from hints and editorials without losing your momentum.",
      ]}
      fields={[
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
      ]}
    />
  );
}
