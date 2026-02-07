import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type Res = { status: (n: number) => Res; json: (o: object) => void };

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface OrderPayload {
  orderId: string;
  email: string;
  orderItems: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cardLast4: string;
  cardBrand: string;
}

function getCardBrand(cardNumber: string): string {
  const clean = cardNumber.replace(/\s/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (clean.startsWith('5') || clean.startsWith('2')) return 'Mastercard';
  if (clean.startsWith('3')) return 'American Express';
  if (clean.startsWith('6')) return 'Discover';
  return 'Card';
}

export default async function handler(req: { method?: string; body?: OrderPayload | string }, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body: OrderPayload | undefined;
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body) as OrderPayload;
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    } else {
      body = req.body;
    }

    if (!body?.email || !body?.orderId || !body?.orderItems || !Array.isArray(body.orderItems)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const { orderId, email, orderItems, subtotal, shipping, tax, total, address, cardLast4, cardBrand } = body;
    const formatId = (id: string) => `#${id.replace(/-/g, '').toUpperCase().slice(0, 8)}`;
    const brand = cardBrand || getCardBrand('');
    const last4 = cardLast4 || '****';

    const itemsHtml = orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e5eb;">
          <span style="font-weight: 500; color: #181d25;">${item.name}</span>
          <span style="color: #6c727f; font-size: 14px;"> × ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e0e5eb; text-align: right; font-weight: 600; color: #181d25;">$${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #181d25;">
            HTS <span style="color: #f55266;">SWAG</span>
          </h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #6c727f;">ORDER ${formatId(orderId)}</p>
        </div>
        
        <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #181d25; text-align: center;">
          Thank you for your purchase!
        </h2>
        <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4e5562; text-align: center;">
          We're getting your order ready. Keep an eye out for order status updates.
        </p>
        
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://htswag.net" style="display: inline-block; padding: 12px 24px; background: #f55266; color: white; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">View your order</a>
          <span style="margin: 0 8px; color: #9ca3af;">or</span>
          <a href="https://htswag.net" style="color: #f55266; font-weight: 500; text-decoration: none;">Visit our store</a>
        </div>

        <h3 style="margin: 24px 0 12px; font-size: 16px; font-weight: 600; color: #181d25;">Order summary</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
          ${itemsHtml}
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;"> 
          <tr><td style="padding: 6px 0; color: #6c727f;">Subtotal</td><td style="text-align: right; padding: 6px 0;">$${subtotal.toFixed(2)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6c727f;">Shipping</td><td style="text-align: right; padding: 6px 0;">$${shipping.toFixed(2)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6c727f;">Taxes</td><td style="text-align: right; padding: 6px 0;">$${tax.toFixed(2)}</td></tr>
          <tr><td style="padding: 12px 0; font-weight: 700; font-size: 18px; color: #181d25;">Total</td><td style="text-align: right; padding: 12px 0; font-weight: 700; font-size: 18px;">$${total.toFixed(2)} USD</td></tr>
        </table>

        <h3 style="margin: 24px 0 12px; font-size: 16px; font-weight: 600; color: #181d25;">Customer information</h3>
        <p style="margin: 0 0 4px; font-size: 14px; color: #4e5562;">${address.firstName} ${address.lastName}</p>
        <p style="margin: 0 0 4px; font-size: 14px; color: #4e5562;">${address.address}</p>
        <p style="margin: 0 0 16px; font-size: 14px; color: #4e5562;">${address.city}, ${address.state} ${address.zipCode}</p>
        <p style="margin: 0 0 4px; font-size: 14px; color: #4e5562;">${address.country}</p>

        <h3 style="margin: 24px 0 12px; font-size: 16px; font-weight: 600; color: #181d25;">Payment</h3>
        <p style="margin: 0; font-size: 14px; color: #4e5562;">
          <span style="display: inline-block; padding: 4px 8px; background: #f5f7fa; border-radius: 4px; font-weight: 600;">${brand} ending with ${last4}</span>
        </p>

        <hr style="border: none; border-top: 1px solid #e0e5eb; margin: 24px 0;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
          © ${new Date().getFullYear()} HTS Swag · Premium Merchandise & Gift Cards
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { error } = await resend.emails.send({
      from: 'HTS Swag <orders@htswag.net>',
      to: [email.trim().toLowerCase()],
      subject: `Order ${formatId(orderId)} confirmed — HTS Swag`,
      html,
    });

    if (error) {
      console.error('Order confirmation email error:', error);
      return res.status(500).json({ error: 'Failed to send confirmation email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send order confirmation error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
