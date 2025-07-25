export interface AlertConfig {
  type: 'email' | 'sms' | 'slack'
  recipient: string
  message: string
  subject?: string
}

export class CourierService {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COURIER_API_KEY || 'mock-api-key'
  }

  async sendAlert(config: AlertConfig): Promise<boolean> {
    try {
      console.log('Sending alert via Courier:', config)
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return true
    } catch (error) {
      console.error('Failed to send alert:', error)
      return false
    }
  }

  async sendPolicyAlert(policyName: string, agentName: string, triggerValue: number, recipient: string): Promise<boolean> {
    const message = `Policy "${policyName}" triggered for agent "${agentName}". Trigger value: ${triggerValue}`
    
    return this.sendAlert({
      type: 'email',
      recipient,
      subject: `Control Room Alert: ${policyName}`,
      message
    })
  }

  async sendAgentDownAlert(agentName: string, recipient: string): Promise<boolean> {
    const message = `Agent "${agentName}" is down and requires immediate attention.`
    
    return this.sendAlert({
      type: 'email',
      recipient,
      subject: `Control Room Alert: Agent Down`,
      message
    })
  }
}

export const courier = new CourierService()
