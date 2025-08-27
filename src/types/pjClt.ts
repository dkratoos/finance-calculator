// Tipos para calculadora PJ vs CLT

export interface CltData {
  salarioBruto: number
  valeAlimentacao: number
  valeTransporte: number
  planoSaude: number
  outrosBeneficios: number
  anosTrabalho: number // Para cálculo do FGTS acumulado
}

export interface PjData {
  valorMensal: number
  categoriaTributacao: 'MEI' | 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO'
  atividadePrincipal: string
  gastosMensais: number
}

export interface ResultadosComparacao {
  clt: {
    salarioLiquido: number
    inss: number
    irrf: number
    totalBeneficios: number
    fgts: number
    fgtsAcumulado: number
    decimoTerceiro: number
    tercoFerias: number
    receitaLiquidaMensal: number
    receitaLiquidaAnual: number
  }
  pj: {
    faturamentoBruto: number
    impostos: number
    receitaLiquida: number
    receitaLiquidaAnual: number
    aliquotaTotal: number
  }
  diferenca: {
    valorAbsolutoMensal: number
    valorAbsolutoAnual: number
    percentualMensal: number
    percentualAnual: number
    melhorOpcaoMensal: 'CLT' | 'PJ'
    melhorOpcaoAnual: 'CLT' | 'PJ'
  }
  recomendacao: {
    percentualMinimoRecomendado: number
    nivelRisco: 'baixo' | 'medio' | 'alto'
    recomendacaoTexto: string
    justificativa: string
    statusDecisao: 'recomendado' | 'neutro' | 'nao_recomendado'
  }
}

export interface PjMasks {
  salarioBrutoMask: string
  valeAlimentacaoMask: string
  valeTransporteMask: string
  planoSaudeMask: string
  outrosBeneficiosMask: string
  valorMensalPjMask: string
  gastosMensaisPjMask: string
}

// Tabelas de impostos brasileiros 2024
export const TRIBUTOS_PJ = {
  MEI: {
    limite: 81000,
    aliquota: 6.0, // DAS MEI (~6%)
    impostos: ['DAS']
  },
  SIMPLES_NACIONAL: {
    // Anexo III (Serviços)
    faixas: [
      { de: 0, ate: 180000, aliquota: 6.0 },
      { de: 180001, ate: 360000, aliquota: 9.0 },
      { de: 360001, ate: 720000, aliquota: 10.5 },
      { de: 720001, ate: 1800000, aliquota: 14.0 },
      { de: 1800001, ate: 3600000, aliquota: 22.0 },
      { de: 3600001, ate: 4800000, aliquota: 33.0 }
    ]
  },
  LUCRO_PRESUMIDO: {
    // ISS (2-5%) + PIS (0.65%) + COFINS (3%) + IRPJ (15%) + CSLL (9%) + adicional IRPJ (10% se > 20k/mês)
    issAliquota: 3.0, // média municipal
    pisAliquota: 0.65,
    cofinsAliquota: 3.0,
    irpjAliquota: 15.0,
    csllAliquota: 9.0,
    adicionalIrpj: 10.0, // sobre o que exceder R$ 20.000/mês
    baseCalculoIrpj: 32.0, // 32% da receita bruta para serviços
    baseCalculoCsll: 32.0
  }
} as const

export type CategoriaTributaria = keyof typeof TRIBUTOS_PJ
export type AtividadePrincipal = 'Tecnologia da Informação' | 'Consultoria' | 'Design e Marketing' | 'Engenharia' | 'Educação' | 'Outros Serviços'
export type MelhorOpcao = 'CLT' | 'PJ'
export type NivelRisco = 'baixo' | 'medio' | 'alto'
export type StatusDecisao = 'recomendado' | 'neutro' | 'nao_recomendado'
