# 🚀 Checkout PIX - Juntos Pelo Bem

## ✨ Funcionalidade Implementada

Checkout completo via PIX com integração preparada para **PushyNPay**, incluindo campo para comentários e interface visual moderna.

## 🎯 Características

### 📱 **Interface do Usuário**
- **Design responsivo** e moderno
- **Animações** suaves e transições
- **Elementos visuais** atrativos (ícones, gradientes, cards)
- **Feedback visual** em tempo real
- **Loading states** durante geração do PIX

### 🔧 **Funcionalidades**
- ✅ Campo para **valor da doação** (mínimo R$ 5,00)
- ✅ Campo para **nome completo** do doador
- ✅ Campo para **e-mail** do doador
- ✅ Campo para **comentário/mensagem** de apoio (opcional)
- ✅ **Validação** de campos obrigatórios
- ✅ **Geração de PIX** com simulação PushyNPay
- ✅ **QR Code** para escaneamento
- ✅ **Chave PIX** copiável
- ✅ **Instruções** passo a passo
- ✅ **Notificações toast** para feedback

### 🎨 **Elementos Visuais**
- **Ícones Lucide React** para melhor UX
- **Gradientes** e cores atrativas
- **Cards** com bordas e sombras
- **Animações** de loading e transições
- **Badges** e indicadores visuais
- **Layout em grid** para instruções

## 🚀 Como Usar

### 1. **Abrir o Checkout**
- Clique no botão verde **"Quero Ajudar"** na barra lateral direita
- O popup de checkout será aberto automaticamente

### 2. **Preencher os Dados**
- **Valor da doação**: Digite o valor (mínimo R$ 5,00)
- **Nome completo**: Seu nome completo
- **E-mail**: Seu e-mail válido
- **Mensagem de apoio**: Comentário opcional (máximo 200 caracteres)

### 3. **Gerar PIX**
- Clique em **"Gerar PIX"**
- Aguarde o processamento (simulação de 2 segundos)
- O PIX será gerado via PushyNPay

### 4. **Fazer Pagamento**
- **Escaneie o QR Code** com seu app bancário
- Ou **copie a chave PIX** e cole no app
- Confirme o valor e finalize o pagamento

## 🔌 Integração PushyNPay

### **Arquivo de Exemplo**
- `src/lib/pushynpay-integration.ts` - Classe completa de integração

### **Funcionalidades da API**
- ✅ **Gerar PIX** (`generatePix`)
- ✅ **Verificar status** (`checkPixStatus`)
- ✅ **Cancelar PIX** (`cancelPix`)
- ✅ **Listar transações** (`listPixTransactions`)

### **Configuração**
```typescript
const pushyNPay = new PushyNPayIntegration({
  apiKey: process.env.PUSHYNPAY_API_KEY,
  merchantId: process.env.PUSHYNPAY_MERCHANT_ID,
  environment: 'production' // ou 'sandbox'
});
```

### **Variáveis de Ambiente**
```env
PUSHYNPAY_API_KEY=sua_api_key_aqui
PUSHYNPAY_MERCHANT_ID=seu_merchant_id_aqui
NODE_ENV=production
```

## 🎨 Personalização

### **Cores e Temas**
- As cores seguem o sistema de design do projeto
- Use as classes Tailwind CSS para personalização
- Gradientes e sombras podem ser ajustados

### **Ícones**
- Todos os ícones são do **Lucide React**
- Fácil de trocar e personalizar
- Mantém consistência visual

### **Animações**
- Transições CSS suaves
- Loading states animados
- Hover effects responsivos

## 🧪 Testando

### **Servidor Local**
```bash
npm run dev
# Acesse: http://localhost:8080/
```

### **Teste do Checkout**
1. Abra a página principal
2. Clique em "Quero Ajudar"
3. Preencha os campos
4. Teste a geração do PIX
5. Verifique o QR Code e chave PIX

## 🚀 Próximos Passos

### **Para Produção**
- [ ] Integrar com API real da PushyNPay
- [ ] Implementar webhook para confirmação
- [ ] Adicionar histórico de doações
- [ ] Implementar notificações em tempo real
- [ ] Adicionar relatórios e analytics

### **Melhorias de UX**
- [ ] Salvar dados do doador (localStorage)
- [ ] Adicionar opções de valor pré-definido
- [ ] Implementar doação recorrente
- [ ] Adicionar compartilhamento social

### **Segurança**
- [ ] Validação de dados no backend
- [ ] Rate limiting para geração de PIX
- [ ] Logs de auditoria
- [ ] Criptografia de dados sensíveis

## 📱 Responsividade

### **Desktop (lg+)**
- Layout completo com sidebar lateral direita
- Grid de 3 colunas com conteúdo principal e sidebar
- Elementos visuais em tamanho completo
- Espaçamentos otimizados para telas grandes

### **Tablet (md-lg)**
- Layout adaptado para telas médias
- Sidebar mantida mas com espaçamentos reduzidos
- Elementos visuais ajustados proporcionalmente
- Navegação horizontal mantida

### **Mobile (sm-md)**
- Layout em coluna única otimizado
- Sidebar posicionada no topo (order-1)
- Conteúdo principal abaixo (order-2)
- Elementos visuais redimensionados para mobile
- Botões empilhados verticalmente quando necessário
- Espaçamentos reduzidos para economia de espaço

### **Mobile Pequeno (<sm)**
- Padding reduzido (px-4 → px-3)
- Tamanhos de fonte adaptados (text-sm → text-xs)
- Ícones menores (w-4 → w-3)
- QR Code redimensionado (w-36 → w-28)
- Grid de instruções em coluna única
- Botões de ação empilhados verticalmente

### **Características Responsivas**
- ✅ **Breakpoints**: sm (640px), md (768px), lg (1024px)
- ✅ **Flexbox/Grid**: Adaptação automática do layout
- ✅ **Espaçamentos**: Responsivos com classes sm:, md:, lg:
- ✅ **Tipografia**: Escalável conforme tamanho da tela
- ✅ **Ícones**: Redimensionados proporcionalmente
- ✅ **Cards**: Padding e margens adaptativos
- ✅ **Botões**: Tamanhos e espaçamentos responsivos
- ✅ **Formulários**: Campos otimizados para touch
- ✅ **Dialog**: Largura adaptativa (95vw em mobile)

## 🔧 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones
- **PushyNPay** para processamento de pagamentos

## 📞 Suporte

Para dúvidas sobre a implementação ou integração com PushyNPay, consulte:
- Documentação da PushyNPay
- Issues do projeto no GitHub
- Equipe de desenvolvimento

---

**Desenvolvido com ❤️ para Juntos Pelo Bem**
