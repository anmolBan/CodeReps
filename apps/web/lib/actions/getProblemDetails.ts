"use server";

import prisma from "@repo/db";

export default async function getProblemDetails(title: string){
    console.log("Fetching details for problem:", title);
    try{
        const problem = await prisma?.problem.findUnique({
            where: {
                title
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        if(!problem){
            return {
                status: 404,
                message: "Problem not found"
            }
        }

        // ── Parse description sections ────────────────────────────────
        const rawDesc: string = (problem.problemDescription ?? "")
            .replace(/Â/g, "")   // strip encoding artifacts (&nbsp; mangled as Â )
            .replace(/\u00a0/g, " "); // normalise non-breaking spaces

        // Split off everything before the first "Example N:" header
        const exampleSplit = rawDesc.split(/\n?\s*Example\s+\d+\s*:/i);
        const descriptionOnly = (exampleSplit[0] ?? rawDesc).trim();

        // Extract constraints block
        const constraintsMatch = rawDesc.match(/Constraints:\s*\n([\s\S]*?)(?=\n\s*Follow[- ]?[Uu]p[^\w]|$)/i);
        const constraints = constraintsMatch?.[1]
            ? constraintsMatch[1].trim().split("\n").map(l => l.trim()).filter(Boolean)
            : [];

        // Extract follow-up block
        const followUpMatch = rawDesc.match(/Follow[- ]?[Uu]p[^\w]*:?\s*([\s\S]*?)$/i);
        const followUp = followUpMatch?.[1]?.trim() ?? "";
        // ──────────────────────────────────────────────────────────────

        const parsedExamples = (problem.examples ?? []).map((ex: any) => {
            const text: string = ex.example_text ?? "";
            const inputMatch = text.match(/Input:\s*([\s\S]*?)(?=\nOutput:|$)/i);
            const outputMatch = text.match(/Output:\s*([\s\S]*?)(?=\nExplanation:|$)/i);
            const explanationMatch = text.match(/Explanation:\s*([\s\S]*?)$/i);
            return {
                input: inputMatch?.[1]?.trim() ?? "",
                output: outputMatch?.[1]?.trim() ?? "",
                explanation: explanationMatch?.[1]?.trim() ?? undefined,
                images: Array.isArray(ex.images) ? (ex.images as string[]).filter(Boolean) : [],
            };
        });

        const response = {
            id: problem.id,
            title: problem.title,
            difficulty: (problem.difficulty ?? "easy").toLowerCase(),
            solved: false,
            tags: problem.tags.map((problemTag) => problemTag.tag.name),
            starterCode: problem.starterCode,
            description: descriptionOnly,
            constraints,
            followUp,
            questionId: problem.questionId,
            examples: parsedExamples,
        }
        return {
            status: 200,
            message: "Problem details fetched successfully",
            problem: response
        }
        
    } catch(error){
        console.error("Error fetching problem details:", error);
        return {
            status: 500,
            message: "Error fetching problem details"
        }
    }
}