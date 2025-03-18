# my-finace-acoes
# Gerenciador de Ações B3

Este é um aplicativo web para gerenciamento de ações da B3 (Bolsa de Valores do Brasil). Ele permite adicionar ações, atualizar preços dinamicamente via API Alpha Vantage, calcular preços justos pelo método Barsi, visualizar gráficos e gerenciar proventos, tudo protegido por autenticação com JWT (JSON Web Tokens). O projeto segue o padrão **MVC (Model-View-Controller)** para organização do código.

## Funcionalidades
- **Login Seguro**: Autenticação com usuário e senha, gerando um token JWT.
- **Gerenciamento de Ações**: Adicionar, atualizar preços e remover ações.
- **Cálculo Barsi**: Determina o preço justo com base no Dividend Yield (DY) e indica se a ação está "Cara" ou "Barata".
- **Gráficos**: Visualização de valor total e proventos por ação usando Chart.js.
- **Banco de Dados**: Dados persistidos em MySQL, associados ao usuário logado.

## Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Backend**: Node.js, Express, MySQL, JWT
- **API Externa**: Alpha Vantage para preços de ações
- **Padrão de Projeto**: MVC

## Estrutura do Projeto