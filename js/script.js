// 1. Fonte da verdade: array de objetos com mais de 5 itens e mais de 3 propriedades cada
const itensCardapio = [
    { id: 1, nome: "Café Espresso Tradicional", categoria: "espresso", preco: 9.00, tempoPreparoMinutos: 3, favorito: false },
    { id: 2, nome: "Cappuccino Italiano", categoria: "cappuccino", preco: 14.50, tempoPreparoMinutos: 5, favorito: true },
    { id: 3, nome: "Café Gelado Caramelo", categoria: "gelado", preco: 18.00, tempoPreparoMinutos: 4, favorito: false },
    { id: 4, nome: "Chá Artesanal de Hibisco", categoria: "cha", preco: 11.00, tempoPreparoMinutos: 6, favorito: false },
    { id: 5, nome: "Mocha Especial Gourmet", categoria: "especial", preco: 22.00, tempoPreparoMinutos: 7, favorito: true },
    { id: 6, nome: "Espresso Duplo com Leite Vegetal", categoria: "espresso", preco: 13.50, tempoPreparoMinutos: 4, favorito: false }
];

// Estado reativo dos filtros da aplicacao
const estadoFiltros = {
    termo: "",
    categoria: "todas",
    apenasFavoritos: false
};

// ============================================================================
// 2. Funcoes Puras de Calculo, Formatacao e Resumo
// ============================================================================

function calcularPrecoFinal(precoBase, descontoPercentual = 0) {
    if (typeof precoBase !== "number" || precoBase < 0) {
        return 0;
    }
    const descontoValido = Math.max(0, Math.min(100, descontoPercentual));
    const valorDesconto = (precoBase * descontoValido) / 100;
    const resultado = precoBase - valorDesconto;
    return Number(resultado.toFixed(2));
}

function classificarFaixaPreco(preco) {
    if (preco < 12.00) {
        return "Economico";
    }
    if (preco <= 17.00) {
        return "Intermediario";
    }
    return "Premium";
}

