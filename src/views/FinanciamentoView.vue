<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import type { FinanciamentoData, ResultadosFinanciamento } from '@/types/financeiro'
import { LIMITES_FINANCIAMENTO, IMPOSTOS_PADRAO } from '@/types/financeiro'
import { formatCurrency, formatPercentage, applyCurrencyMask, formatPeriod } from '@/utils/formatters'

// Estado reativo do formulário
const form = reactive<FinanciamentoData>({
  valorImovel: 0,
  valorEntrada: 0,
  valorFinanciamento: 0,
  taxaJurosAnual: 9.5,
  quantidadeParcelas: 420, // 35 anos
  sistemaAmortizacao: 'SAC',
  rendaFamiliar: 0
})

// Estados para as máscaras de entrada
const valorImovelMask = ref('')
const valorEntradaMask = ref('')
const rendaFamiliarMask = ref('')

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

// Estado para mensagens de erro
const erroValidacao = ref('')

// Validação personalizada mais elegante
const validarCampos = (): boolean => {
  erroValidacao.value = ''

  if (form.valorImovel <= 0) {
    erroValidacao.value = '🏠 Informe o valor do imóvel'
    return false
  }

  if (form.valorEntrada < 0) {
    erroValidacao.value = '💰 O valor de entrada não pode ser negativo'
    return false
  }

  if (form.valorEntrada >= form.valorImovel) {
    erroValidacao.value = '⚠️ A entrada deve ser menor que o valor do imóvel'
    return false
  }

  if (form.taxaJurosAnual <= 0 || form.taxaJurosAnual > 30) {
    erroValidacao.value = '📊 Taxa de juros deve estar entre 0,1% e 30% ao ano'
    return false
  }

  if (form.quantidadeParcelas < 12 || form.quantidadeParcelas > 480) {
    erroValidacao.value = '📅 Prazo deve estar entre 12 e 480 meses'
    return false
  }

  const percentualEntrada = (form.valorEntrada / form.valorImovel) * 100
  if (percentualEntrada < 10) {
    erroValidacao.value = '💡 Recomenda-se entrada mínima de 10% do valor do imóvel'
    return false
  }

  return true
}

// Validação e cálculo
const calcular = () => {
  if (!validarCampos()) {
    return
  }

  calcularFinanciamento()
  showResults.value = true
  erroValidacao.value = ''
}

// Limpar formulário
const limpar = () => {
  Object.assign(form, {
    valorImovel: 0,
    valorEntrada: 0,
    valorFinanciamento: 0,
    taxaJurosAnual: 9.5,
    quantidadeParcelas: 420,
    sistemaAmortizacao: 'SAC',
    rendaFamiliar: 0
  })

  // Limpar as máscaras
  valorImovelMask.value = ''
  valorEntradaMask.value = ''
  rendaFamiliarMask.value = ''

  // Limpar estado
  erroValidacao.value = ''

  showResults.value = false
}

// Função para aplicar máscara de moeda
const aplicarMascaraImovel = (event: Event) => {
  const target = event.target as HTMLInputElement
  valorImovelMask.value = applyCurrencyMask(target.value)
  // Remove pontos separadores de milhares e substitui vírgula por ponto
  const numericValue = valorImovelMask.value.replace(/\./g, '').replace(',', '.')
  form.valorImovel = parseFloat(numericValue) || 0
}

const aplicarMascaraEntrada = (event: Event) => {
  const target = event.target as HTMLInputElement
  valorEntradaMask.value = applyCurrencyMask(target.value)
  const numericValue = valorEntradaMask.value.replace(/\./g, '').replace(',', '.')
  form.valorEntrada = parseFloat(numericValue) || 0
}

const aplicarMascaraRenda = (event: Event) => {
  const target = event.target as HTMLInputElement
  rendaFamiliarMask.value = applyCurrencyMask(target.value)
  const numericValue = rendaFamiliarMask.value.replace(/\./g, '').replace(',', '.')
  form.rendaFamiliar = parseFloat(numericValue) || 0
}
</script>

