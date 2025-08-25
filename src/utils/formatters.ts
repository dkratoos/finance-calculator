/**
 * Utilitários para formatação de valores brasileiros
 */

/**
 * Formata um valor numérico como moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Formata um valor numérico como porcentagem brasileira
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

/**
 * Formata um número com separadores brasileiros (ponto para milhares, vírgula para decimais)
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Remove formatação de moeda e retorna apenas o número
 */
export const parseCurrency = (value: string): number => {
  return parseFloat(
    value
      .replace(/[^\d,-]/g, '') // Remove tudo exceto dígitos, vírgula e hífen
      .replace(',', '.') // Substitui vírgula por ponto para conversão
  ) || 0
}

/**
 * Formata um período em anos e meses
 */
export const formatPeriod = (months: number): string => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (years === 0) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`
  }

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`
  }

  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`
}

/**
 * Valida se um valor é um número válido
 */
export const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value >= 0
}

/**
 * Aplica máscara de moeda brasileira em tempo real
 */
export const applyCurrencyMask = (value: string): string => {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, '')

  // Se não há dígitos, retorna vazio
  if (!digits) return ''

  // Converte para centavos
  const cents = parseInt(digits) / 100

  // Formata como moeda sem o símbolo R$
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cents)
}

/**
 * Aplica máscara de porcentagem
 */
export const applyPercentageMask = (value: string): string => {
  // Remove tudo que não é dígito ou vírgula/ponto
  const cleaned = value.replace(/[^\d,\.]/g, '')

  // Substitui vírgula por ponto
  const normalized = cleaned.replace(',', '.')

  // Limita a 2 casas decimais
  const parts = normalized.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts[1]
  }

  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2)
  }

  return normalized
}
