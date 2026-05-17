import prisma from "@repo/db";
import fs from 'fs';
import { buildJudgeMetadata } from "./judgeMetadata";

async function main(){
    const fileStream = fs.readFileSync('merged_problems.json', 'utf-8');
    const data = JSON.parse(fileStream);
    const questions = data.questions;

    for (let i = 0; i < questions.length; i++){
        const question = questions[i];
        const examples = [];
        let image = "";
        for (let j = 0; j < question.examples.length; j++){
            const example = question.examples[j];
            if(image === example.images[0]){
                examples.push({
                    "example_num": example.example_num,
                    "example_text": example.example_text,
                    "images": []
                })
            }
            else{
                examples.push({
                    "example_num": example.example_num,
                    "example_text": example.example_text,
                    "images": example.images
                })
                console.log(question.title, example.images);
                image = example.images[0];
            }
        }
        const formattedProblem = {
            title: question.title,
            slug: question.problem_slug,
            problemId: question.problem_id,
            difficulty: question.difficulty,
            problemDescription: question.description.split("Example")[0].trim(),
            examples,
            starterCode: question.code_snippets,
            judgeMetadata: buildJudgeMetadata(question.code_snippets),
            testCases: [],
            constraints: question.constraints,
            followUp: question.follow_ups,
            hints: question.hints,
            tags: question.topics
        }
        
        await prisma.problem.upsert({
            where: {
                problemId: formattedProblem.problemId
            },
            update: {
                title: formattedProblem.title,
                slug: formattedProblem.slug,
                difficulty: formattedProblem.difficulty,
                problemDescription: formattedProblem.problemDescription,
                examples: formattedProblem.examples,
                starterCode: formattedProblem.starterCode,
                judgeFunctionName: formattedProblem.judgeMetadata.canonicalFunctionName,
                judgeMetadata: formattedProblem.judgeMetadata,
                constraints: formattedProblem.constraints,
                followUp: formattedProblem.followUp,
                hints: formattedProblem.hints,
            },
            create: {
                title: formattedProblem.title,
                slug: formattedProblem.slug,
                problemId: formattedProblem.problemId,
                difficulty: formattedProblem.difficulty,
                problemDescription: formattedProblem.problemDescription,
                examples: formattedProblem.examples,
                starterCode: formattedProblem.starterCode,
                judgeFunctionName: formattedProblem.judgeMetadata.canonicalFunctionName,
                judgeMetadata: formattedProblem.judgeMetadata,
                testCases: formattedProblem.testCases,
                constraints: formattedProblem.constraints,
                followUp: formattedProblem.followUp,
                hints: formattedProblem.hints,
                tags: {
                    create: formattedProblem.tags.map((tagName: string) => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tagName },
                                create: { name: tagName },
                            },
                        },
                    })),
                },
            },
        });
    }
}

main();
