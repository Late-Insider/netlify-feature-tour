const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { parse } = require('date-fns')

const projectRoot = path.resolve(__dirname, '..')

function loadModule(tsPath) {
  const code = fs.readFileSync(tsPath, 'utf8')
  const transpiled = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2019,
    },
    fileName: tsPath,
  })

  const module = { exports: {} }
  const dir = path.dirname(tsPath)

  function localRequire(specifier) {
    if (specifier.startsWith('@/')) {
      const relative = specifier.replace(/^@\//, '')
      const targetBase = path.resolve(projectRoot, relative)
      return resolveWithExtensions(targetBase)
    }

    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const targetBase = path.resolve(dir, specifier)
      return resolveWithExtensions(targetBase)
    }

    return require(specifier)
  }

  function resolveWithExtensions(basePath) {
    const candidates = [
      `${basePath}.ts`,
      `${basePath}.tsx`,
      `${basePath}.js`,
      `${basePath}/index.ts`,
      `${basePath}/index.tsx`,
      `${basePath}/index.js`,
    ]

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        if (candidate.endsWith('.ts') || candidate.endsWith('.tsx')) {
          return loadModule(candidate)
        }
        return require(candidate)
      }
    }

    throw new Error(`Cannot resolve module: ${basePath}`)
  }

  const wrapped = new Function('require', 'module', 'exports', '__dirname', '__filename', transpiled.outputText)
  wrapped(localRequire, module, module.exports, dir, tsPath)
  return module.exports
}

function runNewsletterDataAssertions() {
  const { newsletterArticles } = loadModule(path.resolve(projectRoot, 'lib/newsletter-articles.tsx'))

  assert.equal(newsletterArticles[0].date, 'October 19, 2025', 'Latest issue should be October 19, 2025')

  const formatString = 'MMMM d, yyyy'
  const dayInMs = 1000 * 60 * 60 * 24

  for (let index = 0; index < newsletterArticles.length - 1; index += 1) {
    const current = parse(newsletterArticles[index].date, formatString, new Date())
    const next = parse(newsletterArticles[index + 1].date, formatString, new Date())
    const diff = Math.round((current.getTime() - next.getTime()) / dayInMs)

    assert.equal(diff, 7, `Issues at index ${index} and ${index + 1} should be seven days apart`)
  }

  const slugs = new Set(newsletterArticles.map((article) => article.slug))
  assert.equal(slugs.size, newsletterArticles.length, 'All newsletter slugs should be unique')
}

function runWeeklyInsightsSnapshot() {
  const WeeklyInsights = loadModule(path.resolve(projectRoot, 'components/weekly-insights.tsx'))
  const Component = WeeklyInsights.default || WeeklyInsights
  const markup = renderToStaticMarkup(React.createElement(Component))

  const snapshotPath = path.resolve(__dirname, '__snapshots__', 'weekly-insights.snap')

  if (process.env.UPDATE_SNAPSHOTS === '1' || !fs.existsSync(snapshotPath)) {
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true })
    fs.writeFileSync(snapshotPath, markup)
    return
  }

  const expected = fs.readFileSync(snapshotPath, 'utf8')
  assert.equal(markup, expected, 'WeeklyInsights snapshot should match the stored markup')
}

function runSubscriberInsertPayloadTests() {
  const supabase = loadModule(path.resolve(projectRoot, 'lib/supabase.ts'))
  const { buildSubscriberInsertPayload } = supabase

  const withSource = buildSubscriberInsertPayload({
    email: 'test@example.com',
    category: 'newsletter',
    status: 'pending',
    source: 'landing-page',
    hasSourceColumn: true,
  })

  assert.equal(withSource.source, 'landing-page', 'Should include source when column is available')

  const withoutSource = buildSubscriberInsertPayload({
    email: 'test@example.com',
    category: 'newsletter',
    status: 'pending',
    source: 'landing-page',
    hasSourceColumn: false,
  })

  assert.equal(
    Object.prototype.hasOwnProperty.call(withoutSource, 'source'),
    false,
    'Should omit source when column is missing',
  )
}

runNewsletterDataAssertions()
runWeeklyInsightsSnapshot()
runSubscriberInsertPayloadTests()

console.log('All newsletter tests passed.')
