import * as fs from 'node:fs'
import * as path from 'node:path'

import type { Linter } from 'eslint'

import createESLintConfig from '@vue/create-eslint-config'

import sortDependencies from './sortDependencies'
import deepMerge from './deepMerge'

import eslintTemplatePackage from '../template/eslint/package.json' assert { type: 'json' }
const eslintDeps = eslintTemplatePackage.devDependencies

export default function renderEslint(
  rootDir,
  { needsTypeScript, needsCypress, needsCypressCT, needsPrettier, needsPlaywright }
) {
  const additionalConfig: Linter.Config = {}
  const additionalDependencies = {}

  if (needsCypress) {
    additionalConfig.overrides = [
      {
        files: needsCypressCT
          ? [
              '**/__tests__/*.{cy,spec}.{js,ts,jsx,tsx}',
              'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
              'cypress/support/**/*.{js,ts,jsx,tsx}'
            ]
          : ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
        extends: ['plugin:cypress/recommended']
      }
    ]

    additionalDependencies['eslint-plugin-cypress'] = eslintDeps['eslint-plugin-cypress']
  }

  if (needsPlaywright) {
    additionalConfig.overrides = [
      {
        files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}'],
        extends: ['plugin:playwright/recommended']
      }
    ]

    additionalDependencies['eslint-plugin-playwright'] = eslintDeps['eslint-plugin-playwright']
  }

  const { pkg, files } = createESLintConfig({
    vueVersion: '3.x',
    // we currently don't support other style guides
    styleGuide: 'default',
    hasTypeScript: needsTypeScript,
    needsPrettier,

    additionalConfig,
    additionalDependencies
  })

  const scripts: Record<string, string> = {
    // Note that we reuse .gitignore here to avoid duplicating the configuration
    lint: needsTypeScript
      ? 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore'
      : 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore'
  }

  // Theoretically, we could add Prettier without requring ESLint.
  // But it doesn't seem to be a good practice, so we just leave it here.
  if (needsPrettier) {
    // Default to only format the `src/` directory to avoid too much noise, and
    // the need for a `.prettierignore` file.
    // Users can still append any paths they'd like to format to the command,
    // e.g. `npm run format cypress/`.
    scripts.format = 'prettier --write src/'
  }

  // update package.json
  const packageJsonPath = path.resolve(rootDir, 'package.json')
  const existingPkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const updatedPkg = sortDependencies(deepMerge(deepMerge(existingPkg, pkg), { scripts }))
  fs.writeFileSync(packageJsonPath, JSON.stringify(updatedPkg, null, 2) + '\n', 'utf-8')

  // write to .eslintrc.cjs, .prettierrc.json, etc.
  for (const [fileName, content] of Object.entries(files)) {
    if (fileName === '.eslintrc.cjs') {
      continue
    }
    const fullPath = path.resolve(rootDir, fileName)
    fs.writeFileSync(fullPath, content as string, 'utf-8')
  }
}
