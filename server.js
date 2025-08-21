const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Para funcionar o stylesheet.css
app.use(express.static(path.join(__dirname, "public")));

/*
1) Crie uma função com uma closure para fazer com que o endereço /random
devolva numeros aleatorios na seguinte lógica:
- Você deve gerar números aleatórios inteiros entre 0 e 10
- Guarde o último número aleatório gerado em um estado dentro da closure
- A função interna, quando invocada, deve retornar um objeto no seguinte formato:
{ ultimoNumero: N_AQUI: numeroAtual }
Acesse a página /random e atualize-a para testar sua lógica
*/
function geraNumeroAleatorio() {
  let ultimo = null;

  return function () {
    const numeroAtual = Math.floor(Math.random() * 11);
    const resultado = { ultimoNumero: ultimo, numeroAtual };
    ultimo = numeroAtual;
    return resultado;
  };
}
const getRandom = geraNumeroAleatorio();

app.get("/random", (req, res) => {
  const numeros = getRandom();
  res.render("random", {
    /* --> */ ultimoNumero: numeros.ultimoNumero,
    numeroAtual: numeros.numeroAtual /* <-- Valores aqui */,
  });
});

app.get("/inverter", (req, res) => {
  res.render("inverter");
});

/*
2) Crie uma função recursiva para inverter uma palavra
- A palavra que deve ser invertida chegará na variável "palavraParaInverter"
- A palavra que você inverteu deve ser passada para a variável "invertida"
Seu programa deve funcionar de modo que, ao acessar o endereço /random,
você deve ser capaz de digitar uma palavra, apertar o botão de enviar e
receber a palavra invertida no alert.
*/
function inverterPalavra(palavra) {
  if (palavra.length <= 1) return palavra;
  return inverterPalavra(palavra.slice(1)) + palavra[0];
}

app.get("/api/inverter/:palavraParaInverter", (req, res) => {
  const palavraParaInverter = req.params.palavraParaInverter;
  const invertida = inverterPalavra(palavraParaInverter);
  res.json(invertida);
});

/*
3) A função pegaCorDeFundo é uma função de alta ordem que recebe três funções como parâmetro:
- pegaVermelho: retorna a faixa de vermelho da cor aleatória, deve retornar um inteiro entre 0 e 255
- pegaVerde: pegaVerde: retorna a faixa de verde da cor aleatória, deve retornar um inteiro entre 0 e 255
- pegaAzul: retorna a faixa de azul da cor aleatória, deve retornar um inteiro entre 0 e 255
Utilizando essas funções, pegaCorDeFundo retorna uma string no formato: rgb(n, n, n), que
é então passada para o endereço /cores como cor de fundo.
No entanto, esse código está com erro, pois as funções anteriores não foram implementadas.
Você deve então implementá-las para corrigir o programa, de modo /cores deve mostrar uma cor aleatória a cada acesso.
*/
function pegaCorDeFundo(pegaVermelho, pegaVerde, pegaAzul) {
  const r = pegaVermelho();
  const g = pegaVerde();
  const b = pegaAzul();
  return `rgb(${r}, ${g}, ${b})`;
}

// Crie as funções abaixo
function pegaVermelho() {
  return Math.floor(Math.random() * 256);
}
function pegaVerde() {
  return Math.floor(Math.random() * 256);
}
function pegaAzul() {
  return Math.floor(Math.random() * 256);
}
// Crie as funções acima

app.get("/cores", (req, res) => {
  // Descomentar e corrigir aqui!
  const corDeFundo = pegaCorDeFundo(pegaVermelho, pegaVerde, pegaAzul);
  res.render("cores", { corDeFundo });
});

/*
4) Utilize a função map (obrigatório) e o que mais for necessário
para implementar o seguinte comportamento:
- Ao acessar /dobrar, você também deve passar dois números: início e fim,
da seguinte forma: /dobrar/5/10, por exemplo
- Esses valores chegam nas variáveis "inicio" e "fim"
- Deste modo, você deve fazer com que ao acessar a página,
mostre na tela os dobros dos números entre o início e o fim
- Partindo do exemplo anterior, você deve retornar [10, 12, 14, 16, 18, 20],
que são os dobros de [5, 6, 7, 8, 9, 10]
É OBRIGATÓRIO UTILIZAR A FUNÇÃO MAP
*/
app.get("/dobros/:inicio/:fim", (req, res) => {
  const inicio = parseInt(req.params.inicio, 10);
  const fim = parseInt(req.params.fim, 10);

  if (isNaN(inicio) || isNaN(fim)) {
    return res.status(400).send("Os valores de início e fim devem ser números.");
  }

  const numeros = [];
  for (let i = inicio; i <= fim; i++) {
    numeros.push(i);
  }

  const dobros = numeros.map(numero => numero * 2); // Dobros aqui;

  res.render("dobros", { dobros: dobros.join(", ") });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
