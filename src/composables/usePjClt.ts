/**
 * Composable para lógica de comparação PJ vs CLT
 */

import { ref, computed, reactive } from 'vue'
import type {
  CltData,
  PjData,
  ResultadosComparacao,
  PjMasks,
  CategoriaTributaria,
  AtividadePrincipal
} from '@/types/pjClt'
import { TRIBUTOS_PJ } from '@/types/pjClt'

export function usePjClt() {
  // Estado reativo dos formulários
  const formClt = reactive<CltData>({
    salarioBruto: 0,
    valeAlimentacao: 0,
    valeTransporte: 0,
    planoSaude: 0,
    outrosBeneficios: 0,
    anosTrabalho: 1
  })

  const formPj = reactive<PjData>({
    valorMensal: 0,
    categoriaTributacao: 'SIMPLES_NACIONAL',
    atividadePrincipal: 'Tecnologia da Informação',
    gastosMensais: 0
  })

  // Estados para as máscaras de entrada
  const mascaras = reactive<PjMasks>({
    salarioBrutoMask: '',
    valeAlimentacaoMask: '',
    valeTransporteMask: '',
    planoSaudeMask: '',
    outrosBeneficiosMask: '',
    valorMensalPjMask: '',
    gastosMensaisPjMask: ''
  })

  // Estado para controlar se os resultados devem ser exibidos
  const showResults = ref(false)

  // Estado para mensagens de erro
  const erroValidacao = ref('')

  // ===========================
  // CÁLCULOS CLT
  // ===========================

  // Função para calcular INSS CLT
  const calcularInssClt = (salario: number): number => {
    // Tabela INSS 2024
    if (salario <= 1412) {
      return salario * 0.075
    } else if (salario <= 2666.68) {
      return 1412 * 0.075 + (salario - 1412) * 0.09
    } else if (salario <= 4000.03) {
      return 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (salario - 2666.68) * 0.12
    } else if (salario <= 7786.02) {
      return 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (4000.03 - 2666.68) * 0.12 + (salario - 4000.03) * 0.14
    } else {
      return 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (4000.03 - 2666.68) * 0.12 + (7786.02 - 4000.03) * 0.14
    }
  }

  // Função para calcular IRRF CLT
  const calcularIrrfClt = (salarioBase: number): number => {
    // Base de cálculo = salário - INSS - dependentes
    const baseCalculo = salarioBase

    // Tabela IRRF 2024
    if (baseCalculo <= 2112) {
      return 0
    } else if (baseCalculo <= 2826.65) {
      return baseCalculo * 0.075 - 158.40
    } else if (baseCalculo <= 3751.05) {
      return baseCalculo * 0.15 - 370.40
    } else if (baseCalculo <= 4664.68) {
      return baseCalculo * 0.225 - 651.73
    } else {
      return baseCalculo * 0.275 - 884.96
    }
  }

  // ===========================
  // CÁLCULOS PJ
  // ===========================

  // Função para calcular impostos PJ
  const calcularImpostosPj = (faturamento: number, categoria: CategoriaTributaria): number => {
    const faturamentoAnual = faturamento * 12

    switch (categoria) {
      case 'MEI':
        if (faturamentoAnual > TRIBUTOS_PJ.MEI.limite) {
          return faturamento * (TRIBUTOS_PJ.SIMPLES_NACIONAL.faixas[0].aliquota / 100)
        }
        return faturamento * (TRIBUTOS_PJ.MEI.aliquota / 100)

      case 'SIMPLES_NACIONAL':
        for (const faixa of TRIBUTOS_PJ.SIMPLES_NACIONAL.faixas) {
          if (faturamentoAnual >= faixa.de && faturamentoAnual <= faixa.ate) {
            return faturamento * (faixa.aliquota / 100)
          }
        }
        // Se exceder todas as faixas, usar a última
        const ultimaFaixa = TRIBUTOS_PJ.SIMPLES_NACIONAL.faixas[TRIBUTOS_PJ.SIMPLES_NACIONAL.faixas.length - 1]
        return faturamento * (ultimaFaixa.aliquota / 100)

      case 'LUCRO_PRESUMIDO':
        const { issAliquota, pisAliquota, cofinsAliquota, irpjAliquota, csllAliquota, adicionalIrpj, baseCalculoIrpj, baseCalculoCsll } = TRIBUTOS_PJ.LUCRO_PRESUMIDO

        const iss = faturamento * (issAliquota / 100)
        const pis = faturamento * (pisAliquota / 100)
        const cofins = faturamento * (cofinsAliquota / 100)

        const baseIrpj = faturamento * (baseCalculoIrpj / 100)
        const baseCsll = faturamento * (baseCalculoCsll / 100)

        const irpj = baseIrpj * (irpjAliquota / 100)
        const csll = baseCsll * (csllAliquota / 100)

        // Adicional IRPJ se base > R$ 20.000
        const adicional = baseIrpj > 20000 ? (baseIrpj - 20000) * (adicionalIrpj / 100) : 0

        return iss + pis + cofins + irpj + csll + adicional

      default:
        return 0
    }
  }

  // ===========================
  // RECOMENDAÇÃO INTELIGENTE
  // ===========================

  // Função para calcular recomendação baseada em riscos
  const calcularRecomendacao = (percentualVantagemPj: number): ResultadosComparacao['recomendacao'] => {
    // Percentuais mínimos recomendados baseados em diferentes fatores
    let percentualMinimo = 25 // Base conservadora de 25%

    // Ajustes baseados na atividade
    switch (formPj.atividadePrincipal as AtividadePrincipal) {
      case 'Tecnologia da Informação':
        percentualMinimo = 20 // TI tem maior demanda e estabilidade
        break
      case 'Consultoria':
        percentualMinimo = 25 // Moderado
        break
      case 'Design e Marketing':
        percentualMinimo = 30 // Mais instável
        break
      case 'Engenharia':
        percentualMinimo = 25 // Moderado
        break
      case 'Educação':
        percentualMinimo = 35 // Menos previsível como PJ
        break
      default:
        percentualMinimo = 30 // Outros serviços
    }

    // Ajustes baseados na categoria tributária
    switch (formPj.categoriaTributacao) {
      case 'MEI':
        percentualMinimo -= 5 // MEI é mais simples e seguro
        break
      case 'SIMPLES_NACIONAL':
        percentualMinimo += 0 // Padrão
        break
      case 'LUCRO_PRESUMIDO':
        percentualMinimo += 5 // Mais complexo e caro
        break
    }

    // Garantir mínimo de 15% e máximo de 40%
    percentualMinimo = Math.max(15, Math.min(40, percentualMinimo))

    // Determinar nível de risco e recomendação
    let nivelRisco: 'baixo' | 'medio' | 'alto'
    let recomendacaoTexto: string
    let justificativa: string
    let statusDecisao: 'recomendado' | 'neutro' | 'nao_recomendado'

    if (percentualVantagemPj >= percentualMinimo + 10) {
      nivelRisco = 'baixo'
      statusDecisao = 'recomendado'
      recomendacaoTexto = 'Migração para PJ recomendada'
      justificativa = `A vantagem de ${percentualVantagemPj.toFixed(1)}% está bem acima do mínimo recomendado de ${percentualMinimo}%, oferecendo boa margem de segurança.`
    } else if (percentualVantagemPj >= percentualMinimo) {
      nivelRisco = 'medio'
      statusDecisao = 'neutro'
      recomendacaoTexto = 'Migração possível, mas avalie com cuidado'
      justificativa = `A vantagem de ${percentualVantagemPj.toFixed(1)}% atende o mínimo de ${percentualMinimo}%, mas com margem apertada. Considere sua tolerância a riscos.`
    } else if (percentualVantagemPj >= 0) {
      nivelRisco = 'alto'
      statusDecisao = 'nao_recomendado'
      recomendacaoTexto = 'Migração não recomendada'
      justificativa = `A vantagem de ${percentualVantagemPj.toFixed(1)}% está abaixo do mínimo recomendado de ${percentualMinimo}%. Os riscos superam os benefícios.`
    } else {
      nivelRisco = 'alto'
      statusDecisao = 'nao_recomendado'
      recomendacaoTexto = 'CLT é claramente melhor'
      justificativa = `PJ oferece ${Math.abs(percentualVantagemPj).toFixed(1)}% MENOS que CLT. Mantenha o regime atual.`
    }

    return {
      percentualMinimoRecomendado: percentualMinimo,
      nivelRisco,
      recomendacaoTexto,
      justificativa,
      statusDecisao
    }
  }

  // ===========================
  // CÁLCULO PRINCIPAL
  // ===========================

  // Função para calcular os resultados
  const calcularResultados = (): ResultadosComparacao => {
    // Cálculos CLT
    const inss = calcularInssClt(formClt.salarioBruto)
    const salarioMenosInss = formClt.salarioBruto - inss
    const irrf = calcularIrrfClt(salarioMenosInss)
    const salarioLiquido = salarioMenosInss - irrf
    const totalBeneficios = formClt.valeAlimentacao + formClt.valeTransporte + formClt.planoSaude + formClt.outrosBeneficios

    // FGTS: 8% do salário bruto (pago pela empresa)
    const fgts = formClt.salarioBruto * 0.08

    // FGTS acumulado: considera o período especificado pelo usuário
    const fgtsAcumulado = fgts * 12 * formClt.anosTrabalho

    // 13º salário: cálculo do líquido do 13º (salário bruto - INSS - IRRF)
    const inss13 = calcularInssClt(formClt.salarioBruto)
    const salario13MenosInss = formClt.salarioBruto - inss13
    const irrf13 = calcularIrrfClt(salario13MenosInss)
    const decimoTerceiro = salario13MenosInss - irrf13

    // 1/3 de férias: 1/3 do salário bruto por ano (pago pela empresa)
    const tercoFerias = formClt.salarioBruto / 3

    // Valores mensais CLT
    const receitaLiquidaMensalClt = salarioLiquido + totalBeneficios

    // Valores anuais CLT (incluindo 13º, FGTS e 1/3 de férias)
    const receitaLiquidaAnualClt = (receitaLiquidaMensalClt * 12) + decimoTerceiro + (fgts * 12) + tercoFerias

    // Cálculos PJ
    const faturamentoBruto = formPj.valorMensal
    const impostos = calcularImpostosPj(faturamentoBruto, formPj.categoriaTributacao)
    const receitaLiquidaMensalPj = faturamentoBruto - impostos - formPj.gastosMensais
    const receitaLiquidaAnualPj = receitaLiquidaMensalPj * 12
    const aliquotaTotal = faturamentoBruto > 0 ? (impostos / faturamentoBruto) * 100 : 0

    // Comparação Mensal
    const diferencaMensal = receitaLiquidaMensalPj - receitaLiquidaMensalClt
    const percentualMensal = receitaLiquidaMensalClt > 0 ? (diferencaMensal / receitaLiquidaMensalClt) * 100 : 0
    const melhorOpcaoMensal = diferencaMensal >= 0 ? 'PJ' : 'CLT'

    // Comparação Anual
    const diferencaAnual = receitaLiquidaAnualPj - receitaLiquidaAnualClt
    const percentualAnual = receitaLiquidaAnualClt > 0 ? (diferencaAnual / receitaLiquidaAnualClt) * 100 : 0
    const melhorOpcaoAnual = diferencaAnual >= 0 ? 'PJ' : 'CLT'

    // Calcular recomendação usando a comparação anual
    const recomendacao = calcularRecomendacao(percentualAnual)

    return {
      clt: {
        salarioLiquido,
        inss,
        irrf,
        totalBeneficios,
        fgts,
        fgtsAcumulado,
        decimoTerceiro,
        tercoFerias,
        receitaLiquidaMensal: receitaLiquidaMensalClt,
        receitaLiquidaAnual: receitaLiquidaAnualClt
      },
      pj: {
        faturamentoBruto,
        impostos,
        receitaLiquida: receitaLiquidaMensalPj,
        receitaLiquidaAnual: receitaLiquidaAnualPj,
        aliquotaTotal
      },
      diferenca: {
        valorAbsolutoMensal: Math.abs(diferencaMensal),
        valorAbsolutoAnual: Math.abs(diferencaAnual),
        percentualMensal: Math.abs(percentualMensal),
        percentualAnual: Math.abs(percentualAnual),
        melhorOpcaoMensal,
        melhorOpcaoAnual
      },
      recomendacao
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

    if (formClt.salarioBruto <= 0 && formPj.valorMensal <= 0) {
      erroValidacao.value = '💰 Informe pelo menos um valor: salário CLT ou faturamento PJ'
      return false
    }

    if (formClt.salarioBruto > 0 && formClt.salarioBruto < 1412) {
      erroValidacao.value = '📊 Salário CLT deve ser pelo menos o salário mínimo (R$ 1.412)'
      return false
    }

    if (formPj.valorMensal > 0 && formPj.categoriaTributacao === 'MEI' && formPj.valorMensal * 12 > TRIBUTOS_PJ.MEI.limite) {
      erroValidacao.value = '⚠️ Faturamento MEI excede o limite anual de R$ 81.000'
      return false
    }

    if (formPj.gastosMensais < 0) {
      erroValidacao.value = '💼 Os gastos mensais PJ não podem ser negativos'
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
    Object.assign(formClt, {
      salarioBruto: 0,
      valeAlimentacao: 0,
      valeTransporte: 0,
      planoSaude: 0,
      outrosBeneficios: 0,
      anosTrabalho: 1
    })

    Object.assign(formPj, {
      valorMensal: 0,
      categoriaTributacao: 'SIMPLES_NACIONAL',
      atividadePrincipal: 'Tecnologia da Informação',
      gastosMensais: 0
    })

    // Limpar as máscaras
    Object.assign(mascaras, {
      salarioBrutoMask: '',
      valeAlimentacaoMask: '',
      valeTransporteMask: '',
      planoSaudeMask: '',
      outrosBeneficiosMask: '',
      valorMensalPjMask: '',
      gastosMensaisPjMask: ''
    })

    // Limpar estado
    erroValidacao.value = ''
    showResults.value = false
  }

  // ===========================
  // FUNÇÕES AUXILIARES
  // ===========================

  // Função para obter descrição da categoria de tributação
  const getDescricaoCategoria = (categoria: CategoriaTributaria): string => {
    switch (categoria) {
      case 'MEI':
        return 'Microempreendedor Individual - até R$ 81.000/ano'
      case 'SIMPLES_NACIONAL':
        return 'Simples Nacional - até R$ 4.8 milhões/ano'
      case 'LUCRO_PRESUMIDO':
        return 'Lucro Presumido - para faturamentos maiores'
      default:
        return ''
    }
  }

  // Funções auxiliares para recomendação
  const getRiscoIcon = (nivelRisco: string): string => {
    switch (nivelRisco) {
      case 'baixo':
        return '✅'
      case 'medio':
        return '⚠️'
      case 'alto':
        return '🚨'
      default:
        return '📊'
    }
  }

  const getRiscoTexto = (nivelRisco: string): string => {
    switch (nivelRisco) {
      case 'baixo':
        return 'Baixo'
      case 'medio':
        return 'Médio'
      case 'alto':
        return 'Alto'
      default:
        return 'Indefinido'
    }
  }

  return {
    // Estado
    formClt,
    formPj,
    mascaras,
    showResults,
    erroValidacao,

    // Computed
    resultados,

    // Métodos
    calcular,
    limpar,
    getDescricaoCategoria,
    getRiscoIcon,
    getRiscoTexto,

    // Constantes
    TRIBUTOS_PJ
  }
}
