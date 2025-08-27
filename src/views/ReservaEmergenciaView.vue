<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formatCurrency, formatPercentage, applyCurrencyMask, formatPeriod } from '@/utils/formatters'
import { useReservaEmergencia } from '@/composables/useReservaEmergencia'

// Usando o composable
const {
  // Estado
  form,
  mascaras,
  showResults,
  erroValidacao,

  // Computed
  resultados,

  // Métodos
  calcular,
  limpar,
  getSituacaoClass,
  getSituacaoTexto,
  getSituacaoIcon,
  getSituacaoTitulo,
  getSituacaoDescricao,

  // Constantes
  DICAS_RESERVA
} = useReservaEmergencia()

// Funções para aplicar máscara de moeda
const aplicarMascaraGastos = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.gastosMensaisMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.gastosMensaisMask.replace(/\./g, '').replace(',', '.')
  form.gastosMensaisEssenciais = parseFloat(numericValue) || 0
}

const aplicarMascaraReservado = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valorReservadoMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valorReservadoMask.replace(/\./g, '').replace(',', '.')
  form.valorJaReservado = parseFloat(numericValue) || 0
}

const aplicarMascaraPoupanca = (event: Event) => {
  const target = event.target as HTMLInputElement
  mascaras.valorPoupancaMask = applyCurrencyMask(target.value)
  const numericValue = mascaras.valorPoupancaMask.replace(/\./g, '').replace(',', '.')
  form.valorMensalPoupanca = parseFloat(numericValue) || 0
}
</script>

