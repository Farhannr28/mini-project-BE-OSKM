import { parseArgs } from "node:util";
import path from "path";
import fs from "fs";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

interface RawCSVData {
  message: string;
}

async function main() {
  const {
    values: { environment },
  } = parseArgs({
    options: {
      environment: { type: "string" },
    },
  });

  switch (environment) {
    case "development":
      /** Data for your development */
      await prisma.$transaction(
        async (tx) => {
          const user = await tx.user.create({
            data: {
              nim: "13520065",
              passwordHash: await hash("password", 10),
              role: UserRole.ADMIN,
            },
          });
          console.log(user);
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted, // Serializable for unversioned transactions
        }
      );
      break;
    case "production":
      /** Data for your test environment */
      const csvFilePath = path.resolve(__dirname, "data/examples.csv");
      const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

      parse(
        fileContent,
        {
          delimiter: ",",
          columns: Object.keys({ message: new String() } as RawCSVData),
        },
        async (err, records: RawCSVData[]) => {
          if (err) console.error(err);

          const examples = await Promise.all(
            records.map(async (record) => {
              return await prisma.example.create({
                data: {
                  message: record.message,
                },
              });
            })
          );

          console.log(examples);
        }
      );
      break;
    default:
      break;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
