<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formatCurrency, formatPercentage, applyCurrencyMask } from '@/utils/formatters'
import { useCustoFuncionario } from '@/composables/useCustoFuncionario'

const {
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
  getDescricaoRegime,
  getDescricaoTipoContrato
} = useCustoFuncionario()

// Funções para aplicar máscaras de moeda - Funcionário
const aplicarMascaraSalario = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.salarioBrutoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.salarioBrutoMask.replace(/\./g, '').replace(',', '.')
  funcionario.salarioBruto = parseFloat(numericValue) || 0
}

// Funções para aplicar máscaras de moeda - Benefícios
const aplicarMascaraValeTransporte = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valeTransporteMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valeTransporteMask.replace(/\./g, '').replace(',', '.')
  beneficios.valeTransporte = parseFloat(numericValue) || 0
}

const aplicarMascaraValeAlimentacao = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valeAlimentacaoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valeAlimentacaoMask.replace(/\./g, '').replace(',', '.')
  beneficios.valeAlimentacao = parseFloat(numericValue) || 0
}

const aplicarMascaraPlanoSaude = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.planoSaudeMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.planoSaudeMask.replace(/\./g, '').replace(',', '.')
  beneficios.planoSaude = parseFloat(numericValue) || 0
}

const aplicarMascaraPlanoOdonto = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.planoOdontologicoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.planoOdontologicoMask.replace(/\./g, '').replace(',', '.')
  beneficios.planoOdontologico = parseFloat(numericValue) || 0
}

const aplicarMascaraSeguroVida = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.seguroVidaMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.seguroVidaMask.replace(/\./g, '').replace(',', '.')
  beneficios.seguroVida = parseFloat(numericValue) || 0
}

const aplicarMascaraAuxilioCreche = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.auxilioCrecheMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.auxilioCrecheMask.replace(/\./g, '').replace(',', '.')
  beneficios.auxilioCreche = parseFloat(numericValue) || 0
}

const aplicarMascaraValeRefeicao = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valeRefeicaoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valeRefeicaoMask.replace(/\./g, '').replace(',', '.')
  beneficios.valeRefeicao = parseFloat(numericValue) || 0
}

const aplicarMascaraAuxilioEducacao = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.auxilioEducacaoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.auxilioEducacaoMask.replace(/\./g, '').replace(',', '.')
  beneficios.auxilioEducacao = parseFloat(numericValue) || 0
}

const aplicarMascaraPrevidenciaPrivada = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.previdenciaPrivadaMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.previdenciaPrivadaMask.replace(/\./g, '').replace(',', '.')
  beneficios.previdenciaPrivada = parseFloat(numericValue) || 0
}

const aplicarMascaraTicketCultura = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.ticketCulturaMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.ticketCulturaMask.replace(/\./g, '').replace(',', '.')
  beneficios.ticketCultura = parseFloat(numericValue) || 0
}

const aplicarMascaraUniformesEpis = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.uniformesEpisMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.uniformesEpisMask.replace(/\./g, '').replace(',', '.')
  beneficios.uniformesEpis = parseFloat(numericValue) || 0
}

const aplicarMascaraContribuicaoSindical = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.contribuicaoSindicalMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.contribuicaoSindicalMask.replace(/\./g, '').replace(',', '.')
  configuracoes.contribuicaoSindical = parseFloat(numericValue) || 0
}

const aplicarMascaraOutrosBeneficios = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.outrosBeneficiosMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.outrosBeneficiosMask.replace(/\./g, '').replace(',', '.')
  beneficios.outrosBeneficios = parseFloat(numericValue) || 0
}

// Função auxiliar para ícones dos regimes
const getRegimeIcon = (regime: string): string => {
  switch (regime) {
    case 'SIMPLES_NACIONAL':
      return '🏢'
    case 'LUCRO_PRESUMIDO':
      return '📊'
    case 'LUCRO_REAL':
      return '💼'
    default:
      return '🏛️'
  }
}

