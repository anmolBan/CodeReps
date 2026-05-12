import fs from 'fs';
import readline from 'readline';
// import { PrismaClient } from '@prisma/client';
import prisma from "@repo/db";

// const prisma = new PrismaClient();

async function main() {
  console.log('Starting dataset ingestion...');

  // Ensure this points to your downloaded train.jsonl file
  const fileStream = fs.createReadStream('leetcode_dataset.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let count = 0;

  for await (const line of rl) {
    let formattedProblem: any = null;
    try {
      const rawData = JSON.parse(line);

      formattedProblem = {
        title: rawData.title || rawData.id || rawData.task_id, 
        questionId: String(rawData.question_id),
        difficulty: rawData.difficulty || 'Medium',
        problemDescription: rawData.problem_description || rawData.content || '',
        starterCode: rawData.starter_code || {}, 
        testCases: rawData.input_output || [],
        tags: Array.isArray(rawData.tags) ? rawData.tags : [],
      };

      await prisma.problem.update({
        where: {
          problemId: formattedProblem.questionId
        }, 
        data: {
          testCases: formattedProblem.testCases
        }
      });

      console.log(`✅ Ingested problem: ${formattedProblem.title}`);
      count++;
      if (count % 100 === 0) console.log(`Ingested ${count} problems...`);

    } catch (error) {
      console.error("Failed to process problem:", formattedProblem?.title);
    }
  }

  console.log(`✅ Finished! Successfully ingested ${count} problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });