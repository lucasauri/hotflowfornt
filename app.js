// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

// Estado da aplicação
let currentTab = 'dashboard';
let produtos = [];
let clientes = [];
let estatisticas = {};
let isBackendConnected = false;

// Dados mockados para demonstração
const mockData = {
    produtos: [
        { id: 1, nome: 'Tomate Cereja', preco: 8.50, embalagem: 'Band. 200m', estoqueAtual: 15 },
        { id: 2, nome: 'Alface Crespa', preco: 3.20, embalagem: 'Band. 200m', estoqueAtual: 8 },
        { id: 3, nome: 'Cenoura', preco: 4.80, embalagem: 'Band. 200m', estoqueAtual: 2 },
        { id: 4, nome: 'Brócolis', preco: 6.90, embalagem: 'Band. 200m', estoqueAtual: 12 },
        { id: 5, nome: 'Couve', preco: 2.50, embalagem: 'Band. 200m', estoqueAtual: 5 }
    ],
    clientes: [
        { id: 1, nome: 'Mercado Central', estado: 'SP', telefone: '(11) 99999-9999', cnpj: '12.345.678/0001-90' },
        { id: 2, nome: 'Supermercado Verde', estado: 'RJ', telefone: '(21) 88888-8888', cnpj: '98.765.432/0001-10' },
        { id: 3, nome: 'Hortifruti São Paulo', estado: 'SP', telefone: '(11) 77777-7777', cnpj: '11.222.333/0001-44' }
    ],
    movimentacoes: [
        { id: 1, produto: { nome: 'Tomate Cereja' }, tipo: 'ENTRADA', quantidade: 20, data: '2024-01-15', estoqueAtual: 15 },
        { id: 2, produto: { nome: 'Alface Crespa' }, tipo: 'SAIDA', quantidade: 5, data: '2024-01-14', estoqueAtual: 8 },
        { id: 3, produto: { nome: 'Cenoura' }, tipo: 'SAIDA', quantidade: 3, data: '2024-01-13', estoqueAtual: 2 }
    ],
    estatisticas: {
        totalProdutos: 5,
        estoqueAtual: 42,
        valorEstoque: 189.50,
        produtosBaixoEstoque: 2
    }
};

// Elementos DOM
const elements = {
    // Tabs
    navItems: document.querySelectorAll('.nav-item'),
    tabContents: document.querySelectorAll('.tab-content'),
    pageTitle: document.getElementById('page-title'),
    
    // Dashboard
    totalProdutos: document.getElementById('total-produtos'),
    estoqueAtual: document.getElementById('estoque-atual'),
    valorEstoque: document.getElementById('valor-estoque'),
    produtosBaixoEstoque: document.getElementById('produtos-baixo-estoque'),
    baixoEstoqueList: document.getElementById('baixo-estoque-list'),
    ultimosProdutos: document.getElementById('ultimos-produtos'),
    
    // Produtos
    produtosTableBody: document.getElementById('produtos-table-body'),
    produtoSearch: document.getElementById('produto-search'),
    addProdutoBtn: document.getElementById('add-produto-btn'),
    
    // Clientes
    clientesTableBody: document.getElementById('clientes-table-body'),
    clienteSearch: document.getElementById('cliente-search'),
    addClienteBtn: document.getElementById('add-cliente-btn'),
    
    // Estoque
    estoqueTableBody: document.getElementById('estoque-table-body'),
    addMovimentacaoBtn: document.getElementById('add-movimentacao-btn'),
    
    // Modals
    produtoModal: document.getElementById('produto-modal'),
    clienteModal: document.getElementById('cliente-modal'),
    movimentacaoModal: document.getElementById('movimentacao-modal'),
    
    // API Status
    apiStatus: document.getElementById('api-status'),
    
    // Loading
    loadingOverlay: document.getElementById('loading-overlay'),
    
    // Toast
    toastContainer: document.getElementById('toast-container')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    console.log('🚀 Iniciando aplicação HortiFlow...');
    
    // Verificar conexão com API
    isBackendConnected = await checkApiConnection();
    
    // Configurar navegação
    setupNavigation();
    
    // Configurar eventos
    setupEventListeners();
    
    // Carregar dados iniciais
    await loadInitialData();
    
    console.log('✅ Aplicação iniciada com sucesso!');
}

