const itensCardapio = [
    { id: 1, nome: "Café Espresso Tradicional", categoria: "espresso", preco: 9.00, tempoPreparoMinutos: 3 },
    { id: 2, nome: "Cappuccino Italiano", categoria: "cappuccino", preco: 14.50, tempoPreparoMinutos: 5 },
    { id: 3, nome: "Café Gelado Caramelo", categoria: "gelado", preco: 18.00, tempoPreparoMinutos: 4 },
    { id: 4, nome: "Chá Artesanal de Hibisco", categoria: "cha", preco: 11.00, tempoPreparoMinutos: 6 },
    { id: 5, nome: "Mocha Especial Gourmet", categoria: "especial", preco: 22.00, tempoPreparoMinutos: 7 },
    { id: 6, nome: "Espresso Duplo com Leite Vegetal", categoria: "espresso", preco: 13.50, tempoPreparoMinutos: 4 }
];

// Calcula o preco com desconto
function calcularPrecoFinal(precoBase, descontoPercentual = 0) {
    if (typeof precoBase !== "number" || precoBase < 0) {
        return 0;
    }
    const descontoValido = Math.max(0, Math.min(100, descontoPercentual));
    const valorDesconto = (precoBase * descontoValido) / 100;
    const resultado = precoBase - valorDesconto;
    return Number(resultado.toFixed(2));
}

// Classifica a faixa de preco
function classificarFaixaPreco(preco) {
    if (preco < 12.00) {
        return "Economico";
    }
    if (preco <= 17.00) {
        return "Intermediario";
    }
    return "Premium";
}

// Formata para moeda brasileira
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

// Funcao com closure para configurar o desconto
function criarCalculadoraDesconto(descontoPadrao = 0) {
    return function (precoBase, desconto = descontoPadrao) {
        return calcularPrecoFinal(precoBase, desconto);
    };
}

// Testes no console
console.group("Cafeteria Aroma — Verificação de Funções Puras");
console.log("calcularPrecoFinal(10, 0):", calcularPrecoFinal(10, 0), "(esperado: 10)");
console.log("calcularPrecoFinal(20, 10):", calcularPrecoFinal(20, 10), "(esperado: 18)");
console.log("calcularPrecoFinal(15) [valor padrão]:", calcularPrecoFinal(15), "(esperado: 15)");
console.log("classificarFaixaPreco(9.00):", classificarFaixaPreco(9.00), "(esperado: Economico)");
console.log("classificarFaixaPreco(14.50):", classificarFaixaPreco(14.50), "(esperado: Intermediario)");
console.log("classificarFaixaPreco(22.00):", classificarFaixaPreco(22.00), "(esperado: Premium)");

const calculadoraCom10PorCento = criarCalculadoraDesconto(10);
console.log("Fábrica com Closure — 10% sobre 50.00:", calculadoraCom10PorCento(50), "(esperado: 45)");
console.groupEnd();

// Processa os itens com map
const itensProcessados = itensCardapio.map((item) => {
    const precoFinal = calcularPrecoFinal(item.preco, 0);
    const faixa = classificarFaixaPreco(precoFinal);
    return {
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        tempoPreparoMinutos: item.tempoPreparoMinutos,
        precoOriginal: item.preco,
        precoFinal: precoFinal,
        faixa: faixa
    };
});

// Filtra bebidas da faixa acessivel
const itensAcessiveis = itensProcessados.filter((item) => item.faixa !== "Premium");

// Calcula a soma e a media com reduce
const totalPreco = itensProcessados.reduce((acumulador, item) => acumulador + item.precoFinal, 0);
const mediaPreco = totalPreco / itensProcessados.length;

// Ordena os precos criando uma copia antes
const itensOrdenadosPorPreco = [...itensProcessados].sort((a, b) => a.precoFinal - b.precoFinal);

// Agrupa as bebidas por categoria
const itensAgrupadosPorCategoria = itensProcessados.reduce((acumulador, item) => {
    const chave = item.categoria;
    if (!acumulador[chave]) {
        acumulador[chave] = [];
    }
    acumulador[chave].push(item);
    return acumulador;
}, {});

