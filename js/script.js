/**
 * Desenvolvimento Front-end para Web - Aula 11
 * Manipulação do DOM, funções puras, métodos de array e classificação de dados.
 * Cafeteria Aroma
 */

// =============================================================================
// 1. DADOS (Array de pelo menos 5 objetos com 3 ou mais propriedades)
// =============================================================================

const itensCardapio = [
    { id: 1, nome: "Café Espresso Tradicional", categoria: "espresso", preco: 9.00, tempoPreparoMinutos: 3 },
    { id: 2, nome: "Cappuccino Italiano", categoria: "cappuccino", preco: 14.50, tempoPreparoMinutos: 5 },
    { id: 3, nome: "Café Gelado Caramelo", categoria: "gelado", preco: 18.00, tempoPreparoMinutos: 4 },
    { id: 4, nome: "Chá Artesanal de Hibisco", categoria: "cha", preco: 11.00, tempoPreparoMinutos: 6 },
    { id: 5, nome: "Mocha Especial Gourmet", categoria: "especial", preco: 22.00, tempoPreparoMinutos: 7 },
    { id: 6, nome: "Espresso Duplo com Leite Vegetal", categoria: "espresso", preco: 13.50, tempoPreparoMinutos: 4 }
];

// =============================================================================
// 2. FUNÇÕES PURAS DE PROCESSAMENTO E CLASSIFICAÇÃO
// =============================================================================

/**
 * Função que processa: calcula o preço com desconto opcional.
 * Não altera os dados recebidos (função pura) e possui parâmetro com valor padrão.
 * 
 * @param {number} precoBase - Valor original da bebida.
 * @param {number} [descontoPercentual=0] - Percentual de desconto a aplicar (0 a 100).
 * @returns {number} Preço final calculado com duas casas decimais.
 */
function calcularPrecoFinal(precoBase, descontoPercentual = 0) {
    if (typeof precoBase !== "number" || precoBase < 0) {
        return 0;
    }
    const descontoValido = Math.max(0, Math.min(100, descontoPercentual));
    const valorDesconto = (precoBase * descontoValido) / 100;
    const resultado = precoBase - valorDesconto;
    return Number(resultado.toFixed(2));
}

/**
 * Função que classifica: recebe o resultado de calcularPrecoFinal e devolve
 * uma etiqueta textual baseada em 3 faixas de preço na ordem lógica estrita.
 * 
 * @param {number} preco - Preço a ser classificado.
 * @returns {"Economico" | "Intermediario" | "Premium"} Rótulo da faixa.
 */
function classificarFaixaPreco(preco) {
    if (preco < 12.00) {
        return "Economico";
    }
    if (preco <= 17.00) {
        return "Intermediario";
    }
    return "Premium";
}

/**
 * Formata um valor numérico para o padrão de moeda brasileiro (BRL).
 * 
 * @param {number} valor - Quantia numérica.
 * @returns {string} String formatada (ex.: "R$ 14,50").
 */
function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

// =============================================================================
// DESAFIO EXTRA (OPCIONAL): Fábrica de funções com closure
// =============================================================================

/**
 * Fábrica com closure que configura previamente uma taxa padrão de desconto.
 * 
 * @param {number} [descontoPadrao=0] - Percentual fixo da fábrica.
 * @returns {(preco: number, descontoOpcional?: number) => number}
 */
function criarCalculadoraDesconto(descontoPadrao = 0) {
    return function (precoBase, desconto = descontoPadrao) {
        return calcularPrecoFinal(precoBase, desconto);
    };
}

// =============================================================================
// 3. TESTES NO CONSOLE (F12) - Executados antes de manipular a página
// =============================================================================

