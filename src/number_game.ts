import readline from 'readline';

async function askQuestion(question: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return await new Promise<string>(res => rl.question(question, res));
}

(async () => {
  console.log(await askQuestion('Say something'));
  process.exit();
})();
