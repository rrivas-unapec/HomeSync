import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SOURCE_DIR = join(ROOT, 'src')
const EXTENSIONS = new Set(['.ts', '.tsx'])

function collectFiles(dir) {
  const found = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      found.push(...collectFiles(full))
    } else if (EXTENSIONS.has(extname(entry))) {
      found.push(full)
    }
  }
  return found
}

function lineOf(source, position) {
  let line = 1
  for (let i = 0; i < position && i < source.length; i += 1) {
    if (source[i] === '\n') line += 1
  }
  return line
}

function findComments(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.JSX, source)

  const violations = []
  let token = scanner.scan()
  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      const start = scanner.getTokenPos()
      violations.push({
        line: lineOf(source, start),
        text: scanner.getTokenText().replace(/\s+/g, ' ').slice(0, 60),
      })
    }
    token = scanner.scan()
  }
  return violations
}

const files = collectFiles(SOURCE_DIR)
let total = 0

for (const file of files) {
  for (const violation of findComments(file)) {
    total += 1
    process.stdout.write(
      `${relative(ROOT, file)}:${violation.line}  comentario prohibido: ${violation.text}\n`,
    )
  }
}

if (total > 0) {
  process.stdout.write(
    `\n${total} comentario(s) encontrado(s). El codigo no debe llevar comentarios.\n`,
  )
  process.exit(1)
}

process.stdout.write(`Sin comentarios en ${files.length} archivos.\n`)