<template>
  <div>
    <!-- Header -->
    <header class="page-header">
      <div class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-link">HOME</RouterLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">FINANCIAMENTO IMOBILIÁRIO</span>
      </div>

      <!-- <div class="hero">
        <h1 class="hero-title">Calculadora de Financiamento Imobiliário</h1>
        <p class="hero-subtitle">
          Simule seu financiamento e descubra a renda necessária para realizar o sonho da casa própria
        </p>
      </div> -->
    </header>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Form Section -->
      <section class="form-section">
        <div class="section-header">
          <h2>
            <span class="icon">🏠</span>
            SIMULADOR DE FINANCIAMENTO IMOBILIÁRIO
          </h2>
        </div>

        <form @submit.prevent="calcular" class="finance-form">
          <div class="form-grid">
            <!-- Dados do Imóvel -->
            <div class="form-group">
              <label class="form-label">Valor do Imóvel</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input
                  v-model="valorImovelMask"
                  @input="aplicarMascaraImovel"
                  type="text"
                  class="form-input"
                  placeholder="500.000,00"
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Valor de Entrada</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input
                  v-model="valorEntradaMask"
                  @input="aplicarMascaraEntrada"
                  type="text"
                  class="form-input"
                  placeholder="100.000,00"
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Taxa de Juros (ao ano)</label>
              <div class="input-wrapper">
                <input
                  v-model.number="form.taxaJurosAnual"
                  type="number"
                  class="form-input"
                  placeholder="9,5"
                  step="0.1"
                  min="0"
                  max="30"
                >
                <span class="input-suffix">%</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Prazo do Financiamento (meses)</label>
              <div class="input-wrapper">
                <input
                  v-model.number="form.quantidadeParcelas"
                  type="number"
                  class="form-input"
                  :placeholder="'420 meses (' + formatPeriod(420) + ')'"
                  min="12"
                  max="480"
                  step="12"
                >
                <span class="input-suffix">meses</span>
              </div>
              <small class="form-helper">{{ formatPeriod(form.quantidadeParcelas || 420) }}</small>
            </div>

            <div class="form-group">
              <label class="form-label">Sistema de Amortização</label>
              <select v-model="form.sistemaAmortizacao" class="form-input">
                <option value="SAC">SAC (Parcelas Decrescentes)</option>
                <option value="PRICE">PRICE (Parcelas Fixas)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Renda Familiar (opcional)</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input
                  v-model="rendaFamiliarMask"
                  @input="aplicarMascaraRenda"
                  type="text"
                  class="form-input"
                  placeholder="10.000,00"
                >
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
              📊 CALCULAR
            </button>
          </div>
        </form>
      </section>

      <!-- Results Section -->
      <section v-if="showResults && resultados" class="results-section">
        <div class="section-header">
          <h2>
            <span class="icon">📊</span>
            RESULTADOS DA SIMULAÇÃO
          </h2>
        </div>

        <div class="results-grid">
          <!-- Valor da Parcela -->
          <div class="result-card highlight">
            <div class="result-icon">💰</div>
            <div class="result-content">
              <h3>Valor da Parcela</h3>
              <p class="result-value">{{ formatCurrency(resultados.valorParcela) }}</p>
              <p class="result-note">
                {{ form.sistemaAmortizacao === 'SAC' ? 'Primeira parcela (SAC)' : 'Parcela fixa (PRICE)' }}
              </p>
            </div>
          </div>

          <!-- Renda Necessária -->
          <div class="result-card">
            <div class="result-icon">📈</div>
            <div class="result-content">
              <h3>Renda Mínima Necessária</h3>
              <p class="result-value">{{ formatCurrency(resultados.rendaDeclaredaMinima) }}</p>
              <p class="result-note">Baseado em {{ LIMITES_FINANCIAMENTO.PERCENTUAL_RENDA_MAXIMO }}% da renda comprometida</p>
            </div>
          </div>

          <!-- Valor Total -->
          <div class="result-card">
            <div class="result-icon">🏠</div>
            <div class="result-content">
              <h3>Valor Total do Imóvel</h3>
              <p class="result-value">{{ formatCurrency(resultados.valorTotalPago) }}</p>
              <p class="result-note">Financiamento + entrada</p>
            </div>
          </div>

          <!-- Juros Pagos -->
          <div class="result-card">
            <div class="result-icon">📊</div>
            <div class="result-content">
              <h3>Total de Juros Pagos</h3>
              <p class="result-value">{{ formatCurrency(resultados.valorJurosPagos) }}</p>
              <p class="result-note">Durante todo o financiamento</p>
            </div>
          </div>

          <!-- Impostos -->
          <div class="result-card">
            <div class="result-icon">🧾</div>
            <div class="result-content">
              <h3>Impostos de Aquisição</h3>
              <p class="result-value">{{ formatCurrency(resultados.impostosAquisicao) }}</p>
              <p class="result-note">ITBI, cartório e taxas (~{{ (IMPOSTOS_PADRAO.itbi + IMPOSTOS_PADRAO.cartorio + IMPOSTOS_PADRAO.taxasDiversas).toFixed(1) }}%)</p>
            </div>
          </div>

          <!-- Percentual da Renda -->
          <div v-if="form.rendaFamiliar" class="result-card" :class="{ 'warning': resultados.percentualRenda > LIMITES_FINANCIAMENTO.PERCENTUAL_RENDA_MAXIMO }">
            <div class="result-icon">⚖️</div>
            <div class="result-content">
              <h3>Comprometimento da Renda</h3>
              <p class="result-value">{{ formatPercentage(resultados.percentualRenda) }}</p>
              <p class="result-note">
                {{ resultados.percentualRenda > LIMITES_FINANCIAMENTO.PERCENTUAL_RENDA_MAXIMO ? '⚠️ Acima do recomendado!' : '✅ Dentro do limite seguro' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-card">
          <h3>📋 Resumo da Simulação</h3>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Valor do imóvel:</span>
              <span class="summary-value">{{ formatCurrency(form.valorImovel) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Entrada:</span>
              <span class="summary-value">{{ formatCurrency(form.valorEntrada) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Financiamento:</span>
              <span class="summary-value">{{ formatCurrency(form.valorFinanciamento) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Taxa de juros:</span>
              <span class="summary-value">{{ form.taxaJurosAnual }}% a.a.</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Prazo:</span>
              <span class="summary-value">{{ form.quantidadeParcelas }} parcelas ({{ Math.round(form.quantidadeParcelas / 12) }} anos)</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Sistema:</span>
              <span class="summary-value">{{ form.sistemaAmortizacao }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>

.hero {
  text-align: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #ff8c00, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #b0b0b0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Customização dos warnings de validação do browser */
.form-input:invalid {
  border-color: rgba(255, 140, 0, 0.6);
  box-shadow: 0 0 0 2px rgba(255, 140, 0, 0.1);
}

.form-input:valid {
  border-color: rgba(67, 233, 123, 0.6);
}

/* Remover setas do input number no Firefox */
.form-input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* Remover setas do input number no Chrome/Safari */
.form-input[type="number"]::-webkit-outer-spin-button,
.form-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>
