import fs from 'fs';
import readline from 'readline';
// import { PrismaClient } from '@prisma/client';
import prisma from "@repo/db";

// const prisma = new PrismaClient();

async function main() {
  console.log('Starting dataset ingestion...');

  // Ensure this points to your downloaded train.jsonl file
  const fileStream = fs.createReadStream('leetcode_dataset2.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let count = 0;

  for await (const line of rl) {
    try {
      const rawData = JSON.parse(line);

      const formattedProblem = {
        title: rawData.title || rawData.id || `Problem ${rawData.task_id}`, 
        questionId: String(rawData.question_id),
        difficulty: rawData.difficulty || 'Medium',
        problemDescription: rawData.problem_description || rawData.content || '',
        starterCode: rawData.starter_code || {}, 
        testCases: rawData.input_output || [],
        tags: Array.isArray(rawData.tags) ? rawData.tags : [],
      };

      await prisma.problem.upsert({
        where: { questionId: formattedProblem.questionId },
        update: {}, // Skip if already in database
        create: {
          title: formattedProblem.title,
          questionId: formattedProblem.questionId,
          difficulty: formattedProblem.difficulty,
          problemDescription: formattedProblem.problemDescription,
          starterCode: formattedProblem.starterCode,
          testCases: formattedProblem.testCases,
          
          // The new explicit many-to-many insertion logic
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

      console.log(`✅ Ingested problem: ${formattedProblem.title}`);
      count++;
      if (count % 100 === 0) console.log(`Ingested ${count} problems...`);

    } catch (error) {
      console.error('Error parsing line or inserting to DB:', error);
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