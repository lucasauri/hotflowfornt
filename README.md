# HortiFlow - Sistema de Gestão Hortifruti

Sistema de gestão para hortifruti desenvolvido com React e Vite.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com estatísticas e produtos com baixo estoque
- **Produtos**: CRUD completo de produtos com controle de estoque
- **Clientes**: Gerenciamento de clientes com validação de CPF/CNPJ
- **Vendas**: Sistema de vendas (nova funcionalidade)
- **Autenticação**: Sistema de login com modo demonstração
- **Modo Offline**: Funciona com dados mockados quando backend não está disponível

## 🛠️ Tecnologias

- **React 18** - Biblioteca para interface de usuário
- **Vite** - Build tool e dev server
- **Vanilla JavaScript** - Para handlers e lógica de negócio
- **CSS3** - Estilização moderna e responsiva
- **Font Awesome** - Ícones

## 📁 Estrutura do Projeto

```
frontend/
├── login.html              # Página de login
├── index.html              # Dashboard principal (React)
├── styles.css              # Estilos globais
├── package.json            # Dependências
├── vite.config.js          # Configuração Vite
│
├── src/
│   ├── main.jsx            # Ponto de entrada React
│   ├── App.jsx             # Componente principal
│   ├── index.css           # Estilos React
│   ├── api.js              # Comunicação com backend
│   ├── auth.js             # Gerenciamento de autenticação
│   ├── ui.js               # Utilitários de UI
│   ├── utils.js            # Funções utilitárias
│   │
│   └── handlers/           # Lógica específica de cada aba
│       ├── dashboardHandler.js
│       ├── produtoHandler.js
│       ├── clienteHandler.js
│       └── vendaHandler.js
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo desenvolvimento:**
```bash
npm run dev
```

3. **Acessar a aplicação:**
- Login: http://localhost:3000/login.html
- Dashboard: http://localhost:3000

### Build para Produção

```bash
npm run build
```

## 🔐 Autenticação

### Modo Demonstração
- Use qualquer e-mail e senha para acessar
- Dados mockados são carregados automaticamente

### Modo Produção
- Configure o backend na URL: `http://localhost:8080/api`
- Sistema detecta automaticamente se backend está disponível

## 📊 Funcionalidades por Aba

### Dashboard
- Estatísticas gerais (total produtos, estoque, valor)
- Lista de produtos com baixo estoque
- Últimos produtos cadastrados

### Produtos
- Listar, criar, editar e excluir produtos
- Busca em tempo real
- Validação de preços e estoque
- Cálculo automático do valor em estoque

### Clientes
- CRUD completo de clientes
- Validação de CPF e CNPJ
- Campos: nome, estado, telefone, documentos, condições de pagamento

### Vendas (Nova)
- Sistema de vendas com produtos e clientes
- Cálculo automático de totais
- Controle de status (pendente/concluída)
- Integração com produtos e clientes existentes

## 🔧 Configuração

### API Backend
Edite a URL da API em `src/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Dados Mockados
Os dados de demonstração estão em `src/api.js` na constante `mockData`.

## 🎨 Design

- **Design System**: Cores verdes (#059669) para tema hortifruti
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Acessível**: Contraste adequado e navegação por teclado
- **Moderno**: Gradientes, sombras e animações suaves

## 🚀 Migração do Sistema Anterior

Esta versão React mantém 100% da funcionalidade do sistema vanilla JavaScript anterior:

- ✅ Todas as funcionalidades preservadas
- ✅ Mesmo design e UX
- ✅ Compatibilidade com backend existente
- ✅ Dados mockados idênticos
- ✅ Sistema de notificações
- ✅ Modais e formulários

### Melhorias Adicionadas

- 🎯 **Organização**: Código separado em handlers específicos
- 🔄 **Reatividade**: Interface atualiza automaticamente
- 🛡️ **Autenticação**: Sistema de login separado
- 📱 **Responsividade**: Melhor experiência mobile
- 🚀 **Performance**: React otimiza re-renderizações
- 🔧 **Manutenibilidade**: Código mais fácil de manter e expandir

## 📝 Próximos Passos

1. **Implementar API de Vendas** no backend
2. **Adicionar relatórios** e gráficos
3. **Sistema de notificações** push
4. **Exportação de dados** (PDF, Excel)
5. **PWA** para uso offline
6. **Testes automatizados**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.