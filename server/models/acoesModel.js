const mysql = require("mysql2/promise");
const fetch = require("node-fetch");

const dbConfig = {
    host: "localhost",
    user: "root", // Ajuste conforme seu usuário MySQL
    password: "123456", // Ajuste conforme sua senha MySQL
    database: "gerenciador_acoes"
};

const API_KEY = "SUA_CHAVE_AQUI"; // Substitua pela chave Alpha Vantage

class AcoesModel {
    static async getConnection() {
        return await mysql.createConnection(dbConfig);
    }

    static async login(username, password) {
        const conn = await this.getConnection();
        const [rows] = await conn.execute("SELECT * FROM usuarios WHERE username = ? AND password = ?", [username, password]);
        await conn.end();
        return rows[0];
    }

    static async getAcoes(userId) {
        const conn = await this.getConnection();
        const [rows] = await conn.execute("SELECT * FROM acoes WHERE user_id = ?", [userId]);
        await conn.end();
        return rows;
    }

    static async adicionarAcao(ticker, quantidade, proventos, userId) {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const precoAtual = parseFloat(data["Global Quote"]["05. price"]);
        const dy = 0.05; // Placeholder
        const precoJusto = (precoAtual * dy) / 0.06;
        const caroBarato = precoAtual > precoJusto ? "Caro" : "Barato";

        const conn = await this.getConnection();
        await conn.execute(
            "INSERT INTO acoes (ticker, quantidade, preco_atual, dy, preco_justo, caro_barato, proventos, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [ticker, quantidade, precoAtual, dy, precoJusto, caroBarato, proventos, userId]
        );
        await conn.end();
    }

    static async atualizarPrecos(userId) {
        const conn = await this.getConnection();
        const [rows] = await conn.execute("SELECT id, ticker FROM acoes WHERE user_id = ?", [userId]);

        for (const row of rows) {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${row.ticker}&apikey=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            const precoAtual = parseFloat(data["Global Quote"]["05. price"]);
            const dy = 0.05;
            const precoJusto = (precoAtual * dy) / 0.06;
            const caroBarato = precoAtual > precoJusto ? "Caro" : "Barato";

            await conn.execute(
                "UPDATE acoes SET preco_atual = ?, preco_justo = ?, caro_barato = ? WHERE id = ?",
                [precoAtual, precoJusto, caroBarato, row.id]
            );
        }
        await conn.end();
    }

    static async removerAcao(id, userId) {
        const conn = await this.getConnection();
        await conn.execute("DELETE FROM acoes WHERE id = ? AND user_id = ?", [id, userId]);
        await conn.end();
    }
}

module.exports = AcoesModel;