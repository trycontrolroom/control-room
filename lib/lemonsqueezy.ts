const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID

interface LemonSqueezyAffiliate {
  id: string
  attributes: {
    email: string
    commission_rate: number
    total_referrals: number
    total_revenue: string
    balance: string
  }
}

interface LemonSqueezyReferral {
  id: string
  attributes: {
    referrer_id: string
    customer_email: string
    order_total: string
    commission_amount: string
    status: string
    created_at: string
  }
}

class LemonSqueezyService {
  private baseUrl = 'https://api.lemonsqueezy.com/v1'
  
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.api+json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`LemonSqueezy API error: ${response.status}`)
    }
    
    return response.json()
  }
  
  async createAffiliate(email: string, name: string) {
    try {
      const response = await this.makeRequest('/affiliates', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'affiliates',
            attributes: {
              email,
              name,
              commission_rate: 50, // 50% commission
              store_id: LEMONSQUEEZY_STORE_ID
            }
          }
        })
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to create LemonSqueezy affiliate:', error)
      throw error
    }
  }
  
  async getAffiliateStats(affiliateId: string) {
    try {
      const [affiliateResponse, referralsResponse] = await Promise.all([
        this.makeRequest(`/affiliates/${affiliateId}`),
        this.makeRequest(`/affiliates/${affiliateId}/referrals`)
      ])
      
      const affiliate: LemonSqueezyAffiliate = affiliateResponse.data
      const referrals: LemonSqueezyReferral[] = referralsResponse.data || []
      
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)
      
      const currentMonthReferrals = referrals.filter(referral => 
        new Date(referral.attributes.created_at) >= currentMonth
      )
      
      const currentMonthEarnings = currentMonthReferrals.reduce((sum, referral) => 
        sum + parseFloat(referral.attributes.commission_amount), 0
      )
      
      return {
        totalReferrals: affiliate.attributes.total_referrals,
        totalRevenue: parseFloat(affiliate.attributes.total_revenue),
        totalEarnings: parseFloat(affiliate.attributes.balance),
        currentMonthEarnings,
        referrals
      }
    } catch (error) {
      console.error('Failed to get affiliate stats:', error)
      throw error
    }
  }
  
  async trackReferral(affiliateCode: string, customerEmail: string, orderAmount: number) {
    try {
      const response = await this.makeRequest('/referrals', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'referrals',
            attributes: {
              referrer_code: affiliateCode,
              customer_email: customerEmail,
              order_total: orderAmount.toString(),
              store_id: LEMONSQUEEZY_STORE_ID
            }
          }
        })
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to track referral:', error)
      throw error
    }
  }
}

export const lemonSqueezy = new LemonSqueezyService()
