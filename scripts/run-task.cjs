#!/usr/bin/env node
const { spawnSync } = require('node:child_process')

const TASKS = {
  lint: {
    command: 'npx',
    args: ['next', 'lint'],
    flag: 'SKIP_LINT',
    label: 'ESLint',
  },
  typecheck: {
    command: 'npx',
    args: ['tsc', '--noEmit'],
    flag: 'SKIP_TYPES',
    label: 'TypeScript type-check',
  },
}

function run() {
  const task = process.argv[2]
  if (!task || !TASKS[task]) {
    console.error('[preflight] Usage: node scripts/run-task.cjs <lint|typecheck>')
    process.exit(1)
  }

  const { command, args, flag, label } = TASKS[task]
  const restricted = process.env.RESTRICTED_ENV === '1' || process.env[flag] === '1'

  if (restricted) {
    console.warn(
      `[preflight] ${label} skipped because ${
        process.env.RESTRICTED_ENV === '1' ? 'RESTRICTED_ENV=1' : `${flag}=1`
      }. Run this task locally before merging.`,
    )
    process.exit(0)
  }

  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' })

  if (result.error) {
    console.error(`[preflight] Failed to execute ${label}: ${result.error.message}`)
    process.exit(result.status ?? 1)
  }

  process.exit(result.status ?? 0)
}

run()
