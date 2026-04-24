import prisma from "@repo/db";

async function main(){
    await prisma.problemTag.deleteMany();
}
async function main2(){
    await prisma.tag.deleteMany();
}
async function main3(){
    await prisma.problem.deleteMany();
}

main();
main2();
main3();