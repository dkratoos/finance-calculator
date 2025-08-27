<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formatCurrency, formatPercentage, applyCurrencyMask } from '@/utils/formatters'
import { usePjClt } from '@/composables/usePjClt'

// Usando o composable
const {
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
  getRiscoTexto
} = usePjClt()

// Funções para aplicar máscara de moeda - CLT
const aplicarMascaraSalario = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.salarioBrutoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.salarioBrutoMask.replace(/\./g, '').replace(',', '.')
  formClt.salarioBruto = parseFloat(numericValue) || 0
}

const aplicarMascaraValeAlimentacao = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valeAlimentacaoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valeAlimentacaoMask.replace(/\./g, '').replace(',', '.')
  formClt.valeAlimentacao = parseFloat(numericValue) || 0
}

const aplicarMascaraValeTransporte = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valeTransporteMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valeTransporteMask.replace(/\./g, '').replace(',', '.')
  formClt.valeTransporte = parseFloat(numericValue) || 0
}

const aplicarMascaraPlanoSaude = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.planoSaudeMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.planoSaudeMask.replace(/\./g, '').replace(',', '.')
  formClt.planoSaude = parseFloat(numericValue) || 0
}

const aplicarMascaraOutrosBeneficios = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.outrosBeneficiosMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.outrosBeneficiosMask.replace(/\./g, '').replace(',', '.')
  formClt.outrosBeneficios = parseFloat(numericValue) || 0
}

// Funções para aplicar máscara de moeda - PJ
const aplicarMascaraValorPj = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valorMensalPjMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valorMensalPjMask.replace(/\./g, '').replace(',', '.')
  formPj.valorMensal = parseFloat(numericValue) || 0
}

const aplicarMascaraGastosPj = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.gastosMensaisPjMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.gastosMensaisPjMask.replace(/\./g, '').replace(',', '.')
  formPj.gastosMensais = parseFloat(numericValue) || 0
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
                    v-model="mascaras.salarioBrutoMask"
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
                    v-model="mascaras.valeAlimentacaoMask"
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
                    v-model="mascaras.valeTransporteMask"
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
                    v-model="mascaras.planoSaudeMask"
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
                    v-model="mascaras.outrosBeneficiosMask"
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
                    v-model="mascaras.valorMensalPjMask"
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
                    v-model="mascaras.gastosMensaisPjMask"
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

</style>