console.group("☕ [Aula 11] Testes das Funções Puras no Console");
console.log("Teste 1 - calcularPrecoFinal(10, 0):", calcularPrecoFinal(10, 0), "-> Esperado: 10");
console.log("Teste 2 - calcularPrecoFinal(20, 10):", calcularPrecoFinal(20, 10), "-> Esperado: 18");
console.log("Teste 3 - calcularPrecoFinal(15) [com valor padrão]:", calcularPrecoFinal(15), "-> Esperado: 15");
console.log("Teste 4 - classificarFaixaPreco(9.00):", classificarFaixaPreco(9.00), "-> Esperado: Economico");
console.log("Teste 5 - classificarFaixaPreco(14.50):", classificarFaixaPreco(14.50), "-> Esperado: Intermediario");
console.log("Teste 6 - classificarFaixaPreco(22.00):", classificarFaixaPreco(22.00), "-> Esperado: Premium");

const calculadoraCom10PorCento = criarCalculadoraDesconto(10);
console.log("Teste Extra (Closure) - 10% em 50.00:", calculadoraCom10PorCento(50), "-> Esperado: 45");
console.groupEnd();

// =============================================================================
// 4. APLICAÇÃO DOS MÉTODOS DE ARRAY (map, filter, reduce, sort seguro)
// =============================================================================

// map: gera uma nova lista contendo preço final processado e classificação de faixa
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

// filter: isola o subconjunto de itens acessíveis (faixa não-premium)
const itensAcessiveis = itensProcessados.filter((item) => item.faixa !== "Premium");

// reduce: calcula o somatório total de preços do cardápio
const totalPreco = itensProcessados.reduce((acumulador, item) => acumulador + item.precoFinal, 0);

// média calculada a partir do reduce
const mediaPreco = totalPreco / itensProcessados.length;

// sort seguro (Erro 4 evitado): cópia prévia do array com spread operator
const itensOrdenadosPorPreco = [...itensProcessados].sort((a, b) => a.precoFinal - b.precoFinal);

// Desafio Extra: Agrupamento por categoria utilizando reduce
const itensAgrupadosPorCategoria = itensProcessados.reduce((acumulador, item) => {
    const chave = item.categoria;
    if (!acumulador[chave]) {
        acumulador[chave] = [];
    }
    acumulador[chave].push(item);
    return acumulador;
}, {});

// =============================================================================
// 5. FUNÇÕES DE MONTAGEM DO DOM (createElement, textContent, classList, append)
// =============================================================================

/**
 * Cria o elemento visual de um card de bebida sem utilizar innerHTML.
 * 
 * @param {object} item - Item com propriedades processadas.
 * @returns {HTMLElement} Elemento article configurado.
 */
function criarElementoCard(item) {
    const card = document.createElement("article");
    card.classList.add("card", "card-resultado");

    // Marca o resultado com a classe específica da faixa de preço
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
    categoria.textContent = `Categoria: ${item.categoria.toUpperCase()}`;

    const tempo = document.createElement("p");
    tempo.classList.add("card-resultado-tempo");
    tempo.textContent = `⏱ Preparo: ${item.tempoPreparoMinutos} min`;

    const preco = document.createElement("p");
    preco.classList.add("card-resultado-preco");
    preco.textContent = `Preço: ${formatarPreco(item.precoFinal)}`;

    card.append(cabecalho, categoria, tempo, preco);
    return card;
}

/**
 * Cria o card de resumo estatístico gerado com reduce.
 * 
 * @param {number} totalItens - Quantidade total de itens.
 * @param {number} totalValor - Soma dos preços calculada com reduce.
 * @param {number} precoMedio - Média de preços calculada.
 * @param {number} totalAcessivel - Quantidade de itens filtrados.
 * @returns {HTMLElement} Elemento div de resumo estatístico.
 */
