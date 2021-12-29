import readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function askQuestion(question: string) {
  return await new Promise<string>(res => rl.question(question, res));
}

function getRandomInt(max: number, notZero?: boolean) {
  while (true) {
    const val = Math.floor(Math.random() * max);
    if (notZero && val === 0) {
      continue;
    }
    return val;
  }
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
        const operand1 = getRandomInt(10);
        const operand2 = getRandomInt(10);
        const result = operand1 + operand2;
        return { operand1, operand2, operation, result };
      }
      case '-': {
        const result = getRandomInt(10);
        const operand2 = getRandomInt(10);
        const operand1 = result + operand2;
        return { operand1, operand2, operation, result };
      }
      case 'x': {
        const operand1 = getRandomInt(10);
        const operand2 = getRandomInt(10);
        const result = operand1 * operand2;
        return { operand1, operand2, operation, result };
      }
      case '/': {
        const result = getRandomInt(10, true);
        const operand2 = getRandomInt(10, true);
        const operand1 = result * operand2;
        return { operand1, operand2, operation, result };
      }
    }
  });

  for (let i = COUNTDOWN_START; i > 0; i--) {
    console.log(`Get Ready... ${i}`);
    await new Promise(res => setTimeout(res, 1000));
  }

  for (const question of questions) {
    const answer = await askQuestion(`${question.operand1} ${question.operation} ${question.operand2} = `);
    if (Number(answer) !== question.result) {
      console.log(`Incorrect. ${question.result}`);
    }
  }

  process.exit();
})();
