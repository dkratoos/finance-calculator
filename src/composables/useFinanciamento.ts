/**
 * Composable para lógica de financiamento imobiliário
 */

import { ref, computed, reactive } from 'vue'
import type { FinanciamentoData, ResultadosFinanciamento } from '@/types/financeiro'
import { LIMITES_FINANCIAMENTO, IMPOSTOS_PADRAO } from '@/types/financeiro'

export function useFinanciamento() {
  // Estado reativo do formulário
  const form = reactive<FinanciamentoData>({
    valorImovel: 0,
    valorEntrada: 0,
    valorFinanciamento: 0,
    taxaJurosAnual: 9.5,
    quantidadeParcelas: 360, // 30 anos
    sistemaAmortizacao: 'SAC',
    rendaFamiliar: 0
  })

  // Estado para controlar se os resultados devem ser exibidos
  const showResults = ref(false)

  // Calcular valor do financiamento automaticamente
  const calcularFinanciamento = () => {
    form.valorFinanciamento = form.valorImovel - form.valorEntrada
  }

  // Função para calcular os resultados
  const calcularResultados = (): ResultadosFinanciamento => {
    const taxaJurosMensal = form.taxaJurosAnual / 100 / 12
    const numeroParcelas = form.quantidadeParcelas

    let valorParcela: number
    let valorTotalPago: number

    if (form.sistemaAmortizacao === 'PRICE') {
      // Sistema PRICE (parcelas fixas)
      if (taxaJurosMensal === 0) {
        valorParcela = form.valorFinanciamento / numeroParcelas
      } else {
        valorParcela = form.valorFinanciamento *
          (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, numeroParcelas)) /
          (Math.pow(1 + taxaJurosMensal, numeroParcelas) - 1)
      }
      valorTotalPago = valorParcela * numeroParcelas
    } else {
      // Sistema SAC (parcelas decrescentes)
      const amortizacao = form.valorFinanciamento / numeroParcelas
      let saldoDevedor = form.valorFinanciamento
      valorTotalPago = 0
      valorParcela = 0 // Primeira parcela (maior)

      for (let i = 1; i <= numeroParcelas; i++) {
        const juros = saldoDevedor * taxaJurosMensal
        const parcela = amortizacao + juros

        if (i === 1) {
          valorParcela = parcela // Primeira parcela para exibição
        }

        valorTotalPago += parcela
        saldoDevedor -= amortizacao
      }
    }

    const valorJurosPagos = valorTotalPago - form.valorFinanciamento
    const taxaTotalImpostos = IMPOSTOS_PADRAO.itbi + IMPOSTOS_PADRAO.cartorio + IMPOSTOS_PADRAO.taxasDiversas
    const impostosAquisicao = form.valorImovel * (taxaTotalImpostos / 100)
    const rendaDeclaredaMinima = (valorParcela * 100) / LIMITES_FINANCIAMENTO.PERCENTUAL_RENDA_MAXIMO
    const percentualRenda = form.rendaFamiliar ? (valorParcela / form.rendaFamiliar) * 100 : 0

    return {
      rendaDeclaredaMinima,
      valorTotalPago: valorTotalPago + form.valorEntrada,
      valorJurosPagos,
      valorParcela,
      impostosAquisicao,
      percentualRenda
    }
  }

  // Computed para os resultados
  const resultados = computed(() => {
    if (!showResults.value) return null
    return calcularResultados()
  })

  // Validação dos dados do formulário
  const validarFormulario = (): string | null => {
    if (form.valorImovel <= 0) {
      return 'O valor do imóvel deve ser maior que zero.'
    }

    if (form.valorEntrada < 0) {
      return 'O valor de entrada não pode ser negativo.'
    }

    if (form.valorEntrada >= form.valorImovel) {
      return 'O valor de entrada não pode ser maior que o valor do imóvel.'
    }

    if (form.taxaJurosAnual < LIMITES_FINANCIAMENTO.TAXA_JUROS_MINIMA ||
        form.taxaJurosAnual > LIMITES_FINANCIAMENTO.TAXA_JUROS_MAXIMA) {
      return `A taxa de juros deve estar entre ${LIMITES_FINANCIAMENTO.TAXA_JUROS_MINIMA}% e ${LIMITES_FINANCIAMENTO.TAXA_JUROS_MAXIMA}% ao ano.`
    }

    if (form.quantidadeParcelas <= 0) {
      return 'O número de parcelas deve ser maior que zero.'
    }

    const percentualEntrada = (form.valorEntrada / form.valorImovel) * 100
    if (percentualEntrada < LIMITES_FINANCIAMENTO.ENTRADA_MINIMA) {
      return `A entrada deve ser de pelo menos ${LIMITES_FINANCIAMENTO.ENTRADA_MINIMA}% do valor do imóvel.`
    }

    return null
  }

  // Função para calcular e validar
  const calcular = (): boolean => {
    const erro = validarFormulario()

    if (erro) {
      alert(erro)
      return false
    }

    calcularFinanciamento()
    showResults.value = true
    return true
  }

  // Limpar formulário
  const limpar = () => {
    Object.assign(form, {
      valorImovel: 0,
      valorEntrada: 0,
      valorFinanciamento: 0,
      taxaJurosAnual: 9.5,
      quantidadeParcelas: 360,
      sistemaAmortizacao: 'SAC',
      rendaFamiliar: 0
    })
    showResults.value = false
  }

  // Computed para verificar se o comprometimento da renda está seguro
  const rendaSegura = computed(() => {
    if (!resultados.value || !form.rendaFamiliar) return true
    return resultados.value.percentualRenda <= LIMITES_FINANCIAMENTO.PERCENTUAL_RENDA_MAXIMO
  })

  // Computed para a porcentagem de entrada
  const percentualEntrada = computed(() => {
    if (form.valorImovel === 0) return 0
    return (form.valorEntrada / form.valorImovel) * 100
  })

  return {
    // Estado
    form,
    showResults,
    resultados,

    // Computed
    rendaSegura,
    percentualEntrada,

    // Métodos
    calcular,
    limpar,
    calcularFinanciamento,
    validarFormulario,

    // Constantes
    LIMITES_FINANCIAMENTO,
    IMPOSTOS_PADRAO
  }
}
