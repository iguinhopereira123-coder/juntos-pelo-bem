# 🚀 Guia de Deploy - Juntos pelo Bem

## 🌐 **Opções de Deploy**

### 1. **GitHub Pages (Recomendado - Gratuito)**

#### ✅ **Configuração Automática (Já Feita)**

O projeto já está configurado para deploy automático no GitHub Pages!

**O que foi configurado:**
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Vite configurado para produção
- ✅ Script de deploy no package.json
- ✅ Dependência gh-pages instalada

#### 🔧 **Ativar GitHub Pages:**

1. **Vá para:** https://github.com/iguinhopereira123-coder/juntos-pelo-bem/settings/pages
2. **Source:** Selecione "Deploy from a branch"
3. **Branch:** Selecione "gh-pages" (será criada automaticamente)
4. **Folder:** Deixe como "/ (root)"
5. **Clique:** "Save"

#### 🚀 **Deploy Automático:**

Agora, sempre que você fizer push para a branch `main`, o GitHub Actions irá:
1. Buildar a aplicação
2. Fazer deploy automaticamente
3. Disponibilizar em: `https://iguinhopereira123-coder.github.io/juntos-pelo-bem/`

### 2. **Vercel (Alternativa - Gratuito)**

#### **Deploy Manual:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### **Deploy via GitHub:**
1. Conecte o repositório no [Vercel](https://vercel.com)
2. Deploy automático a cada push

### 3. **Netlify (Alternativa - Gratuito)**

#### **Deploy Manual:**
```bash
# Build
npm run build

# Fazer upload da pasta dist/
```

#### **Deploy via GitHub:**
1. Conecte o repositório no [Netlify](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🎯 **URLs de Deploy**

### **GitHub Pages:**
- **URL:** https://iguinhopereira123-coder.github.io/juntos-pelo-bem/
- **Status:** Configurado, aguardando ativação

### **Vercel (após configurar):**
- **URL:** https://juntos-pelo-bem.vercel.app
- **Status:** Não configurado

### **Netlify (após configurar):**
- **URL:** https://juntos-pelo-bem.netlify.app
- **Status:** Não configurado

## 🔧 **Comandos Úteis**

### **Deploy Manual (GitHub Pages):**
```bash
# Build e deploy
npm run deploy

# Apenas build
npm run build

# Preview local
npm run preview
```

### **Verificar Status:**
```bash
# Status do Git
git status

# Logs do GitHub Actions
# Vá para: https://github.com/iguinhopereira123-coder/juntos-pelo-bem/actions
```

## 📋 **Checklist de Deploy**

### **GitHub Pages:**
- [x] Workflow configurado
- [x] Vite configurado
- [x] Scripts adicionados
- [ ] Ativar GitHub Pages nas configurações
- [ ] Verificar deploy automático
- [ ] Testar aplicação online

### **Vercel:**
- [ ] Conectar repositório
- [ ] Configurar variáveis de ambiente
- [ ] Fazer primeiro deploy
- [ ] Testar aplicação

### **Netlify:**
- [ ] Conectar repositório
- [ ] Configurar build settings
- [ ] Fazer primeiro deploy
- [ ] Testar aplicação

## 🌍 **Variáveis de Ambiente**

### **Para Produção:**
```env
VITE_PUSHINPAY_API_KEY=sua_chave_api_aqui
VITE_PUSHINPAY_ENVIRONMENT=production
```

### **Configurar no Deploy:**
- **GitHub Pages:** Não suporta variáveis de ambiente (usar fallback)
- **Vercel:** Settings > Environment Variables
- **Netlify:** Site settings > Environment variables

## 🚨 **Problemas Comuns**

### **Erro 404 no GitHub Pages:**
- Verificar se o base path está correto no `vite.config.ts`
- Verificar se a branch `gh-pages` foi criada

### **Erro de Build:**
- Verificar logs no GitHub Actions
- Testar build local: `npm run build`

### **CORS em Produção:**
- A aplicação usa fallback local automaticamente
- Para API real, configurar CORS no servidor

## 📞 **Suporte**

### **GitHub Actions:**
- Logs: https://github.com/iguinhopereira123-coder/juntos-pelo-bem/actions
- Issues: https://github.com/iguinhopereira123-coder/juntos-pelo-bem/issues

### **Documentação:**
- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/docs)
- [Netlify](https://docs.netlify.com/)

---

**Status:** ✅ Configurado para GitHub Pages  
**Próximo Passo:** Ativar GitHub Pages nas configurações do repositório