<template>
  <div>
    <!-- Header -->
    <header class="page-header">
      <div class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-link">HOME</RouterLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">RESERVA DE EMERGÊNCIA</span>
      </div>
    </header>

    <!-- Main Content -->
    <div class="content-wrapper">
      <!-- Form Section -->
      <section class="form-section">
        <div class="section-header">
          <h2>
            <span class="icon">🏦</span>
            SIMULADOR DE RESERVA DE EMERGÊNCIA
          </h2>
        </div>

        <form @submit.prevent="calcular" class="finance-form">
          <div class="form-grid">
            <!-- Gastos Mensais Essenciais -->
            <div class="form-group">
              <label class="form-label">Gastos Mensais Essenciais</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input
                  v-model="mascaras.gastosMensaisMask"
                  @input="aplicarMascaraGastos"
                  type="text"
                  class="form-input"
                  placeholder="3.500,00"
                >
              </div>
              <small class="form-helper">Inclua alimentação, moradia, transporte, contas básicas</small>
            </div>

            <!-- Valor Já Reservado -->
            <div class="form-group">
              <label class="form-label">Valor Já Reservado (opcional)</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input
                  v-model="mascaras.valorReservadoMask"
                  @input="aplicarMascaraReservado"
                  type="text"
                  class="form-input"
                  placeholder="0,00"
                >
              </div>
              <small class="form-helper">Quanto você já tem guardado para emergências</small>
            </div>

            <!-- Meta de Meses -->
            <div class="form-group">
              <label class="form-label">Meta de Meses de Reserva</label>
              <div class="input-wrapper">
                <input
                  v-model.number="form.metaMesesReserva"
                  type="number"
                  class="form-input"
                  placeholder="6"
                  min="1"
                  max="24"
                  step="1"
                >
                <span class="input-suffix">meses</span>
              </div>
              <small class="form-helper">Recomendado: 3-6 meses para CLT, 6-12 para autônomos</small>
            </div>

            <!-- Valor Mensal para Poupança -->
            <div class="form-group">
              <label class="form-label">Valor Mensal Disponível</label>
              <div class="input-wrapper">
                <span class="input-prefix">R$</span>
                <input
                  v-model="mascaras.valorPoupancaMask"
                  @input="aplicarMascaraPoupanca"
                  type="text"
                  class="form-input"
                  placeholder="500,00"
                >
              </div>
              <small class="form-helper">Quanto você pode guardar por mês</small>
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
              💰 CALCULAR
            </button>
          </div>
        </form>
      </section>

      <!-- Results Section -->
      <section v-if="showResults && resultados" class="results-section">
        <div class="section-header">
          <h2>
            <span class="icon">📊</span>
            ANÁLISE DA SUA RESERVA DE EMERGÊNCIA
          </h2>
        </div>

        <div class="results-grid">
          <!-- Valor Total Necessário -->
          <div class="result-card highlight">
            <div class="result-icon">🎯</div>
            <div class="result-content">
              <h3>Valor Total da Meta</h3>
              <p class="result-value">{{ formatCurrency(resultados.valorTotalNecessario) }}</p>
              <p class="result-note">{{ form.metaMesesReserva }} meses de gastos essenciais</p>
            </div>
          </div>

          <!-- Valor Ainda Necessário -->
          <div class="result-card" :class="{ 'highlight': resultados.valorAindaNecessario === 0 }">
            <div class="result-icon">📈</div>
            <div class="result-content">
              <h3>Ainda Falta Guardar</h3>
              <p class="result-value">{{ formatCurrency(resultados.valorAindaNecessario) }}</p>
              <p class="result-note">
                {{ resultados.valorAindaNecessario === 0 ? '🎉 Meta atingida!' : 'Para completar sua reserva' }}
              </p>
            </div>
          </div>

          <!-- Percentual Atingido -->
          <div class="result-card" :class="getSituacaoClass(resultados.situacaoReserva)">
            <div class="result-icon">⚖️</div>
            <div class="result-content">
              <h3>Progresso da Meta</h3>
              <p class="result-value">{{ formatPercentage(resultados.percentualAtingido) }}</p>
              <p class="result-note">{{ getSituacaoTexto(resultados.situacaoReserva) }}</p>
            </div>
          </div>

          <!-- Tempo para Completar -->
          <div v-if="resultados.valorAindaNecessario > 0 && form.valorMensalPoupanca > 0" class="result-card">
            <div class="result-icon">⏰</div>
            <div class="result-content">
              <h3>Tempo para Completar</h3>
              <p class="result-value">{{ resultados.tempoParaCompletar }} meses</p>
              <p class="result-note">{{ formatPeriod(resultados.tempoParaCompletar) }}</p>
            </div>
          </div>

          <!-- Economia Recomendada -->
          <div class="result-card">
            <div class="result-icon">💡</div>
            <div class="result-content">
              <h3>Economia Recomendada</h3>
              <p class="result-value">{{ formatCurrency(resultados.economiaRecomendada) }}</p>
              <p class="result-note">20% dos gastos essenciais por mês</p>
            </div>
          </div>

          <!-- Situação Geral -->
          <div class="result-card" :class="getSituacaoClass(resultados.situacaoReserva)">
            <div class="result-icon">{{ getSituacaoIcon(resultados.situacaoReserva) }}</div>
            <div class="result-content">
              <h3>Situação da Reserva</h3>
              <p class="result-value">{{ getSituacaoTitulo(resultados.situacaoReserva) }}</p>
              <p class="result-note">{{ getSituacaoDescricao(resultados.situacaoReserva) }}</p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="summary-card">
          <h3>📋 Resumo da Análise</h3>
          <div class="summary-content">
            <div class="summary-item">
              <span class="summary-label">Gastos mensais essenciais:</span>
              <span class="summary-value">{{ formatCurrency(form.gastosMensaisEssenciais) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Valor já reservado:</span>
              <span class="summary-value">{{ formatCurrency(form.valorJaReservado) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Meta de reserva:</span>
              <span class="summary-value">{{ form.metaMesesReserva }} meses</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Capacidade mensal de poupança:</span>
              <span class="summary-value">{{ formatCurrency(form.valorMensalPoupanca) }}</span>
            </div>
          </div>
        </div>

        <!-- Dicas -->
        <div class="tips-card">
          <h3>💡 Dicas para Sua Reserva de Emergência</h3>
          <div class="tips-content">
            <div v-for="dica in DICAS_RESERVA" :key="dica.titulo" class="tip-item">
              <strong>{{ dica.icon }} {{ dica.titulo }}:</strong> {{ dica.descricao }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos desta view apenas se necessário */
</style>
