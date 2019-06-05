const { merge } = require('../lib')
const path = require('path')

describe('merge', () => {
  test('merges configs', async () => {
    const report = await merge({
      reportDir: path.resolve(__dirname, './mochawesome-report'),
    })
    const suites = report.results

    expect(report.stats).toMatchSnapshot({
      start: expect.any(String),
      end: expect.any(String),
    })
    expect(suites.length).toBe(3)

    expect(suites[0].tests.length).toBe(2)
    expect(suites[0].passes.length).toBe(2)
    expect(suites[0].failures.length).toBe(0)

    expect(suites[1].tests.length).toBe(1)
    expect(suites[1].passes.length).toBe(0)
    expect(suites[1].failures.length).toBe(1)

    expect(suites[2].tests.length).toBe(3)
    expect(suites[2].passes.length).toBe(1)
    expect(suites[2].failures.length).toBe(2)
  })

  test('throws when invalid directory provided', async () => {
    const dirname = './invalid-directory'
    const dir = path.resolve(process.cwd(), dirname)
    await expect(merge({ reportDir: dirname })).rejects.toEqual(
      new Error(`Directory ${dir} does not exist`)
    )
  })

  test('defaults to mochawesome-report directory', async () => {
    const dir = path.resolve(process.cwd(), 'mochawesome-report')
    await expect(merge()).rejects.toEqual(
      new Error(`Directory ${dir} does not exist`)
    )
  })
})
