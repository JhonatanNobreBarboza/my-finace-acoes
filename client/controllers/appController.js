class AppController {
    constructor() {
        this.tabelaCorpo = document.getElementById("corpoTabela");
        this.acoes = [];
        this.grafico = null;
        this.token = localStorage.getItem("token");

        if (this.token) {
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("mainContainer").style.display = "block";
            this.carregarAcoes();
        }

        document.getElementById("loginBtn").addEventListener("click", () => this.login());
        document.getElementById("addBtn").addEventListener("click", () => this.adicionarAcao());
        document.getElementById("updateBtn").addEventListener("click", () => this.atualizarPrecos());
        document.getElementById("logoutBtn").addEventListener("click", () => this.logout());
    }

    async login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        try {
            const data = await ApiModel.login(username, password);
            this.token = data.token;
            localStorage.setItem("token", this.token);
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("mainContainer").style.display = "block";
            this.carregarAcoes();
        } catch (error) {
            alert("Usuário ou senha inválidos!");
        }
    }

    logout() {
        localStorage.removeItem("token");
        this.token = null;
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("mainContainer").style.display = "none";
    }

    async carregarAcoes() {
        try {
            this.acoes = await ApiModel.getAcoes(this.token);
            this.atualizarTabela();
            this.atualizarGrafico();
        } catch (error) {
            this.logout();
        }
    }

    async adicionarAcao() {
        const ticker = document.getElementById("tickerInput").value.toUpperCase();
        const quantidade = parseInt(document.getElementById("quantidadeInput").value) || 0;
        const proventos = parseFloat(document.getElementById("proventosInput").value) || 0;

        if (!ticker) return alert("Digite um ticker válido!");

        try {
            await ApiModel.adicionarAcao(ticker, quantidade, proventos, this.token);
            this.carregarAcoes();
            document.getElementById("tickerInput").value = "";
            document.getElementById("quantidadeInput").value = "";
            document.getElementById("proventosInput").value = "";
        } catch (error) {
            alert("Erro ao adicionar ação!");
        }
    }

    async atualizarPrecos() {
        try {
            await ApiModel.atualizarPrecos(this.token);
            this.carregarAcoes();
        } catch (error) {
            alert("Erro ao atualizar preços!");
        }
    }

    async removerAcao(id) {
        try {
            await ApiModel.removerAcao(id, this.token);
            this.carregarAcoes();
        } catch (error) {
            alert("Erro ao remover ação!");
        }
    }

    atualizarTabela() {
        this.tabelaCorpo.innerHTML = "";
        this.acoes.forEach(acao => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${acao.ticker}</td>
                <td>${acao.quantidade}</td>
                <td>${acao.preco_atual.toFixed(2)}</td>
                <td>${(acao.dy * 100).toFixed(2)}</td>
                <td>${acao.preco_justo.toFixed(2)}</td>
                <td class="${acao.caro_barato.toLowerCase()}">${acao.caro_barato}</td>
                <td>${acao.proventos.toFixed(2)}</td>
                <td><button class="delete-btn" onclick="appController.removerAcao(${acao.id})">Remover</button></td>
            `;
            this.tabelaCorpo.appendChild(linha);
        });
    }

    atualizarGrafico() {
        const ctx = document.createElement("canvas");
        document.getElementById("chart").innerHTML = "";
        document.getElementById("chart").appendChild(ctx);

        const labels = this.acoes.map(a => a.ticker);
        const valores = this.acoes.map(a => a.preco_atual * a.quantidade);
        const proventos = this.acoes.map(a => a.proventos);

        if (this.grafico) this.grafico.destroy();
        this.grafico = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    { label: "Valor Total (R$)", data: valores, backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)", borderWidth: 1 },
                    { label: "Proventos (R$)", data: proventos, backgroundColor: "rgba(255, 159, 64, 0.2)", borderColor: "rgba(255, 159, 64, 1)", borderWidth: 1 }
                ]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }
}

const appController = new AppController();