# 📊 Calculadora de Custo de Funcionário - Documentação Completa

## 🎯 **Visão Geral**

Calculadora completa que determina o custo total de um funcionário para o empregador brasileiro, incluindo **todos** os encargos trabalhistas, benefícios e custos obrigatórios e opcionais previstos na legislação trabalhista de 2024.

---

## 📋 **Campos de Entrada**

### **👔 Dados do Funcionário**

| Campo                 | Tipo      | Obrigatório | Descrição                                     |
| --------------------- | --------- | ----------- | --------------------------------------------- |
| **Salário Bruto**     | Monetário | ✅          | Remuneração mensal contratual                 |
| **Cargo**             | Texto     | ❌          | Função exercida pelo funcionário              |
| **Regime Tributário** | Select    | ✅          | Simples Nacional, Lucro Presumido, Lucro Real |
| **Tipo de Contrato**  | Select    | ✅          | CLT, Aprendiz, Estagiário                     |

### **🎁 Benefícios e Vales**

| Campo                   | Tipo      | Obrigatório | Descrição                           |
| ----------------------- | --------- | ----------- | ----------------------------------- |
| **Vale Transporte**     | Monetário | ❌          | Valor total do VT                   |
| **Vale Alimentação**    | Monetário | ❌          | Valor total do VA                   |
| **Vale Refeição**       | Monetário | ❌          | Valor total do VR (diferente do VA) |
| **Plano de Saúde**      | Monetário | ❌          | Custo mensal para empresa           |
| **Plano Odontológico**  | Monetário | ❌          | Custo mensal para empresa           |
| **Seguro de Vida**      | Monetário | ❌          | Custo mensal para empresa           |
| **Auxílio Creche**      | Monetário | ❌          | Se aplicável                        |
| **Auxílio Educação**    | Monetário | ❌          | Cursos, faculdade, especializações  |
| **Previdência Privada** | Monetário | ❌          | PGBL, VGBL ou similar               |
| **Ticket Cultura**      | Monetário | ❌          | Lazer e atividades culturais        |
| **Uniformes e EPIs**    | Monetário | ❌          | Custo mensal médio                  |
| **Outros Benefícios**   | Monetário | ❌          | Gympass, convênios, etc.            |

### **⚙️ Configurações Avançadas**

| Campo                         | Tipo      | Padrão | Descrição                                       |
| ----------------------------- | --------- | ------ | ----------------------------------------------- |
| **Desconto Vale Transporte**  | %         | 6%     | Máximo 6% do salário (Lei)                      |
| **Desconto Vale Alimentação** | %         | 20%    | Máximo 20% do salário (Lei)                     |
| **Desconto Vale Refeição**    | %         | 20%    | Máximo 20% do salário (Lei)                     |
| **Alíquota SAT**              | Select    | 1%     | 1% (Baixo), 2% (Médio), 3% (Alto risco)         |
| **Adicional Periculosidade**  | Checkbox  | ❌     | 30% sobre salário base                          |
| **Adicional Insalubridade**   | Checkbox  | ❌     | 40% do salário mínimo                           |
| **Adicional Noturno**         | Checkbox  | ❌     | 20% para trabalho 22h-5h                        |
| **Percentual Horas Extras**   | %         | 0%     | Média mensal sobre salário                      |
| **PPR Anual**                 | %         | 0%     | Participação nos Lucros como % do salário anual |
| **Contribuição Sindical**     | Monetário | 0      | Valor anual da contribuição sindical            |

---

## 🧮 **Cálculos Realizados**

### **📊 Encargos Obrigatórios**

1. **INSS Patronal**: 20% sobre salário base + adicionais
2. **FGTS**: 8% sobre salário base + adicionais
3. **Provisão Férias**: (Salário + 1/3) ÷ 12
4. **Provisão 13º Salário**: Salário ÷ 12
5. **SAT**: 1%, 2% ou 3% (conforme regime e risco)
6. **Sistema S**: 5,8% (SESI, SENAI, SEBRAE, INCRA, Salário-Educação)

### **➕ Adicionais Calculados**

1. **Adicional Periculosidade**: 30% do salário bruto
2. **Adicional Insalubridade**: 40% do salário mínimo (R$ 1.412)
3. **Adicional Noturno**: 20% do salário bruto
4. **Horas Extras**: Percentual configurável sobre salário
5. **PPR**: Distribuído mensalmente (% anual ÷ 12)
6. **Contribuição Sindical**: Distribuída mensalmente (anual ÷ 12)

### **🎁 Benefícios Líquidos**

- **Vale Transporte**: Valor total - desconto funcionário (máx 6%)
- **Vale Alimentação**: Valor total - desconto funcionário (máx 20%)
- **Vale Refeição**: Valor total - desconto funcionário (máx 20%)
- **Demais Benefícios**: Valor integral pago pela empresa

---

## 📈 **Resultados Apresentados**

### **💡 Resumo Executivo**

- **Custo Total Mensal**: Salário + Encargos + Benefícios
- **Custo Total Anual**: Custo mensal × 12
- **Multiplicador de Custo**: Quanto a empresa paga por cada R$ 1,00 de salário
- **Custo por Hora**: Considerando 220h/mês trabalhadas

### **📊 Breakdown Detalhado**

