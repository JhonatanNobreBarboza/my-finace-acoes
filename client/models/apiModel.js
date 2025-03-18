class ApiModel {
    static async fetchData(url, method = "GET", body = null, token = null) {
        const headers = {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
        const response = await fetch(url, {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) })
        });
        if (!response.ok) throw new Error("Erro na requisição");
        return await response.json();
    }

    static async login(username, password) {
        return this.fetchData("http://localhost:3000/login", "POST", { username, password });
    }

    static async getAcoes(token) {
        return this.fetchData("http://localhost:3000/acoes", "GET", null, token);
    }

    static async adicionarAcao(ticker, quantidade, proventos, token) {
        return this.fetchData("http://localhost:3000/adicionar", "POST", { ticker, quantidade, proventos }, token);
    }

    static async atualizarPrecos(token) {
        return this.fetchData("http://localhost:3000/atualizar", "POST", null, token);
    }

    static async removerAcao(id, token) {
        return this.fetchData(`http://localhost:3000/remover/${id}`, "DELETE", null, token);
    }
}