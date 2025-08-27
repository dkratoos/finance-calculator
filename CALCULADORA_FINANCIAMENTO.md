# 🏠 Calculadora de Financiamento Imobiliário

## 🎯 **Visão Geral**

Calculadora completa e moderna para simular financiamentos imobiliários no Brasil, oferecendo cálculos precisos baseados nas práticas e regulamentações do mercado financeiro brasileiro. Suporte aos sistemas SAC e PRICE com análise completa de viabilidade financeira.

## 🎯 Funcionalidades Principais

### 📊 Sistemas de Amortização Suportados

**1. SAC (Sistema de Amortização Constante)**

- ✅ Parcelas decrescentes
- ✅ Maior economia de juros no longo prazo
- ✅ Ideal para quem tem renda estável ou crescente

**2. PRICE (Tabela Price)**

- ✅ Parcelas fixas
- ✅ Maior previsibilidade no orçamento
- ✅ Ideal para planejamento de longo prazo

### 💰 Cálculos Realizados

1. **Valor da Parcela**

   - Primeira parcela (SAC) ou parcela fixa (PRICE)
   - Considerando juros compostos

2. **Renda Mínima Necessária**

   - Baseado no limite de 30% de comprometimento da renda
   - Seguindo diretrizes do SFH (Sistema Financeiro da Habitação)

3. **Valor Total do Investimento**

   - Soma do financiamento + entrada
   - Custo real do imóvel

4. **Total de Juros Pagos**

   - Valor total de juros durante todo o financiamento
   - Comparação entre sistemas SAC e PRICE

5. **Impostos e Taxas**

   - ITBI (Imposto sobre Transmissão de Bens Imóveis): ~2%
   - Custos de cartório e registro: ~1%
   - Taxas diversas: ~0,5%
   - **Total médio**: ~3,5% do valor do imóvel

6. **Análise de Comprometimento da Renda**
   - Percentual da renda familiar comprometido
   - Indicador de segurança financeira

## 🔧 Como Usar

### 1. Preenchimento dos Dados

**Dados Obrigatórios:**

- **Valor do Imóvel**: Preço total do imóvel
- **Valor de Entrada**: Quantia paga à vista (mínimo 20%)
- **Taxa de Juros**: Taxa anual oferecida pelo banco
- **Prazo**: Período do financiamento (5 a 35 anos)
- **Sistema**: SAC ou PRICE

**Dados Opcionais:**

- **Renda Familiar**: Para análise de comprometimento

### 2. Validações Automáticas

O sistema valida automaticamente:

- ✅ Valor de entrada mínimo (20% do valor do imóvel)
- ✅ Taxa de juros dentro dos limites (3% a 25% a.a.)
- ✅ Prazo do financiamento (5 a 35 anos)
- ✅ Consistência entre valor do imóvel e entrada

### 3. Interpretação dos Resultados

**🟢 Seguro** - Comprometimento ≤ 30% da renda
**🟡 Atenção** - Comprometimento > 30% da renda

## 📈 Fórmulas Utilizadas

### Sistema SAC

```
Amortização = Valor Financiado ÷ Número de Parcelas
Juros(n) = Saldo Devedor(n-1) × Taxa Mensal
Parcela(n) = Amortização + Juros(n)
Saldo Devedor(n) = Saldo Devedor(n-1) - Amortização
```

### Sistema PRICE

```
PMT = PV × [i × (1+i)^n] ÷ [(1+i)^n - 1]

Onde:
PMT = Valor da parcela
PV = Valor presente (valor financiado)
i = Taxa de juros mensal
n = Número de parcelas
```

## 🏛️ Regulamentações Brasileiras

### Limites do SFH (Sistema Financeiro da Habitação)

- **Valor máximo**: R$ 1.500.000,00 (2024)
- **Renda máxima**: R$ 7.000,00 (para subsídios)
- **Comprometimento máximo**: 30% da renda bruta familiar

### Taxas de Referência

- **Selic**: Taxa básica de juros (referência)
- **TR**: Taxa Referencial (indexador comum)
- **IPCA**: Índice de inflação (alguns financiamentos)

## 💡 Dicas Importantes

### Para o Comprador

1. **Entrada maior = menos juros**: Cada R$ 1.000 a mais na entrada economiza muito em juros
2. **Compare sistemas**: SAC vs PRICE têm impactos diferentes no orçamento
3. **Reserve para custos extras**: ~10% do valor do imóvel para taxas e mobília
4. **Negocie a taxa**: Compare ofertas de diferentes bancos

### Para Escolha do Sistema

**Escolha SAC se:**

- Sua renda tende a crescer
- Quer pagar menos juros no total
- Pode comprometer mais renda no início

**Escolha PRICE se:**

- Prefere parcelas fixas
- Precisa de previsibilidade no orçamento
- Renda é estável

## 🔍 Exemplos Práticos

### Exemplo 1: Apartamento R$ 500.000

- **Entrada**: R$ 100.000 (20%)
- **Financiamento**: R$ 400.000
- **Taxa**: 9,5% a.a.
- **Prazo**: 30 anos

**Resultado SAC:**

- Primeira parcela: ~R$ 4.278
- Total de juros: ~R$ 571.000
- Renda mínima: ~R$ 14.260

**Resultado PRICE:**

- Parcela fixa: ~R$ 3.697
- Total de juros: ~R$ 731.000
- Renda mínima: ~R$ 12.323

### Comparação de Sistemas

| Aspecto          | SAC          | PRICE |
| ---------------- | ------------ | ----- |
| Parcelas         | Decrescentes | Fixas |
| Primeira parcela | Maior        | Menor |
| Total de juros   | Menor        | Maior |
| Previsibilidade  | Menor        | Maior |

## 🎨 Recursos Visuais

- **Interface Moderna**: Design dark theme profissional
- **Cards Interativos**: Hover effects e animações
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Formatação Brasileira**: Valores em R$ e percentuais localizados
- **Indicadores Visuais**: Cores para alertas de comprometimento

## 🚀 Tecnologias

- **Vue 3**: Composition API
- **TypeScript**: Tipagem estática
- **CSS3**: Gradientes e animações
- **Responsive Design**: Mobile-first

---

> **Nota**: Esta calculadora é uma ferramenta de simulação. Consulte sempre um especialista financeiro para decisões definitivas de investimento.