function criarElementoResumo(totalItens, totalValor, precoMedio, totalAcessivel) {
    const cardResumo = document.createElement("div");
    cardResumo.classList.add("card", "resumo-resultado");

    const tituloResumo = document.createElement("h3");
    tituloResumo.textContent = "📊 Resumo Geral do Cardápio (Cálculo via Reduce)";

    const listaResumo = document.createElement("ul");
    listaResumo.classList.add("lista-resumo");

    const linhaTotalItens = document.createElement("li");
    linhaTotalItens.textContent = `Total de opções no cardápio: ${totalItens} bebidas`;

    const linhaTotalPreco = document.createElement("li");
    linhaTotalPreco.textContent = `Soma dos preços do catálogo: ${formatarPreco(totalValor)}`;

    const linhaMediaPreco = document.createElement("li");
    linhaMediaPreco.textContent = `Preço médio por bebida: ${formatarPreco(precoMedio)}`;

    const linhaAcessiveis = document.createElement("li");
    linhaAcessiveis.textContent = `Opções de alto custo-benefício (filtradas): ${totalAcessivel} bebidas`;

    listaResumo.append(linhaTotalItens, linhaTotalPreco, linhaMediaPreco, linhaAcessiveis);
    cardResumo.append(tituloResumo, listaResumo);

    return cardResumo;
}

/**
 * Cria o bloco de categorias agrupadas (Desafio Extra).
 * 
 * @param {Record<string, Array<object>>} categorias - Objeto agrupado via reduce.
 * @returns {HTMLElement}
 */
function criarBlocoCategorias(categorias) {
    const container = document.createElement("div");
    container.classList.add("bloco-categorias-extra");

    const titulo = document.createElement("h3");
    titulo.textContent = "📂 Visão Agrupada por Categoria (Reduce Extra)";

    const gridCategorias = document.createElement("div");
    gridCategorias.classList.add("grid-categorias");

    for (const [categoria, lista] of Object.entries(categorias)) {
        const itemCat = document.createElement("div");
        itemCat.classList.add("card", "card-categoria-item");

        const tituloCat = document.createElement("h4");
        tituloCat.textContent = `Categoria: ${categoria.toUpperCase()}`;

        const contagem = document.createElement("p");
        contagem.textContent = `${lista.length} produto(s): ${lista.map((b) => b.nome).join(", ")}`;

        itemCat.append(tituloCat, contagem);
        gridCategorias.append(itemCat);
    }

    container.append(titulo, gridCategorias);
    return container;
}

// =============================================================================
// 6. INICIALIZAÇÃO E INJEÇÃO NA PÁGINA (Com verificação de nulidade - Erro 5)
// =============================================================================

function inicializarSecaoResultado() {
    // Seleção com verificação de nulidade (Erro 5 evitado)
    const containerResultado = document.querySelector("#resultado");
    if (!containerResultado) {
        console.error("Erro 5 evitado: elemento '#resultado' não foi encontrado na página.");
        return;
    }

    // Título e descrição da seção
    const tituloPrincipal = document.createElement("h2");
    tituloPrincipal.id = "titulo-resultado";
    tituloPrincipal.textContent = "Classificação Dinâmica de Bebidas";

    const subtitulo = document.createElement("p");
    subtitulo.classList.add("resultado-subtitulo");
    subtitulo.textContent =
        "Catálogo interativo gerado dinamicamente com funções puras, métodos de array (map, filter, reduce) e estilização por classes de faixa.";

    // Monta o resumo estatístico
    const elementoResumo = criarElementoResumo(
        itensProcessados.length,
        totalPreco,
        mediaPreco,
        itensAcessiveis.length
    );

    // Monta o grid com todos os cards
    const gridCards = document.createElement("div");
    gridCards.classList.add("grid-resultado");

    for (const item of itensOrdenadosPorPreco) {
        const elementoCard = criarElementoCard(item);
        gridCards.append(elementoCard);
    }

    // Monta o bloco do desafio extra
    const elementoCategorias = criarBlocoCategorias(itensAgrupadosPorCategoria);

    // Injeta tudo no elemento <section id="resultado">
    containerResultado.append(
        tituloPrincipal,
        subtitulo,
        elementoResumo,
        gridCards,
        elementoCategorias
    );

    console.log("✅ [Aula 11] Elementos gerados e inseridos no DOM com sucesso!");
}

// Executa a inicialização
inicializarSecaoResultado();
