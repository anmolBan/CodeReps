"use server";

import prisma from "@repo/db";

export default async function getProblems(limit = 20, offset = 0) {
    try{
        const safeLimit = Math.max(1, Math.min(limit, 100));
        const safeOffset = Math.max(0, offset);

        const response = await prisma.problem.findMany({
            skip: safeOffset,
            take: safeLimit,
            orderBy: {
                createdAt: "asc",
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const problems = response.map((problem) => ({
            id: problem.id,
            title: problem.title,
            difficulty: (problem.difficulty ?? "easy").toLowerCase(),
            acceptance: 0,
            likes: 0,
            solved: false,
            tags: problem.tags.map((problemTag) => problemTag.tag.name),
        }));

        return {
            problems,
            hasMore: response.length === safeLimit,
            status: 200,
            message: "Problems fetched successfully"
        }
    } catch (error) {
        console.error("Error fetching problems:", error);
        return {
            problems: [],
            status: 500,
            message: "An error occurred while fetching problems",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}