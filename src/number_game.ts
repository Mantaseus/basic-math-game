import readline from 'readline';

async function askQuestion(question: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return await new Promise<string>(res => rl.question(question, res));
}

const COUNTDOWN_START = 3;
const OPERATIONS = (['+', '-', 'x', '/'] as const).slice();

interface Question {
  operand1: number;
  operand2: number;
  operation: typeof OPERATIONS[number];
  result: number;
}

(async () => {
  const questions = Array(5).fill(0).map<Question>(() => {
    const operation = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
    switch(operation) {
      case '+': {
        const operand1 = Math.floor(Math.random() * 10);
        const operand2 = Math.floor(Math.random() * 10);
        const result = operand1 + operand2;
        return { operand1, operand2, operation, result };
      }
      case '-': {
        const result = Math.floor(Math.random() * 10);
        const operand2 = Math.floor(Math.random() * 10);
        const operand1 = result + operand2;
        return { operand1, operand2, operation, result };
      }
      case 'x': {
        const operand1 = Math.floor(Math.random() * 10);
        const operand2 = Math.floor(Math.random() * 10);
        const result = operand1 * operand2;
        return { operand1, operand2, operation, result };
      }
      case '/': {
        const result = Math.floor(Math.random() * 10);
        const operand2 = Math.floor(Math.random() * 10);
        const operand1 = result * operand2;
        return { operand1, operand2, operation, result };
      }
    }
  });
  console.log(questions)
  return;

  for (let i = COUNTDOWN_START; i > 0; i--) {
    console.log(`Get Ready... ${i}`);
    await new Promise(res => setTimeout(res, 1000));
  }

  console.log(await askQuestion('Say something: '));
  process.exit();
})();
