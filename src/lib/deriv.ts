export const DERIV_API_URL = 'https://api.derivws.com'
export const DERIV_APP_ID = '33wc03nEpY39kVkVR3s62'

export async function getDerivWebSocketUrl(accountId: string, token: string, type: 'demo' | 'real' = 'demo') {
  try {
    const response = await fetch(`${DERIV_API_URL}/trading/v1/options/accounts/${accountId}/otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Deriv-App-ID': DERIV_APP_ID
      }
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.data?.url ?? null
  } catch {
    return null
  }
}

export async function getDerivAccounts(token: string) {
  try {
    const response = await fetch(`${DERIV_API_URL}/trading/v1/options/accounts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Deriv-App-ID': DERIV_APP_ID
      }
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.data ?? null
  } catch {
    return null
  }
}
