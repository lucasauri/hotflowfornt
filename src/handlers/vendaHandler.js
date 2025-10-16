// Handler para Vendas (Nova funcionalidade)
import { getClientes, getProdutos, mockData } from '../api.js';
import { showToast, showError, showSuccess, showModal, closeAllModals, renderTable, showLoading } from '../ui.js';
import { formatCurrency, formatDate } from '../utils.js';

export class VendaHandler {
    constructor(isBackendConnected) {
        this.isBackendConnected = isBackendConnected;
        this.vendas = [];
        this.clientes = [];
        this.produtos = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botão adicionar venda
        const addBtn = document.getElementById('add-venda-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showVendaModal());
        }

        // Formulário de venda
        const form = document.getElementById('venda-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleVendaSubmit(e));
        }

        // Busca de vendas
        const searchInput = document.getElementById('venda-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterVendas(e.target.value);
            });
        }
    }

    async loadVendas() {
        try {
            showLoading(true);
            
            // Por enquanto, usar dados mockados para vendas
            // Em uma implementação real, você teria uma API de vendas
            this.vendas = this.getMockVendas();
            this.renderVendasTable(this.vendas);
        } catch (error) {
            console.error('Erro ao carregar vendas:', error);
            showError('Erro ao carregar vendas');
            this.renderVendasTable([]);
        } finally {
            showLoading(false);
        }
    }

    async loadClientes() {
        try {
            if (this.isBackendConnected) {
                this.clientes = await getClientes();
            } else {
                this.clientes = mockData.clientes;
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            this.clientes = mockData.clientes;
        }
    }

    async loadProdutos() {
        try {
            if (this.isBackendConnected) {
                this.produtos = await getProdutos();
            } else {
                this.produtos = mockData.produtos;
            }
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.produtos = mockData.produtos;
        }
    }

    getMockVendas() {
        return [
            {
                id: 1,
                cliente: { nome: 'Mercado Central' },
                produtos: [
                    { produto: { nome: 'Tomate Cereja' }, quantidade: 10, preco: 8.50 },
                    { produto: { nome: 'Alface Crespa' }, quantidade: 5, preco: 3.20 }
                ],
                total: 99.50,
                data: '2024-01-15',
                status: 'CONCLUIDA'
            },
            {
                id: 2,
                cliente: { nome: 'Supermercado Verde' },
                produtos: [
                    { produto: { nome: 'Cenoura' }, quantidade: 8, preco: 4.80 }
                ],
                total: 38.40,
                data: '2024-01-14',
                status: 'PENDENTE'
            }
        ];
    }

    renderVendasTable(vendasList) {
        const container = document.getElementById('vendas-table-body');
        if (!container) return;

        if (!vendasList || vendasList.length === 0) {
            container.innerHTML = '<tr><td colspan="6" class="loading">Nenhuma venda encontrada</td></tr>';
            return;
        }

        const rows = vendasList.map(venda => `
            <tr>
                <td>#${venda.id}</td>
                <td>${venda.cliente.nome}</td>
                <td>${venda.produtos.length} item(s)</td>
                <td>${formatCurrency(venda.total)}</td>
                <td>${formatDate(venda.data)}</td>
                <td>
                    <span class="status-badge ${venda.status === 'CONCLUIDA' ? 'ok' : 'low'}">
                        ${venda.status === 'CONCLUIDA' ? 'Concluída' : 'Pendente'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="window.vendaHandler.viewVenda(${venda.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.vendaHandler.cancelVenda(${venda.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        container.innerHTML = rows;
    }

    filterVendas(searchTerm) {
        const filtered = this.vendas.filter(venda => 
            venda.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venda.id.toString().includes(searchTerm)
        );
        this.renderVendasTable(filtered);
    }

    async showVendaModal(venda = null) {
        await this.loadClientes();
        await this.loadProdutos();
        
        const modal = document.getElementById('venda-modal');
        const title = modal.querySelector('#venda-modal-title');
        const form = modal.querySelector('#venda-form');
        
        title.textContent = venda ? 'Editar Venda' : 'Nova Venda';
        
        // Preencher select de clientes
        const clienteSelect = form.querySelector('#venda-cliente');
        clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
            this.clientes.map(cliente => 
                `<option value="${cliente.id}">${cliente.nome}</option>`
            ).join('');
        
        // Preencher select de produtos
        const produtoSelect = form.querySelector('#venda-produto');
        produtoSelect.innerHTML = '<option value="">Selecione um produto</option>' +
            this.produtos.map(produto => 
                `<option value="${produto.id}" data-preco="${produto.preco}">${produto.nome} - ${formatCurrency(produto.preco)}</option>`
            ).join('');
        
        if (venda) {
            // Preencher formulário para edição
            form.querySelector('#venda-id').value = venda.id;
            form.querySelector('#venda-cliente').value = venda.cliente.id;
        } else {
            form.reset();
            form.querySelector('#venda-id').value = '';
        }
        
        showModal('venda-modal');
    }

    async handleVendaSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const id = formData.get('venda-id');
        const clienteId = formData.get('venda-cliente');
        const produtoId = formData.get('venda-produto');
        const quantidade = parseFloat(formData.get('venda-quantidade'));
        
        if (!clienteId) {
            showError('Selecione um cliente.');
            return;
        }
        
        if (!produtoId) {
            showError('Selecione um produto.');
            return;
        }
        
        if (!quantidade || quantidade <= 0) {
            showError('Informe uma quantidade válida.');
            return;
        }
        
        const produto = this.produtos.find(p => p.id == produtoId);
        const cliente = this.clientes.find(c => c.id == clienteId);
        
        const venda = {
            cliente: cliente,
            produtos: [{
                produto: produto,
                quantidade: quantidade,
                preco: produto.preco
            }],
            total: quantidade * produto.preco,
            data: new Date().toISOString().split('T')[0],
            status: 'PENDENTE'
        };
        
        try {
            showLoading(true);
            
            // Simular salvamento (em uma implementação real, você faria uma requisição para a API)
            if (id) {
                // Atualizar venda existente
                const index = this.vendas.findIndex(v => v.id == id);
                if (index !== -1) {
                    this.vendas[index] = { ...venda, id: parseInt(id) };
                }
                showSuccess('Venda atualizada com sucesso!');
            } else {
                // Criar nova venda
                const newId = Math.max(...this.vendas.map(v => v.id)) + 1;
                this.vendas.push({ ...venda, id: newId });
                showSuccess('Venda criada com sucesso!');
            }
            
            closeAllModals();
            this.renderVendasTable(this.vendas);
            
        } catch (error) {
            console.error('Erro ao salvar venda:', error);
            showError('Erro ao salvar venda');
        } finally {
            showLoading(false);
        }
    }

    viewVenda(id) {
        const venda = this.vendas.find(v => v.id === id);
        if (venda) {
            // Implementar visualização detalhada da venda
            showToast(`Visualizando venda #${id}`, 'info');
        }
    }

    async cancelVenda(id) {
        const confirmed = await showConfirm('Tem certeza que deseja cancelar esta venda?');
        if (!confirmed) return;

        try {
            showLoading(true);
            
            // Simular cancelamento
            const index = this.vendas.findIndex(v => v.id === id);
            if (index !== -1) {
                this.vendas.splice(index, 1);
                showSuccess('Venda cancelada com sucesso!');
                this.renderVendasTable(this.vendas);
            }
        } catch (error) {
            console.error('Erro ao cancelar venda:', error);
            showError('Erro ao cancelar venda');
        } finally {
            showLoading(false);
        }
    }
}

export { VendaHandler };