// Função auxiliar para ícones dos tipos de contrato
const getContratoIcon = (tipo: string): string => {
  switch (tipo) {
    case 'CLT':
      return '👔'
    case 'APRENDIZ':
      return '🎓'
    case 'ESTAGIARIO':
      return '📚'
    default:
      return '📋'
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
        <span class="breadcrumb-current">CUSTO FUNCIONÁRIO</span>
      </div>
    </header>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Form Section -->
      <section class="form-section">
        <div class="section-header">
          <h2>
            <span class="icon">👥</span>
            CALCULADORA DE CUSTO DE FUNCIONÁRIO
          </h2>
        </div>

        <form @submit.prevent="calcular" class="finance-form">
          <!-- Seção Dados do Funcionário -->
          <div class="form-subsection">
            <h3 class="subsection-title">
              <span class="subsection-icon">👔</span>
              Dados do Funcionário
            </h3>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Salário Bruto</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.salarioBrutoMask"
                    @input="aplicarMascaraSalario"
                    type="text"
                    class="form-input"
                    placeholder="5.000,00"
                  >
                </div>
                <small class="form-helper">Salário base mensal do funcionário</small>
              </div>

              <div class="form-group">
                <label class="form-label">Cargo</label>
                <input
                  v-model="funcionario.cargo"
                  type="text"
                  class="form-input"
                  placeholder="Analista de Sistemas"
                >
                <small class="form-helper">Função exercida pelo funcionário</small>
              </div>

              <div class="form-group">
                <label class="form-label">Regime Tributário</label>
                <select v-model="funcionario.regimeTributario" class="form-input">
                    <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                    <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                    <option value="LUCRO_REAL">Lucro Real</option>
                  </select>
                <small class="form-helper">{{ getDescricaoRegime(funcionario.regimeTributario) }}</small>
              </div>

              <div class="form-group">
                <label class="form-label">Tipo de Contrato</label>
                <select v-model="funcionario.tipoContrato" class="form-input">
                    <option value="CLT">CLT</option>
                    <option value="APRENDIZ">Aprendiz</option>
                    <option value="ESTAGIARIO">Estagiário</option>
                  </select>
                <small class="form-helper">{{ getDescricaoTipoContrato(funcionario.tipoContrato) }}</small>
              </div>
            </div>
          </div>

          <!-- Seção Benefícios -->
          <div class="form-subsection">
            <h3 class="subsection-title">
              <span class="subsection-icon">🎁</span>
              Benefícios e Vales
            </h3>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Vale Transporte</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.valeTransporteMask"
                    @input="aplicarMascaraValeTransporte"
                    type="text"
                    class="form-input"
                    placeholder="200,00"
                  >
                </div>
                <small class="form-helper">Valor total do vale transporte</small>
              </div>

              <div class="form-group">
                <label class="form-label">Vale Alimentação</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.valeAlimentacaoMask"
                    @input="aplicarMascaraValeAlimentacao"
                    type="text"
                    class="form-input"
                    placeholder="800,00"
                  >
                </div>
                <small class="form-helper">Valor total do vale alimentação</small>
              </div>

              <div class="form-group">
                <label class="form-label">Plano de Saúde</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.planoSaudeMask"
                    @input="aplicarMascaraPlanoSaude"
                    type="text"
                    class="form-input"
                    placeholder="350,00"
                  >
                </div>
                <small class="form-helper">Custo mensal para a empresa</small>
              </div>

              <div class="form-group">
                <label class="form-label">Plano Odontológico</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.planoOdontologicoMask"
                    @input="aplicarMascaraPlanoOdonto"
                    type="text"
                    class="form-input"
                    placeholder="80,00"
                  >
                </div>
                <small class="form-helper">Custo mensal para a empresa</small>
              </div>

              <div class="form-group">
                <label class="form-label">Seguro de Vida</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.seguroVidaMask"
                    @input="aplicarMascaraSeguroVida"
                    type="text"
                    class="form-input"
                    placeholder="50,00"
                  >
                </div>
                <small class="form-helper">Custo mensal para a empresa</small>
              </div>

              <div class="form-group">
                <label class="form-label">Auxílio Creche</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.auxilioCrecheMask"
                    @input="aplicarMascaraAuxilioCreche"
                    type="text"
                    class="form-input"
                    placeholder="300,00"
                  >
                </div>
                <small class="form-helper">Se aplicável</small>
              </div>

              <div class="form-group">
                <label class="form-label">Vale Refeição</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.valeRefeicaoMask"
                    @input="aplicarMascaraValeRefeicao"
                    type="text"
                    class="form-input"
                    placeholder="600,00"
                  >
                </div>
                <small class="form-helper">Diferente do vale alimentação</small>
              </div>

              <div class="form-group">
                <label class="form-label">Auxílio Educação</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.auxilioEducacaoMask"
                    @input="aplicarMascaraAuxilioEducacao"
                    type="text"
                    class="form-input"
                    placeholder="500,00"
                  >
                </div>
                <small class="form-helper">Cursos, faculdade, especializações</small>
              </div>

              <div class="form-group">
                <label class="form-label">Previdência Privada</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.previdenciaPrivadaMask"
                    @input="aplicarMascaraPrevidenciaPrivada"
                    type="text"
                    class="form-input"
                    placeholder="300,00"
                  >
                </div>
                <small class="form-helper">PGBL, VGBL ou similar</small>
              </div>

              <div class="form-group">
                <label class="form-label">Ticket Cultura</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.ticketCulturaMask"
                    @input="aplicarMascaraTicketCultura"
                    type="text"
                    class="form-input"
                    placeholder="100,00"
                  >
                </div>
                <small class="form-helper">Lazer e atividades culturais</small>
              </div>

              <div class="form-group">
                <label class="form-label">Uniformes e EPIs</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.uniformesEpisMask"
                    @input="aplicarMascaraUniformesEpis"
                    type="text"
                    class="form-input"
                    placeholder="150,00"
                  >
                </div>
                <small class="form-helper">Custo mensal médio com uniformes e EPIs</small>
              </div>

              <div class="form-group">
                <label class="form-label">Outros Benefícios</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.outrosBeneficiosMask"
                    @input="aplicarMascaraOutrosBeneficios"
                    type="text"
                    class="form-input"
                    placeholder="200,00"
                  >
                </div>
                <small class="form-helper">Gympass, convênios, etc.</small>
              </div>
            </div>
          </div>

          <!-- Seção Configurações -->
          <div class="form-subsection">
            <h3 class="subsection-title">
              <span class="subsection-icon">⚙️</span>
              Configurações Avançadas
            </h3>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Desconto Vale Transporte</label>
                <div class="input-wrapper">
                  <input
                    v-model.number="configuracoes.percentualValeTransporte"
                    type="number"
                    class="form-input"
                    placeholder="6"
                    min="0"
                    max="6"
                    step="0.1"
                  >
                  <span class="input-suffix">%</span>
                </div>
                <small class="form-helper">Máximo 6% do salário (Lei)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Desconto Vale Alimentação</label>
                <div class="input-wrapper">
                  <input
                    v-model.number="configuracoes.percentualValeAlimentacao"
                    type="number"
                    class="form-input"
                    placeholder="20"
                    min="0"
                    max="20"
                    step="0.1"
                  >
                  <span class="input-suffix">%</span>
                </div>
                <small class="form-helper">Máximo 20% do salário (Lei)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Desconto Vale Refeição</label>
                <div class="input-wrapper">
                  <input
                    v-model.number="configuracoes.percentualValeRefeicao"
                    type="number"
                    class="form-input"
                    placeholder="20"
                    min="0"
                    max="20"
                    step="0.1"
                  >
                  <span class="input-suffix">%</span>
                </div>
                <small class="form-helper">Máximo 20% do salário (Lei)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Alíquota SAT</label>
                <div class="input-wrapper">
                  <select v-model.number="configuracoes.aliquotaSAT" class="form-input">
                    <option :value="1">1% - Risco Leve</option>
                    <option :value="2">2% - Risco Médio</option>
                    <option :value="3">3% - Risco Grave</option>
                  </select>
                </div>
                <small class="form-helper">Seguro de Acidente do Trabalho</small>
              </div>

              <div class="form-group">
                <label class="form-label">Percentual Horas Extras</label>
                <div class="input-wrapper">
                  <input
                    v-model.number="configuracoes.percentualHorasExtras"
                    type="number"
                    class="form-input"
                    placeholder="10"
                    min="0"
                    max="50"
                    step="0.1"
                  >
                  <span class="input-suffix">%</span>
                </div>
                <small class="form-helper">Média mensal sobre o salário</small>
              </div>

              <div class="form-group">
                <label class="form-label">Adicional Periculosidade</label>
                <div class="custom-checkbox-wrapper">
                  <input
                    v-model="configuracoes.temAdicionalPericulosidade"
                    type="checkbox"
                    class="custom-checkbox-input"
                    id="periculosidade"
                  >
                  <label for="periculosidade" class="custom-checkbox-label">
                    <div class="custom-checkbox">
                      <div class="checkbox-checkmark">
                        <svg viewBox="0 0 24 24" class="checkmark-icon">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="checkbox-content">
                      <span class="checkbox-title">☢️ Atividade Perigosa</span>
                      <span class="checkbox-description">Adicional de 30% sobre o salário base</span>
                    </div>
                  </label>
                </div>
                <small class="form-helper">Para atividades com risco de explosões, inflamáveis, etc.</small>
              </div>

              <div class="form-group">
                <label class="form-label">Adicional Insalubridade</label>
                <div class="custom-checkbox-wrapper">
                  <input
                    v-model="configuracoes.temAdicionalInsalubridade"
                    type="checkbox"
                    class="custom-checkbox-input"
                    id="insalubridade"
                  >
                  <label for="insalubridade" class="custom-checkbox-label">
                    <div class="custom-checkbox">
                      <div class="checkbox-checkmark">
                        <svg viewBox="0 0 24 24" class="checkmark-icon">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="checkbox-content">
                      <span class="checkbox-title">🦠 Atividade Insalubre</span>
                      <span class="checkbox-description">Adicional de 40% do salário mínimo</span>
                    </div>
                  </label>
                </div>
                <small class="form-helper">Para atividades nocivas à saúde (ruído, químicos, etc.)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Adicional Noturno</label>
                <div class="custom-checkbox-wrapper">
                  <input
                    v-model="configuracoes.temAdicionalNoturno"
                    type="checkbox"
                    class="custom-checkbox-input"
                    id="noturno"
                  >
                  <label for="noturno" class="custom-checkbox-label">
                    <div class="custom-checkbox">
                      <div class="checkbox-checkmark">
                        <svg viewBox="0 0 24 24" class="checkmark-icon">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="checkbox-content">
                      <span class="checkbox-title">🌙 Adicional Noturno</span>
                      <span class="checkbox-description">Adicional de 20% para trabalho noturno (22h-5h)</span>
                    </div>
                  </label>
                </div>
                <small class="form-helper">Para trabalho entre 22h e 5h da manhã</small>
              </div>

              <div class="form-group">
                <label class="form-label">PPR Anual</label>
                <div class="input-wrapper">
                  <input
                    v-model.number="configuracoes.percentualPpr"
                    type="number"
                    class="form-input"
                    placeholder="50"
                    min="0"
                    max="200"
                    step="0.1"
                  >
                  <span class="input-suffix">%</span>
                </div>
                <small class="form-helper">Participação nos Lucros como % do salário anual</small>
              </div>

              <div class="form-group">
                <label class="form-label">Contribuição Sindical</label>
                <div class="input-wrapper">
                  <span class="input-prefix">R$</span>
                  <input
                    v-model="mascaras.contribuicaoSindicalMask"
                    @input="aplicarMascaraContribuicaoSindical"
                    type="text"
                    class="form-input"
                    placeholder="120,00"
                  >
                </div>
                <small class="form-helper">Valor anual da contribuição sindical</small>
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
              💰 CALCULAR CUSTO
            </button>
          </div>
        </form>
      </section>

      <!-- Results Section -->
      <section v-if="showResults && resultados" class="results-section">
        <div class="section-header">
          <h2>
            <span class="icon">📊</span>
            ANÁLISE DE CUSTO DO FUNCIONÁRIO
          </h2>
        </div>

        <!-- Cards de Resumo Principal -->
        <div class="summary-card">
          <h3>💡 Resumo Executivo</h3>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">💰 Custo Total Mensal:</span>
              <span class="summary-value">{{ formatCurrency(resultados.resumo.custoTotalMensal) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">📅 Custo Total Anual:</span>
              <span class="summary-value">{{ formatCurrency(resultados.resumo.custoTotalAnual) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">📈 Multiplicador de Custo:</span>
              <span class="summary-value">{{ resultados.resumo.multiplicadorCusto.toFixed(2) }}x</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">⏱️ Custo por Hora:</span>
              <span class="summary-value">{{ formatCurrency(resultados.resumo.custoHoraTrabalho) }}</span>
            </div>
          </div>
        </div>

        <div class="results-grid">
          <!-- Seção Salário Base -->
          <div class="result-card highlight">
            <div class="result-icon">💰</div>
            <div class="result-content">
              <h3>Salário Base</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.salarioBruto) }}</p>
              <p class="result-note">Valor contratual mensal</p>
            </div>
          </div>

          <!-- Seção Encargos Obrigatórios -->
          <div class="result-card">
            <div class="result-icon">🏦</div>
            <div class="result-content">
              <h3>INSS Patronal (20%)</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.inssPatronal) }}</p>
              <p class="result-note">Contribuição previdenciária</p>
            </div>
          </div>

          <div class="result-card">
            <div class="result-icon">🛡️</div>
            <div class="result-content">
              <h3>FGTS (8%)</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.fgts) }}</p>
              <p class="result-note">Fundo de Garantia</p>
            </div>
          </div>

          <div class="result-card">
            <div class="result-icon">🏖️</div>
            <div class="result-content">
              <h3>Provisão Férias</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.provisaoFerias) }}</p>
              <p class="result-note">Salário + 1/3 ÷ 12</p>
            </div>
          </div>

          <div class="result-card">
            <div class="result-icon">🎊</div>
            <div class="result-content">
              <h3>Provisão 13º Salário</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.provisaoDecimoTerceiro) }}</p>
              <p class="result-note">1/12 do salário</p>
            </div>
          </div>

          <!-- Encargos por Regime -->
          <div v-if="resultados.encargos.sat > 0" class="result-card warning">
            <div class="result-icon">⚠️</div>
            <div class="result-content">
              <h3>SAT ({{ configuracoes.aliquotaSAT }}%)</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.sat) }}</p>
              <p class="result-note">Seguro Acidente Trabalho</p>
            </div>
          </div>

          <div v-if="resultados.encargos.sistemaS > 0" class="result-card warning">
            <div class="result-icon">🏭</div>
            <div class="result-content">
              <h3>Sistema S (5.8%)</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.sistemaS) }}</p>
              <p class="result-note">SESI, SENAI, SEBRAE, etc.</p>
            </div>
          </div>

          <!-- Adicionais -->
          <div v-if="resultados.encargos.adicionalPericulosidade > 0" class="result-card warning">
            <div class="result-icon">☢️</div>
            <div class="result-content">
              <h3>Adicional Periculosidade</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.adicionalPericulosidade) }}</p>
              <p class="result-note">30% sobre salário base</p>
            </div>
          </div>

          <div v-if="resultados.encargos.adicionalInsalubridade > 0" class="result-card warning">
            <div class="result-icon">🦠</div>
            <div class="result-content">
              <h3>Adicional Insalubridade</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.adicionalInsalubridade) }}</p>
              <p class="result-note">40% do salário mínimo</p>
            </div>
          </div>

          <div v-if="resultados.encargos.horasExtras > 0" class="result-card warning">
            <div class="result-icon">⏰</div>
            <div class="result-content">
              <h3>Horas Extras</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.horasExtras) }}</p>
              <p class="result-note">{{ configuracoes.percentualHorasExtras }}% sobre salário</p>
            </div>
          </div>

          <div v-if="resultados.encargos.adicionalNoturno > 0" class="result-card warning">
            <div class="result-icon">🌙</div>
            <div class="result-content">
              <h3>Adicional Noturno</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.adicionalNoturno) }}</p>
              <p class="result-note">20% sobre salário base</p>
            </div>
          </div>

          <div v-if="resultados.encargos.ppr > 0" class="result-card">
            <div class="result-icon">💰</div>
            <div class="result-content">
              <h3>PPR Mensal</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.ppr) }}</p>
              <p class="result-note">{{ configuracoes.percentualPpr }}% do salário anual</p>
            </div>
          </div>

          <div v-if="resultados.encargos.contribuicaoSindical > 0" class="result-card">
            <div class="result-icon">🏛️</div>
            <div class="result-content">
              <h3>Contribuição Sindical</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.contribuicaoSindical) }}</p>
              <p class="result-note">Distribuída mensalmente</p>
            </div>
          </div>

          <!-- Total Encargos -->
          <div class="result-card highlight">
            <div class="result-icon">📊</div>
            <div class="result-content">
              <h3>Total Encargos</h3>
              <p class="result-value">{{ formatCurrency(resultados.encargos.totalEncargos) }}</p>
              <p class="result-note">{{ formatPercentage(resultados.resumo.percentualEncargos) }} do salário</p>
            </div>
          </div>

          <!-- Benefícios -->
          <div v-if="resultados.beneficios.valeTransporteLiquido > 0" class="result-card">
            <div class="result-icon">🚌</div>
            <div class="result-content">
              <h3>Vale Transporte</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.valeTransporteLiquido) }}</p>
              <p class="result-note">Custo líquido empresa</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.valeAlimentacaoLiquido > 0" class="result-card">
            <div class="result-icon">🍽️</div>
            <div class="result-content">
              <h3>Vale Alimentação</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.valeAlimentacaoLiquido) }}</p>
              <p class="result-note">Custo líquido empresa</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.valeRefeicaoLiquido > 0" class="result-card">
            <div class="result-icon">🍕</div>
            <div class="result-content">
              <h3>Vale Refeição</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.valeRefeicaoLiquido) }}</p>
              <p class="result-note">Custo líquido empresa</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.planoSaude > 0" class="result-card">
            <div class="result-icon">🏥</div>
            <div class="result-content">
              <h3>Plano de Saúde</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.planoSaude) }}</p>
              <p class="result-note">Custo empresa</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.auxilioEducacao > 0" class="result-card">
            <div class="result-icon">🎓</div>
            <div class="result-content">
              <h3>Auxílio Educação</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.auxilioEducacao) }}</p>
              <p class="result-note">Cursos e capacitação</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.previdenciaPrivada > 0" class="result-card">
            <div class="result-icon">🏦</div>
            <div class="result-content">
              <h3>Previdência Privada</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.previdenciaPrivada) }}</p>
              <p class="result-note">PGBL/VGBL</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.uniformesEpis > 0" class="result-card">
            <div class="result-icon">👷</div>
            <div class="result-content">
              <h3>Uniformes e EPIs</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.uniformesEpis) }}</p>
              <p class="result-note">Equipamentos de proteção</p>
            </div>
          </div>

          <div v-if="resultados.beneficios.totalBeneficios > 0" class="result-card highlight">
            <div class="result-icon">🎁</div>
            <div class="result-content">
              <h3>Total Benefícios</h3>
              <p class="result-value">{{ formatCurrency(resultados.beneficios.totalBeneficios) }}</p>
              <p class="result-note">Custo total mensal</p>
            </div>
          </div>
        </div>

        <!-- Card Informativo -->
        <div class="summary-card">
          <h3>💡 Informações Importantes</h3>
          <div class="tips-content">
            <div class="tip-item">
              <strong>{{ getRegimeIcon(funcionario.regimeTributario) }} Regime Tributário:</strong>
              {{ getDescricaoRegime(funcionario.regimeTributario) }}
            </div>
            <div class="tip-item">
              <strong>{{ getContratoIcon(funcionario.tipoContrato) }} Tipo de Contrato:</strong>
              {{ getDescricaoTipoContrato(funcionario.tipoContrato) }}
            </div>
            <div class="tip-item">
              <strong>📊 Multiplicador {{ resultados.resumo.multiplicadorCusto.toFixed(2) }}x:</strong>
              Para cada R$ 1,00 de salário, a empresa gasta R$ {{ resultados.resumo.multiplicadorCusto.toFixed(2) }} no total.
            </div>
            <div class="tip-item">
              <strong>💰 Custo Anual:</strong>
              Considerando 12 meses, o funcionário custa {{ formatCurrency(resultados.resumo.custoTotalAnual) }} por ano.
            </div>
            <div class="tip-item">
              <strong>⏱️ Valor Hora:</strong>
              Considerando 220 horas/mês, cada hora trabalhada custa {{ formatCurrency(resultados.resumo.custoHoraTrabalho) }}.
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/responsive.css';

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

