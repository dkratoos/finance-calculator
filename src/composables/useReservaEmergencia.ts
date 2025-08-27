/**
 * Composable para lógica de Reserva de Emergência
 */

import { ref, computed, reactive } from 'vue'
import type {
  ReservaEmergenciaData,
  ResultadosReserva,
  ReservaMasks,
  SituacaoReserva
} from '@/types/reservaEmergencia'
import { RESERVA_CONSTANTS, SITUACAO_CONFIGS, DICAS_RESERVA } from '@/types/reservaEmergencia'

export function useReservaEmergencia() {
  // Estado reativo do formulário
  const form = reactive<ReservaEmergenciaData>({
    gastosMensaisEssenciais: 0,
    valorJaReservado: 0,
    metaMesesReserva: 6,
    valorMensalPoupanca: 0
  })

  // Estados para as máscaras de entrada
  const mascaras = reactive<ReservaMasks>({
    gastosMensaisMask: '',
    valorReservadoMask: '',
    valorPoupancaMask: ''
  })

  // Estado para controlar se os resultados devem ser exibidos
  const showResults = ref(false)

  // Estado para mensagens de erro
  const erroValidacao = ref('')

  // ===========================
  // CÁLCULOS PRINCIPAIS
  // ===========================

  // Função para determinar situação da reserva
  const determinarSituacaoReserva = (percentualAtingido: number): SituacaoReserva => {
    if (percentualAtingido < RESERVA_CONSTANTS.LIMITES_SITUACAO.INSUFICIENTE) {
      return 'insuficiente'
    } else if (percentualAtingido < RESERVA_CONSTANTS.LIMITES_SITUACAO.PARCIAL) {
      return 'parcial'
    } else if (percentualAtingido < RESERVA_CONSTANTS.LIMITES_SITUACAO.ADEQUADA) {
      return 'adequada'
    } else {
      return 'excelente'
    }
  }

  // Função para calcular os resultados
  const calcularResultados = (): ResultadosReserva => {
    const valorTotalNecessario = form.gastosMensaisEssenciais * form.metaMesesReserva
    const valorAindaNecessario = Math.max(0, valorTotalNecessario - form.valorJaReservado)
    const percentualAtingido = valorTotalNecessario > 0 ? (form.valorJaReservado / valorTotalNecessario) * 100 : 0

    let tempoParaCompletar = 0
    if (valorAindaNecessario > 0 && form.valorMensalPoupanca > 0) {
      tempoParaCompletar = Math.ceil(valorAindaNecessario / form.valorMensalPoupanca)
    }

    // Recomendação: 20% dos gastos essenciais para reserva de emergência
    const economiaRecomendada = form.gastosMensaisEssenciais * (RESERVA_CONSTANTS.PERCENTUAL_ECONOMIA_RECOMENDADO / 100)

    // Determinar situação da reserva
    const situacaoReserva = determinarSituacaoReserva(percentualAtingido)

    return {
      valorTotalNecessario,
      valorAindaNecessario,
      tempoParaCompletar,
      percentualAtingido,
      economiaRecomendada,
      situacaoReserva
    }
  }

  // Computed para os resultados
  const resultados = computed(() => {
    if (!showResults.value) return null
    return calcularResultados()
  })

  // ===========================
  // VALIDAÇÃO
  // ===========================

  // Validação dos campos
  const validarCampos = (): boolean => {
    erroValidacao.value = ''

    if (form.gastosMensaisEssenciais <= 0) {
      erroValidacao.value = '💰 Informe seus gastos mensais essenciais'
      return false
    }

    if (form.valorJaReservado < 0) {
      erroValidacao.value = '🏦 O valor já reservado não pode ser negativo'
      return false
    }

    if (form.metaMesesReserva < RESERVA_CONSTANTS.META_MINIMA_MESES ||
        form.metaMesesReserva > RESERVA_CONSTANTS.META_MAXIMA_MESES) {
      erroValidacao.value = `📅 A meta deve ser entre ${RESERVA_CONSTANTS.META_MINIMA_MESES} e ${RESERVA_CONSTANTS.META_MAXIMA_MESES} meses`
      return false
    }

    if (form.valorMensalPoupanca < 0) {
      erroValidacao.value = '💵 O valor mensal de poupança não pode ser negativo'
      return false
    }

    if (form.metaMesesReserva < RESERVA_CONSTANTS.META_MINIMA_MESES) {
      erroValidacao.value = `⚠️ Recomenda-se uma reserva de pelo menos ${RESERVA_CONSTANTS.META_MINIMA_MESES} meses`
      return false
    }

    return true
  }

  // ===========================
  // AÇÕES PRINCIPAIS
  // ===========================

  // Função principal de cálculo
  const calcular = () => {
    if (!validarCampos()) {
      return
    }

    showResults.value = true
    erroValidacao.value = ''
  }

  // Limpar formulário
  const limpar = () => {
    Object.assign(form, {
      gastosMensaisEssenciais: 0,
      valorJaReservado: 0,
      metaMesesReserva: 6,
      valorMensalPoupanca: 0
    })

    // Limpar as máscaras
    Object.assign(mascaras, {
      gastosMensaisMask: '',
      valorReservadoMask: '',
      valorPoupancaMask: ''
    })

    // Limpar estado
    erroValidacao.value = ''
    showResults.value = false
  }

  // ===========================
  // FUNÇÕES AUXILIARES
  // ===========================

  // Funções auxiliares para exibição dos resultados
  const getSituacaoClass = (situacao: SituacaoReserva): string => {
    return SITUACAO_CONFIGS[situacao].class
  }

  const getSituacaoTexto = (situacao: SituacaoReserva): string => {
    return SITUACAO_CONFIGS[situacao].texto
  }

  const getSituacaoIcon = (situacao: SituacaoReserva): string => {
    return SITUACAO_CONFIGS[situacao].icon
  }

  const getSituacaoTitulo = (situacao: SituacaoReserva): string => {
    return SITUACAO_CONFIGS[situacao].titulo
  }

  const getSituacaoDescricao = (situacao: SituacaoReserva): string => {
    return SITUACAO_CONFIGS[situacao].descricao
  }

  // Computed para verificar se a meta está completa
  const metaCompleta = computed(() => {
    if (!resultados.value) return false
    return resultados.value.valorAindaNecessario === 0
  })

  // Computed para o progresso em formato 0-100
  const progressoPercentual = computed(() => {
    if (!resultados.value) return 0
    return Math.min(100, Math.max(0, resultados.value.percentualAtingido))
  })

  return {
    // Estado
    form,
    mascaras,
    showResults,
    erroValidacao,

    // Computed
    resultados,
    metaCompleta,
    progressoPercentual,

    // Métodos
    calcular,
    limpar,
    getSituacaoClass,
    getSituacaoTexto,
    getSituacaoIcon,
    getSituacaoTitulo,
    getSituacaoDescricao,

    // Constantes
    RESERVA_CONSTANTS,
    DICAS_RESERVA
  }
}
