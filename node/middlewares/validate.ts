import { UserInputError } from '@vtex/api'

export async function validate(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: {
      route: { params },
      logger,
    },
  } = ctx

  const { code } = params

  logger.info({
    message: 'Validating status code',
    code,
    routeId: 'status',
  })

  if (!code) {
    logger.warn({
      message: 'Status code is required',
      routeId: 'status',
    })
    throw new UserInputError('Code is required') // Wrapper for a Bad Request (400) HTTP Error. Check others in https://github.com/vtex/node-vtex-api/blob/fd6139349de4e68825b1074f1959dd8d0c8f4d5b/src/errors/index.ts
  }

  const codeNumber = parseInt(code as string, 10)

  if (Number.isNaN(codeNumber)) {
    logger.warn({
      message: 'Status code is not a number',
      code,
      routeId: 'status',
    })
  }

  ctx.state.code = codeNumber

  await next()
}
