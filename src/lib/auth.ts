export const DERIV_CLIENT_ID = '33wc03nEpY39kVkVR3s62'
export const REDIRECT_URI = 'https://swifttrade.pro/callback'

export async function loginWithDeriv() {
  const array = crypto.getRandomValues(new Uint8Array(64))
  const codeVerifier = Array.from(array)
    .map(v => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[v % 66])
    .join('')

  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const state = crypto.getRandomValues(new Uint8Array(16))
    .reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')

  sessionStorage.setItem('pkce_code_verifier', codeVerifier)
  sessionStorage.setItem('oauth_state', state)

  const url = `https://auth.deriv.com/oauth2/auth?response_type=code&client_id=${DERIV_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=trade+account_manage&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`

  window.location.href = url
}
