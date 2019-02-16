import { OK } from 'http-status'

export const expectErrorResponse = ({
  status,
  body,
  expectedMessage
}: {
  status: number
  body: any
  expectedMessage: string
}) => {
  expect(status).toEqual(OK)
  expect(body.errors).toHaveLength(1)
  expect(body.errors[0]).toMatchObject({
    message: expectedMessage
  })
}
