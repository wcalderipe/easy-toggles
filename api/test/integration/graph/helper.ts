import { OK } from 'http-status'

const expectApplicationNotFound = ({ status, body }) => {
  expect(status).toEqual(OK)
  expect(body.errors).toHaveLength(1)
  expect(body.errors[0]).toMatchObject({
    message: `Could not resolve to an Application with ID 'you-will-never-find-me'.`
  })
}

export { expectApplicationNotFound }
