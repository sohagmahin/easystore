import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();

  // delete db
  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });

  console.log("database seeds successfully!");
}

main();
