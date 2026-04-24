import prisma from "@repo/db";
import fs from 'fs';

async function main(){
    const fileStream = fs.readFileSync('merged_problems.json', 'utf-8');
    const data = JSON.parse(fileStream);
    const questions = data.questions;

    let count = 0;

    for (let i = 0; i < questions.length; i++){
        const question = questions[i];
        try{
            await prisma.problem.update({
                where: {
                    title: question.problem_slug
                },
                data: {
                    examples: question.examples
                }
            });
        } catch(error){
            console.error(`Error updating problem: ${question.problem_slug}`);
            count++;
        }
    }
    console.log(`Finished updating problems. Total errors: ${count}`);
}

main();