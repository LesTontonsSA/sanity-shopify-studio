import { IncomingHttpHeaders } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import parseJsonWithRawBody from '../../../../middleware/parseJsonWithRawBody'
import requirePost from '../../../../middleware/requirePost'
import verifyShopifyWebhook from '../../../../middleware/verifyShopifyWebhook'
import markDeletedProductAndVariants from '../../../../services/sanity/markDeletedProductAndVariants'
import { ShopifyWebhookBody } from '../../../../services/sanity/types'
import runMiddleware from '../../../../utils/runMiddleware'

const TOPIC = 'products/delete'

// Disable default body parsing, required to obtain raw body to validate Shopify webhooks
export const config = {
  api: { bodyParser: false }
}

/**
 * We return 200 status code to indicate to Shopify that the webhook was successfully
 * received - even in the case of errors.
 *
 * Shopify will automatically delete webhooks if errors (any non-2xx code) or no response is
 * returned after multiple consecutive retries.
 *
 * The only exception to this is if non-POST requests are received, as Shopify will always send POST requests.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Middleware:
  // - only allow POST requests
  await runMiddleware(req, res, requirePost)
  // - parse JSON body and include raw body in request
  await runMiddleware(req, res, parseJsonWithRawBody)
  // - verify integrity of Shopify webhook (must run after `parseJsonWithRawBody`)
  await runMiddleware(req, res, verifyShopifyWebhook)

  // prettier-ignore
  const { body, headers } = <{ body: ShopifyWebhookBody; headers: IncomingHttpHeaders }>req

  // Get shopify topic (action)
  const shopifyTopic = String(headers['x-shopify-topic'])

  if (shopifyTopic !== TOPIC) {
    return res.status(200).send('No valid x-shopify-topic header was found')
  }

  // Created documents in sanity will use the same shopify ID
  const documentId = Number(body.id)
  await markDeletedProductAndVariants(documentId)

  return res.status(200).send('Product deleted')
}
