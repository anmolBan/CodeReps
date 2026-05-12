import fs from "fs";
import prisma from "@repo/db";

async function main(){
    const fileStream = fs.readFileSync('merged_problems.json', 'utf-8');
    const data = JSON.parse(fileStream);
    const questions = data.questions;

    let maxImages = 0;

    for(let i = 0; i < questions.length; i++){
        const question = questions[i];

        const examples = question.examples;

        for(let j = 0; j < examples.length; j++){
            const currLength = examples[j].images.length;
            maxImages = Math.max(maxImages, currLength);
            if(currLength > 1){
                console.log(question.title, examples[j].images);
            }
        }

    }
    console.log("Max images in any example:", maxImages);
}

main();