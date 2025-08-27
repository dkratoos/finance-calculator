export interface FuncionarioData {
  salarioBruto: number           // Salário base
  cargo: string                  // Para personalização de cálculos
  regimeTributario: 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'
  tipoContrato: 'CLT' | 'APRENDIZ' | 'ESTAGIARIO'
}

export interface MascarasCampos {
  salarioBrutoMask: string
  valeTransporteMask: string
  valeAlimentacaoMask: string
  valeRefeicaoMask: string
  planoSaudeMask: string
  planoOdontologicoMask: string
  seguroVidaMask: string
  auxilioCrecheMask: string
  auxilioEducacaoMask: string
  previdenciaPrivadaMask: string
  ticketCulturaMask: string
  uniformesEpisMask: string
  contribuicaoSindicalMask: string
  outrosBeneficiosMask: string
}

export interface BeneficiosData {
  valeTransporte: number         // Valor mensal
  valeAlimentacao: number        // Valor mensal
  valeRefeicao: number          // Valor mensal (diferente do VA)
  planoSaude: number            // Custo empresa
  planoOdontologico: number     // Custo empresa
  seguroVida: number            // Custo empresa
  auxilioCreche: number         // Se aplicável
  auxilioEducacao: number       // Faculdade, cursos
  previdenciaPrivada: number    // PGBL, VGBL
  ticketCultura: number         // Lazer e cultura
  uniformesEpis: number         // Uniformes e EPIs
  outrosBeneficios: number      // Gympass, etc.
}

export interface ConfiguracoesData {
  percentualValeTransporte: number  // % desconto funcionário (6% max)
  percentualValeAlimentacao: number // % desconto funcionário (20% max)
  percentualValeRefeicao: number   // % desconto funcionário (20% max)
  aliquotaSAT: number              // 1%, 2% ou 3% conforme grau de risco
  temAdicionalPericulosidade: boolean
  temAdicionalInsalubridade: boolean
  temAdicionalNoturno: boolean     // Trabalho noturno (22h-5h)
  percentualHorasExtras: number     // % média mensal
  percentualPpr: number            // PPR anual
  contribuicaoSindical: number     // Valor anual
}

export interface EncargosCalculados {
  salarioBruto: number
  inssPatronal: number
  fgts: number
  provisaoFerias: number
  provisaoDecimoTerceiro: number
  sat: number
  sistemaS: number
  salarioEducacao: number
  adicionalPericulosidade: number
  adicionalInsalubridade: number
  adicionalNoturno: number
  horasExtras: number
  ppr: number
  contribuicaoSindical: number
  totalEncargos: number
}

export interface BeneficiosCalculados {
  valeTransporteLiquido: number
  valeAlimentacaoLiquido: number
  valeRefeicaoLiquido: number
  valeTransporteDesconto: number
  valeAlimentacaoDesconto: number
  valeRefeicaoDesconto: number
  planoSaude: number
  planoOdontologico: number
  seguroVida: number
  auxilioCreche: number
  auxilioEducacao: number
  previdenciaPrivada: number
  ticketCultura: number
  uniformesEpis: number
  outrosBeneficios: number
  totalBeneficios: number
}

export interface ResultadoCustoFuncionario {
  encargos: EncargosCalculados
  beneficios: BeneficiosCalculados
  resumo: {
    custoTotalMensal: number
    custoTotalAnual: number
    percentualEncargos: number // Encargos/Salário * 100
    custoHoraTrabalho: number // Considerando 220h/mês
    multiplicadorCusto: number // CustoTotal/SalarioBruto
  }
}
