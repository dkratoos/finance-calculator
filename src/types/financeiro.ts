// Tipos para calculadoras financeiras

export interface FinanciamentoData {
  valorImovel: number
  valorEntrada: number
  valorFinanciamento: number
  taxaJurosAnual: number
  quantidadeParcelas: number
  sistemaAmortizacao: 'SAC' | 'PRICE'
  rendaFamiliar?: number
}

export interface ResultadosFinanciamento {
  rendaDeclaredaMinima: number
  valorTotalPago: number
  valorJurosPagos: number
  valorParcela: number
  impostosAquisicao: number
  percentualRenda: number
}

export interface Calculator {
  id: string
  title: string
  description: string
  route: string
  icon: string
  gradient: string
  available: boolean
}

export interface ImpostosRegionais {
  itbi: number        // Imposto sobre Transmissão de Bens Imóveis
  cartorio: number    // Custos de cartório e registro
  taxasDiversas: number // Outras taxas municipais
}

// Constantes financeiras brasileiras
export const LIMITES_FINANCIAMENTO = {
  PERCENTUAL_RENDA_MAXIMO: 30, // 30% da renda comprometida
  ENTRADA_MINIMA: 20, // 20% mínimo de entrada
  PRAZO_MINIMO: 5, // 5 anos mínimo
  PRAZO_MAXIMO: 35, // 35 anos máximo
  TAXA_JUROS_MINIMA: 3, // 3% ao ano
  TAXA_JUROS_MAXIMA: 25 // 25% ao ano
} as const

export const IMPOSTOS_PADRAO: ImpostosRegionais = {
  itbi: 2.0,        // 2% ITBI (média nacional)
  cartorio: 1.0,    // 1% cartório
  taxasDiversas: 0.5 // 0.5% outras taxas
} as const