// Verificar conexão com API
async function checkApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/produtos/health`, {
            method: 'GET',
            timeout: 3000
        });
        if (response.ok) {
            updateApiStatus(true);
            showToast('Conectado ao backend HortiFlow', 'success');
            return true;
        } else {
            updateApiStatus(false);
            showToast('Modo demonstração ativado - Dados de exemplo', 'info');
            return false;
        }
    } catch (error) {
        console.error('Erro ao conectar com API:', error);
        updateApiStatus(false);
        showToast('Modo demonstração ativado - Dados de exemplo', 'info');
        return false;
    }
}

function updateApiStatus(connected) {
    const statusElement = elements.apiStatus;
    if (connected) {
        statusElement.className = 'api-status connected';
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Conectado</span>';
    } else {
        statusElement.className = 'api-status disconnected';
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Modo Demonstração</span>';
    }
}

// Configurar navegação
function setupNavigation() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Atualizar navegação
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tab) {
            item.classList.add('active');
        }
    });
    
    // Atualizar conteúdo
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tab) {
            content.classList.add('active');
        }
    });
    
    // Atualizar título
    const titles = {
        dashboard: 'Dashboard',
        produtos: 'Gerenciar Produtos',
        clientes: 'Gerenciar Clientes',
        estoque: 'Controle de Estoque'
    };
    elements.pageTitle.textContent = titles[tab];
    
    currentTab = tab;
    
    // Carregar dados específicos da tab
    loadTabData(tab);
}

async function loadTabData(tab) {
    switch (tab) {
        case 'dashboard':
            await loadDashboardData();
            break;
        case 'produtos':
            await loadProdutos();
            break;
        case 'clientes':
            await loadClientes();
            break;
        case 'estoque':
            await loadEstoque();
            await loadProdutosForSelect();
            break;
    }
}

// Configurar eventos
function setupEventListeners() {
    // Botão de atualizar
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadTabData(currentTab);
    });
    
    // Busca de produtos
    elements.produtoSearch.addEventListener('input', (e) => {
        filterProdutos(e.target.value);
    });
    
    // Busca de clientes
    elements.clienteSearch.addEventListener('input', (e) => {
        filterClientes(e.target.value);
    });
    
    // Botões de adicionar
    elements.addProdutoBtn.addEventListener('click', () => showProdutoModal());
    elements.addClienteBtn.addEventListener('click', () => showClienteModal());
    elements.addMovimentacaoBtn.addEventListener('click', () => showMovimentacaoModal());
    
    // Fechar modais
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => closeAllModals());
    });
    
    // Formulários
    document.getElementById('produto-form').addEventListener('submit', handleProdutoSubmit);
    document.getElementById('cliente-form').addEventListener('submit', handleClienteSubmit);
    document.getElementById('movimentacao-form').addEventListener('submit', handleMovimentacaoSubmit);
    
    // Filtros de estoque
    document.getElementById('produto-filter').addEventListener('change', filterEstoque);
    document.getElementById('tipo-filter').addEventListener('change', filterEstoque);
    
    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
}

// Carregar dados iniciais
async function loadInitialData() {
    showLoading(true);
    try {
        // Se não estiver conectado ao backend, carregar dados mockados imediatamente
        if (!isBackendConnected) {
            console.log('🔄 Carregando dados de demonstração...');
            await loadDashboardData();
        } else {
            await loadDashboardData();
        }
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showToast('Erro ao carregar dados', 'error');
    } finally {
        showLoading(false);
    }
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    try {
        const response = await fetch(url, config);
        
        if (response.status === 404) {
             throw new Error("Recurso não encontrado.");
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
        
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null; // DELETE ou PUT sem retorno
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro na requisição [${options.method || 'GET'}] ${endpoint}:`, error);
        throw error;
    }
}

// Modals
function showProdutoModal(produto = null) {
    const modal = elements.produtoModal;
    const title = modal.querySelector('#produto-modal-title');
    const form = modal.querySelector('#produto-form');
    
    title.textContent = produto ? 'Editar Produto' : 'Novo Produto';
    
    if (produto) {
        // Preencher formulário com dados do produto
        form.querySelector('#produto-id').value = produto.id;
        form.querySelector('#produto-nome').value = produto.nome;
        form.querySelector('#produto-preco').value = produto.preco;
        form.querySelector('#produto-embalagem').value = produto.embalagem;
        form.querySelector('#produto-estoque-inicial').value = produto.estoqueInicial || 0;
    } else {
        form.reset();
        form.querySelector('#produto-id').value = '';
    }
    
    modal.classList.add('active');
}

