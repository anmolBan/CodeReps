type StarterCodeMap = Record<string, string>;

type SupportedJudgeLanguage = "javascript" | "typescript" | "python" | "java" | "cpp";
type InvocationMode = "function" | "class-method";

type LanguageJudgeConfig = {
  invocationMode: InvocationMode;
  symbolName: string;
  className?: string;
};

export type JudgeMetadata = {
  version: 1;
  canonicalFunctionName: string | null;
  extractedFrom: string | null;
  languages: Partial<Record<SupportedJudgeLanguage, LanguageJudgeConfig>>;
  ignoredLanguages: string[];
  mismatchedLanguages: string[];
};

const SUPPORTED_LANGUAGE_ORDER = [
  "typescript",
  "javascript",
  "python3",
  "python",
  "java",
  "cpp",
] as const;

const DEFAULT_IGNORED_LANGUAGES = ["rust", "erlang", "racket", "elixir"];

function extractFunctionNameFromJavascript(source: string) {
  return (
    source.match(/\b(?:var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function\b/)?.[1]
    ?? source.match(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/)?.[1]
  );
}

function extractFunctionNameFromTypescript(source: string) {
  return (
    source.match(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/)?.[1]
    ?? source.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(/)?.[1]
  );
}

function extractFunctionNameFromPython(source: string) {
  return source.match(/\bdef\s+([A-Za-z_][\w]*)\s*\(\s*self\b/)?.[1];
}

function extractFunctionNameFromJava(source: string) {
  return source.match(/\b(?:public|private|protected)\s+(?:static\s+)?[\w<>\[\], ?]+\s+([A-Za-z_][\w]*)\s*\(/)?.[1];
}

function extractFunctionNameFromCpp(source: string) {
  return source.match(/\b(?:vector|bool|int|long|double|char|string|void|float|ListNode|TreeNode|Node|unordered_map|map|set|pair)\b[\w<>\[\], :*&]*\s+([A-Za-z_][\w]*)\s*\(/)?.[1];
}

function extractFunctionName(language: string, source: string) {
  switch (language) {
    case "javascript":
      return extractFunctionNameFromJavascript(source);
    case "typescript":
      return extractFunctionNameFromTypescript(source);
    case "python":
    case "python3":
      return extractFunctionNameFromPython(source);
    case "java":
      return extractFunctionNameFromJava(source);
    case "cpp":
      return extractFunctionNameFromCpp(source);
    default:
      return undefined;
  }
}

export function buildJudgeMetadata(starterCode: unknown): JudgeMetadata {
  const starterCodeMap = (starterCode && typeof starterCode === "object")
    ? starterCode as StarterCodeMap
    : {};

  let canonicalFunctionName: string | null = null;
  let extractedFrom: string | null = null;

  for (const language of SUPPORTED_LANGUAGE_ORDER) {
    const source = starterCodeMap[language];
    if (!source) continue;

    const extractedFunctionName = extractFunctionName(language, source);
    if (!extractedFunctionName) continue;

    canonicalFunctionName = extractedFunctionName;
    extractedFrom = language;
    break;
  }

  const languages: JudgeMetadata["languages"] = {};
  const mismatchedLanguages: string[] = [];

  const supportedConfigByLanguage: Record<SupportedJudgeLanguage, { invocationMode: InvocationMode; className?: string }> = {
    javascript: { invocationMode: "function" },
    typescript: { invocationMode: "function" },
    python: { invocationMode: "class-method", className: "Solution" },
    java: { invocationMode: "class-method", className: "Solution" },
    cpp: { invocationMode: "class-method", className: "Solution" },
  };

  for (const [language, config] of Object.entries(supportedConfigByLanguage) as Array<[SupportedJudgeLanguage, { invocationMode: InvocationMode; className?: string }]>) {
    const source = starterCodeMap[language];
    if (!source || !canonicalFunctionName) continue;

    const extractedFunctionName = extractFunctionName(language, source);
    if (extractedFunctionName && extractedFunctionName !== canonicalFunctionName) {
      mismatchedLanguages.push(language);
      continue;
    }

    languages[language] = {
      invocationMode: config.invocationMode,
      symbolName: canonicalFunctionName,
      ...(config.className ? { className: config.className } : {}),
    };
  }

  return {
    version: 1,
    canonicalFunctionName,
    extractedFrom,
    languages,
    ignoredLanguages: DEFAULT_IGNORED_LANGUAGES.filter((language) => language in starterCodeMap),
    mismatchedLanguages,
  };
}