// Monta o card de cada item
function criarElementoCard(item) {
    const card = document.createElement("article");
    card.classList.add("card", "card-resultado");

    const classeFaixa = `faixa-${item.faixa.toLowerCase()}`;
    card.classList.add(classeFaixa);

    const cabecalho = document.createElement("div");
    cabecalho.classList.add("card-resultado-cabecalho");

    const titulo = document.createElement("h3");
    titulo.textContent = item.nome;

    const badgeFaixa = document.createElement("span");
    badgeFaixa.classList.add("tag-faixa", `tag-${item.faixa.toLowerCase()}`);
    badgeFaixa.textContent = item.faixa;

    cabecalho.append(titulo, badgeFaixa);

    const categoria = document.createElement("p");
    categoria.classList.add("card-resultado-categoria");
    const nomeCategoriaFormatado = item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1);
    categoria.textContent = `Categoria: ${nomeCategoriaFormatado}`;

    const tempo = document.createElement("p");
    tempo.classList.add("card-resultado-tempo");
    tempo.textContent = `Tempo de preparo: ${item.tempoPreparoMinutos} min`;

    const preco = document.createElement("p");
    preco.classList.add("card-resultado-preco");
    preco.textContent = `Preço: ${formatarPreco(item.precoFinal)}`;

    card.append(cabecalho, categoria, tempo, preco);
    return card;
}

// Monta o resumo de estatisticas
function criarElementoResumo(totalItens, totalValor, precoMedio, totalAcessivel) {
    const cardResumo = document.createElement("div");
    cardResumo.classList.add("resumo-resultado");

    const tituloResumo = document.createElement("h3");
    tituloResumo.textContent = "Panorama do Cardápio";

    const listaResumo = document.createElement("ul");
    listaResumo.classList.add("lista-resumo");

    const linhaTotalItens = document.createElement("li");
    linhaTotalItens.textContent = `Opções no catálogo: ${totalItens} bebidas`;

    const linhaTotalPreco = document.createElement("li");
    linhaTotalPreco.textContent = `Soma dos preços: ${formatarPreco(totalValor)}`;

    const linhaMediaPreco = document.createElement("li");
    linhaMediaPreco.textContent = `Preço médio: ${formatarPreco(precoMedio)}`;

    const linhaAcessiveis = document.createElement("li");
    linhaAcessiveis.textContent = `Bebidas em faixa acessível: ${totalAcessivel} opções`;

    listaResumo.append(linhaTotalItens, linhaTotalPreco, linhaMediaPreco, linhaAcessiveis);
    cardResumo.append(tituloResumo, listaResumo);

    return cardResumo;
}

// Monta o bloco com as bebidas por categoria
function criarBlocoCategorias(categorias) {
    const container = document.createElement("div");
    container.classList.add("bloco-categorias-extra");

    const titulo = document.createElement("h3");
    titulo.textContent = "Bebidas por Categoria";

    const gridCategorias = document.createElement("div");
    gridCategorias.classList.add("grid-categorias");

    for (const [categoria, lista] of Object.entries(categorias)) {
        const itemCat = document.createElement("div");
        itemCat.classList.add("card-categoria-item");

        const tituloCat = document.createElement("h4");
        tituloCat.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);

        const contagem = document.createElement("p");
        contagem.textContent = `${lista.length} produto(s): ${lista.map((b) => b.nome).join(", ")}`;

        itemCat.append(tituloCat, contagem);
        gridCategorias.append(itemCat);
    }

    container.append(titulo, gridCategorias);
    return container;
}

// Insere os elementos na pagina
function inicializarSecaoResultado() {
    const containerResultado = document.querySelector("#resultado");
    if (!containerResultado) {
        return;
    }

    const tituloPrincipal = document.createElement("h2");
    tituloPrincipal.id = "titulo-resultado";
    tituloPrincipal.textContent = "Cardápio Dinâmico e Recomendações";

    const subtitulo = document.createElement("p");
    subtitulo.classList.add("resultado-subtitulo");
    subtitulo.textContent =
        "Seleção artesanal com tempos médios de preparo, preços calculados e classificação por faixas de degustação.";

    const elementoResumo = criarElementoResumo(
        itensProcessados.length,
        totalPreco,
        mediaPreco,
        itensAcessiveis.length
    );

    const gridCards = document.createElement("div");
    gridCards.classList.add("grid-resultado");

    for (const item of itensOrdenadosPorPreco) {
        const elementoCard = criarElementoCard(item);
        gridCards.append(elementoCard);
    }

    const elementoCategorias = criarBlocoCategorias(itensAgrupadosPorCategoria);

    containerResultado.append(
        tituloPrincipal,
        subtitulo,
        elementoResumo,
        gridCards,
        elementoCategorias
    );
}

inicializarSecaoResultado();
