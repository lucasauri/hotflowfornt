// Utilitários de UI

// Gerenciamento de Loading
export function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

// Gerenciamento de Modais
export function showModal(modalId, data = null) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        
        // Se houver dados, preencher formulário
        if (data && modal.querySelector('form')) {
            fillForm(modal.querySelector('form'), data);
        }
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

export function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Preencher formulário com dados
function fillForm(form, data) {
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key] || '';
        }
    });
}

// Sistema de Toast
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

export function showError(message) {
    showToast(message, 'error');
}

export function showSuccess(message) {
    showToast(message, 'success');
}

// Confirmação
export function showConfirm(message) {
    return new Promise((resolve) => {
        const result = confirm(message);
        resolve(result);
    });
}

// Renderização de Tabelas
export function renderTable(containerId, data, columns, actions = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<tr><td colspan="100%" class="loading">Nenhum item encontrado</td></tr>';
        return;
    }

    const rows = data.map(item => {
        const cells = columns.map(col => {
            let value = item[col.key];
            
            // Formatação especial
            if (col.format === 'currency') {
                value = formatCurrency(value);
            } else if (col.format === 'date') {
                value = new Date(value).toLocaleDateString('pt-BR');
            }
            
            return `<td>${value || '-'}</td>`;
        }).join('');

        // Adicionar coluna de ações se especificada
        let actionsCell = '';
        if (actions) {
            actionsCell = `<td>${actions(item)}</td>`;
        }

        return `<tr>${cells}${actionsCell}</tr>`;
    }).join('');

    container.innerHTML = rows;
}

// Renderização de Lista
export function renderList(containerId, data, itemRenderer) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum item encontrado</p>';
        return;
    }

    const items = data.map(item => itemRenderer(item)).join('');
    container.innerHTML = items;
}

// Atualizar Status da API
export function updateApiStatus(connected) {
    const statusElement = document.getElementById('api-status');
    if (!statusElement) return;

    if (connected) {
        statusElement.className = 'api-status connected';
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Conectado</span>';
    } else {
        statusElement.className = 'api-status disconnected';
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Modo Demonstração</span>';
    }
}

// Validação de formulários
export function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Limpar erros de validação
export function clearValidationErrors(form) {
    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });
}

// Utilitários de formatação
export function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

export function formatDateTime(date) {
    return new Date(date).toLocaleString('pt-BR');
}
