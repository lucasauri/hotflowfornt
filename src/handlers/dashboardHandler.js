// Handler para Dashboard
import { getProdutoEstatisticas, getProdutosBaixoEstoque, getProdutos, mockData } from '../api.js';
import { showToast, updateApiStatus, renderList } from '../ui.js';
import { formatCurrency } from '../utils.js';

export class DashboardHandler {
    constructor(isBackendConnected) {
        this.isBackendConnected = isBackendConnected;
    }

    async loadDashboardData() {
        try {
            let stats, baixoEstoque, ultimosProdutos;
            
            if (this.isBackendConnected) {
                // Carregar dados do backend
                stats = await getProdutoEstatisticas();
                baixoEstoque = await getProdutosBaixoEstoque();
                ultimosProdutos = await getProdutos();
                ultimosProdutos = ultimosProdutos.slice(0, 5); // Limitar a 5
            } else {
                // Usar dados mockados
                console.log('📊 Carregando dados mockados...');
                stats = mockData.estatisticas;
                baixoEstoque = mockData.produtos.filter(p => p.estoqueAtual < 5);
                ultimosProdutos = mockData.produtos.slice(0, 5);
                
                // Simular delay
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            this.updateStatistics(stats);
            this.renderBaixoEstoque(baixoEstoque);
            this.renderUltimosProdutos(ultimosProdutos);

        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            showToast('Erro ao carregar dados do dashboard', 'error');
        }
    }

    updateStatistics(stats) {
        if (!stats) return;

        const elements = {
            totalProdutos: document.getElementById('total-produtos'),
            estoqueAtual: document.getElementById('estoque-atual'),
            valorEstoque: document.getElementById('valor-estoque'),
            produtosBaixoEstoque: document.getElementById('produtos-baixo-estoque')
        };

        if (elements.totalProdutos) elements.totalProdutos.textContent = stats.totalProdutos || 0;
        if (elements.estoqueAtual) elements.estoqueAtual.textContent = stats.estoqueAtual || 0;
        if (elements.valorEstoque) elements.valorEstoque.textContent = formatCurrency(stats.valorEstoque || 0);
        if (elements.produtosBaixoEstoque) elements.produtosBaixoEstoque.textContent = stats.produtosBaixoEstoque || 0;
    }

    renderBaixoEstoque(produtos) {
        const container = document.getElementById('baixo-estoque-list');
        if (!container) return;

        if (!produtos || produtos.length === 0) {
            container.innerHTML = '<p class="empty-state">Nenhum produto com baixo estoque</p>';
            return;
        }

        const items = produtos.map(produto => `
            <div class="list-item">
                <div class="item-info">
                    <h4>${produto.nome}</h4>
                    <p>Estoque: ${produto.estoqueAtual} ${produto.embalagem}</p>
                </div>
                <span class="status-badge low">Baixo</span>
            </div>
        `).join('');

        container.innerHTML = items;
    }

    renderUltimosProdutos(produtos) {
        const container = document.getElementById('ultimos-produtos');
        if (!container) return;

        if (!produtos || produtos.length === 0) {
            container.innerHTML = '<p class="empty-state">Nenhum produto cadastrado</p>';
            return;
        }

        const items = produtos.map(produto => `
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

        container.innerHTML = items;
    }

    updateApiStatus(connected) {
        updateApiStatus(connected);
        this.isBackendConnected = connected;
    }
}

export { DashboardHandler };
