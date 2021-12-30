import readline from 'readline';
import { Command } from 'commander';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ColorFgRed = '\x1b[31m';
const ColorFgGreen = '\x1b[32m';
const ColorReset = '\x1b[0m';

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

class Timing {
  private startTime: number = 0;
  start() {
    this.startTime = performance.now();
  }
  end(): string {
    return `${Math.floor((performance.now() - this.startTime) / 100) / 10}s`;
  }
}

const COUNTDOWN_START = 3;
const OPERATIONS = (['+', '-', 'x', '/'] as const).slice();
const DEFAULT_QUESTION_COUNT = 20;

interface Question {
  operand1: number;
  operand2: number;
  operation: typeof OPERATIONS[number];
  result: number;
}

const program = new Command();
const options = program
  .option('-c, --question-count <count>', 'Number of questions that will be asked', String(DEFAULT_QUESTION_COUNT))
  .parse(process.argv)
  .opts();

(async () => {
  const questionCount = Number(options.questionCount) || DEFAULT_QUESTION_COUNT;
  console.log(`${questionCount} Questions`);

  const questions = Array(questionCount).fill(0).map<Question>(() => {
    const operation = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
    switch(operation) {
      case '+': {
        const operand1 = getRandomInt(100);
        const operand2 = getRandomInt(100);
        const result = operand1 + operand2;
        return { operand1, operand2, operation, result };
      }
      case '-': {
        const result = getRandomInt(100);
        const operand2 = getRandomInt(100);
        const operand1 = result + operand2;
        return { operand1, operand2, operation, result };
      }
      case 'x': {
        const operand1 = getRandomInt(100);
        const operand2 = getRandomInt(10);
        const result = operand1 * operand2;
        return { operand1, operand2, operation, result };
      }
      case '/': {
        const result = getRandomInt(100, true);
        const operand2 = getRandomInt(10, true);
        const operand1 = result * operand2;
        return { operand1, operand2, operation, result };
      }
    }
  });

  for (let i = COUNTDOWN_START; i > 0; i--) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine(0);
    process.stdout.write(`Get Ready... ${i}`);
    await new Promise(res => setTimeout(res, 1000));
  }

  const overallTiming = new Timing();
  overallTiming.start();

  for (const question of questions) {
    const questionTiming = new Timing();
    questionTiming.start();

    const questionStr = `${question.operand1} ${question.operation} ${question.operand2} = `;
    const answer = await askQuestion(questionStr);

    const color = Number(answer) !== question.result ? ColorFgRed : ColorFgGreen;

    process.stdout.moveCursor(0, -1);
    process.stdout.clearScreenDown();
    console.log(`${color}${questionStr}${answer}${ColorReset} (${questionTiming.end()})`)
  }

  console.log(`\nTime: ${overallTiming.end()}`);
  
  process.exit();
})();
