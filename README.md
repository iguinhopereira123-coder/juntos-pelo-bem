# 🎗️ Juntos pelo Bem - Campanha de Doação

Uma aplicação web moderna para campanhas de doação com integração PIX, construída com React, TypeScript e Shadcn UI.

## ✨ Características

- 🎨 **Interface Moderna**: Design responsivo e acessível
- 💳 **Pagamento PIX**: Integração completa com PushinPay
- 📱 **Mobile First**: Otimizado para dispositivos móveis
- 🔒 **Seguro**: Fallback local para desenvolvimento
- ⚡ **Performance**: Construído com Vite e React Query

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **Build**: Vite
- **Estado**: React Query (TanStack Query)
- **Pagamento**: PushinPay PIX API
- **Roteamento**: React Router

## 📦 Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/juntos-pelo-bem.git
cd juntos-pelo-bem

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_PUSHINPAY_API_KEY=sua_chave_api_aqui
VITE_PUSHINPAY_ENVIRONMENT=production
```

### Configuração PushinPay

1. Obtenha sua API Key no [PushinPay](https://pushinpay.com)
2. Configure a chave no arquivo `.env.local`
3. Para desenvolvimento, o sistema usa fallback local automaticamente

## 🎯 Funcionalidades

### 💰 Sistema de Doação
- Formulário de doação responsivo
- Validação de dados em tempo real
- Múltiplos valores de doação
- Comentários personalizados

### 📱 PIX Integration
- Geração automática de QR Code
- Código copia e cola
- Verificação de status em tempo real
- Fallback local para desenvolvimento

### 🎨 Interface
- Design moderno e intuitivo
- Componentes reutilizáveis
- Animações suaves
- Acessibilidade completa

## 🧪 Testes

### Testes Disponíveis no Console

```javascript
// Testar integração PIX
window.testFallback.testLocal()

// Testar checkout completo
window.testFallback.testCheckout()

// Testar interface
window.testFallback.testUI()

// Debug PushinPay
window.pushinPayDebug.testCORS()
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes Shadcn UI
│   └── *.tsx           # Componentes customizados
├── lib/                # Utilitários e integrações
│   ├── pix-api.ts      # API PIX
│   └── pushynpay-integration.ts  # Integração PushinPay
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
└── assets/             # Imagens e recursos
```

## 🔒 Segurança

- **Desenvolvimento**: Fallback local automático
- **Produção**: API PushinPay com fallback
- **CORS**: Configurado para produção
- **Validação**: Dados validados no frontend e backend

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Deploy pasta dist/
```

## 📚 Documentação

- [PushinPay Setup](./PUSHINPAY_SETUP.md)
- [CORS Solution](./CORS_SOLUTION.md)
- [PIX Checkout](./PIX_CHECKOUT_README.md)
- [Correções PushinPay](./CORREÇÕES_PUSHINPAY.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/juntos-pelo-bem/issues)
- **Email**: seu-email@exemplo.com
- **Documentação**: [Wiki do Projeto](https://github.com/seu-usuario/juntos-pelo-bem/wiki)

---

**Desenvolvido com ❤️ para fazer a diferença no mundo**
