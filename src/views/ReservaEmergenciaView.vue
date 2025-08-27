<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { formatCurrency, formatPercentage, applyCurrencyMask, formatPeriod } from '@/utils/formatters'

// Interface para dados da reserva de emergência
interface ReservaEmergenciaData {
  gastosMensaisEssenciais: number
  valorJaReservado: number
  metaMesesReserva: number
  valorMensalPoupanca: number
}

// Interface para resultados
interface ResultadosReserva {
  valorTotalNecessario: number
  valorAindaNecessario: number
  tempoParaCompletar: number
  percentualAtingido: number
  economiaRecomendada: number
  situacaoReserva: 'insuficiente' | 'parcial' | 'adequada' | 'excelente'
}

// Estado reativo do formulário
const form = reactive<ReservaEmergenciaData>({
  gastosMensaisEssenciais: 0,
  valorJaReservado: 0,
  metaMesesReserva: 6,
  valorMensalPoupanca: 0
})

// Estados para as máscaras de entrada
const gastosMensaisMask = ref('')
const valorReservadoMask = ref('')
const valorPoupancaMask = ref('')

// Estado para controlar se os resultados devem ser exibidos
const showResults = ref(false)

// Estado para mensagens de erro
const erroValidacao = ref('')

// Função para calcular os resultados
const calcularResultados = (): ResultadosReserva => {
  const valorTotalNecessario = form.gastosMensaisEssenciais * form.metaMesesReserva
  const valorAindaNecessario = Math.max(0, valorTotalNecessario - form.valorJaReservado)
  const percentualAtingido = valorTotalNecessario > 0 ? (form.valorJaReservado / valorTotalNecessario) * 100 : 0

  let tempoParaCompletar = 0
  if (valorAindaNecessario > 0 && form.valorMensalPoupanca > 0) {
    tempoParaCompletar = Math.ceil(valorAindaNecessario / form.valorMensalPoupanca)
  }

  // Recomendação: 20% da renda para reserva de emergência
  const economiaRecomendada = form.gastosMensaisEssenciais * 0.2

  // Determinar situação da reserva
  let situacaoReserva: ResultadosReserva['situacaoReserva']
  if (percentualAtingido < 25) {
    situacaoReserva = 'insuficiente'
  } else if (percentualAtingido < 75) {
    situacaoReserva = 'parcial'
  } else if (percentualAtingido < 100) {
    situacaoReserva = 'adequada'
  } else {
    situacaoReserva = 'excelente'
  }

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

  if (form.metaMesesReserva < 1 || form.metaMesesReserva > 24) {
    erroValidacao.value = '📅 A meta deve ser entre 1 e 24 meses'
    return false
  }

  if (form.valorMensalPoupanca < 0) {
    erroValidacao.value = '💵 O valor mensal de poupança não pode ser negativo'
    return false
  }

  if (form.metaMesesReserva < 3) {
    erroValidacao.value = '⚠️ Recomenda-se uma reserva de pelo menos 3 meses'
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
  Object.assign(form, {
    gastosMensaisEssenciais: 0,
    valorJaReservado: 0,
    metaMesesReserva: 6,
    valorMensalPoupanca: 0
  })

  // Limpar as máscaras
  gastosMensaisMask.value = ''
  valorReservadoMask.value = ''
  valorPoupancaMask.value = ''

  // Limpar estado
  erroValidacao.value = ''
  showResults.value = false
}

// Funções para aplicar máscara de moeda
const aplicarMascaraGastos = (event: Event) => {
  const target = event.target as HTMLInputElement
  gastosMensaisMask.value = applyCurrencyMask(target.value)
  const numericValue = gastosMensaisMask.value.replace(/\./g, '').replace(',', '.')
  form.gastosMensaisEssenciais = parseFloat(numericValue) || 0
}

const aplicarMascaraReservado = (event: Event) => {
  const target = event.target as HTMLInputElement
  valorReservadoMask.value = applyCurrencyMask(target.value)
  const numericValue = valorReservadoMask.value.replace(/\./g, '').replace(',', '.')
  form.valorJaReservado = parseFloat(numericValue) || 0
}

const aplicarMascaraPoupanca = (event: Event) => {
  const target = event.target as HTMLInputElement
  valorPoupancaMask.value = applyCurrencyMask(target.value)
  const numericValue = valorPoupancaMask.value.replace(/\./g, '').replace(',', '.')
  form.valorMensalPoupanca = parseFloat(numericValue) || 0
}

// Funções auxiliares para exibição dos resultados
const getSituacaoClass = (situacao: ResultadosReserva['situacaoReserva']): string => {
  switch (situacao) {
    case 'insuficiente':
      return 'warning'
    case 'parcial':
      return ''
    case 'adequada':
      return 'highlight'
    case 'excelente':
      return 'highlight'
    default:
      return ''
  }
}

const getSituacaoTexto = (situacao: ResultadosReserva['situacaoReserva']): string => {
  switch (situacao) {
    case 'insuficiente':
      return '🔴 Reserva insuficiente'
    case 'parcial':
      return '🟡 Progresso parcial'
    case 'adequada':
      return '🟢 Reserva adequada'
    case 'excelente':
      return '🟢 Excelente reserva!'
    default:
      return ''
  }
}

const getSituacaoIcon = (situacao: ResultadosReserva['situacaoReserva']): string => {
  switch (situacao) {
    case 'insuficiente':
      return '🚨'
    case 'parcial':
      return '⚠️'
    case 'adequada':
      return '✅'
    case 'excelente':
      return '🏆'
    default:
      return '📊'
  }
}

const getSituacaoTitulo = (situacao: ResultadosReserva['situacaoReserva']): string => {
  switch (situacao) {
    case 'insuficiente':
      return 'Insuficiente'
    case 'parcial':
      return 'Em Progresso'
    case 'adequada':
      return 'Adequada'
    case 'excelente':
      return 'Excelente'
    default:
      return 'Análise'
  }
}

const getSituacaoDescricao = (situacao: ResultadosReserva['situacaoReserva']): string => {
  switch (situacao) {
    case 'insuficiente':
      return 'Foque em construir sua reserva'
    case 'parcial':
      return 'Continue poupando'
    case 'adequada':
      return 'Reserva bem estruturada'
    case 'excelente':
      return 'Parabéns pelo planejamento!'
    default:
      return ''
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
                  v-model="gastosMensaisMask"
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
                  v-model="valorReservadoMask"
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
                  v-model="valorPoupancaMask"
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
            <div class="tip-item">
              <strong>🏦 Onde guardar:</strong> Prefira investimentos de alta liquidez como poupança, CDB com liquidez diária ou fundos DI.
            </div>
            <div class="tip-item">
              <strong>🎯 Meta recomendada:</strong> 3-6 meses para CLT, 6-12 meses para autônomos ou PJ.
            </div>
            <div class="tip-item">
              <strong>📊 Prioridade:</strong> A reserva de emergência deve vir antes de outros investimentos.
            </div>
            <div class="tip-item">
              <strong>🔄 Reposição:</strong> Se usar a reserva, priorize repô-la o quanto antes.
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

</style>