function showClienteModal(cliente = null) {
    const modal = elements.clienteModal;
    const title = modal.querySelector('#cliente-modal-title');
    const form = modal.querySelector('#cliente-form');
    
    title.textContent = cliente ? 'Editar Cliente' : 'Novo Cliente';
    
    if (cliente) {
        // Preencher formulário com dados do cliente
        form.querySelector('#cliente-id').value = cliente.id;
        form.querySelector('#cliente-nome').value = cliente.nome;
        form.querySelector('#cliente-estado').value = cliente.estado || '';
        form.querySelector('#cliente-telefone').value = cliente.telefone || '';
        form.querySelector('#cliente-cnpj').value = cliente.cnpj || '';
        form.querySelector('#cliente-ie').value = cliente.ie || '';
        form.querySelector('#cliente-cond-pgto').value = cliente.condPgto || '';
        form.querySelector('#cliente-banco').value = cliente.banco || '';
    } else {
        form.reset();
        form.querySelector('#cliente-id').value = '';
    }
    
    modal.classList.add('active');
}

// Funções de validação
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    return true;
}

// Form Handlers
async function handleProdutoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = formData.get('produto-id');
    // Normalizar entradas
    const nome = (formData.get('produto-nome') || '').trim();
    const precoStr = (formData.get('produto-preco') || '').toString().replace(',', '.');
    const emb = (formData.get('produto-embalagem') || '').trim();
    const estoqueStr = (formData.get('produto-estoque-inicial') || '').toString().replace(',', '.');

    const preco = parseFloat(precoStr);
    const estoqueInicial = estoqueStr === '' ? 0 : parseFloat(estoqueStr);

    // Validação simples no cliente
    if (!nome) {
        showToast('Informe o nome do produto.', 'error');
        return;
    }
    if (isNaN(preco) || preco <= 0) {
        showToast('Informe um preço válido maior que zero.', 'error');
        return;
    }
    if (isNaN(estoqueInicial) || estoqueInicial < 0) {
        showToast('Informe um estoque inicial válido (zero ou maior).', 'error');
        return;
    }

    const produto = {
        nome: nome,
        preco: preco,
        embalagem: emb || 'Band. 200m',
        estoqueInicial: estoqueInicial
    };
    
    try {
        showLoading(true);
        
        if (id) {
            await apiRequest(`/produtos/${id}`, {
                method: 'PUT',
                body: JSON.stringify(produto)
            });
            showToast('Produto atualizado com sucesso!', 'success');
        } else {
            await apiRequest('/produtos', {
                method: 'POST',
                body: JSON.stringify(produto)
            });
            showToast('Produto criado com sucesso!', 'success');
        }
        
        closeAllModals();
        await loadProdutos();
        await loadDashboardData();
        
    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        showToast('Erro ao salvar produto', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleClienteSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = formData.get('cliente-id');
    const nome = (formData.get('cliente-nome') || '').trim();
    if (!nome) {
        showToast('Informe o nome do cliente.', 'error');
        return;
    }
    const cpf = (formData.get('cliente-cpf') || '').trim();
    if (cpf && !validarCPF(cpf)) {
        showToast('CPF inválido.', 'error');
        return;
    }
    const cliente = {
        nome: nome,
        estado: (formData.get('cliente-estado') || '').trim(),
        telefone: (formData.get('cliente-telefone') || '').trim(),
        cnpj: (formData.get('cliente-cnpj') || '').trim(),
        cpf: cpf,
        ie: (formData.get('cliente-ie') || '').trim(),
        condPgto: (formData.get('cliente-cond-pgto') || '').trim(),
        banco: (formData.get('cliente-banco') || '').trim()
    };
    
    try {
        showLoading(true);
        
        if (id) {
            await apiRequest(`/clientes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(cliente)
            });
            showToast('Cliente atualizado com sucesso!', 'success');
        } else {
            await apiRequest('/clientes', {
                method: 'POST',
                body: JSON.stringify(cliente)
            });
            showToast('Cliente criado com sucesso!', 'success');
        }
        
        closeAllModals();
        await loadClientes();
        
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        showToast('Erro ao salvar cliente', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleMovimentacaoSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const movimentacao = {
        tipo: formData.get('movimentacao-tipo'),
        quantidade: parseFloat(formData.get('movimentacao-quantidade'))
    };

    const produtoId = formData.get('movimentacao-produto');

    try {
        showLoading(true);

        await apiRequest(`/api/produtos/${produtoId}/movimentacao`, {
            method: 'POST',
            body: JSON.stringify(movimentacao)
        });

        showToast('Movimentação registrada com sucesso!', 'success');
        closeAllModals();
        await loadEstoque();
        await loadDashboardData();

    } catch (error) {
        console.error('Erro ao registrar movimentação:', error);
        showToast('Erro ao registrar movimentação', 'error');
    } finally {
        showLoading(false);
    }
}

// Utility Functions
function showLoading(show) {
    if (show) {
        elements.loadingOverlay.classList.add('active');
    } else {
        elements.loadingOverlay.classList.remove('active');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function showMovimentacaoModal() {
    const modal = elements.movimentacaoModal;
    modal.classList.add('active');
    
    // Carregar produtos para o select
    loadProdutosForSelect();
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Funções globais para ações
window.editProduto = function(id) {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
        showProdutoModal(produto);
    }
};

window.deleteProduto = async function(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
            showLoading(true);
            await apiRequest(`/produtos/${id}`, { method: 'DELETE' });
            showToast('Produto excluído com sucesso!', 'success');
            await loadProdutos();
            await loadDashboardData();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            showToast('Erro ao excluir produto', 'error');
        } finally {
            showLoading(false);
        }
    }
};

window.editCliente = function(id) {
    const cliente = clientes.find(c => c.id === id);
    if (cliente) {
        showClienteModal(cliente);
    }
};

window.deleteCliente = async function(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            showLoading(true);
            await apiRequest(`/clientes/${id}`, { method: 'DELETE' });
            showToast('Cliente excluído com sucesso!', 'success');
            await loadClientes();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            showToast('Erro ao excluir cliente', 'error');
        } finally {
            showLoading(false);
        }
    }
};

// Funções de carregamento de dados
async function loadDashboardData() {
    try {
        let stats, baixoEstoque, ultimosProdutos;
        
        if (isBackendConnected) {
            // Carregar estatísticas
            stats = await apiRequest('/api/produtos/estatisticas');
            // Carregar produtos com baixo estoque
            baixoEstoque = await apiRequest('/api/produtos/baixo-estoque');
            // Carregar últimos produtos
            ultimosProdutos = await apiRequest('/api/produtos?limit=5');
        } else {
            // Usar dados mockados imediatamente
            console.log('📊 Carregando dados mockados...');
            stats = mockData.estatisticas;
            baixoEstoque = mockData.produtos.filter(p => p.estoqueAtual < 5);
            ultimosProdutos = mockData.produtos.slice(0, 5);
            
            // Simular um pequeno delay para mostrar o loading
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Atualizar estatísticas
        if (stats) {
            elements.totalProdutos.textContent = stats.totalProdutos || 0;
            elements.estoqueAtual.textContent = stats.estoqueAtual || 0;
            elements.valorEstoque.textContent = formatCurrency(stats.valorEstoque || 0);
            elements.produtosBaixoEstoque.textContent = stats.produtosBaixoEstoque || 0;
        }

        // Carregar produtos com baixo estoque
        if (baixoEstoque && baixoEstoque.length > 0) {
            elements.baixoEstoqueList.innerHTML = baixoEstoque.map(produto => `
                <div class="list-item">
                    <div class="item-info">
                        <h4>${produto.nome}</h4>
                        <p>Estoque: ${produto.estoqueAtual} ${produto.embalagem}</p>
                    </div>
                    <span class="status-badge low">Baixo</span>
                </div>
            `).join('');
        } else {
            elements.baixoEstoqueList.innerHTML = '<p class="empty-state">Nenhum produto com baixo estoque</p>';
        }

        // Carregar últimos produtos
        if (ultimosProdutos && ultimosProdutos.length > 0) {
            elements.ultimosProdutos.innerHTML = ultimosProdutos.map(produto => `
                <div class="list-item">
                    <div class="item-info">
                        <h4>${produto.nome}</h4>
                        <p>Preço: ${formatCurrency(produto.preco)}</p>
                    </div>
                    <span class="status-badge ${produto.estoqueAtual < 10 ? 'low' : 'ok'}">
                        ${produto.estoqueAtual} ${produto.embalagem}
                    </span>
                </div>
            `).join('');
        } else {
            elements.ultimosProdutos.innerHTML = '<p class="empty-state">Nenhum produto cadastrado</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showToast('Erro ao carregar dados do dashboard', 'error');
    }
}

async function loadProdutos() {
    try {
        let produtosData;
        if (isBackendConnected) {
            produtosData = await apiRequest('/produtos');
        } else {
            produtosData = mockData.produtos;
        }
        produtos = produtosData || [];
        renderProdutosTable(produtos);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos', 'error');
        elements.produtosTableBody.innerHTML = '<tr><td colspan="6" class="loading">Erro ao carregar produtos</td></tr>';
    }
}

async function loadClientes() {
    try {
        let clientesData;
        if (isBackendConnected) {
            clientesData = await apiRequest('/clientes');
        } else {
            clientesData = mockData.clientes;
        }
        clientes = clientesData || [];
        renderClientesTable(clientes);
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        showToast('Erro ao carregar clientes', 'error');
        elements.clientesTableBody.innerHTML = '<tr><td colspan="5" class="loading">Erro ao carregar clientes</td></tr>';
    }
}

async function loadEstoque() {
    try {
        let movimentacoes;
        if (isBackendConnected) {
            movimentacoes = await apiRequest('/movimentacoes');
        } else {
            movimentacoes = mockData.movimentacoes;
        }
        renderEstoqueTable(movimentacoes || []);
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
        showToast('Erro ao carregar movimentações', 'error');
        elements.estoqueTableBody.innerHTML = '<tr><td colspan="5" class="loading">Erro ao carregar movimentações</td></tr>';
    }
}

async function loadProdutosForSelect() {
    try {
        let produtosData;
        if (isBackendConnected) {
            produtosData = await apiRequest('/produtos');
        } else {
            produtosData = mockData.produtos;
        }
        
        const select = document.getElementById('movimentacao-produto');
        const filterSelect = document.getElementById('produto-filter');
        
        if (produtosData && produtosData.length > 0) {
            const options = produtosData.map(produto => 
                `<option value="${produto.id}">${produto.nome}</option>`
            ).join('');
            
            select.innerHTML = '<option value="">Selecione um produto</option>' + options;
            filterSelect.innerHTML = '<option value="">Todos os produtos</option>' + options;
        }
    } catch (error) {
        console.error('Erro ao carregar produtos para select:', error);
    }
}

// Funções de renderização
function renderProdutosTable(produtosList) {
    if (!produtosList || produtosList.length === 0) {
        elements.produtosTableBody.innerHTML = '<tr><td colspan="6" class="loading">Nenhum produto encontrado</td></tr>';
        return;
    }

    elements.produtosTableBody.innerHTML = produtosList.map(produto => `
        <tr>
            <td>${produto.nome}</td>
            <td>${formatCurrency(produto.preco)}</td>
            <td>${produto.embalagem}</td>
            <td>${produto.estoqueAtual || 0}</td>
            <td>${formatCurrency((produto.estoqueAtual || 0) * produto.preco)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduto(${produto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduto(${produto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderClientesTable(clientesList) {
    if (!clientesList || clientesList.length === 0) {
        elements.clientesTableBody.innerHTML = '<tr><td colspan="5" class="loading">Nenhum cliente encontrado</td></tr>';
        return;
    }

    elements.clientesTableBody.innerHTML = clientesList.map(cliente => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.estado || '-'}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>${cliente.cnpj || '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCliente(${cliente.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCliente(${cliente.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderEstoqueTable(movimentacoes) {
    if (!movimentacoes || movimentacoes.length === 0) {
        elements.estoqueTableBody.innerHTML = '<tr><td colspan="5" class="loading">Nenhuma movimentação encontrada</td></tr>';
        return;
    }

    elements.estoqueTableBody.innerHTML = movimentacoes.map(mov => `
        <tr>
            <td>${mov.produto?.nome || 'Produto não encontrado'}</td>
            <td>
                <span class="status-badge ${mov.tipo === 'ENTRADA' ? 'ok' : 'low'}">
                    ${mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                </span>
            </td>
            <td>${mov.quantidade}</td>
            <td>${new Date(mov.data).toLocaleDateString('pt-BR')}</td>
            <td>${mov.estoqueAtual || 0}</td>
        </tr>
    `).join('');
}

// Funções de filtro
function filterProdutos(searchTerm) {
    const filtered = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderProdutosTable(filtered);
}

function filterClientes(searchTerm) {
    const filtered = clientes.filter(cliente => 
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderClientesTable(filtered);
}

// Função de filtro de estoque
async function filterEstoque() {
    const produtoFilter = document.getElementById('produto-filter').value;
    const tipoFilter = document.getElementById('tipo-filter').value;
    
    try {
        let url = '/movimentacoes?';
        const params = [];
        
        if (produtoFilter) {
            params.push(`produtoId=${produtoFilter}`);
        }
        if (tipoFilter) {
            params.push(`tipo=${tipoFilter}`);
        }
        
        if (params.length > 0) {
            url += params.join('&');
        }
        
        const movimentacoes = await apiRequest(url);
        renderEstoqueTable(movimentacoes || []);
    } catch (error) {
        console.error('Erro ao filtrar movimentações:', error);
        showToast('Erro ao filtrar movimentações', 'error');
    }}