/**
 * Composable para lógica de cálculo de custo de funcionário
 */

import { ref, computed, reactive } from 'vue'
import type {
  FuncionarioData,
  BeneficiosData,
  ConfiguracoesData,
  ResultadoCustoFuncionario,
  EncargosCalculados,
  BeneficiosCalculados,
  MascarasCampos
} from '@/types/custoFuncionario'

export function useCustoFuncionario() {
  // Estados reativos dos formulários
  const funcionario = reactive<FuncionarioData>({
    salarioBruto: 0,
    cargo: '',
    regimeTributario: 'SIMPLES_NACIONAL',
    tipoContrato: 'CLT'
  })

  const beneficios = reactive<BeneficiosData>({
    valeTransporte: 0,
    valeAlimentacao: 0,
    valeRefeicao: 0,
    planoSaude: 0,
    planoOdontologico: 0,
    seguroVida: 0,
    auxilioCreche: 0,
    auxilioEducacao: 0,
    previdenciaPrivada: 0,
    ticketCultura: 0,
    uniformesEpis: 0,
    outrosBeneficios: 0
  })

  const configuracoes = reactive<ConfiguracoesData>({
    percentualValeTransporte: 6, // 6% máximo por lei
    percentualValeAlimentacao: 20, // 20% máximo por lei
    percentualValeRefeicao: 20, // 20% máximo por lei
    aliquotaSAT: 1, // 1% para atividade de baixo risco
    temAdicionalPericulosidade: false,
    temAdicionalInsalubridade: false,
    temAdicionalNoturno: false,
    percentualHorasExtras: 0,
    percentualPpr: 0, // PPR anual como % do salário
    contribuicaoSindical: 0
  })

  // Máscaras para campos monetários
  const mascaras = reactive<MascarasCampos>({
    salarioBrutoMask: '',
    valeTransporteMask: '',
    valeAlimentacaoMask: '',
    valeRefeicaoMask: '',
    planoSaudeMask: '',
    planoOdontologicoMask: '',
    seguroVidaMask: '',
    auxilioCrecheMask: '',
    auxilioEducacaoMask: '',
    previdenciaPrivadaMask: '',
    ticketCulturaMask: '',
    uniformesEpisMask: '',
    contribuicaoSindicalMask: '',
    outrosBeneficiosMask: ''
  })

  // Estado para controlar exibição dos resultados
  const showResults = ref(false)
  const erroValidacao = ref('')

  /**
   * Calcula os encargos obrigatórios
   */
    const calcularEncargos = (): EncargosCalculados => {
    const { salarioBruto } = funcionario
    const {
      aliquotaSAT,
      temAdicionalPericulosidade,
      temAdicionalInsalubridade,
      temAdicionalNoturno,
      percentualHorasExtras,
      percentualPpr,
      contribuicaoSindical
    } = configuracoes

    // Base para cálculos
    let salarioBase = salarioBruto

    // Adicionais que integram a base de cálculo
    const adicionalPericulosidade = temAdicionalPericulosidade ? salarioBruto * 0.30 : 0
    const adicionalInsalubridade = temAdicionalInsalubridade ? 1412 * 0.40 : 0 // 40% do salário mínimo
    const adicionalNoturno = temAdicionalNoturno ? salarioBruto * 0.20 : 0 // 20% adicional noturno
    const horasExtras = salarioBruto * (percentualHorasExtras / 100)

    // Salário que serve de base para encargos
    salarioBase = salarioBruto + adicionalPericulosidade + adicionalInsalubridade + adicionalNoturno + horasExtras

    // Encargos básicos obrigatórios
    const inssPatronal = salarioBase * 0.20 // 20% sempre
    const fgts = salarioBase * 0.08 // 8% sempre
    const provisaoFerias = salarioBase * (1 + 1/3) / 12 // Salário + 1/3 dividido por 12
    const provisaoDecimoTerceiro = salarioBase / 12 // 1/12 do salário

    // PPR (distribuído mensalmente)
    const ppr = (salarioBruto * (percentualPpr / 100)) / 12

    // Encargos que dependem do regime tributário
    let sat = 0
    let sistemaS = 0
    let salarioEducacao = 0

    if (funcionario.regimeTributario === 'LUCRO_PRESUMIDO' || funcionario.regimeTributario === 'LUCRO_REAL') {
      sat = salarioBase * (aliquotaSAT / 100) // 1%, 2% ou 3%
      sistemaS = salarioBase * 0.058 // SESI (1.5%) + SENAI (1.0%) + SEBRAE (0.6%) + INCRA (0.2%) + Salário Educação (2.5%) = 5.8%
      salarioEducacao = 0 // Já incluído no Sistema S
    }

    // Contribuição sindical (distribuída mensalmente)
    const contribuicaoSindicalMensal = contribuicaoSindical / 12

    const totalEncargos = inssPatronal + fgts + provisaoFerias + provisaoDecimoTerceiro +
                         sat + sistemaS + adicionalPericulosidade + adicionalInsalubridade +
                         adicionalNoturno + horasExtras + ppr + contribuicaoSindicalMensal

    return {
      salarioBruto,
      inssPatronal,
      fgts,
      provisaoFerias,
      provisaoDecimoTerceiro,
      sat,
      sistemaS,
      salarioEducacao,
      adicionalPericulosidade,
      adicionalInsalubridade,
      adicionalNoturno,
      horasExtras,
      ppr,
      contribuicaoSindical: contribuicaoSindicalMensal,
      totalEncargos
    }
  }

  /**
   * Calcula os custos com benefícios
   */
    const calcularBeneficios = (): BeneficiosCalculados => {
    const { salarioBruto } = funcionario
    const { percentualValeTransporte, percentualValeAlimentacao, percentualValeRefeicao } = configuracoes

    // Cálculo do vale transporte (empresa paga a diferença)
    const valeTransporteDesconto = Math.min(
      beneficios.valeTransporte,
      salarioBruto * (percentualValeTransporte / 100)
    )
    const valeTransporteLiquido = Math.max(0, beneficios.valeTransporte - valeTransporteDesconto)

    // Cálculo do vale alimentação (empresa paga a diferença)
    const valeAlimentacaoDesconto = Math.min(
      beneficios.valeAlimentacao,
      salarioBruto * (percentualValeAlimentacao / 100)
    )
    const valeAlimentacaoLiquido = Math.max(0, beneficios.valeAlimentacao - valeAlimentacaoDesconto)

    // Cálculo do vale refeição (empresa paga a diferença)
    const valeRefeicaoDesconto = Math.min(
      beneficios.valeRefeicao,
      salarioBruto * (percentualValeRefeicao / 100)
    )
    const valeRefeicaoLiquido = Math.max(0, beneficios.valeRefeicao - valeRefeicaoDesconto)

    const totalBeneficios = valeTransporteLiquido + valeAlimentacaoLiquido + valeRefeicaoLiquido +
                           beneficios.planoSaude + beneficios.planoOdontologico + beneficios.seguroVida +
                           beneficios.auxilioCreche + beneficios.auxilioEducacao + beneficios.previdenciaPrivada +
                           beneficios.ticketCultura + beneficios.uniformesEpis + beneficios.outrosBeneficios

    return {
      valeTransporteLiquido,
      valeAlimentacaoLiquido,
      valeRefeicaoLiquido,
      valeTransporteDesconto,
      valeAlimentacaoDesconto,
      valeRefeicaoDesconto,
      planoSaude: beneficios.planoSaude,
      planoOdontologico: beneficios.planoOdontologico,
      seguroVida: beneficios.seguroVida,
      auxilioCreche: beneficios.auxilioCreche,
      auxilioEducacao: beneficios.auxilioEducacao,
      previdenciaPrivada: beneficios.previdenciaPrivada,
      ticketCultura: beneficios.ticketCultura,
      uniformesEpis: beneficios.uniformesEpis,
      outrosBeneficios: beneficios.outrosBeneficios,
      totalBeneficios
    }
  }

  /**
   * Calcula o resultado completo
   */
  const calcularResultados = (): ResultadoCustoFuncionario => {
    const encargos = calcularEncargos()
    const beneficiosCalc = calcularBeneficios()

    const custoTotalMensal = encargos.salarioBruto + encargos.totalEncargos + beneficiosCalc.totalBeneficios
    const custoTotalAnual = custoTotalMensal * 12
    const percentualEncargos = funcionario.salarioBruto > 0 ? (encargos.totalEncargos / funcionario.salarioBruto) * 100 : 0
    const custoHoraTrabalho = custoTotalMensal / 220 // 220 horas por mês
    const multiplicadorCusto = funcionario.salarioBruto > 0 ? custoTotalMensal / funcionario.salarioBruto : 0

    return {
      encargos,
      beneficios: beneficiosCalc,
      resumo: {
        custoTotalMensal,
        custoTotalAnual,
        percentualEncargos,
        custoHoraTrabalho,
        multiplicadorCusto
      }
    }
  }

  // Computed para os resultados
  const resultados = computed(() => {
    if (!showResults.value) return null
    return calcularResultados()
  })

  /**
   * Validação dos campos
   */
  const validarCampos = (): boolean => {
    erroValidacao.value = ''

    if (funcionario.salarioBruto <= 0) {
      erroValidacao.value = '💰 Informe o salário bruto do funcionário'
      return false
    }

    if (funcionario.salarioBruto < 1412) {
      erroValidacao.value = '📊 Salário deve ser pelo menos o salário mínimo (R$ 1.412)'
      return false
    }

    if (configuracoes.percentualValeTransporte > 6) {
      erroValidacao.value = '🚌 Desconto do vale transporte não pode ser superior a 6%'
      return false
    }

    if (configuracoes.percentualValeAlimentacao > 20) {
      erroValidacao.value = '🍽️ Desconto do vale alimentação não pode ser superior a 20%'
      return false
    }

    if (configuracoes.percentualValeRefeicao > 20) {
      erroValidacao.value = '🍕 Desconto do vale refeição não pode ser superior a 20%'
      return false
    }

    if (configuracoes.aliquotaSAT < 1 || configuracoes.aliquotaSAT > 3) {
      erroValidacao.value = '⚠️ Alíquota SAT deve estar entre 1% e 3%'
      return false
    }

    if (configuracoes.percentualHorasExtras < 0 || configuracoes.percentualHorasExtras > 50) {
      erroValidacao.value = '⏰ Percentual de horas extras deve estar entre 0% e 50%'
      return false
    }

    if (configuracoes.percentualPpr < 0 || configuracoes.percentualPpr > 200) {
      erroValidacao.value = '💰 Percentual de PPR deve estar entre 0% e 200%'
      return false
    }

    if (configuracoes.contribuicaoSindical < 0) {
      erroValidacao.value = '🏛️ Contribuição sindical não pode ser negativa'
      return false
    }

    return true
  }

  /**
   * Função principal de cálculo
   */
  const calcular = () => {
    if (!validarCampos()) {
      return
    }

    showResults.value = true
    erroValidacao.value = ''
  }

  /**
   * Limpar formulário
   */
  const limpar = () => {
    // Reset funcionário
    Object.assign(funcionario, {
      salarioBruto: 0,
      cargo: '',
      regimeTributario: 'SIMPLES_NACIONAL',
      tipoContrato: 'CLT'
    })

    // Reset benefícios
    Object.assign(beneficios, {
      valeTransporte: 0,
      valeAlimentacao: 0,
      valeRefeicao: 0,
      planoSaude: 0,
      planoOdontologico: 0,
      seguroVida: 0,
      auxilioCreche: 0,
      auxilioEducacao: 0,
      previdenciaPrivada: 0,
      ticketCultura: 0,
      uniformesEpis: 0,
      outrosBeneficios: 0
    })

    // Reset configurações para valores padrão
    Object.assign(configuracoes, {
      percentualValeTransporte: 6,
      percentualValeAlimentacao: 20,
      percentualValeRefeicao: 20,
      aliquotaSAT: 1,
      temAdicionalPericulosidade: false,
      temAdicionalInsalubridade: false,
      temAdicionalNoturno: false,
      percentualHorasExtras: 0,
      percentualPpr: 0,
      contribuicaoSindical: 0
    })

    // Limpar máscaras
    Object.keys(mascaras).forEach(key => {
      mascaras[key as keyof MascarasCampos] = ''
    })

    // Reset estado
    erroValidacao.value = ''
    showResults.value = false
  }

  /**
   * Funções auxiliares para descrições
   */
  const getDescricaoRegime = (regime: string): string => {
    switch (regime) {
      case 'SIMPLES_NACIONAL':
        return 'Regime simplificado - Menor carga tributária'
      case 'LUCRO_PRESUMIDO':
        return 'Tributação baseada em presunção de lucro'
      case 'LUCRO_REAL':
        return 'Tributação sobre lucro real apurado'
      default:
        return ''
    }
  }

  const getDescricaoTipoContrato = (tipo: string): string => {
    switch (tipo) {
      case 'CLT':
        return 'Consolidação das Leis do Trabalho'
      case 'APRENDIZ':
        return 'Contrato de aprendizagem - Encargos reduzidos'
      case 'ESTAGIARIO':
        return 'Estágio - Sem vínculo empregatício'
      default:
        return ''
    }
  }

  return {
    // Estados
    funcionario,
    beneficios,
    configuracoes,
    mascaras,
    showResults,
    erroValidacao,

    // Computed
    resultados,

    // Métodos
    calcular,
    limpar,
    validarCampos,
    calcularEncargos,
    calcularBeneficios,
    calcularResultados,
    getDescricaoRegime,
    getDescricaoTipoContrato
  }
}
