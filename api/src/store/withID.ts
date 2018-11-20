import * as uuid from 'uuid/v4'

const withID = <T>(object: T): T => {
  return Object.assign(object, { id: uuid() })
}

export { withID }
