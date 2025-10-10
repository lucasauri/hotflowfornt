# HortiFlow Frontend - Interface Web

## 📋 Descrição

Frontend moderno para o sistema HortiFlow, desenvolvido com HTML5, CSS3 e JavaScript vanilla. Consome a API REST do backend Java.

## 🎨 Características

- **Interface Moderna**: Design responsivo e intuitivo
- **Dashboard Interativo**: Estatísticas em tempo real
- **CRUD Completo**: Gerenciamento de produtos e clientes
- **Controle de Estoque**: Movimentações de entrada e saída
- **Notificações**: Sistema de toast para feedback
- **Status da API**: Indicador de conexão com o backend
- **Modo Demonstração**: Funciona sem backend usando dados mockados

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com Flexbox e Grid
- **JavaScript ES6+** - Lógica da aplicação
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Inter)

## 🚀 Como Executar

### Modo Demonstração (Recomendado para Testes)
O sistema funciona **mesmo sem o backend**, usando dados mockados para demonstração.

### Modo Completo (Com Backend)
- Backend Java rodando em `http://localhost:8080`
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Opção 1: Servidor Python
```bash
cd frontend
python -m http.server 3000
```

### Opção 2: Script Batch (Windows)
```bash
cd frontend
start-frontend.bat
```

### Opção 3: Servidor Node.js
```bash
cd frontend
npx http-server -p 3000
```

### Opção 4: Live Server (VS Code)
1. Instale a extensão "Live Server"
2. Clique com botão direito no `index.html`
3. Selecione "Open with Live Server"

## 📱 Funcionalidades

### Dashboard
- **Estatísticas Gerais**: Total de produtos, estoque atual, valor em estoque
- **Produtos com Baixo Estoque**: Lista de produtos que precisam de reposição
- **Últimos Produtos**: Produtos cadastrados recentemente

### Gerenciamento de Produtos
- ✅ Listar todos os produtos
- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Excluir produto
- ✅ Buscar produtos
- ✅ Visualizar estoque atual
- ✅ Calcular valor em estoque

### Gerenciamento de Clientes
- ✅ Listar todos os clientes
- ✅ Criar novo cliente
- ✅ Editar cliente existente
- ✅ Excluir cliente
- ✅ Buscar clientes
- ✅ Dados completos (CNPJ, IE, etc.)

### Controle de Estoque
- ✅ Movimentações de entrada
- ✅ Movimentações de saída
- ✅ Histórico de movimentações
- ✅ Filtros por produto e tipo
- ✅ Validação de estoque

## 🎭 Modo Demonstração

Quando o backend não está disponível, o sistema automaticamente:
- ✅ Usa dados mockados para demonstração
- ✅ Exibe "Modo Demonstração" no status da API
- ✅ Mostra notificação informando o modo atual
- ✅ Permite testar todas as funcionalidades

### Dados de Demonstração Incluídos:
- **5 Produtos**: Tomate Cereja, Alface Crespa, Cenoura, Brócolis, Couve
- **3 Clientes**: Mercado Central, Supermercado Verde, Hortifruti São Paulo
- **Movimentações**: Histórico de entradas e saídas
- **Estatísticas**: Valores calculados automaticamente

## 🔧 Configuração da API

O frontend está configurado para consumir a API Java em:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/{id}` | Busca produto por ID |
| GET | `/produtos/estoque-baixo` | Produtos com estoque baixo |
| GET | `/produtos/estatisticas` | Estatísticas gerais |
| POST | `/produtos` | Cria novo produto |
| PUT | `/produtos/{id}` | Atualiza produto |
| DELETE | `/produtos/{id}` | Remove produto |
| POST | `/produtos/{id}/movimentacao` | Adiciona movimentação |
| GET | `/clientes` | Lista todos os clientes |
| POST | `/clientes` | Cria novo cliente |
| PUT | `/clientes/{id}` | Atualiza cliente |
| DELETE | `/clientes/{id}` | Remove cliente |

## 🎨 Interface

### Cores Principais
- **Verde**: #059669 (Primary)
- **Azul**: #3b82f6 (Info)
- **Laranja**: #f59e0b (Warning)
- **Vermelho**: #ef4444 (Error)

### Componentes
- **Sidebar**: Navegação principal
- **Cards**: Estatísticas e informações
- **Tabelas**: Dados organizados
- **Modais**: Formulários de cadastro
- **Toasts**: Notificações

## 📱 Responsividade

A interface é totalmente responsiva e funciona em:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🔍 Recursos Avançados

### Sistema de Notificações
- Toast notifications para feedback
- Indicador de status da API
- Loading states durante operações

### Validação
- Validação de formulários
- Verificação de estoque antes de saídas
- Tratamento de erros da API

### Performance
- Lazy loading de dados
- Debounce na busca
- Cache de dados em memória

## 🐛 Solução de Problemas

### Backend não conecta
1. Verifique se o backend Java está rodando
2. Confirme a porta 8080 está livre
3. Teste a URL: `http://localhost:8080/api/produtos/health`

### CORS Errors
- O backend deve ter CORS habilitado
- Verifique as configurações no `application.properties`

### Dados não carregam
1. Abra o DevTools (F12)
2. Verifique a aba Network
3. Confirme as requisições estão sendo feitas
4. Verifique os logs do backend

## 📊 Monitoramento

### Console do Navegador
- Logs de debug da aplicação
- Erros de JavaScript
- Requisições da API

### Network Tab
- Status das requisições HTTP
- Tempo de resposta
- Payload das requisições

## 🔄 Atualizações

Para atualizar o frontend:
1. Modifique os arquivos HTML/CSS/JS
2. Recarregue a página no navegador
3. Para mudanças na API, reinicie o backend

## 📝 Próximas Funcionalidades

- [ ] Gráficos de estoque
- [ ] Relatórios em PDF
- [ ] Exportação de dados
- [ ] Sistema de usuários
- [ ] Backup automático
- [ ] Notificações push

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- **Hortifruti Team** - Desenvolvimento inicial

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do repositório. 