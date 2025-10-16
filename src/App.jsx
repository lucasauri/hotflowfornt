import React, { useState, useEffect } from 'react';
import { checkApiConnection } from './api.js';
import { isAuthenticated } from './auth.js';
import { showToast, updateApiStatus, showLoading } from './ui.js';

function App() {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [isBackendConnected, setIsBackendConnected] = useState(false);
    const [handlers, setHandlers] = useState({});

    useEffect(() => {
        initializeApp();
    }, []);

    useEffect(() => {
        // Inicializar handlers quando a conexão for definida
        if (isBackendConnected !== null) {
            // Carregar handlers dinamicamente
            import('./handlers/dashboardHandler.js').then(module => {
                const DashboardHandler = module.DashboardHandler;
                const dashboardHandler = new DashboardHandler(isBackendConnected);
                
                import('./handlers/produtoHandler.js').then(module => {
                    const ProdutoHandler = module.ProdutoHandler;
                    const produtoHandler = new ProdutoHandler(isBackendConnected);
                    
                    import('./handlers/clienteHandler.js').then(module => {
                        const ClienteHandler = module.ClienteHandler;
                        const clienteHandler = new ClienteHandler(isBackendConnected);
                        
                        import('./handlers/vendaHandler.js').then(module => {
                            const VendaHandler = module.VendaHandler;
                            const vendaHandler = new VendaHandler(isBackendConnected);
                            
                            const newHandlers = {
                                dashboard: dashboardHandler,
                                produto: produtoHandler,
                                cliente: clienteHandler,
                                venda: vendaHandler
                            };
                            setHandlers(newHandlers);

                            // Disponibilizar handlers globalmente para compatibilidade
                            window.dashboardHandler = dashboardHandler;
                            window.produtoHandler = produtoHandler;
                            window.clienteHandler = clienteHandler;
                            window.vendaHandler = vendaHandler;
                        });
                    });
                });
            });
        }
    }, [isBackendConnected]);

    useEffect(() => {
        // Carregar dados da aba ativa
        if (handlers[currentTab]) {
            loadTabData(currentTab);
        }
    }, [currentTab, handlers]);

    async function initializeApp() {
        console.log('🚀 Iniciando aplicação HortiFlow...');
        
        // Verificar autenticação
        if (!isAuthenticated()) {
            console.log('❌ Usuário não autenticado, redirecionando...');
            window.location.href = '/login.html';
            return;
        }

        try {
            // Verificar conexão com API
            const connected = await checkApiConnection();
            setIsBackendConnected(connected);
            
            if (connected) {
                showToast('Conectado ao backend HortiFlow', 'success');
            } else {
                showToast('Modo demonstração ativado - Dados de exemplo', 'info');
            }
            
            console.log('✅ Aplicação iniciada com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar app:', error);
            setIsBackendConnected(false);
            showToast('Modo demonstração ativado - Dados de exemplo', 'info');
        }
    }

    async function loadTabData(tab) {
        if (!handlers[tab]) return;

        try {
            switch (tab) {
                case 'dashboard':
                    await handlers.dashboard.loadDashboardData();
                    break;
                case 'produtos':
                    await handlers.produto.loadProdutos();
                    break;
                case 'clientes':
                    await handlers.cliente.loadClientes();
                    break;
                case 'vendas':
                    await handlers.venda.loadVendas();
                    break;
            }
        } catch (error) {
            console.error(`Erro ao carregar dados da aba ${tab}:`, error);
        }
    }

    function switchTab(tab) {
        setCurrentTab(tab);
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { id: 'produtos', label: 'Produtos', icon: 'fas fa-box' },
        { id: 'clientes', label: 'Clientes', icon: 'fas fa-users' },
        { id: 'vendas', label: 'Vendas', icon: 'fas fa-shopping-cart' }
    ];

    const titles = {
        dashboard: 'Dashboard',
        produtos: 'Gerenciar Produtos',
        clientes: 'Gerenciar Clientes',
        vendas: 'Gerenciar Vendas'
    };

    return (
        <div className="container">
            {/* Sidebar */}
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h2><i className="fas fa-leaf"></i> HortiFlow</h2>
                    <p>Sistema de Gestão</p>
                </div>
                <ul className="nav-menu">
                    {tabs.map(tab => (
                        <li 
                            key={tab.id}
                            className={`nav-item ${currentTab === tab.id ? 'active' : ''}`}
                            onClick={() => switchTab(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            <span>{tab.label}</span>
                        </li>
                    ))}
                </ul>
                <div className="sidebar-footer">
                    <div className="api-status" id="api-status">
                        <i className="fas fa-circle"></i>
                        <span>Conectando...</span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <h1>{titles[currentTab]}</h1>
                    <div className="header-actions">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => loadTabData(currentTab)}
                        >
                            <i className="fas fa-sync-alt"></i> Atualizar
                        </button>
                    </div>
                </header>

                {/* Tab Content */}
                <div className="tab-content active">
                    {currentTab === 'dashboard' && <DashboardContent />}
                    {currentTab === 'produtos' && <ProdutosContent />}
                    {currentTab === 'clientes' && <ClientesContent />}
                    {currentTab === 'vendas' && <VendasContent />}
                </div>
            </main>
        </div>
    );
}

// Componentes de conteúdo das abas
function DashboardContent() {
    return (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="stat-info">
                        <h3 id="total-produtos">-</h3>
                        <p>Total de Produtos</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-warehouse"></i>
                    </div>
                    <div className="stat-info">
                        <h3 id="estoque-atual">-</h3>
                        <p>Estoque Atual</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="stat-info">
                        <h3 id="valor-estoque">R$ 0,00</h3>
                        <p>Valor em Estoque</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <div className="stat-info">
                        <h3 id="produtos-baixo-estoque">-</h3>
                        <p>Baixo Estoque</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <h3>Produtos com Baixo Estoque</h3>
                    <div id="baixo-estoque-list" className="list-container">
                        <p className="empty-state">Carregando...</p>
                    </div>
                </div>
                <div className="card">
                    <h3>Últimos Produtos</h3>
                    <div id="ultimos-produtos" className="list-container">
                        <p className="empty-state">Carregando...</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function ProdutosContent() {
    return (
        <>
            <div className="tab-header">
                <h2>Gerenciar Produtos</h2>
                <button className="btn btn-primary" id="add-produto-btn">
                    <i className="fas fa-plus"></i> Novo Produto
                </button>
            </div>

            <div className="search-bar">
                <input type="text" id="produto-search" placeholder="Buscar produtos..." />
                <i className="fas fa-search"></i>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Embalagem</th>
                            <th>Estoque Atual</th>
                            <th>Valor Estoque</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="produtos-table-body">
                        <tr>
                            <td colspan="6" className="loading">Carregando produtos...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function ClientesContent() {
    return (
        <>
            <div className="tab-header">
                <h2>Gerenciar Clientes</h2>
                <button className="btn btn-primary" id="add-cliente-btn">
                    <i className="fas fa-plus"></i> Novo Cliente
                </button>
            </div>

            <div className="search-bar">
                <input type="text" id="cliente-search" placeholder="Buscar clientes..." />
                <i className="fas fa-search"></i>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Estado</th>
                            <th>Telefone</th>
                            <th>CNPJ</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="clientes-table-body">
                        <tr>
                            <td colspan="5" className="loading">Carregando clientes...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

function VendasContent() {
    return (
        <>
            <div className="tab-header">
                <h2>Gerenciar Vendas</h2>
                <button className="btn btn-primary" id="add-venda-btn">
                    <i className="fas fa-plus"></i> Nova Venda
                </button>
            </div>

            <div className="search-bar">
                <input type="text" id="venda-search" placeholder="Buscar vendas..." />
                <i className="fas fa-search"></i>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Produtos</th>
                            <th>Total</th>
                            <th>Data</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="vendas-table-body">
                        <tr>
                            <td colspan="7" className="loading">Carregando vendas...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default App;
