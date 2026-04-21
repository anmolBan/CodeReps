import { userSignUpSchema } from "@repo/zod-types";
import { handleSignup } from "../../../lib/actions/handleSignup";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const parsedBody = userSignUpSchema.safeParse(body);
  if (!parsedBody.success) {
    const fieldErrors = parsedBody.error.flatten().fieldErrors;

    return NextResponse.json(
      {
        error: "Invalid inputs",
        fieldErrors: {
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      },
      { status: 400 },
    );
  }

  try {
    const result = await handleSignup(parsedBody.data);

    if (result.status !== 201) {
      return NextResponse.json(
        {
          error: result.error,
          fieldErrors:
            result.status === 400
              ? {
                  email: result.error,
                }
              : undefined,
        },
        { status: result.status },
      );
    }

    return NextResponse.json({ message: result.message }, { status: 201 });
  } catch (error) {
    console.error("Error in signup route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
