/**
 * WhatsApp Integration for LATAM DeFi
 * Sends loan notifications via WhatsApp Business API
 */

interface WhatsAppMessage {
  to: string; // Phone number in format: +521234567890
  message: string;
  type: 'loan_approved' | 'repayment_reminder' | 'payment_received' | 'credit_update';
}

interface LoanNotification {
  ensName: string;
  amount: string;
  interestRate: string;
  dueDate: string;
  phoneNumber: string;
}

export class WhatsAppService {
  private apiToken: string;
  private phoneNumberId: string;

  constructor() {
    // These would come from environment variables
    this.apiToken = process.env.WHATSAPP_API_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  }

  /**
   * Send WhatsApp message via Meta Business API
   */
  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    // For demo purposes, we'll use a mock implementation
    // In production, integrate with Meta's WhatsApp Business API
    console.log('📱 WhatsApp Message:', {
      to: message.to,
      message: message.message,
      type: message.type,
    });

    // Mock success
    return true;

    /* Production implementation:
    try {
      const response = await fetch(
        `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: message.to,
            type: 'text',
            text: { body: message.message },
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return false;
    }
    */
  }

  /**
   * Send loan approval notification
   */
  async sendLoanApproval(data: LoanNotification): Promise<boolean> {
    const message = `
🎉 ¡Préstamo Aprobado! / Loan Approved!

Tu préstamo ha sido aprobado en LatamCredit.eth
Your loan has been approved on LatamCredit.eth

📝 Detalles / Details:
• ENS: ${data.ensName}
• Monto / Amount: $${data.amount} USDC
• Tasa / Rate: ${data.interestRate}%
• Fecha límite / Due: ${data.dueDate}

💰 Los fondos están disponibles en tu wallet
Funds are now available in your wallet

🔗 Ver detalles / View details:
https://latamcredit.eth/loans

¡Gracias por usar LatamCredit!
Thank you for using LatamCredit!
    `.trim();

    return this.sendMessage({
      to: data.phoneNumber,
      message,
      type: 'loan_approved',
    });
  }

  /**
   * Send repayment reminder
   */
  async sendRepaymentReminder(data: LoanNotification): Promise<boolean> {
    const message = `
⏰ Recordatorio de Pago / Payment Reminder

Hola! Tienes un pago próximo en LatamCredit.eth
Hi! You have an upcoming payment on LatamCredit.eth

📝 Detalles / Details:
• ENS: ${data.ensName}
• Monto / Amount: $${data.amount} USDC
• Fecha límite / Due: ${data.dueDate}

💳 Pagar ahora / Pay now:
https://latamcredit.eth/pay?ens=${data.ensName}

📱 También puedes escanear el código QR
You can also scan the QR code

Paga a tiempo para mejorar tu score crediticio! 📈
Pay on time to improve your credit score! 📈
    `.trim();

    return this.sendMessage({
      to: data.phoneNumber,
      message,
      type: 'repayment_reminder',
    });
  }

  /**
   * Send payment received confirmation
   */
  async sendPaymentConfirmation(
    phoneNumber: string,
    ensName: string,
    amount: string
  ): Promise<boolean> {
    const message = `
✅ Pago Recibido / Payment Received

Tu pago ha sido procesado exitosamente!
Your payment has been processed successfully!

📝 Detalles / Details:
• ENS: ${ensName}
• Monto / Amount: $${amount} USDC
• Fecha / Date: ${new Date().toLocaleDateString()}

🎯 Tu score crediticio ha mejorado!
Your credit score has improved!

📊 Ver historial / View history:
https://latamcredit.eth/credit

¡Gracias! / Thank you!
    `.trim();

    return this.sendMessage({
      to: phoneNumber,
      message,
      type: 'payment_received',
    });
  }

  /**
   * Send credit score update
   */
  async sendCreditUpdate(
    phoneNumber: string,
    ensName: string,
    oldScore: number,
    newScore: number
  ): Promise<boolean> {
    const emoji = newScore > oldScore ? '📈' : '📉';
    const change = newScore > oldScore ? 'mejorado' : 'actualizado';

    const message = `
${emoji} Score Crediticio ${change}!

Tu score ha sido actualizado en LatamCredit.eth
Your credit score has been updated on LatamCredit.eth

📝 Detalles / Details:
• ENS: ${ensName}
• Score Anterior / Previous: ${oldScore}
• Nuevo Score / New Score: ${newScore}
• Cambio / Change: ${newScore > oldScore ? '+' : ''}${newScore - oldScore}

📊 Ver detalles completos / View full details:
https://latamcredit.eth/credit

${newScore > oldScore ? '¡Sigue así! / Keep it up!' : 'Mejora tu score pagando a tiempo / Improve by paying on time'}
    `.trim();

    return this.sendMessage({
      to: phoneNumber,
      message,
      type: 'credit_update',
    });
  }

  /**
   * Generate WhatsApp payment link
   */
  generatePaymentLink(
    phoneNumber: string,
    ensName: string,
    amount: string
  ): string {
    const message = encodeURIComponent(
      `💰 Pagar a ${ensName}\n\nMonto: $${amount} USDC\n\nLink: https://latamcredit.eth/pay?ens=${ensName}&amount=${amount}`
    );
    return `https://wa.me/${phoneNumber}?text=${message}`;
  }
}

// Export singleton instance
export const whatsappService = new WhatsAppService();

// Helper function to format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present (assume Mexico +52)
  if (!digits.startsWith('52') && digits.length === 10) {
    return `52${digits}`;
  }
  
  return digits;
}

// Demo function to test WhatsApp integration
export async function testWhatsAppIntegration() {
  const testData: LoanNotification = {
    ensName: 'juan.latamcredit.eth',
    amount: '500.00',
    interestRate: '3.0',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    phoneNumber: '+5215512345678',
  };

  console.log('🧪 Testing WhatsApp Integration...');
  
  const results = {
    approval: await whatsappService.sendLoanApproval(testData),
    reminder: await whatsappService.sendRepaymentReminder(testData),
    confirmation: await whatsappService.sendPaymentConfirmation(
      testData.phoneNumber,
      testData.ensName,
      testData.amount
    ),
    creditUpdate: await whatsappService.sendCreditUpdate(
      testData.phoneNumber,
      testData.ensName,
      650,
      680
    ),
  };

  console.log('✅ WhatsApp Test Results:', results);
  return results;
}

