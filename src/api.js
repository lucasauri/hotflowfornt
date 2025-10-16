// Configuração da API
const API_BASE_URL = 'http://localhost:8080/api';

// Dados mockados para demonstração
export const mockData = {
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

// Função principal de requisição
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

// Verificar conexão com API
export async function checkApiConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/produtos/health`, {
            method: 'GET',
            timeout: 3000
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao conectar com API:', error);
        return false;
    }
}

// API de Produtos
export async function getProdutos() {
    return await apiRequest('/produtos');
}

export async function createProduto(produto) {
    return await apiRequest('/produtos', {
        method: 'POST',
        body: JSON.stringify(produto)
    });
}

export async function updateProduto(id, produto) {
    return await apiRequest(`/produtos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(produto)
    });
}

export async function deleteProduto(id) {
    return await apiRequest(`/produtos/${id}`, {
        method: 'DELETE'
    });
}

export async function getProdutoEstatisticas() {
    return await apiRequest('/api/produtos/estatisticas');
}

export async function getProdutosBaixoEstoque() {
    return await apiRequest('/api/produtos/baixo-estoque');
}

// API de Clientes
export async function getClientes() {
    return await apiRequest('/clientes');
}

export async function createCliente(cliente) {
    return await apiRequest('/clientes', {
        method: 'POST',
        body: JSON.stringify(cliente)
    });
}

export async function updateCliente(id, cliente) {
    return await apiRequest(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cliente)
    });
}

export async function deleteCliente(id) {
    return await apiRequest(`/clientes/${id}`, {
        method: 'DELETE'
    });
}

// API de Movimentações
export async function getMovimentacoes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/movimentacoes?${queryString}` : '/movimentacoes';
    return await apiRequest(endpoint);
}

export async function createMovimentacao(produtoId, movimentacao) {
    return await apiRequest(`/api/produtos/${produtoId}/movimentacao`, {
        method: 'POST',
        body: JSON.stringify(movimentacao)
    });
}

// API de Autenticação
export async function login(credentials) {
    return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

export async function logout() {
    return await apiRequest('/auth/logout', {
        method: 'POST'
    });
}

export async function verifyToken() {
    return await apiRequest('/auth/verify');
}