- **Cards Individuais** para cada encargo e benefício
- **Ícones Temáticos** para fácil identificação
- **Valores Destacados** em dourado para totais
- **Alertas Visuais** para itens condicionais (SAT, adicionais, etc.)

### **🎯 Informações Contextuais**

- **Explicações Legais** de cada encargo
- **Regime Tributário** e seus impactos
- **Dicas Educativas** sobre legislação trabalhista

---

## ⚖️ **Conformidade Legal 2024**

### **✅ Encargos Obrigatórios Implementados**

- [x] INSS Patronal (20%)
- [x] FGTS (8%)
- [x] Provisão de Férias + 1/3 constitucional
- [x] Provisão de 13º salário
- [x] SAT - Seguro Acidente de Trabalho
- [x] Sistema S (SESI, SENAI, SEBRAE, INCRA, Salário-Educação)

### **✅ Adicionais Legais Implementados**

- [x] Adicional de Periculosidade (30%)
- [x] Adicional de Insalubridade (40% do mínimo)
- [x] Adicional Noturno (20%)
- [x] Horas Extras (50% ou 100%)

### **✅ Benefícios Comuns Implementados**

- [x] Vale Transporte (desconto máx 6%)
- [x] Vale Alimentação (desconto máx 20%)
- [x] Vale Refeição (desconto máx 20%)
- [x] Plano de Saúde e Odontológico
- [x] Seguro de Vida
- [x] Auxílio Creche
- [x] Auxílio Educação
- [x] Previdência Privada
- [x] Uniformes e EPIs

### **✅ Outros Custos Implementados**

- [x] PPR - Participação nos Lucros e Resultados
- [x] Contribuição Sindical
- [x] Ticket Cultura/Lazer

---

## 🔧 **Funcionalidades Técnicas**

### **🎨 Interface do Usuário**

- **Design Responsivo** para mobile e desktop
- **Máscaras de Entrada** para valores monetários
- **Checkboxes Customizados** com animações
- **Validação em Tempo Real** com mensagens claras
- **Cards Informativos** com breakdown detalhado

### **⚡ Performance**

- **Cálculos Reativos** com Vue 3 Composition API
- **Validações Inteligentes** com feedback imediato
- **Máscaras Otimizadas** para entrada de dados
- **Animações Suaves** CSS com transições

### **♿ Acessibilidade**

- **Labels Associados** para leitores de tela
- **Navegação por Teclado** completa
- **Contraste Adequado** em todos os elementos
- **Textos Alternativos** em ícones e elementos visuais

---

## 🚀 **Como Usar**

### **1. Dados Básicos**

1. Informe o **salário bruto** do funcionário
2. Selecione o **regime tributário** da empresa
3. Escolha o **tipo de contrato** (CLT, Aprendiz, Estagiário)

### **2. Benefícios**

1. Adicione os **valores dos vales** (transporte, alimentação, refeição)
2. Informe custos com **planos de saúde** e outros benefícios
3. Configure **auxílios específicos** se aplicáveis

### **3. Configurações**

1. Ajuste **percentuais de desconto** dos vales
2. Configure **adicionais** se aplicáveis (periculosidade, insalubridade, noturno)
3. Defina **horas extras** e **PPR** se houver

### **4. Resultados**

1. Clique em **"💰 CALCULAR CUSTO"**
2. Visualize o **resumo executivo** com valores principais
3. Analise o **breakdown detalhado** de cada item
4. Use as **informações contextuais** para entender cada encargo

---

## 📊 **Exemplos de Uso**

### **Exemplo 1: Funcionário Básico**

```
Salário: R$ 3.000,00
Vale Alimentação: R$ 600,00
Vale Transporte: R$ 200,00
Regime: Simples Nacional

Resultado: ~R$ 4.200,00/mês (multiplicador 1,4x)
```

### **Exemplo 2: Funcionário com Adicionais**

```
Salário: R$ 5.000,00
Adicional Periculosidade: ✅
Plano de Saúde: R$ 400,00
Regime: Lucro Presumido

Resultado: ~R$ 8.500,00/mês (multiplicador 1,7x)
```

---

## 🎯 **Benefícios da Calculadora**

### **Para Empregadores**

- **Planejamento Financeiro** preciso
- **Conformidade Legal** garantida
- **Transparência** nos custos
- **Comparação** entre diferentes cenários

### **Para RH e Contadores**

- **Ferramenta Profissional** completa
- **Cálculos Automáticos** sem erros
- **Documentação** dos custos
- **Educação** sobre encargos trabalhistas

### **Para Estudantes e Curiosos**

- **Aprendizado** sobre legislação trabalhista
- **Compreensão** dos custos empresariais
- **Interface Educativa** com explicações
- **Simulação** de diferentes cenários

---

## 🔮 **Futuras Melhorias**

- [ ] **Export PDF** dos resultados
- [ ] **Comparação** entre múltiplos funcionários
- [ ] **Gráficos Interativos** de distribuição de custos
- [ ] **Simulação** de reajustes salariais
- [ ] **Histórico** de cálculos realizados
- [ ] **Templates** para diferentes cargos/setores

---

**✨ Calculadora de Custo de Funcionário - Completa, Precisa e Educativa! ✨**
