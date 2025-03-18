const express = require("express");
const acoesRoutes = require("./routes/acoesRoutes");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/acoes", acoesRoutes);
app.use("/login", acoesRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});