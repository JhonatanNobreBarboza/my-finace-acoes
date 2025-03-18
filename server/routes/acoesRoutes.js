const express = require("express");
const router = express.Router();
const acoesController = require("../controllers/acoesController");

router.post("/login", acoesController.login);
router.get("/", acoesController.verificarToken, acoesController.getAcoes);
router.post("/adicionar", acoesController.verificarToken, acoesController.adicionarAcao);
router.post("/atualizar", acoesController.verificarToken, acoesController.atualizarPrecos);
router.delete("/remover/:id", acoesController.verificarToken, acoesController.removerAcao);

module.exports = router;