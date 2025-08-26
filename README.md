# 📊 FinanceCalc - Calculadoras Financeiras

Uma aplicação moderna de calculadoras financeiras desenvolvida com Vue 3, TypeScript e design responsivo inspirado nas melhores práticas de UX/UI.

## 🚀 Funcionalidades

### 🏠 Calculadora de Financiamento Imobiliário

A calculadora de financiamento imobiliário oferece uma análise completa para quem deseja adquirir um imóvel:

#### 📝 Campos de Entrada:

- **Valor do Imóvel**: Preço total do imóvel
- **Valor de Entrada**: Quantia paga à vista
- **Taxa de Juros Anual**: Taxa de juros aplicada (padrão: 9,5% a.a.)
- **Prazo**: Período do financiamento (10 a 35 anos)
- **Sistema de Amortização**: SAC ou PRICE
- **Renda Familiar**: Para análise de comprometimento (opcional)

#### 📊 Resultados Calculados:

- **Valor da Parcela**: Primeira parcela (SAC) ou parcela fixa (PRICE)
- **Renda Mínima Necessária**: Baseada em 30% de comprometimento da renda
- **Valor Total Pago**: Soma de todas as parcelas + entrada
- **Total de Juros**: Juros pagos durante todo o financiamento
- **Impostos de Aquisição**: ITBI, cartório e taxas (~3,5% do valor do imóvel)
- **Comprometimento da Renda**: Percentual da renda comprometido

#### 🔢 Sistemas de Amortização:

**SAC (Sistema de Amortização Constante)**

- Parcelas decrescentes
- Maior valor pago de juros no início
- Menor valor total de juros

**PRICE (Tabela Price)**

- Parcelas fixas
- Distribuição equilibrada de juros e amortização
- Maior previsibilidade financeira

## 🎨 Design e UX

- **Dark Theme**: Interface moderna com tema escuro
- **Gradientes**: Uso de gradientes vibrantes para destacar elementos importantes
- **Cards Interativos**: Efeitos hover e animações suaves
- **Layout Responsivo**: Adaptação perfeita para mobile, tablet e desktop
- **Formatação Brasileira**: Valores em Real (R$) e percentuais formatados

## 🛠️ Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **TypeScript** - Tipagem estática para maior robustez
- **Vue Router** - Roteamento SPA
- **CSS3** - Estilização avançada com gradientes e animações
- **ESLint** - Linting para qualidade de código

## 📱 Responsividade

A aplicação foi desenvolvida com mobile-first approach:

- **Desktop**: Layout em grade com múltiplas colunas
- **Tablet**: Adaptação automática dos cards
- **Mobile**: Interface otimizada para telas pequenas

## 🧮 Fórmulas Financeiras

### Sistema SAC

```
Amortização = Valor Financiado ÷ Número de Parcelas
Juros = Saldo Devedor × Taxa de Juros Mensal
Parcela = Amortização + Juros
```

### Sistema PRICE

```
Parcela = PV × [(1+i)^n × i] ÷ [(1+i)^n - 1]

Onde:
PV = Valor Presente (valor financiado)
i = Taxa de juros mensal
n = Número de parcelas
```

### Impostos e Taxas

- **ITBI**: ~2% do valor do imóvel (varia por município)
- **Cartório e Registro**: ~1% do valor do imóvel
- **Taxas Diversas**: ~0,5% do valor do imóvel

## 🚀 Como Usar

1. **Acesse a página inicial** para ver todas as calculadoras disponíveis
2. **Clique em "Financiamento Imobiliário"** para acessar a calculadora
3. **Preencha os dados** do imóvel e financiamento
4. **Clique em "CALCULAR"** para ver os resultados
5. **Analise os resultados** detalhados apresentados

## 📋 Próximas Funcionalidades

- 📈 Calculadora de Juros Compostos
- 📊 Calculadora de Juros Simples
- 💰 Calculadora do Primeiro Milhão
- 🔢 Calculadora de Porcentagem
- 📋 Calculadora de CDI

## 💡 Dicas Financeiras

### Renda Comprometida

- **Até 30%**: Considerado seguro pelas instituições financeiras
- **Acima de 30%**: Pode comprometer o orçamento familiar

### Entrada Recomendada

- **Mínimo 20%**: Para melhores condições de financiamento
- **Ideal 30-40%**: Reduz significativamente os juros pagos

### Escolha do Sistema

- **SAC**: Melhor para quem tem renda mais alta no início
- **PRICE**: Melhor para planejamento de longo prazo

---

Desenvolvido com 💛 usando Vue 3 + TypeScript
