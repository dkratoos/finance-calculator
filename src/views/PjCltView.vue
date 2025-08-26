<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { formatCurrency, formatPercentage, applyCurrencyMask } from '@/utils/formatters'

// Interfaces para dados de CLT e PJ
interface CltData {
  salarioBruto: number
  valeAlimentacao: number
  valeTransporte: number
  planoSaude: number
  outrosBeneficios: number
  anosTrabalho: number // Para cálculo do FGTS acumulado
}

interface PjData {
  valorMensal: number
  categoriaTributacao: 'MEI' | 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO'
  atividadePrincipal: string
  gastosMensais: number
}

// Interface para resultados da comparação
interface ResultadosComparacao {
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

// Tabelas de impostos brasileiros 2024
const TRIBUTOS_PJ = {
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
}

// Estado reativo dos formulários
const formClt = reactive<CltData>({
  salarioBruto: 0,
  valeAlimentacao: 0,
  valeTransporte: 0,
  planoSaude: 0,
  outrosBeneficios: 0,
  anosTrabalho: 1 // Default 1 anos para visualizar FGTS acumulado
})

const formPj = reactive<PjData>({
  valorMensal: 0,
  categoriaTributacao: 'SIMPLES_NACIONAL',
  atividadePrincipal: 'Tecnologia da Informação',
  gastosMensais: 0
})

// Estados para as máscaras de entrada
const salarioBrutoMask = ref('')
const valeAlimentacaoMask = ref('')
const valeTransporteMask = ref('')
const planoSaudeMask = ref('')
const outrosBeneficiosMask = ref('')
const valorMensalPjMask = ref('')
const gastosMensaisPjMask = ref('')

// Estado para controlar se os resultados devem ser exibidos
const showResults = ref(false)

// Estado para mensagens de erro
const erroValidacao = ref('')

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

// Função para calcular impostos PJ
const calcularImpostosPj = (faturamento: number, categoria: string): number => {
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

// Função para calcular recomendação baseada em riscos
const calcularRecomendacao = (percentualVantagemPj: number): ResultadosComparacao['recomendacao'] => {
  // Percentuais mínimos recomendados baseados em diferentes fatores
  let percentualMinimo = 25 // Base conservadora de 25%

  // Ajustes baseados na atividade
  switch (formPj.atividadePrincipal) {
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
  salarioBrutoMask.value = ''
  valeAlimentacaoMask.value = ''
  valeTransporteMask.value = ''
  planoSaudeMask.value = ''
  outrosBeneficiosMask.value = ''
  valorMensalPjMask.value = ''
  gastosMensaisPjMask.value = ''

  // Limpar estado
  erroValidacao.value = ''
  showResults.value = false
}

// Funções para aplicar máscara de moeda - CLT
const aplicarMascaraSalario = (event: Event) => {
  const target = event.target as HTMLInputElement
  salarioBrutoMask.value = applyCurrencyMask(target.value)
  const numericValue = salarioBrutoMask.value.replace(/\./g, '').replace(',', '.')
  formClt.salarioBruto = parseFloat(numericValue) || 0
}

const aplicarMascaraValeAlimentacao = (event: Event) => {
  const target = event.target as HTMLInputElement
  valeAlimentacaoMask.value = applyCurrencyMask(target.value)
  const numericValue = valeAlimentacaoMask.value.replace(/\./g, '').replace(',', '.')
  formClt.valeAlimentacao = parseFloat(numericValue) || 0
}

const aplicarMascaraValeTransporte = (event: Event) => {
  const target = event.target as HTMLInputElement
  valeTransporteMask.value = applyCurrencyMask(target.value)
  const numericValue = valeTransporteMask.value.replace(/\./g, '').replace(',', '.')
  formClt.valeTransporte = parseFloat(numericValue) || 0
}

const aplicarMascaraPlanoSaude = (event: Event) => {
  const target = event.target as HTMLInputElement
  planoSaudeMask.value = applyCurrencyMask(target.value)
  const numericValue = planoSaudeMask.value.replace(/\./g, '').replace(',', '.')
  formClt.planoSaude = parseFloat(numericValue) || 0
}

const aplicarMascaraOutrosBeneficios = (event: Event) => {
  const target = event.target as HTMLInputElement
  outrosBeneficiosMask.value = applyCurrencyMask(target.value)
  const numericValue = outrosBeneficiosMask.value.replace(/\./g, '').replace(',', '.')
  formClt.outrosBeneficios = parseFloat(numericValue) || 0
}

// Funções para aplicar máscara de moeda - PJ
const aplicarMascaraValorPj = (event: Event) => {
  const target = event.target as HTMLInputElement
  valorMensalPjMask.value = applyCurrencyMask(target.value)
  const numericValue = valorMensalPjMask.value.replace(/\./g, '').replace(',', '.')
  formPj.valorMensal = parseFloat(numericValue) || 0
}

const aplicarMascaraGastosPj = (event: Event) => {
  const target = event.target as HTMLInputElement
  gastosMensaisPjMask.value = applyCurrencyMask(target.value)
  const numericValue = gastosMensaisPjMask.value.replace(/\./g, '').replace(',', '.')
  formPj.gastosMensais = parseFloat(numericValue) || 0
}

// Função para obter descrição da categoria de tributação
const getDescricaoCategoria = (categoria: string): string => {
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
</script>

<template>
  <div>
    <!-- Header -->
    <header class="page-header">
      <div class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-link">HOME</RouterLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">PJ vs CLT</span>
      </div>
    </header>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Form Section -->
      <section class="form-section">
        <div class="section-header">
          <h2>
            <span class="icon">⚖️</span>
            COMPARADOR PJ vs CLT
          </h2>
        </div>

        <form @submit.prevent="calcular" class="finance-form">
          <!-- CLT Section -->
          <div class="form-subsection">
            <h3 class="subsection-title">
              <span class="subsection-icon">👔</span>
              Regime CLT
            </h3>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Salário Bruto</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="salarioBrutoMask"
                    @input="aplicarMascaraSalario"
                    type="text"
                    class="form-input"
                    placeholder="5.000,00"
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Vale Alimentação</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="valeAlimentacaoMask"
                    @input="aplicarMascaraValeAlimentacao"
                    type="text"
                    class="form-input"
                    placeholder="600,00"
                  >
                </div>
                <small class="form-helper">Valor mensal sem coparticipação</small>
              </div>

              <div class="form-group">
                <label class="form-label">Vale Transporte</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="valeTransporteMask"
                    @input="aplicarMascaraValeTransporte"
                    type="text"
                    class="form-input"
                    placeholder="220,00"
                  >
                </div>
                <small class="form-helper">Valor líquido recebido</small>
              </div>

              <div class="form-group">
                <label class="form-label">Plano de Saúde</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="planoSaudeMask"
                    @input="aplicarMascaraPlanoSaude"
                    type="text"
                    class="form-input"
                    placeholder="300,00"
                  >
                </div>
                <small class="form-helper">Valor da empresa (sem desconto)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Outros Benefícios</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="outrosBeneficiosMask"
                    @input="aplicarMascaraOutrosBeneficios"
                    type="text"
                    class="form-input"
                    placeholder="200,00"
                  >
                </div>
                <small class="form-helper">Gympass, seguro de vida, etc.</small>
              </div>

              <div class="form-group">
                <label class="form-label">Anos de Trabalho</label>
                <div class="input-wrapper">
                  <input
                    v-model.number="formClt.anosTrabalho"
                    type="number"
                    class="form-input"
                    placeholder="1"
                    min="1"
                    max="40"
                    step="1"
                  >
                  <span class="input-suffix">anos</span>
                </div>
                <small class="form-helper">Para cálculo do FGTS acumulado</small>
              </div>
            </div>
          </div>

          <!-- PJ Section -->
          <div class="form-subsection">
            <h3 class="subsection-title">
              <span class="subsection-icon">💼</span>
              Regime PJ
            </h3>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Faturamento Mensal</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="valorMensalPjMask"
                    @input="aplicarMascaraValorPj"
                    type="text"
                    class="form-input"
                    placeholder="8.000,00"
                  >
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Categoria de Tributação</label>
                <select v-model="formPj.categoriaTributacao" class="form-input">
                  <option value="MEI">MEI</option>
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                </select>
                <small class="form-helper">{{ getDescricaoCategoria(formPj.categoriaTributacao) }}</small>
              </div>

              <div class="form-group">
                <label class="form-label">Atividade Principal</label>
                <select v-model="formPj.atividadePrincipal" class="form-input">
                  <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                  <option value="Consultoria">Consultoria</option>
                  <option value="Design e Marketing">Design e Marketing</option>
                  <option value="Engenharia">Engenharia</option>
                  <option value="Educação">Educação</option>
                  <option value="Outros Serviços">Outros Serviços</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Gastos Mensais</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="gastosMensaisPjMask"
                    @input="aplicarMascaraGastosPj"
                    type="text"
                    class="form-input"
                    placeholder="500,00"
                  >
                </div>
                <small class="form-helper">Contador, equipamentos, internet, etc.</small>
              </div>
            </div>
          </div>

          <!-- Erro de Validação -->
          <div v-if="erroValidacao" class="error-message">
            <div class="error-content">
              <span>{{ erroValidacao }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="limpar" class="btn btn-secondary">
              🗑️ LIMPAR
            </button>
            <button type="submit" class="btn btn-primary">
              ⚖️ COMPARAR
            </button>
          </div>
        </form>
      </section>

      <!-- Results Section -->
      <section v-if="showResults && resultados" class="results-section">
        <div class="section-header">
          <h2>
            <span class="icon">📊</span>
            ANÁLISE COMPARATIVA
          </h2>
        </div>

        <!-- Resumo da Decisão -->
        <div class="decision-cards">
          <!-- Comparação Mensal -->
          <div class="decision-card" :class="resultados.diferenca.melhorOpcaoMensal.toLowerCase()">
            <div class="decision-icon">
              {{ resultados.diferenca.melhorOpcaoMensal === 'PJ' ? '💼' : '👔' }}
            </div>
            <div class="decision-content">
              <h3>Melhor Mensal: {{ resultados.diferenca.melhorOpcaoMensal === 'PJ' ? 'PJ' : 'CLT' }}</h3>
              <p class="decision-value">
                {{ formatCurrency(resultados.diferenca.valorAbsolutoMensal) }}/mês
              </p>
              <p class="decision-percentage">
                ({{ formatPercentage(resultados.diferenca.percentualMensal) }} de diferença)
              </p>
            </div>
          </div>

          <!-- Comparação Anual -->
          <div class="decision-card" :class="resultados.diferenca.melhorOpcaoAnual.toLowerCase()">
            <div class="decision-icon">
              {{ resultados.diferenca.melhorOpcaoAnual === 'PJ' ? '💼' : '👔' }}
            </div>
            <div class="decision-content">
              <h3>Melhor Anual: {{ resultados.diferenca.melhorOpcaoAnual === 'PJ' ? 'PJ' : 'CLT' }}</h3>
              <p class="decision-value">
                {{ formatCurrency(resultados.diferenca.valorAbsolutoAnual) }}/ano
              </p>
              <p class="decision-percentage">
                ({{ formatPercentage(resultados.diferenca.percentualAnual) }} de diferença)
              </p>
            </div>
          </div>
        </div>

        <div class="results-grid">
          <!-- Resultados CLT -->
          <div class="result-section">
            <h3 class="result-section-title">
              <span class="section-icon">👔</span>
              CLT
            </h3>

            <div class="result-cards">
              <div class="result-card">
                <div class="result-icon">💰</div>
                <div class="result-content">
                  <h4>Salário Líquido</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.salarioLiquido) }}</p>
                  <p class="result-note">Mensal após descontos</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">🎁</div>
                <div class="result-content">
                  <h4>Total Benefícios</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.totalBeneficios) }}</p>
                  <p class="result-note">VA, VT, plano de saúde, etc.</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">🏦</div>
                <div class="result-content">
                  <h4>FGTS</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.fgts) }}</p>
                  <p class="result-note">8% depositado pela empresa</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">🎊</div>
                <div class="result-content">
                  <h4>13º Salário</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.decimoTerceiro) }}</p>
                  <p class="result-note">Valor líquido anual</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">🏖️</div>
                <div class="result-content">
                  <h4>1/3 de Férias</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.tercoFerias) }}</p>
                  <p class="result-note">Abono constitucional anual</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">💎</div>
                <div class="result-content">
                  <h4>FGTS Acumulado</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.fgtsAcumulado) }}</p>
                  <p class="result-note">Em {{ formClt.anosTrabalho }} anos de trabalho</p>
                </div>
              </div>

              <div class="result-card highlight">
                <div class="result-icon">📅</div>
                <div class="result-content">
                  <h4>Receita Mensal</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.receitaLiquidaMensal) }}</p>
                  <p class="result-note">Salário + benefícios</p>
                </div>
              </div>

              <div class="result-card highlight">
                <div class="result-icon">🏆</div>
                <div class="result-content">
                  <h4>Receita Anual Total</h4>
                  <p class="result-value">{{ formatCurrency(resultados.clt.receitaLiquidaAnual) }}</p>
                  <p class="result-note">Incluindo 13º e FGTS</p>
                </div>
              </div>

              <div class="result-card breakdown">
                <div class="result-content">
                  <h4>Descontos</h4>
                  <div class="breakdown-item">
                    <span>INSS:</span>
                    <span>{{ formatCurrency(resultados.clt.inss) }}</span>
                  </div>
                  <div class="breakdown-item">
                    <span>IRRF:</span>
                    <span>{{ formatCurrency(resultados.clt.irrf) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resultados PJ -->
          <div class="result-section">
            <h3 class="result-section-title">
              <span class="section-icon">💼</span>
              PJ
            </h3>

            <div class="result-cards">
              <div class="result-card">
                <div class="result-icon">📈</div>
                <div class="result-content">
                  <h4>Faturamento Bruto</h4>
                  <p class="result-value">{{ formatCurrency(resultados.pj.faturamentoBruto) }}</p>
                  <p class="result-note">Mensal</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">🧾</div>
                <div class="result-content">
                  <h4>Impostos</h4>
                  <p class="result-value">{{ formatCurrency(resultados.pj.impostos) }}</p>
                  <p class="result-note">{{ formatPercentage(resultados.pj.aliquotaTotal) }} do faturamento</p>
                </div>
              </div>

              <div class="result-card">
                <div class="result-icon">💼</div>
                <div class="result-content">
                  <h4>Gastos Mensais</h4>
                  <p class="result-value">{{ formatCurrency(formPj.gastosMensais) }}</p>
                  <p class="result-note">Contador, equipamentos, etc.</p>
                </div>
              </div>

              <div class="result-card highlight">
                <div class="result-icon">📅</div>
                <div class="result-content">
                  <h4>Receita Mensal</h4>
                  <p class="result-value">{{ formatCurrency(resultados.pj.receitaLiquida) }}</p>
                  <p class="result-note">Líquida após impostos e gastos</p>
                </div>
              </div>

              <div class="result-card highlight">
                <div class="result-icon">🏆</div>
                <div class="result-content">
                  <h4>Receita Anual Total</h4>
                  <p class="result-value">{{ formatCurrency(resultados.pj.receitaLiquidaAnual) }}</p>
                  <p class="result-note">12 meses de receita líquida</p>
                </div>
              </div>

              <div class="result-card breakdown">
                <div class="result-content">
                  <h4>Categoria</h4>
                  <div class="breakdown-item">
                    <span>Regime:</span>
                    <span>{{ formPj.categoriaTributacao.replace('_', ' ') }}</span>
                  </div>
                  <div class="breakdown-item">
                    <span>Atividade:</span>
                    <span>{{ formPj.atividadePrincipal }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recomendação -->
          <div class="result-section recommendation-section">
            <h3 class="result-section-title">
              <span class="section-icon">🎯</span>
              Recomendação
            </h3>

            <div class="recommendation-card" :class="resultados.recomendacao.statusDecisao">
              <div class="recommendation-header">
                <div class="recommendation-icon">
                  {{ getRiscoIcon(resultados.recomendacao.nivelRisco) }}
                </div>
                <div class="recommendation-status">
                  <h4>{{ resultados.recomendacao.recomendacaoTexto }}</h4>
                  <p class="risk-level">Risco: {{ getRiscoTexto(resultados.recomendacao.nivelRisco) }}</p>
                </div>
              </div>

              <div class="recommendation-content">
                <div class="recommendation-metric">
                  <span class="metric-label">Mínimo recomendado:</span>
                  <span class="metric-value">{{ resultados.recomendacao.percentualMinimoRecomendado }}%</span>
                </div>

                <div class="recommendation-metric">
                  <span class="metric-label">Sua vantagem PJ:</span>
                  <span class="metric-value" :class="{ 'positive': resultados.diferenca.percentualAnual >= 0, 'negative': resultados.diferenca.percentualAnual < 0 }">
                    {{ resultados.diferenca.melhorOpcaoAnual === 'PJ' ? '+' : '-' }}{{ formatPercentage(resultados.diferenca.percentualAnual) }}
                  </span>
                </div>

                <div class="recommendation-justification">
                  <p>{{ resultados.recomendacao.justificativa }}</p>
                </div>

                <div class="risk-factors">
                  <h5>Fatores Considerados:</h5>
                  <ul>
                    <li>📋 Atividade: {{ formPj.atividadePrincipal }}</li>
                    <li>🧾 Regime: {{ formPj.categoriaTributacao.replace('_', ' ') }}</li>
                    <li>⚖️ Estabilidade vs Flexibilidade</li>
                    <li>📊 Benefícios perdidos (FGTS, 13º, férias)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dicas -->
        <div class="tips-card">
          <h3>💡 Considerações Importantes</h3>
          <div class="tips-content">
            <div class="tip-item">
              <strong>🏦 FGTS CLT:</strong> 8% do salário depositado mensalmente pela empresa, disponível para saque em demissão sem justa causa, compra da casa própria ou aposentadoria.
            </div>
            <div class="tip-item">
              <strong>🎊 13º Salário:</strong> CLT recebe 13º salário (gratificação natalina), equivalente a um salário extra por ano.
            </div>
            <div class="tip-item">
              <strong>🏖️ 1/3 de Férias:</strong> CLT recebe 1/3 adicional do salário como abono de férias, garantido pela Constituição Federal.
            </div>
            <div class="tip-item">
              <strong>💰 Flexibilidade PJ:</strong> PJ permite maior flexibilidade de horários, potencial de crescimento de renda e deduções fiscais.
            </div>
            <div class="tip-item">
              <strong>📊 Custos ocultos PJ:</strong> Considere custos com contador (R$ 150-500/mês), equipamentos, internet, previdência privada e "13º próprio".
            </div>
            <div class="tip-item">
              <strong>⚖️ Aspectos legais:</strong> Verifique se não há vínculo empregatício disfarçado (pejotização). CLT tem maior estabilidade legal.
            </div>
            <div class="tip-item">
              <strong>🎯 Planejamento PJ:</strong> Reserve mensalmente para férias, 13º salário, aposentadoria e emergências médicas.
            </div>
            <div class="tip-item">
              <strong>🎯 Recomendação Inteligente:</strong> Nossa recomendação considera percentuais mínimos baseados na sua atividade, regime tributário e riscos. TI precisa +20%, Educação +35%, pois cada área tem diferentes níveis de estabilidade.
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2rem;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  justify-content: center;
}

.breadcrumb-link {
  color: #ffd700;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  color: #ff8c00;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #666;
}

.breadcrumb-current {
  color: #e4e6ea;
}

.content-wrapper {
  display: grid;
  gap: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e4e6ea;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #ffd700;
}

.icon {
  font-size: 1.5rem;
}

.form-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.form-section:hover {
  border-color: rgba(255, 215, 0, 0.2);
}

.form-subsection {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.subsection-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.subsection-icon {
  font-size: 1.3rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #e4e6ea;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix,
.input-suffix {
  position: absolute;
  color: #a0a0a0;
  font-weight: 500;
  pointer-events: none;
  z-index: 2;
}

.input-prefix {
  left: 0.75rem;
}

.input-suffix {
  right: 0.75rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #e4e6ea;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-wrapper .form-input {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

.form-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.form-helper {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #a0a0a0;
  font-style: italic;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  color: #1a1a2e;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e4e6ea;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary:hover {
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.error-message {
  margin: 1.5rem 0;
  padding: 0;
  animation: slideDown 0.3s ease;
}

.error-content {
  background: linear-gradient(135deg, rgba(255, 140, 0, 0.15), rgba(255, 107, 107, 0.1));
  border: 1px solid rgba(255, 140, 0, 0.4);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: #ffb84d;
  font-weight: 500;
  font-size: 0.9rem;
  text-align: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.decision-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.decision-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.decision-card.pj {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.decision-card.clt {
  border-color: #2196f3;
  background: rgba(33, 150, 243, 0.1);
}

.decision-icon {
  font-size: 3.5rem;
  flex-shrink: 0;
}

.decision-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #e4e6ea;
}

.decision-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffd700;
  margin-bottom: 0.25rem;
}

.decision-percentage {
  font-size: 1rem;
  color: #a0a0a0;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.result-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.result-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
}

.section-icon {
  font-size: 1.3rem;
}

.result-cards {
  display: grid;
  gap: 1rem;
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.result-card.highlight {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.result-card.breakdown {
  flex-direction: column;
  align-items: stretch;
}

.result-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.result-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #e4e6ea;
}

.result-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffd700;
}

.result-note {
  font-size: 0.75rem;
  color: #a0a0a0;
  margin-top: 0.25rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.85rem;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-item span:first-child {
  color: #a0a0a0;
}

.breakdown-item span:last-child {
  color: #e4e6ea;
  font-weight: 600;
}

.tips-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.tips-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #e4e6ea;
}

.tips-content {
  display: grid;
  gap: 1rem;
}

.tip-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #ffd700;
  color: #e4e6ea;
  line-height: 1.6;
}

.tip-item strong {
  color: #ffd700;
}

/* Estilos para Recomendação */
.recommendation-section {
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.recommendation-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid;
  transition: all 0.3s ease;
}

.recommendation-card.recomendado {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.recommendation-card.neutro {
  border-color: #ff9800;
  background: rgba(255, 152, 0, 0.1);
}

.recommendation-card.nao_recomendado {
  border-color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.recommendation-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.recommendation-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.recommendation-status h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #e4e6ea;
}

.risk-level {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin: 0;
}

.recommendation-content {
  display: grid;
  gap: 1rem;
}

.recommendation-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.metric-label {
  color: #a0a0a0;
  font-weight: 500;
}

.metric-value {
  color: #e4e6ea;
  font-weight: 700;
  font-size: 1.1rem;
}

.metric-value.positive {
  color: #4caf50;
}

.metric-value.negative {
  color: #f44336;
}

.recommendation-justification {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid #ffd700;
}

.recommendation-justification p {
  margin: 0;
  color: #e4e6ea;
  line-height: 1.5;
}

.risk-factors h5 {
  color: #ffd700;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.risk-factors ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.risk-factors li {
  color: #a0a0a0;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  padding-left: 0.5rem;
}

/* Responsividade */
@media (max-width: 1200px) {
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .recommendation-section {
    order: -1; /* Mostra primeiro em mobile */
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-section,
  .results-section {
    padding: 1.5rem;
  }

  .form-subsection {
    padding: 1rem;
  }

  .decision-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .decision-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .decision-icon {
    font-size: 3rem;
  }

  .result-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .result-icon {
    font-size: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .form-section,
  .results-section {
    padding: 1rem;
  }

  .section-header h2 {
    font-size: 1rem;
    padding: 0.75rem;
  }

  .subsection-title {
    font-size: 1rem;
  }

  .decision-value {
    font-size: 1.1rem;
  }

  .result-value {
    font-size: 1rem;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }
}
</style>
