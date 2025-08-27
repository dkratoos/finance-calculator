# ⚖️ Calculadora PJ vs CLT - Documentação Completa

## 🎯 **Visão Geral**

Calculadora inteligente que compara financeiramente o trabalho como **Pessoa Jurídica (PJ)** versus **Consolidação das Leis do Trabalho (CLT)**, oferecendo análises detalhadas e recomendações baseadas em risco para orientar sua decisão profissional.

---

## 📋 **Campos de Entrada**

### **👔 Regime CLT**

| Campo                 | Tipo      | Obrigatório | Descrição                                  |
| --------------------- | --------- | ----------- | ------------------------------------------ |
| **Salário Bruto**     | Monetário | ❌          | Remuneração mensal contratual              |
| **Vale Alimentação**  | Monetário | ❌          | Valor mensal sem coparticipação            |
| **Vale Transporte**   | Monetário | ❌          | Valor líquido recebido                     |
| **Plano de Saúde**    | Monetário | ❌          | Valor da empresa (sem desconto)            |
| **Outros Benefícios** | Monetário | ❌          | Gympass, seguro de vida, etc.              |
| **Anos de Trabalho**  | Numérico  | ✅          | Para cálculo do FGTS acumulado (padrão: 1) |

### **💼 Regime PJ**

| Campo                    | Tipo      | Obrigatório | Descrição                              |
| ------------------------ | --------- | ----------- | -------------------------------------- |
| **Faturamento Mensal**   | Monetário | ❌          | Receita bruta mensal                   |
| **Categoria Tributária** | Select    | ✅          | MEI, Simples Nacional, Lucro Presumido |
| **Atividade Principal**  | Select    | ✅          | Área de atuação profissional           |
| **Gastos Mensais**       | Monetário | ❌          | Contador, equipamentos, internet, etc. |

---

## 🧮 **Cálculos Realizados**

### **💰 Análise CLT**

1. **Descontos Obrigatórios**

   - **INSS**: Até 14% conforme faixas salariais 2024
   - **IRRF**: 0% a 27,5% conforme tabela progressiva

2. **Benefícios Calculados**

   - **FGTS**: 8% depositado pela empresa mensalmente
   - **13º Salário**: Valor líquido (descontado INSS/IRRF)
   - **1/3 de Férias**: Abono constitucional anual
   - **FGTS Acumulado**: Projeção baseada nos anos de trabalho

3. **Receita Total**
   - **Mensal**: Salário líquido + benefícios
   - **Anual**: 12 meses + 13º + FGTS + 1/3 férias

### **🏢 Análise PJ**

1. **Impostos por Categoria**

   **MEI (até R$ 81.000/ano)**

   - DAS: ~6% do faturamento

   **Simples Nacional (Anexo III)**

   - 6% a 33% conforme faturamento anual
   - Faixas progressivas de R$ 0 a R$ 4,8 milhões

   **Lucro Presumido**

   - ISS: 3% (média municipal)
   - PIS: 0,65% + COFINS: 3%
   - IRPJ: 15% + CSLL: 9%
   - Adicional IRPJ: 10% (se > R$ 20k/mês)

2. **Receita Líquida**
   - Faturamento - Impostos - Gastos Mensais

### **📊 Comparação Inteligente**

1. **Análise Mensal vs Anual**
2. **Percentual de Vantagem**
3. **Melhor Opção por Período**
4. **Recomendação com Base em Risco**

---

## 🎯 **Sistema de Recomendação Inteligente**

### **📈 Percentuais Mínimos por Atividade**

| Atividade            | Percentual Mínimo | Justificativa               |
| -------------------- | ----------------- | --------------------------- |
| **TI**               | 20%               | Alta demanda e estabilidade |
| **Consultoria**      | 25%               | Risco moderado              |
| **Design/Marketing** | 30%               | Mercado mais instável       |
| **Engenharia**       | 25%               | Risco moderado              |
| **Educação**         | 35%               | Menos previsível como PJ    |
| **Outros Serviços**  | 30%               | Variabilidade média         |

### **⚙️ Ajustes por Categoria Tributária**

- **MEI**: -5% (mais simples e seguro)
- **Simples Nacional**: +0% (padrão)
- **Lucro Presumido**: +5% (mais complexo)

### **🚦 Níveis de Risco**

**🟢 Baixo Risco** - Vantagem ≥ (Mínimo + 10%)

