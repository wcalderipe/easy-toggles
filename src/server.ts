import { app } from './app'

const port = process.env.PORT || '3000'

app.listen(port, () => {
  // tslint:disable-next-line
  console.log(`server listening at port ${port}`)
})
