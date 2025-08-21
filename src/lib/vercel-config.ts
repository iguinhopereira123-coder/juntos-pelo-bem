// Configuração específica para Vercel
export const VERCEL_CONFIG = {
  // API Key da PushinPay (em produção, usar variáveis de ambiente)
  PUSHINPAY_API_KEY: "43550|QC51bcICP2BG9ZGBEDWF6cF1IcUnDfN0tMdhFeq82618ef54",
  
  // Ambiente
  ENVIRONMENT: 'production',
  
  // URLs da API
  PUSHINPAY_BASE_URL: 'https://api.pushinpay.com',
  PUSHINPAY_SANDBOX_URL: 'https://sandbox.pushinpay.com',
  
  // Configurações de CORS
  CORS_MODE: 'cors' as RequestMode,
  CREDENTIALS: 'omit' as RequestCredentials,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'X-API-Version': '2024-01-01',
  },
  
  // Timeout para requisições
  REQUEST_TIMEOUT: 10000, // 10 segundos
  
  // Configurações de fallback
  FALLBACK_ENABLED: true,
  FALLBACK_TIMEOUT: 5000, // 5 segundos
};

// Função para detectar se está rodando na Vercel
export function isVercelEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.location.hostname.includes('vercel.app') ||
         window.location.hostname.includes('localhost') ||
         window.location.hostname === '127.0.0.1';
}

// Função para obter a API Key baseada no ambiente
export function getApiKey(): string {
  // Em produção na Vercel, tentar usar variável de ambiente
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    // Se houver variável de ambiente configurada na Vercel
    const envKey = (window as any).__VERCEL_ENV_VARS?.VITE_PUSHINPAY_API_KEY;
    if (envKey) return envKey;
  }
  
  // Fallback para a chave padrão
  return VERCEL_CONFIG.PUSHINPAY_API_KEY;
}

// Função para configurar headers de autorização
export function getAuthHeaders(): Record<string, string> {
  return {
    ...VERCEL_CONFIG.DEFAULT_HEADERS,
    'Authorization': `Bearer ${getApiKey()}`,
  };
}
