console.log("hello world")
// Checks API example
// See: https://developer.github.com/v3/checks/ to learn more
module.exports = app => {
  // app.on(['check_suite.*', 'check_run.*'], check)
  app.on('check_suite', check)

  async function check (context) {
    console.log("hello world")
    // Do stuff
    const { head_branch, head_sha } = context.payload.check_suite

    // Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}
    return context.github.checks.create(context.repo({
      name: 'Checklist',
      head_branch,
      head_sha,
      status: 'completed',
      conclusion: 'success',
      completed_at: new Date(),
      output: {
        title: 'Checklist!',
        summary: 'All *items* checked'
      }
    }))
  }

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
