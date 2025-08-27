// Tipos para calculadora de Reserva de Emergência

export interface ReservaEmergenciaData {
  gastosMensaisEssenciais: number
  valorJaReservado: number
  metaMesesReserva: number
  valorMensalPoupanca: number
}

export interface ResultadosReserva {
  valorTotalNecessario: number
  valorAindaNecessario: number
  tempoParaCompletar: number
  percentualAtingido: number
  economiaRecomendada: number
  situacaoReserva: 'insuficiente' | 'parcial' | 'adequada' | 'excelente'
}

export interface ReservaMasks {
  gastosMensaisMask: string
  valorReservadoMask: string
  valorPoupancaMask: string
}

// Constantes para reserva de emergência
export const RESERVA_CONSTANTS = {
  META_MINIMA_MESES: 3,
  META_MAXIMA_MESES: 24,
  META_RECOMENDADA_CLT: 6, // meses
  META_RECOMENDADA_AUTONOMO: 12, // meses
  PERCENTUAL_ECONOMIA_RECOMENDADO: 20, // 20% dos gastos essenciais
  LIMITES_SITUACAO: {
    INSUFICIENTE: 25, // < 25%
    PARCIAL: 75, // 25% - 75%
    ADEQUADA: 100, // 75% - 100%
    EXCELENTE: 100 // >= 100%
  }
} as const

export type SituacaoReserva = 'insuficiente' | 'parcial' | 'adequada' | 'excelente'

export interface SituacaoConfig {
  class: string
  texto: string
  icon: string
  titulo: string
  descricao: string
}

export const SITUACAO_CONFIGS: Record<SituacaoReserva, SituacaoConfig> = {
  insuficiente: {
    class: 'warning',
    texto: '🔴 Reserva insuficiente',
    icon: '🚨',
    titulo: 'Insuficiente',
    descricao: 'Foque em construir sua reserva'
  },
  parcial: {
    class: '',
    texto: '🟡 Progresso parcial',
    icon: '⚠️',
    titulo: 'Em Progresso',
    descricao: 'Continue poupando'
  },
  adequada: {
    class: 'highlight',
    texto: '🟢 Reserva adequada',
    icon: '✅',
    titulo: 'Adequada',
    descricao: 'Reserva bem estruturada'
  },
  excelente: {
    class: 'highlight',
    texto: '🟢 Excelente reserva!',
    icon: '🏆',
    titulo: 'Excelente',
    descricao: 'Parabéns pelo planejamento!'
  }
}

// Dicas organizadas por situação
export const DICAS_RESERVA = [
  {
    icon: '🏦',
    titulo: 'Onde guardar',
    descricao: 'Prefira investimentos de alta liquidez como poupança, CDB com liquidez diária ou fundos DI.'
  },
  {
    icon: '🎯',
    titulo: 'Meta recomendada',
    descricao: '3-6 meses para CLT, 6-12 meses para autônomos ou PJ.'
  },
  {
    icon: '📊',
    titulo: 'Prioridade',
    descricao: 'A reserva de emergência deve vir antes de outros investimentos.'
  },
  {
    icon: '🔄',
    titulo: 'Reposição',
    descricao: 'Se usar a reserva, priorize repô-la o quanto antes.'
  }
] as const
