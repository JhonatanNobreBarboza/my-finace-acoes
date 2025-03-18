const jwt = require("jsonwebtoken");
const acoesModel = require("../models/acoesModel");

const SECRET = "sua_chave_secreta"; // Substitua por uma chave segura

class AcoesController {
    static async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await acoesModel.login(username, password);
            if (!user) return res.status(401).send("Credenciais inválidas");
            const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
            res.json({ token });
        } catch (error) {
            res.status(500).send("Erro no login");
        }
    }

    static verificarToken(req, res, next) {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).send("Token não fornecido");

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) return res.status(403).send("Token inválido");
            req.userId = decoded.id;
            next();
        });
    }

    static async getAcoes(req, res) {
        try {
            const acoes = await acoesModel.getAcoes(req.userId);
            res.json(acoes);
        } catch (error) {
            res.status(500).send("Erro ao listar ações");
        }
    }

    static async adicionarAcao(req, res) {
        const { ticker, quantidade, proventos } = req.body;
        try {
            await acoesModel.adicionarAcao(ticker, quantidade, proventos, req.userId);
            res.status(200).send();
        } catch (error) {
            res.status(500).send("Erro ao adicionar ação");
        }
    }

    static async atualizarPrecos(req, res) {
        try {
            await acoesModel.atualizarPrecos(req.userId);
            res.status(200).send();
        } catch (error) {
            res.status(500).send("Erro ao atualizar preços");
        }
    }

    static async removerAcao(req, res) {
        try {
            await acoesModel.removerAcao(req.params.id, req.userId);
            res.status(200).send();
        } catch (error) {
            res.status(500).send("Erro ao remover ação");
        }
    }
}

module.exports = AcoesController;