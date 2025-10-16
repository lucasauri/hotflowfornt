// Gerenciamento de autenticação
const TOKEN_KEY = 'hortiflow_token';
const USER_KEY = 'hortiflow_user';

// Verificar se usuário está autenticado
export function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
}

// Obter token do localStorage
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Obter dados do usuário
export function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Salvar dados de autenticação
export function setAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Limpar dados de autenticação
export function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// Fazer logout
export function logout() {
    clearAuthData();
    // Redirecionar para login
    window.location.href = '/login.html';
}

// Verificar se token é válido
export async function verifyToken() {
    const token = getToken();
    if (!token) return false;

    try {
        // Aqui você pode fazer uma requisição para verificar o token
        // Por enquanto, vamos apenas verificar se existe
        return true;
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        clearAuthData();
        return false;
    }
}

// Interceptar requisições para adicionar token
export function getAuthHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Middleware para proteger rotas
export function requireAuth() {
    return isAuthenticated();
}