- ✅ **Migração Recomendada**
- Margem de segurança confortável

**🟡 Médio Risco** - Vantagem ≥ Mínimo

- ⚠️ **Migração Possível, Avalie Cuidado**
- Margem apertada, considere tolerância a risco

**🔴 Alto Risco** - Vantagem < Mínimo ou Negativa

- 🚨 **Migração Não Recomendada**
- Riscos superam benefícios

---

## 📊 **Resultados Apresentados**

### **🏆 Resumo Executivo**

- **Comparação Mensal e Anual**
- **Melhor Opção por Período**
- **Percentual de Diferença**
- **Status da Recomendação**

### **📈 Breakdown Detalhado**

**CLT:**

- Salário líquido, descontos, benefícios
- FGTS mensal e acumulado
- 13º salário e 1/3 férias
- Receita total mensal e anual

**PJ:**

- Faturamento bruto e impostos
- Alíquota total efetiva
- Receita líquida mensal e anual
- Gastos operacionais

### **🎯 Recomendação Personalizada**

- **Análise de Risco** com justificativa
- **Fatores Considerados** (atividade, tributação, estabilidade)
- **Percentual Mínimo** calculado para sua situação
- **Margem de Segurança** atual

---

## 💡 **Considerações Importantes**

### **🏦 Vantagens CLT**

- **FGTS**: Fundo disponível para emergências e aposentadoria
- **13º Salário**: Renda extra garantida anualmente
- **Férias Remuneradas**: 1/3 adicional constitucional
- **Estabilidade Legal**: Direitos trabalhistas garantidos
- **Previsibilidade**: Renda fixa mensal

### **💼 Vantagens PJ**

- **Flexibilidade**: Horários e contratos mais livres
- **Potencial de Crescimento**: Possibilidade de aumento de renda
- **Deduções Fiscais**: Gastos dedutíveis do IR
- **Autonomia**: Maior controle sobre a carreira
- **Múltiplos Clientes**: Diversificação de fontes de renda

### **⚠️ Custos Ocultos PJ**

- **Contador**: R$ 150-500/mês
- **Equipamentos**: Computador, internet, celular
- **Previdência Privada**: Substituir INSS
- **Plano de Saúde**: Sem cobertura empresarial
- **"13º Próprio"**: Reservar para gratificação
- **Férias Próprias**: Reservar para períodos sem renda

---

## 🔍 **Exemplos Práticos**

### **Exemplo 1: Desenvolvedor Sênior**

```
CLT:
- Salário: R$ 8.000
- VA: R$ 800 | VT: R$ 200 | Plano: R$ 400
- Total Anual: ~R$ 140.000

PJ:
- Faturamento: R$ 12.000/mês
- Simples Nacional: ~8% impostos
- Gastos: R$ 800/mês
- Total Anual: ~R$ 124.000

Resultado: CLT 13% melhor → NÃO RECOMENDADO
```

### **Exemplo 2: Consultor Especialista**

```
CLT:
- Salário: R$ 10.000
- Benefícios: R$ 1.500
- Total Anual: ~R$ 180.000

PJ:
- Faturamento: R$ 18.000/mês
- Simples Nacional: ~11% impostos
- Gastos: R$ 1.000/mês
- Total Anual: ~R$ 204.000

Resultado: PJ 25% melhor → RECOMENDADO ✅
```

---

## 🚀 **Como Usar**

### **1. Preencha Dados CLT** (se aplicável)

- Informe salário e benefícios atuais
- Configure anos de trabalho para FGTS

### **2. Preencha Dados PJ** (se aplicável)

- Defina faturamento pretendido/atual
- Escolha categoria tributária adequada
- Informe gastos operacionais

### **3. Analise os Resultados**

- Compare valores mensais e anuais
- Observe o percentual de vantagem
- Leia a recomendação personalizada

### **4. Considere os Fatores**

- Avalie sua tolerância a risco
- Considere estabilidade vs flexibilidade
- Planeje custos ocultos do PJ

---

## 📋 **Validações Automáticas**

- ✅ Pelo menos um regime deve ser preenchido
- ✅ Salário CLT ≥ salário mínimo (R$ 1.412)
- ✅ MEI não pode exceder R$ 81.000/ano
- ✅ Gastos PJ não podem ser negativos

---

**⚖️ Calculadora PJ vs CLT - Decisão Inteligente com Base em Dados! ⚖️**
