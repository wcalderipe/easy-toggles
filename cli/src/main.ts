import * as Program from 'commander'
import { request } from 'graphql-request'
import * as ui from './ui'

const main = (): void => {
  const parseContext = (val: any, context: any) => {
    const [name, value] = val.split('=')

    return [
      ...context,
      { name, value }
    ]
  }

  Program
    .command('toggle:evaluate')
    .option('-c, --context <context>', 'Context variable', parseContext, [])
    .option('-a, --application <application>', 'Application ID')
    .action(async (cmd) => {
      const { application, context } = cmd
      const query = `
        query evaluate ($applicationId: ID!, $context: [ContextInput!]!) {
          toggle(
            applicationId: $applicationId,
            context: $context
          ) {
            name
            isActive
          }
        }
      `
      const variables = {
        applicationId: application,
        context
      }
      const response: { toggle: any } = await request('http://127.0.0.1:3000/graphql', query, variables)

      ui.toggleEvaluate({ application, toggle: response.toggle })
    })

  Program
    .command('application:show')
    .option('-a, --application <application>', 'Application ID')
    .action(async (cmd) => {
      const { application } = cmd
      const query = `
        query findApplication($applicationId: ID!) {
          application(id: $applicationId) {
            name,
            features {
              name,
              criterias {
                name,
                values
              }
            }
          }
        }
      `
      const variables = {
        applicationId: application,
      }
      const response: any = await request('http://127.0.0.1:3000/graphql', query, variables)

      ui.applicationShow({ application: response.application })
    })


  Program
    .parse(process.argv)
}

main()
