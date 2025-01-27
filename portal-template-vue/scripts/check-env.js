import chalk from 'chalk'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function checkEnvFile() {
  const envPath = resolve(__dirname, '../.env')
  const envExamplePath = resolve(__dirname, '../.env.example')

  if (!existsSync(envPath)) {
    console.log(chalk.red('Error: Missing .env file!'))
    console.log(chalk.yellow('Please follow these steps:'))
    console.log(chalk.yellow('1. Copy .env.example file to .env'))
    console.log(
      chalk.yellow(
        '2. Update the environment variables in .env file with your actual configuration'
      )
    )

    if (existsSync(envExamplePath)) {
      console.log(chalk.green('\nNote: .env.example file exists and is ready to be copied'))
    } else {
      console.log(
        chalk.red(
          '\nWarning: .env.example file is also missing. Please create the environment configuration file first'
        )
      )
    }

    process.exit(1)
  }
}

// Execute check
checkEnvFile()
