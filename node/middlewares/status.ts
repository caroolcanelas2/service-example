export async function status(ctx: Context, next: () => Promise<any>) {
  const {
    state: { code },
    clients: { status: statusClient },
    vtex: { logger },
  } = ctx

  logger.info({
    message: 'Fetching status',
    code,
    routeId: 'status',
  })

  try {
    const statusResponse = await statusClient.getStatus(code)

    logger.info({
      message: 'Status body received',
      code,
      statusResponse,
      routeId: 'status',
    })

    const {
      headers,
      data,
      status: responseStatus,
    } = await statusClient.getStatusWithHeaders(code)

    logger.info({
      message: 'Status response ready',
      code,
      responseStatus,
      cacheControl: headers['cache-control'],
      routeId: 'status',
    })

    ctx.status = responseStatus
    ctx.body = data
    ctx.set('Cache-Control', headers['cache-control'])
  } catch (error) {
    logger.error({
      message: 'Failed to fetch status',
      code,
      routeId: 'status',
      error: error instanceof Error ? error.message : String(error),
    })

    throw error
  }

  await next()
}
