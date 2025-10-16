// Handler para Produtos
import { getProdutos, createProduto, updateProduto, deleteProduto, mockData } from '../api.js';
import { showToast, showError, showSuccess, showConfirm, showModal, closeAllModals, renderTable, showLoading } from '../ui.js';
import { formatCurrency } from '../utils.js';

export class ProdutoHandler {
    constructor(isBackendConnected) {
        this.isBackendConnected = isBackendConnected;
        this.produtos = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Busca de produtos
        const searchInput = document.getElementById('produto-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProdutos(e.target.value);
            });
        }

        // Botão adicionar produto
        const addBtn = document.getElementById('add-produto-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showProdutoModal());
        }

        // Formulário de produto
        const form = document.getElementById('produto-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleProdutoSubmit(e));
        }
    }

    async loadProdutos() {
        try {
            showLoading(true);
            let produtosData;
            
            if (this.isBackendConnected) {
                produtosData = await getProdutos();
            } else {
                produtosData = mockData.produtos;
            }
            
            this.produtos = produtosData || [];
            this.renderProdutosTable(this.produtos);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            showError('Erro ao carregar produtos');
            this.renderProdutosTable([]);
        } finally {
            showLoading(false);
        }
    }

    renderProdutosTable(produtosList) {
        const columns = [
            { key: 'nome', label: 'Nome' },
            { key: 'preco', label: 'Preço', format: 'currency' },
            { key: 'embalagem', label: 'Embalagem' },
            { key: 'estoqueAtual', label: 'Estoque Atual' },
            { 
                key: 'valorEstoque', 
                label: 'Valor Estoque',
                format: 'currency',
                getValue: (produto) => (produto.estoqueAtual || 0) * produto.preco
            }
        ];

        const actions = (produto) => `
            <button class="btn btn-sm btn-primary" onclick="window.produtoHandler.editProduto(${produto.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="window.produtoHandler.deleteProduto(${produto.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;

        const container = document.getElementById('produtos-table-body');
        if (!container) return;

        if (!produtosList || produtosList.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="loading">Nenhum produto encontrado</td></tr>';
            return;
        }

        const rows = produtosList.map(produto => {
            const valorEstoque = (produto.estoqueAtual || 0) * produto.preco;
            return `
                <tr>
                    <td>${produto.nome}</td>
                    <td>${formatCurrency(produto.preco)}</td>
                    <td>${produto.embalagem}</td>
                    <td>${produto.estoqueAtual || 0}</td>
                    <td>${formatCurrency(valorEstoque)}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="window.produtoHandler.editProduto(${produto.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.produtoHandler.deleteProduto(${produto.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        container.innerHTML = rows;
    }

    filterProdutos(searchTerm) {
        const filtered = this.produtos.filter(produto => 
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderProdutosTable(filtered);
    }

    showProdutoModal(produto = null) {
        const modal = document.getElementById('produto-modal');
        const title = modal.querySelector('#produto-modal-title');
        const form = modal.querySelector('#produto-form');
        
        title.textContent = produto ? 'Editar Produto' : 'Novo Produto';
        
        if (produto) {
            // Preencher formulário
            form.querySelector('#produto-id').value = produto.id;
            form.querySelector('#produto-nome').value = produto.nome;
            form.querySelector('#produto-preco').value = produto.preco;
            form.querySelector('#produto-embalagem').value = produto.embalagem;
            form.querySelector('#produto-estoque-inicial').value = produto.estoqueInicial || 0;
        } else {
            form.reset();
            form.querySelector('#produto-id').value = '';
        }
        
        showModal('produto-modal');
    }

    async handleProdutoSubmit(e) {
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

        // Validação
        if (!nome) {
            showError('Informe o nome do produto.');
            return;
        }
        if (isNaN(preco) || preco <= 0) {
            showError('Informe um preço válido maior que zero.');
            return;
        }
        if (isNaN(estoqueInicial) || estoqueInicial < 0) {
            showError('Informe um estoque inicial válido (zero ou maior).');
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
                await updateProduto(id, produto);
                showSuccess('Produto atualizado com sucesso!');
            } else {
                await createProduto(produto);
                showSuccess('Produto criado com sucesso!');
            }
            
            closeAllModals();
            await this.loadProdutos();
            
            // Notificar dashboard para atualizar
            if (window.dashboardHandler) {
                await window.dashboardHandler.loadDashboardData();
            }
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            showError('Erro ao salvar produto');
        } finally {
            showLoading(false);
        }
    }

    editProduto(id) {
        const produto = this.produtos.find(p => p.id === id);
        if (produto) {
            this.showProdutoModal(produto);
        }
    }

    async deleteProduto(id) {
        const confirmed = await showConfirm('Tem certeza que deseja excluir este produto?');
        if (!confirmed) return;

        try {
            showLoading(true);
            await deleteProduto(id);
            showSuccess('Produto excluído com sucesso!');
            await this.loadProdutos();
            
            // Notificar dashboard para atualizar
            if (window.dashboardHandler) {
                await window.dashboardHandler.loadDashboardData();
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            showError('Erro ao excluir produto');
        } finally {
            showLoading(false);
        }
    }
}

export { ProdutoHandler };
