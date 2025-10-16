// Handler para Clientes
import { getClientes, createCliente, updateCliente, deleteCliente, mockData } from '../api.js';
import { showToast, showError, showSuccess, showConfirm, showModal, closeAllModals, renderTable, showLoading } from '../ui.js';
import { validarCPF } from '../utils.js';

export class ClienteHandler {
    constructor(isBackendConnected) {
        this.isBackendConnected = isBackendConnected;
        this.clientes = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Busca de clientes
        const searchInput = document.getElementById('cliente-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterClientes(e.target.value);
            });
        }

        // Botão adicionar cliente
        const addBtn = document.getElementById('add-cliente-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showClienteModal());
        }

        // Formulário de cliente
        const form = document.getElementById('cliente-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleClienteSubmit(e));
        }
    }

    async loadClientes() {
        try {
            showLoading(true);
            let clientesData;
            
            if (this.isBackendConnected) {
                clientesData = await getClientes();
            } else {
                clientesData = mockData.clientes;
            }
            
            this.clientes = clientesData || [];
            this.renderClientesTable(this.clientes);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            showError('Erro ao carregar clientes');
            this.renderClientesTable([]);
        } finally {
            showLoading(false);
        }
    }

    renderClientesTable(clientesList) {
        const container = document.getElementById('clientes-table-body');
        if (!container) return;

        if (!clientesList || clientesList.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="loading">Nenhum cliente encontrado</td></tr>';
            return;
        }

        const rows = clientesList.map(cliente => `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.estado || '-'}</td>
                <td>${cliente.telefone || '-'}</td>
                <td>${cliente.cnpj || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="window.clienteHandler.editCliente(${cliente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="window.clienteHandler.deleteCliente(${cliente.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        container.innerHTML = rows;
    }

    filterClientes(searchTerm) {
        const filtered = this.clientes.filter(cliente => 
            cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderClientesTable(filtered);
    }

    showClienteModal(cliente = null) {
        const modal = document.getElementById('cliente-modal');
        const title = modal.querySelector('#cliente-modal-title');
        const form = modal.querySelector('#cliente-form');
        
        title.textContent = cliente ? 'Editar Cliente' : 'Novo Cliente';
        
        if (cliente) {
            // Preencher formulário
            form.querySelector('#cliente-id').value = cliente.id;
            form.querySelector('#cliente-nome').value = cliente.nome;
            form.querySelector('#cliente-estado').value = cliente.estado || '';
            form.querySelector('#cliente-telefone').value = cliente.telefone || '';
            form.querySelector('#cliente-cnpj').value = cliente.cnpj || '';
            form.querySelector('#cliente-cpf').value = cliente.cpf || '';
            form.querySelector('#cliente-ie').value = cliente.ie || '';
            form.querySelector('#cliente-cond-pgto').value = cliente.condPgto || '';
            form.querySelector('#cliente-banco').value = cliente.banco || '';
        } else {
            form.reset();
            form.querySelector('#cliente-id').value = '';
        }
        
        showModal('cliente-modal');
    }

    async handleClienteSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const id = formData.get('cliente-id');
        const nome = (formData.get('cliente-nome') || '').trim();
        
        if (!nome) {
            showError('Informe o nome do cliente.');
            return;
        }

        const cpf = (formData.get('cliente-cpf') || '').trim();
        if (cpf && !validarCPF(cpf)) {
            showError('CPF inválido.');
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
                await updateCliente(id, cliente);
                showSuccess('Cliente atualizado com sucesso!');
            } else {
                await createCliente(cliente);
                showSuccess('Cliente criado com sucesso!');
            }
            
            closeAllModals();
            await this.loadClientes();
            
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            showError('Erro ao salvar cliente');
        } finally {
            showLoading(false);
        }
    }

    editCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            this.showClienteModal(cliente);
        }
    }

    async deleteCliente(id) {
        const confirmed = await showConfirm('Tem certeza que deseja excluir este cliente?');
        if (!confirmed) return;

        try {
            showLoading(true);
            await deleteCliente(id);
            showSuccess('Cliente excluído com sucesso!');
            await this.loadClientes();
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            showError('Erro ao excluir cliente');
        } finally {
            showLoading(false);
        }
    }
}

export { ClienteHandler };
