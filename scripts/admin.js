import bcrypt from "bcrypt";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { prisma } from "../src/lib/prisma.js";

const rl = readline.createInterface({ input, output });

async function main() {
  const email = await rl.question("Email do administrador: ");
  const password = await rl.question("Senha: ");
  const name = await rl.question("Nome: ");

  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.create({
    data: {
      email,
      name,
      password: hash,
    },
  });

  console.log("Administrador criado com sucesso.");
}

main()
  .catch(console.error)
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });