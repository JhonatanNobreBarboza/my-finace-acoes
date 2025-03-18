CREATE DATABASE gerenciador_acoes;
USE gerenciador_acoes;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE acoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    quantidade INT NOT NULL,
    preco_atual DECIMAL(10,2) NOT NULL,
    dy DECIMAL(5,4) NOT NULL,
    preco_justo DECIMAL(10,2) NOT NULL,
    caro_barato VARCHAR(10) NOT NULL,
    proventos DECIMAL(10,2) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (username, password) VALUES ('admin', '123456');