function formatarPreco(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function formatarNomeCategoria(categoria) {
    const mapaCategorias = {
        espresso: "Espresso",
        cappuccino: "Cappuccino",
        gelado: "Café Gelado",
        cha: "Chá Artesanal",
        especial: "Especial Gourmet"
    };
    return mapaCategorias[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1);
}

function criarCalculadoraDesconto(descontoPadrao = 0) {
    return function (precoBase, desconto = descontoPadrao) {
        return calcularPrecoFinal(precoBase, desconto);
    };
}

// Funcao pura que calcula o resumo estatistico a partir dos dados recebidos
function calcularResumo(itensFiltrados, totalItensGeral) {
    const visiveis = itensFiltrados.length;
    const favoritos = itensFiltrados.filter((item) => item.favorito).length;
    const somaPrecos = itensFiltrados.reduce((acumulador, item) => acumulador + item.preco, 0);
    const precoMedio = visiveis > 0 ? somaPrecos / visiveis : 0;

    return {
        visiveis: visiveis,
        totalGeral: totalItensGeral,
        favoritos: favoritos,
        precoMedio: precoMedio
    };
}

// ============================================================================
// 3. Renderizacao do DOM (createElement, textContent, dataset, replaceChildren)
// ============================================================================

// Cria cada elemento da lista garantindo protecao total contra XSS (sem innerHTML para dados)
function criarElementoItem(item) {
    const li = document.createElement("li");
    li.classList.add("card-item-catalogo");
    li.dataset.id = String(item.id);

    const faixa = classificarFaixaPreco(item.preco);
    li.classList.add(`faixa-${faixa.toLowerCase()}`);

    if (item.favorito) {
        li.classList.add("item-favorito");
    }

    const cabecalho = document.createElement("div");
    cabecalho.classList.add("card-item-cabecalho");

    const titulo = document.createElement("h3");
    titulo.textContent = item.nome;

    const badgeFaixa = document.createElement("span");
    badgeFaixa.classList.add("tag-faixa", `tag-${faixa.toLowerCase()}`);
    badgeFaixa.textContent = faixa;

    cabecalho.append(titulo, badgeFaixa);

    const categoria = document.createElement("p");
    categoria.classList.add("card-item-categoria");
    categoria.textContent = `Categoria: ${formatarNomeCategoria(item.categoria)}`;

    const tempo = document.createElement("p");
    tempo.classList.add("card-item-tempo");
    tempo.textContent = `Tempo de preparo: ${item.tempoPreparoMinutos} min`;

    const preco = document.createElement("p");
    preco.classList.add("card-item-preco");
    preco.textContent = `Preço: ${formatarPreco(item.preco)}`;

    const barraAcoes = document.createElement("div");
    barraAcoes.classList.add("card-item-acoes");

    const btnFavorito = document.createElement("button");
    btnFavorito.type = "button";
    btnFavorito.classList.add("botao-acao", item.favorito ? "botao-favorito-ativo" : "botao-secundario");
    btnFavorito.dataset.acao = "favoritar";
    btnFavorito.dataset.id = String(item.id);
    btnFavorito.setAttribute("aria-pressed", String(item.favorito));
    btnFavorito.textContent = item.favorito ? "★ Favorito" : "☆ Favoritar";

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.classList.add("botao-acao", "botao-perigo");
    btnRemover.dataset.acao = "remover";
    btnRemover.dataset.id = String(item.id);
    btnRemover.setAttribute("aria-label", `Remover ${item.nome} do cardápio`);
    btnRemover.textContent = "Remover";

    barraAcoes.append(btnFavorito, btnRemover);

    li.append(cabecalho, categoria, tempo, preco, barraAcoes);
    return li;
}

// Atualiza o resumo anunciado pela regiao aria-live="polite"
function atualizarResumo(resumo) {
    const elementoResumo = document.querySelector("#resumo-catalogo");
    if (!elementoResumo) {
        return;
    }

    if (resumo.totalGeral === 0) {
        elementoResumo.textContent = "Nenhuma bebida cadastrada no catálogo no momento.";
        return;
    }

    if (resumo.visiveis === 0) {
        elementoResumo.textContent = `Nenhum resultado encontrado para os filtros atuais (${resumo.totalGeral} bebidas cadastradas).`;
        return;
    }

    elementoResumo.textContent =
        `Exibindo ${resumo.visiveis} de ${resumo.totalGeral} bebidas no cardápio ` +
        `(${resumo.favoritos} favorita(s) listada(s) | Preço médio: ${formatarPreco(resumo.precoMedio)}).`;
}

// Funcao central que le os dados, aplica filtros e redesenha com replaceChildren
function desenhar() {
    const listaCardapio = document.querySelector("#lista-cardapio");
    if (!listaCardapio) {
        return;
    }

    const termoNormalizado = estadoFiltros.termo.trim().toLowerCase();
    const categoriaSelecionada = estadoFiltros.categoria;
    const apenasFavoritos = estadoFiltros.apenasFavoritos;

    const itensFiltrados = itensCardapio.filter((item) => {
        const atendeTermo = item.nome.toLowerCase().includes(termoNormalizado);
        const atendeCategoria = categoriaSelecionada === "todas" || item.categoria === categoriaSelecionada;
        const atendeFavorito = !apenasFavoritos || item.favorito;
        return atendeTermo && atendeCategoria && atendeFavorito;
    });

    if (itensFiltrados.length === 0) {
        const itemVazio = document.createElement("li");
        itemVazio.classList.add("item-vazio");
        itemVazio.textContent = "Nenhuma bebida encontrada para os filtros selecionados.";
        listaCardapio.replaceChildren(itemVazio);
    } else {
        const elementosCards = itensFiltrados.map(criarElementoItem);
        listaCardapio.replaceChildren(...elementosCards);
    }

    const dadosResumo = calcularResumo(itensFiltrados, itensCardapio.length);
    atualizarResumo(dadosResumo);
}

// ============================================================================
// 4. Ouvintes Nomeados de Eventos do Catalogo (com Delegacao)
// ============================================================================

function tratarBusca(evento) {
    estadoFiltros.termo = evento.target.value;
    desenhar();
}

function tratarFiltroCategoria(evento) {
    estadoFiltros.categoria = evento.target.value;
    desenhar();
}

function tratarAlternarFavoritos(evento) {
    const botao = evento.currentTarget;
    estadoFiltros.apenasFavoritos = !estadoFiltros.apenasFavoritos;
    botao.setAttribute("aria-pressed", String(estadoFiltros.apenasFavoritos));
    botao.classList.toggle("botao-favorito-ativo", estadoFiltros.apenasFavoritos);
    desenhar();
}

// Delegacao de eventos: um unico ouvinte no conteiner <ul>
function tratarCliqueLista(evento) {
    const botao = evento.target.closest("[data-acao]");
    if (!botao) {
        return;
    }

    const idItem = Number(botao.dataset.id);
    const acao = botao.dataset.acao;

    const itemAlvo = itensCardapio.find((item) => item.id === idItem);
    if (!itemAlvo) {
        return;
    }

    if (acao === "favoritar") {
        itemAlvo.favorito = !itemAlvo.favorito;
        desenhar();
    } else if (acao === "remover") {
        const indice = itensCardapio.findIndex((item) => item.id === idItem);
        if (indice !== -1) {
            itensCardapio.splice(indice, 1);
            desenhar();
        }
    }
}

// Formulario de adicao de item novo (prova da delegacao de eventos)
function tratarEnvioFormulario(evento) {
    evento.preventDefault();
    const form = evento.currentTarget;

    const inputNome = form.querySelector("#novo-nome");
    const selectCategoria = form.querySelector("#nova-categoria");
    const inputPreco = form.querySelector("#novo-preco");
    const inputTempo = form.querySelector("#novo-tempo");

    if (!inputNome || !selectCategoria || !inputPreco || !inputTempo) {
        return;
    }

    const nome = inputNome.value.trim();
    const categoria = selectCategoria.value;
    const preco = Number(inputPreco.value);
    const tempo = Number(inputTempo.value);

    if (!nome || !categoria || Number.isNaN(preco) || preco <= 0) {
        return;
    }

    const proximoId = itensCardapio.length > 0 ? Math.max(...itensCardapio.map((i) => i.id)) + 1 : 1;

    itensCardapio.push({
        id: proximoId,
        nome: nome,
        categoria: categoria,
        preco: Number(preco.toFixed(2)),
        tempoPreparoMinutos: tempo > 0 ? tempo : 5,
        favorito: false
    });

    form.reset();
    inputNome.focus();
    desenhar();
}

// Desafio extra: tecla de atalho '/' para focar no campo de busca
function tratarAtalhoTeclado(evento) {
    if (evento.key !== "/") {
        return;
    }

    const elementoFocado = document.activeElement;
    const tagFocada = elementoFocado ? elementoFocado.tagName.toLowerCase() : "";

    if (tagFocada === "input" || tagFocada === "textarea" || tagFocada === "select" || (elementoFocado && elementoFocado.isContentEditable)) {
        return;
    }

    const campoBusca = document.querySelector("#campo-busca");
    if (campoBusca) {
        evento.preventDefault();
        campoBusca.focus();
        campoBusca.select();
    }
}

// ============================================================================
// 5. Controle com Estado do Menu de Navegacao e Acessibilidade
// ============================================================================

function fecharMenuMobile() {
    const botaoHamburguer = document.querySelector(".botao-hamburguer");
    const menuNavegacao = document.querySelector("#menu-navegacao");
    if (!botaoHamburguer || !menuNavegacao) {
        return;
    }

    botaoHamburguer.setAttribute("aria-expanded", "false");
    menuNavegacao.classList.remove("menu-aberto");
}

function alternarMenuMobile() {
    const botaoHamburguer = document.querySelector(".botao-hamburguer");
    const menuNavegacao = document.querySelector("#menu-navegacao");
    if (!botaoHamburguer || !menuNavegacao) {
        return;
    }

    const estaAberto = botaoHamburguer.getAttribute("aria-expanded") === "true";
    const novoEstado = !estaAberto;

    botaoHamburguer.setAttribute("aria-expanded", String(novoEstado));
    menuNavegacao.classList.toggle("menu-aberto", novoEstado);
}

// Fechamento pelo teclado: tecla Escape fecha e devolve foco ao botao hamburguer
function tratarTecladoMenu(evento) {
    if (evento.key !== "Escape") {
        return;
    }

    const botaoHamburguer = document.querySelector(".botao-hamburguer");
    if (!botaoHamburguer) {
        return;
    }

    const estaAberto = botaoHamburguer.getAttribute("aria-expanded") === "true";
    if (estaAberto) {
        fecharMenuMobile();
        botaoHamburguer.focus();
    }
}

// Desafio extra: fechar menu com clique fora usando closest
function tratarCliqueForaMenu(evento) {
    const navegacao = document.querySelector("#menu-principal");
    const botaoHamburguer = document.querySelector(".botao-hamburguer");
    if (!navegacao || !botaoHamburguer) {
        return;
    }

    const estaAberto = botaoHamburguer.getAttribute("aria-expanded") === "true";
    if (!estaAberto) {
        return;
    }

    if (!evento.target.closest("#menu-principal")) {
        fecharMenuMobile();
    }
}

// Atualiza o estado ativo ao navegar entre secoes
function tratarCliqueMenuNavegacao(evento) {
    const link = evento.target.closest(".link-menu");
    if (!link) {
        return;
    }

    const linksMenu = document.querySelectorAll(".menu-navegacao .link-menu");
    linksMenu.forEach((itemMenu) => {
        itemMenu.classList.remove("ativo", "active");
        itemMenu.removeAttribute("aria-current");
    });

    link.classList.add("ativo", "active");
    link.setAttribute("aria-current", "page");

    fecharMenuMobile();
}

// ============================================================================
// 6. Funcoes de Inicializacao por Recurso
// ============================================================================

function iniciarMenuNavegacao() {
    const botaoHamburguer = document.querySelector(".botao-hamburguer");
    if (botaoHamburguer) {
        botaoHamburguer.addEventListener("click", alternarMenuMobile);
    }

    const menuNavegacao = document.querySelector("#menu-navegacao");
    if (menuNavegacao) {
        menuNavegacao.addEventListener("click", tratarCliqueMenuNavegacao);
    }

    document.addEventListener("keydown", tratarTecladoMenu);
    document.addEventListener("click", tratarCliqueForaMenu);
}

function iniciarCatalogoInterativo() {
    const campoBusca = document.querySelector("#campo-busca");
    if (campoBusca) {
        campoBusca.addEventListener("input", tratarBusca);
    }

    const filtroCategoria = document.querySelector("#filtro-categoria");
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", tratarFiltroCategoria);
    }

    const btnFavoritos = document.querySelector("#btn-filtro-favoritos");
    if (btnFavoritos) {
        btnFavoritos.addEventListener("click", tratarAlternarFavoritos);
    }

    const listaCardapio = document.querySelector("#lista-cardapio");
    if (listaCardapio) {
        listaCardapio.addEventListener("click", tratarCliqueLista);
    }

    const formNovoItem = document.querySelector("#form-novo-item");
    if (formNovoItem) {
        formNovoItem.addEventListener("submit", tratarEnvioFormulario);
    }

    document.addEventListener("keydown", tratarAtalhoTeclado);

    // Primeira renderizacao: a pagina nasce preenchida
    desenhar();
}

function tratarFecharAviso(evento) {
    const botao = evento.currentTarget;
    const idAviso = botao.getAttribute("aria-controls");
    const aviso = idAviso ? document.querySelector(`#${idAviso}`) : botao.closest(".aviso");
    if (aviso) {
        aviso.remove();
    }
}

function iniciarAvisoReserva() {
    const botaoFecharAviso = document.querySelector(".aviso .botao-fechar");
    if (botaoFecharAviso) {
        botaoFecharAviso.addEventListener("click", tratarFecharAviso);
    }
}

function tratarCliqueAnalisador() {
    if (typeof window.iniciarMenuInterativo === "function") {
        window.iniciarMenuInterativo();
    }
}

function iniciarAnalisadorPrompt() {
    const botaoAnalisador = document.querySelector("#btn-iniciar-analisador");
    if (botaoAnalisador) {
        botaoAnalisador.addEventListener("click", tratarCliqueAnalisador);
    }
}

// ============================================================================
// 7. Inicializacao Geral dos Recursos ao Carregar o Script
// ============================================================================

iniciarMenuNavegacao();
iniciarCatalogoInterativo();
iniciarAvisoReserva();
iniciarAnalisadorPrompt();
