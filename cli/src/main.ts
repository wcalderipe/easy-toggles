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

  const parseList = (val: any) => val.split(',')

  Program
    .command('toggle:evaluate')
    .option('-c, --context <key=value>', 'Context variable', parseContext, [])
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
    .option('-a, --application <foo>', 'Application ID')
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
    .command('criteria:update')
    .option('-a, --application <foo>', 'Application ID')
    .option('-c, --criteria <foo>', 'Criteria ID')
    .option('-n, --name <foo>', 'Criteria name')
    .option('-v, --values <foo,bar,baz>', 'Criteria values', parseList)
    .action(async (cmd) => {
      const { application, criteria, name, values } = cmd
      const query = `
        mutation updateCriteria($input: UpdateApplicationCriteriaInput) {
          updateApplicationCriteria(input: $input) {
            id
            name
            values
          }
        }
      `
      const variables = {
        input: {
          name,
          values,
          applicationId: application,
          criteriaId: criteria
        }
      }
      const response: any = await request('http://127.0.0.1:3000/graphql', query, variables)

      ui.criteriaUpdate(response.updateApplicationCriteria)
    })

  Program
    .parse(process.argv)
}

main()
