<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="header-container">
        <div class="brand">
          <h1>📊 FinanceCalc</h1>
          <span class="subtitle">Calculadoras Financeiras</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>📊 FinanceCalc</h3>
            <p>Ferramentas inteligentes para seu planejamento financeiro</p>
          </div>

          <div class="footer-links">
            <div class="footer-column">
              <h4>Calculadoras</h4>
              <ul>
                <li><RouterLink to="/financiamento">Financiamento Imobiliário</RouterLink></li>
                <li><RouterLink to="/reserva-emergencia">Reserva de Emergência</RouterLink></li>
                <li><RouterLink to="/pj-clt">PJ vs CLT</RouterLink></li>
                <li><RouterLink to="/custo-funcionario">Custo Funcionário</RouterLink></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Recursos</h4>
              <ul>
                <li><a href="#" @click.prevent>Guia de Financiamento</a></li>
                <li><a href="#" @click.prevent>Dicas de Investimento</a></li>
                <li><a href="#" @click.prevent>Educação Financeira</a></li>
                <li><a href="#" @click.prevent>Contato</a></li>
              </ul>
            </div>

            <div class="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" @click.prevent>Política de Privacidade</a></li>
                <li><a href="#" @click.prevent>Termos de Uso</a></li>
                <li><a href="#" @click.prevent>Sobre Nós</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>&copy; 2024 FinanceCalc. Desenvolvido com Vue 3 + TypeScript</p>
            <p class="disclaimer">
              <strong>Aviso:</strong> Esta ferramenta é apenas para simulação.
              Consulte sempre um especialista financeiro para decisões de investimento.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #e4e6ea;
  min-height: 100vh;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 80px;
  width: 100%;
  display: flex;
  align-items: center;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.brand h1 {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.2rem;
}

.subtitle {
  font-size: 0.9rem;
  color: #a0a0a0;
  font-weight: 400;
}

/* Hero section padronizada */
.hero-standardized {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

/* Utility Classes */
.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 215, 0, 0.3);
}

.btn {
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  border: none;
  border-radius: 8px;
  color: #1a1a2e;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #e4e6ea;
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

.form-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}

.form-input::placeholder {
  color: #a0a0a0;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Footer Styles */
.footer {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(26, 26, 46, 0.6));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  width: 100%;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  padding: 3rem 0 2rem;
}

.footer-brand h3 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.footer-brand p {
  color: #b0b0b0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-column h4 {
  color: #e4e6ea;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-column ul {
  list-style: none;
}

.footer-column li {
  margin-bottom: 0.75rem;
}

.footer-column a,
.footer-column .coming-soon {
  color: #a0a0a0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-column a:hover {
  color: #ffd700;
  text-decoration: underline;
}

.footer-column .coming-soon {
  opacity: 0.6;
  cursor: not-allowed;
  font-style: italic;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.footer-bottom-content {
  text-align: center;
}

.footer-bottom-content p {
  color: #a0a0a0;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.disclaimer {
  font-size: 0.8rem !important;
  opacity: 0.8;
  max-width: 600px;
  margin: 0 auto;
}

/* ==== RESPONSIVIDADE GLOBAL ==== */

/* Large Desktop (1920px+) - Full HD e maiores */
@media (min-width: 1920px) {
  .container {
    max-width: 1400px;
  }

    .header-container,
  .footer-container {
    max-width: 1400px;
    padding: 0 2rem;
  }

  .header {
    height: 90px;
  }



  .brand h1 {
    font-size: 2.2rem;
  }
}

/* Desktop (1366px-1919px) - HD padrão */
@media (min-width: 1366px) and (max-width: 1919px) {
  .container {
    max-width: 1200px;
  }

    .header-container,
  .footer-container {
    max-width: 1200px;
    padding: 0 1.5rem;
  }

  .header {
    height: 85px;
  }



  .brand h1 {
    font-size: 2rem;
  }
}

/* Small Desktop/Large Tablet (1024px-1365px) */
@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 1000px;
  }

    .header-container,
  .footer-container {
    max-width: 1000px;
    padding: 0 1.25rem;
  }

  .header {
    height: 80px;
  }



  .brand h1 {
    font-size: 1.9rem;
  }
}

/* Tablet (768px-1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
    .header-container,
  .footer-container {
    padding: 0 1rem;
  }

  .header {
    height: 75px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .footer-links {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }



  .brand h1 {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .card {
    padding: 1.5rem;
  }
}

/* Mobile Large (481px-767px) */
@media (min-width: 481px) and (max-width: 767px) {
    .header-container,
  .footer-container {
    padding: 0 0.75rem;
  }

  .header {
    height: 70px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
    padding: 2rem 0 1.5rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .brand h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.75rem;
  }

  .card {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.9rem;
  }
}

/* Mobile Small (320px-480px) */
@media (max-width: 480px) {
    .header-container,
  .footer-container {
    padding: 0 0.5rem;
  }

  .header {
    height: 65px;
  }

  .footer-content {
    padding: 1.5rem 0 1rem;
  }

  .footer-column h4 {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  .footer-column a,
  .footer-column .coming-soon {
    font-size: 0.8rem;
  }

  .footer-bottom-content p {
    font-size: 0.75rem;
  }

  .disclaimer {
    font-size: 0.7rem !important;
  }



  .brand h1 {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.7rem;
  }

  .card {
    padding: 1rem;
    border-radius: 8px;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }

  .form-input {
    padding: 0.625rem;
    font-size: 0.9rem;
  }
}

/* Extra Small Mobile (max 320px) */
@media (max-width: 320px) {
    .header-container,
  .footer-container {
    padding: 0 0.25rem;
  }

  .header {
    height: 60px;
  }

  .footer-content {
    padding: 1rem 0;
  }

  .footer-brand h3 {
    font-size: 1.2rem;
  }

  .footer-brand p {
    font-size: 0.8rem;
  }



  .brand h1 {
    font-size: 1rem;
  }

  .card {
    padding: 0.75rem;
  }
}
</style>
