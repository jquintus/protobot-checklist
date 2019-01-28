const https = require('https');
const axios = require('axios');

// Checks API example
// See: https://developer.github.com/v3/checks/ to learn more
module.exports = app => {
  app.on(['check_suite.requested', 'check_run.*'], check)
  // app.on('check_suite', check)

  async function check (context) {
    const prUrl = context.payload.check_suite.pull_requests[0].url

    console.log("=====================")
    console.log(context.payload.action)
    console.log(prUrl)
    console.log("=====================")
    // console.log(context)
    // Do stuff
    const { head_branch, head_sha } = context.payload.check_suite

    axios.get(prUrl).then(resp => 
    {
      // Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}
      body = resp.data.body
      lines = body.split("\r\n");
      
      console.log("body:")
      console.log(lines)

      matches = lines.map(line => line.match(/\[\s\s*\].*/))
                     .filter(match => match)
                     .reduce(function(a, b){ return a.concat(b); })
      // matches = body.match(/\[\s\s*\]/)

      if (matches)
      {
          console.log("failed!!!")
          console.log(matches)
          return context.github.checks.create(context.repo({
            name: 'Checklist',
            head_branch,
            head_sha,
            status: 'completed',
            conclusion: 'failure',
            completed_at: new Date(),
            output: {
              title: 'Checklist!',
              summary: matches.join("\r\n")
            }
          }))
      }
      else
      {
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
    })
  }

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