/* Custom Checkbox Styles */
.custom-checkbox-wrapper {
  margin-top: 0.75rem;
}

.custom-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.custom-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.custom-checkbox-label:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 215, 0, 0.2);
  transform: translateY(-2px);
}

.custom-checkbox {
  position: relative;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.3s ease;
  opacity: 0;
}

.checkmark-icon {
  width: 14px;
  height: 14px;
  fill: #1a1a2e;
}

.checkbox-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.checkbox-title {
  color: #e4e6ea;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
}

.checkbox-description {
  color: #a0a0a0;
  font-size: 0.8rem;
  line-height: 1.3;
}

/* Checked State */
.custom-checkbox-input:checked + .custom-checkbox-label {
  background: rgba(255, 215, 0, 0.1);
  border-color: #ffd700;
}

.custom-checkbox-input:checked + .custom-checkbox-label::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.05));
  pointer-events: none;
}

.custom-checkbox-input:checked + .custom-checkbox-label .custom-checkbox {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  border-color: #ffd700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
}

.custom-checkbox-input:checked + .custom-checkbox-label .checkbox-checkmark {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.custom-checkbox-input:checked + .custom-checkbox-label .checkbox-title {
  color: #ffd700;
}

/* Focus State */
.custom-checkbox-input:focus + .custom-checkbox-label {
  outline: 2px solid rgba(255, 215, 0, 0.5);
  outline-offset: 2px;
}

/* Animation */
.custom-checkbox-label::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s ease;
  pointer-events: none;
}

.custom-checkbox-input:checked + .custom-checkbox-label::after {
  width: 100px;
  height: 100px;
  opacity: 0;
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

/* Responsividade */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .summary-content {
    grid-template-columns: 1fr;
  }

  .custom-checkbox-label {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .checkbox-title {
    font-size: 0.9rem;
  }

  .checkbox-description {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .custom-checkbox-label {
    flex-direction: row;
    align-items: flex-start;
    padding: 0.75rem;
  }

  .custom-checkbox {
    width: 20px;
    height: 20px;
    margin-top: 1px;
  }

  .checkmark-icon {
    width: 12px;
    height: 12px;
  }

  .checkbox-title {
    font-size: 0.85rem;
  }

  .checkbox-description {
    font-size: 0.7rem;
  }
}
</style>
