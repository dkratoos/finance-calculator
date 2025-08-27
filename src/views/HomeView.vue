<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Calculator } from '@/types/financeiro'

const router = useRouter()

const calculators: Calculator[] = [
  {
    id: 'financiamento',
    title: 'Financiamento Imobiliário',
    description: 'Calcule o salário necessário para financiar um imóvel, considerando parcelas, juros e impostos.',
    route: '/financiamento',
    icon: '🏠',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    available: true
  },
  {
    id: 'reserva-emergencia',
    title: 'Reserva de Emergência',
    description: 'Simule o valor ideal para uma boa reserva de emergência.',
    route: '/reserva-emergencia',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    available: true
  },
  {
    id: 'pj-clt',
    title: 'PJ vs CLT',
    description: 'Compare os custos e benefícios entre trabalhar como PJ ou CLT no Brasil.',
    route: '/pj-clt',
    icon: '⚖️',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    available: true
  },
  {
    id: 'custo-funcionario',
    title: 'Custo de Funcionário',
    description: 'Calcule o custo total de um funcionário para o empregador, incluindo salário, encargos e benefícios.',
    route: '/custo-funcionario',
    icon: '👥',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    available: true
  },
  {
    id: 'juros-compostos',
    title: 'Juros Compostos',
    description: 'Veja quantas vezes o seu dinheiro pode se multiplicar e trabalhar para você.',
    route: '/juros-compostos',
    icon: '📈',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    available: false
  },
  {
    id: 'juros-simples',
    title: 'Juros Simples',
    description: 'Veja seu dinheiro crescer a partir do valor inicial, com uma taxa de juros fixa.',
    route: '/juros-simples',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    available: false
  },
  {
    id: 'primeiro-milhao',
    title: 'Primeiro Milhão',
    description: 'Quer saber quanto precisa investir por mês para alcançar o seu primeiro milhão?',
    route: '/primeiro-milhao',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    available: false
  },
  {
    id: 'porcentagem',
    title: 'Porcentagem',
    description: 'Calculadoras poderosas para descomplicar os cálculos de porcentagem.',
    route: '/porcentagem',
    icon: '🔢',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    available: false
  },
  {
    id: 'cdi',
    title: 'CDI',
    description: 'Simule seus ganhos de rendimento baseado no índice CDI.',
    route: '/cdi',
    icon: '📋',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    available: false
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <h1 class="hero-title">Calculadoras Financeiras</h1>
      <p class="hero-subtitle">
        Ferramentas poderosas para planejar seu futuro financeiro de forma inteligente
      </p>
    </section>

    <!-- Calculators Grid -->
    <section class="calculators-section">
      <div class="section-header">
        <h2>
          <span class="icon">🧮</span>
          CALCULADORAS
        </h2>
      </div>

      <div class="calculators-grid">
        <div
          v-for="calc in calculators"
          :key="calc.id"
          class="calculator-card"
          :class="{ 'disabled': !calc.available }"
          @click="calc.available && router.push(calc.route)"
        >
          <div class="card-background" :style="{ background: calc.gradient }"></div>
          <div class="card-content">
            <div class="card-icon">{{ calc.icon }}</div>
            <h3 class="card-title">{{ calc.title }}</h3>
            <p class="card-description">{{ calc.description }}</p>

            <div v-if="!calc.available" class="card-action">
              <div class="unavailable-badge">
                EM BREVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  font-size: 1.2rem;
  color: #b0b0b0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.calculators-section {
  margin-top: 3rem;
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

.calculators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.calculator-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;
  cursor: pointer;
  height: 280px;
}

.calculator-card:hover:not(.disabled) {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 215, 0, 0.3);
}

.calculator-card:not(.disabled) {
  cursor: pointer;
}

.calculator-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  opacity: 0.8;
  pointer-events: none;
}

.card-content {
  position: relative;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  z-index: 2;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-description {
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.9;
  flex-grow: 1;
  margin-bottom: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.card-action {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.unavailable-badge {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.4rem 0.8rem;
  color: #ffd700;
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* ==== RESPONSIVIDADE HOME ==== */

/* Large Desktop (1920px+) - Full HD */
@media (min-width: 1920px) {
  .hero {
    min-height: 200px;
    padding: 2.5rem 0;
  }

  .hero-title {
    font-size: 3.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .calculators-grid {
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2.5rem;
  }

  .calculator-card {
    height: 320px;
  }

  .card-content {
    padding: 2.5rem;
  }
}

/* Desktop (1366px-1919px) - HD */
@media (min-width: 1366px) and (max-width: 1919px) {
  .hero {
    min-height: 180px;
    padding: 2rem 0;
  }

  .calculators-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .calculator-card {
    height: 300px;
  }
}

/* Small Desktop/Large Tablet (1024px-1365px) */
@media (min-width: 1024px) and (max-width: 1365px) {
  .hero-title {
    font-size: 2.8rem;
  }

  .calculators-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.75rem;
  }

  .calculator-card {
    height: 280px;
  }
}

/* Tablet (768px-1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero {
    min-height: 160px;
    padding: 1.5rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .calculators-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .calculator-card {
    height: 260px;
  }

  .card-content {
    padding: 1.75rem;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-description {
    font-size: 0.9rem;
  }
}

/* Mobile Large (481px-767px) */
@media (min-width: 481px) and (max-width: 767px) {
  .hero {
    min-height: 140px;
    padding: 1.25rem 0;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .calculators-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .calculator-card {
    height: 240px;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-description {
    font-size: 0.85rem;
  }
}

/* Mobile Small (320px-480px) */
@media (max-width: 480px) {
  .hero {
    min-height: 120px;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .hero-title {
    font-size: 1.8rem;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    padding: 0 1rem;
  }

  .section-header h2 {
    font-size: 1rem;
    padding: 0.75rem;
  }

  .calculators-grid {
    gap: 1rem;
  }

  .calculator-card {
    height: 220px;
  }

  .card-content {
    padding: 1.25rem;
  }

  .card-icon {
    font-size: 2.25rem;
    margin-bottom: 0.75rem;
  }

  .card-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .card-description {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .unavailable-badge {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
    top: 0.75rem;
    right: 0.75rem;
  }
}

/* Extra Small Mobile (max 320px) */
@media (max-width: 320px) {
  .hero-title {
    font-size: 1.6rem;
  }

  .calculator-card {
    height: 200px;
  }

  .card-content {
    padding: 1rem;
  }

  .card-icon {
    font-size: 2rem;
  }

  .card-title {
    font-size: 0.9rem;
  }

  .card-description {
    font-size: 0.75rem;
  }
}
</style>
