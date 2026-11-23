/**
 * Cafeteria Aroma - Script principal
 *
 * Tema: Cardápio interativo e análise estatística de bebidas artesanais.
 *
 * Entrada:
 *   - Orçamento máximo em R$ informado via prompt (faixa válida: 5 a 50, padrão 15.00).
 *   - Termo de busca, categoria e filtro de favoritos na interface.
 *   - Cadastro de novas bebidas e envio do formulário de reserva.
 *
 * Processamento:
 *   1. Validação e coerção explícita com Number() (null, vazio, NaN e faixa).
 *   2. Padrão dados -> classificar -> resumir com for...of, if/else if/else,
 *      switch, while (simulação de combo no orçamento) e do...while (menu).
 *   3. Funções puras com escopo local, parâmetro padrão e return.
 *   4. Métodos de array (filter, map, reduce) sobre itensCardapio.
 *
 * Saída:
 *   - Cards e resumo renderizados no DOM com createElement, textContent e replaceChildren(),
 *     marcados com classes CSS e anunciados em região aria-live="polite".
 *   - Tabela e resumo no Console (F12) com console.table() e gráfico em Canvas 2D.
 *
 * Pseudocódigo:
 *   INICIO
 *     OBTER precoLimite VIA prompt (padrão 15.00) E VALIDAR entre 5 e 50
 *     PARA CADA item DE itensCardapio (for...of):
 *       ACUMULAR totalPreco, CONTAR itens <= precoLimite, ATUALIZAR caro/barato
 *       CLASSIFICAR faixaPreco VIA if / else if / else
 *       OBTER etiquetaCategoria VIA switch
 *     FIM PARA
 *     SIMULAR quantos itens sequenciais cabem no teto do combo VIA while
 *     EXIBIR relatório NO console.table E NO DOM (#resumo-analisador-dom)
 *     REPETIR menu interativo VIA do...while ATÉ opção "3" ou "sair"
 *   FIM
 *
 * Teste de Mesa (3 primeiras voltas do for...of com precoLimite = R$ 15,00):
 * +-------+-----------------------------+---------+------------+---------------+---------------------+
 * | Volta | Item (nome)                 | Preço   | Total Acum.| Faixa         | Status Orçamento    |
 * +-------+-----------------------------+---------+------------+---------------+---------------------+
 * | 1     | Café Espresso Tradicional   | R$ 9,00 | R$ 9,00    | Economico     | Dentro do orçamento |
 * | 2     | Cappuccino Italiano         | R$ 14,50| R$ 23,50   | Intermediario | Dentro do orçamento |
 * | 3     | Café Gelado Caramelo        | R$ 18,00| R$ 41,50   | Premium       | Acima do orçamento  |
 * +-------+-----------------------------+---------+------------+---------------+---------------------+
 */

// Base de dados principal (6 itens com 6 propriedades cada)
const itensCardapio = [
    { id: 1, nome: "Café Espresso Tradicional", categoria: "espresso", preco: 9.00, tempoPreparoMinutos: 3, favorito: false },
    { id: 2, nome: "Cappuccino Italiano", categoria: "cappuccino", preco: 14.50, tempoPreparoMinutos: 5, favorito: true },
    { id: 3, nome: "Café Gelado Caramelo", categoria: "gelado", preco: 18.00, tempoPreparoMinutos: 4, favorito: false },
    { id: 4, nome: "Chá Artesanal de Hibisco", categoria: "cha", preco: 11.00, tempoPreparoMinutos: 6, favorito: false },
    { id: 5, nome: "Mocha Especial Gourmet", categoria: "especial", preco: 22.00, tempoPreparoMinutos: 7, favorito: true },
    { id: 6, nome: "Espresso Duplo com Leite Vegetal", categoria: "espresso", preco: 13.50, tempoPreparoMinutos: 4, favorito: false }
];

// Estado atual dos filtros
const estadoFiltros = {
    termo: "",
    categoria: "todas",
    apenasFavoritos: false
};

// Funções puras e escopo local

// Processa o preço com desconto usando variáveis de escopo local e parâmetro padrão
function calcularPrecoFinal(precoBase, descontoPercentual = 0) {
    const baseNumerica = Number(precoBase);
    const descontoNumerico = Number(descontoPercentual);

    if (Number.isNaN(baseNumerica) || baseNumerica < 0) {
        return 0;
    }

    const descontoValido = Math.max(0, Math.min(100, Number.isNaN(descontoNumerico) ? 0 : descontoNumerico));
    const valorDesconto = (baseNumerica * descontoValido) / 100;
    const resultado = baseNumerica - valorDesconto;
    return Number(resultado.toFixed(2));
}

// Exemplo de escopo local com closure: taxaPadraoLocal fica restrita à função externa
function criarCalculadoraDesconto(descontoPadrao = 0) {
    const taxaPadraoLocal = Number(descontoPadrao);
    return function (precoBase, desconto = taxaPadraoLocal) {
        return calcularPrecoFinal(precoBase, desconto);
    };
}

// Classifica o preço em três faixas com if / else if / else
function classificarFaixaPreco(preco) {
    const valor = Number(preco);
    if (valor < 12.00) {
        return "Economico";
    } else if (valor <= 17.00) {
        return "Intermediario";
    } else {
        return "Premium";
    }
}

// Retorna a descrição da categoria usando switch com break e default
function obterEtiquetaCategoria(categoria) {
    let etiqueta = "";
    switch (categoria) {
        case "espresso":
            etiqueta = "Espresso Tradicional da Casa";
            break;
        case "cappuccino":
            etiqueta = "Cappuccino com Leite Vaporizado";
            break;
        case "gelado":
            etiqueta = "Bebida Gelada Refrescante";
            break;
        case "cha":
            etiqueta = "Infusão Artesanal de Frutas e Ervas";
            break;
        case "especial":
            etiqueta = "Receita Autoral Gourmet";
            break;
        default:
            etiqueta = "Bebida Especial Aroma";
            break;
    }
    return etiqueta;
}

function formatarPreco(valor) {
    const numero = Number(valor);
    return `R$ ${(Number.isNaN(numero) ? 0 : numero).toFixed(2).replace(".", ",")}`;
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

// Calcula o resumo estatístico com filter e reduce
function calcularResumo(itensFiltrados, totalItensGeral) {
    const visiveis = itensFiltrados.length;
    const favoritos = itensFiltrados.filter((item) => item.favorito === true).length;
    const somaPrecos = itensFiltrados.reduce((acumulador, item) => acumulador + item.preco, 0);
    const precoMedio = visiveis > 0 ? somaPrecos / visiveis : 0;

    return {
        visiveis: visiveis,
        totalGeral: totalItensGeral,
        favoritos: favoritos,
        precoMedio: Number(precoMedio.toFixed(2))
    };
}

// Lógica estruturada: dados -> classificar -> resumir

function executarAnaliseCardapio(precoLimiteParametro = 15.00, exibirNoConsole = true) {
    const precoLimite = Number(precoLimiteParametro);
    const itensProcessados = [];

    if (itensCardapio.length === 0) {
        return {
            precoLimite: precoLimite,
            totalPreco: 0,
            mediaPreco: 0,
            contadorDentroDoLimite: 0,
            totalItens: 0,
            itensNoCombo: 0,
            itemMaisCaro: null,
            itemMaisBarato: null,
            itensProcessados: itensProcessados
        };
    }

    let totalPreco = 0;
    let contadorDentroDoLimite = 0;
    let itemMaisCaro = itensCardapio[0];
    let itemMaisBarato = itensCardapio[0];

    for (const item of itensCardapio) {
        totalPreco += item.preco;

        if (item.preco <= precoLimite) {
            contadorDentroDoLimite++;
        }
        if (item.preco > itemMaisCaro.preco) {
            itemMaisCaro = item;
        }
        if (item.preco < itemMaisBarato.preco) {
            itemMaisBarato = item;
        }

        const faixaPreco = classificarFaixaPreco(item.preco);
        const etiquetaCategoria = obterEtiquetaCategoria(item.categoria);
        const statusOrcamento = item.preco <= precoLimite ? "Dentro do orçamento" : "Acima do orçamento";

        itensProcessados.push({
            id: item.id,
            nome: item.nome,
            categoria: item.categoria,
            preco: Number(item.preco.toFixed(2)),
            faixaPreco: faixaPreco,
            etiquetaCategoria: etiquetaCategoria,
            statusOrcamento: statusOrcamento
        });
    }

    // Simula com while quantos itens sequenciais cabem em um combo de até 2x o limite
    let indiceWhile = 0;
    let somaCombo = 0;
    let itensNoCombo = 0;
    const tetoCombo = precoLimite * 2;

    while (indiceWhile < itensCardapio.length && somaCombo + itensCardapio[indiceWhile].preco <= tetoCombo) {
        somaCombo += itensCardapio[indiceWhile].preco;
        itensNoCombo++;
        indiceWhile++;
    }

    const mediaPreco = totalPreco / itensCardapio.length;

    if (exibirNoConsole) {
        console.log("=== RELATÓRIO GERAL - CARDÁPIO CAFETERIA AROMA ===");
        console.log(`Parâmetro de preço máximo: ${formatarPreco(precoLimite)}`);
        console.log(`Total acumulado do cardápio: ${formatarPreco(totalPreco)}`);
        console.log(`Média de preço das bebidas: ${formatarPreco(mediaPreco)}`);
        console.log(`Bebida mais cara: ${itemMaisCaro.nome} (${formatarPreco(itemMaisCaro.preco)})`);
        console.log(`Bebida mais acessível: ${itemMaisBarato.nome} (${formatarPreco(itemMaisBarato.preco)})`);
        console.log(`Itens dentro do orçamento: ${contadorDentroDoLimite} de ${itensCardapio.length}`);
        console.log(`Simulação combo (while, teto ${formatarPreco(tetoCombo)}): ${itensNoCombo} itens (${formatarPreco(somaCombo)})`);
        console.table(itensProcessados);
    }

    return {
        precoLimite: precoLimite,
        totalPreco: Number(totalPreco.toFixed(2)),
        mediaPreco: Number(mediaPreco.toFixed(2)),
        contadorDentroDoLimite: contadorDentroDoLimite,
        totalItens: itensCardapio.length,
        itensNoCombo: itensNoCombo,
        itemMaisCaro: itemMaisCaro,
        itemMaisBarato: itemMaisBarato,
        itensProcessados: itensProcessados
    };
}

function renderizarResumoAnalisador(relatorio) {
    const container = document.querySelector("#resumo-analisador-dom");
    if (!container) {
        return;
    }

    if (!relatorio || relatorio.totalItens === 0) {
        const avisoVazio = document.createElement("p");
        avisoVazio.textContent = "Nenhuma bebida disponível para análise estatística.";
        container.replaceChildren(avisoVazio);
        return;
    }

    const metricas = [
        { rotulo: "Orçamento analisado", valor: formatarPreco(relatorio.precoLimite) },
        { rotulo: "Dentro do orçamento", valor: `${relatorio.contadorDentroDoLimite} de ${relatorio.totalItens} bebidas` },
        { rotulo: "Média do cardápio", valor: formatarPreco(relatorio.mediaPreco) },
        { rotulo: "Mais acessível", valor: `${relatorio.itemMaisBarato.nome} (${formatarPreco(relatorio.itemMaisBarato.preco)})` }
    ];

    const cartoes = metricas.map((metrica) => {
        const bloco = document.createElement("div");
        bloco.classList.add("analisador-metrica");

        const rotulo = document.createElement("span");
        rotulo.classList.add("analisador-metrica-rotulo");
        rotulo.textContent = metrica.rotulo;

        const valor = document.createElement("strong");
        valor.classList.add("analisador-metrica-valor");
        valor.textContent = metrica.valor;

        bloco.append(rotulo, valor);
        return bloco;
    });

    container.replaceChildren(...cartoes);
}

// Menu interativo via prompt e do...while (acionado ao carregar e via botão)
function iniciarMenuInterativo() {
    const valorPadrao = 15.00;
    let precoLimite = valorPadrao;

    const entradaUsuario = prompt("Informe um preço máximo em R$ para filtrar o cardápio (faixa válida: 5 a 50):", "15.00");
    const valorRecebido = entradaUsuario ?? "";

    if (entradaUsuario === null) {
        console.warn(`[Aviso] Entrada cancelada pelo usuário. Usando preço padrão de R$ ${valorPadrao.toFixed(2)}.`);
    } else if (valorRecebido.trim() === "") {
        console.warn(`[Aviso] Nenhum valor informado. Usando preço padrão de R$ ${valorPadrao.toFixed(2)}.`);
    } else {
        const numeroConvertido = Number(valorRecebido.replace(",", "."));
        if (Number.isNaN(numeroConvertido)) {
            console.warn(`[Aviso] '${valorRecebido}' não é um número válido. Usando R$ ${valorPadrao.toFixed(2)}.`);
        } else if (numeroConvertido < 5 || numeroConvertido > 50) {
            console.warn(`[Aviso] Preço R$ ${numeroConvertido.toFixed(2)} fora da faixa (5 a 50). Usando R$ ${valorPadrao.toFixed(2)}.`);
        } else {
            precoLimite = numeroConvertido;
        }
    }

    const relatorio = executarAnaliseCardapio(precoLimite, true);
    renderizarResumoAnalisador(relatorio);

    let opcaoMenu = "";
    do {
        const entradaMenu = prompt(
            "=== MENU INTERATIVO - CAFETERIA AROMA ===\n\n" +
            "1 - Listar itens analisados\n" +
            "2 - Exibir resumo estatístico\n" +
            "3 (ou 'sair') - Encerrar o sistema\n\n" +
            "Escolha uma opção:"
        );

        const opcaoNormalizada = (entradaMenu ?? "3").trim().toLowerCase();

        switch (opcaoNormalizada) {
            case "1": {
                console.table(relatorio.itensProcessados);
                let textoItens = "BEBIDAS ANALISADAS - CAFETERIA AROMA\n\n";
                for (const itemCardapio of relatorio.itensProcessados) {
                    textoItens += `${itemCardapio.id}. ${itemCardapio.nome}: ${formatarPreco(itemCardapio.preco)} (${itemCardapio.faixaPreco} | ${itemCardapio.statusOrcamento})\n`;
                }
                alert(textoItens);
                break;
            }
            case "2": {
                const textoResumo =
                    "RESUMO ESTATÍSTICO - CAFETERIA AROMA\n\n" +
                    `• Preço limite: ${formatarPreco(relatorio.precoLimite)}\n` +
                    `• Total acumulado: ${formatarPreco(relatorio.totalPreco)}\n` +
                    `• Preço médio: ${formatarPreco(relatorio.mediaPreco)}\n` +
                    `• Mais cara: ${relatorio.itemMaisCaro.nome} (${formatarPreco(relatorio.itemMaisCaro.preco)})\n` +
                    `• Mais acessível: ${relatorio.itemMaisBarato.nome} (${formatarPreco(relatorio.itemMaisBarato.preco)})\n` +
                    `• Dentro do orçamento: ${relatorio.contadorDentroDoLimite} de ${relatorio.totalItens}`;
                alert(textoResumo);
                break;
            }
            case "3":
            case "sair":
                opcaoMenu = "sair";
                break;
            default:
                alert("Opção inválida! Escolha 1, 2, 3 ou 'sair'.");
                break;
        }
    } while (opcaoMenu !== "sair");
}

// Renderização do DOM: createElement, textContent e replaceChildren

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
    titulo.classList.add("card-item-titulo");
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
        `Exibindo ${resumo.visiveis} de ${resumo.totalGeral} bebidas ` +
        `(${resumo.favoritos} fav. | Média: ${formatarPreco(resumo.precoMedio)}).`;
}

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
    renderizarResumoAnalisador(executarAnaliseCardapio(15.00, false));
}

// Ouvintes de eventos e delegação

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

// Delegação de eventos: um único ouvinte na lista <ul>
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
        if (!window.confirm(`Deseja realmente remover "${itemAlvo.nome}" do cardápio?`)) {
            return;
        }
        const indice = itensCardapio.findIndex((item) => item.id === idItem);
        if (indice !== -1) {
            itensCardapio.splice(indice, 1);
            desenhar();
        }
    }
}

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

function tratarEnvioReserva(evento) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const feedback = document.querySelector("#feedback-reserva");
    const inputNome = form.querySelector("#nome");
    const inputData = form.querySelector("#data");
    const inputHorario = form.querySelector("#horario");

    if (feedback && inputNome && inputData && inputHorario) {
        const nomeCliente = inputNome.value.trim() || "Cliente";
        feedback.textContent = `Reserva solicitada para ${nomeCliente} em ${inputData.value} às ${inputHorario.value}. Aguardamos você!`;
        feedback.hidden = false;
    }

    form.reset();
}

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

// Menu de navegação mobile e acessibilidade

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

// Inicialização por recurso

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

    const formReserva = document.querySelector("#form-reserva");
    if (formReserva) {
        formReserva.addEventListener("submit", tratarEnvioReserva);
    }
}

function iniciarAnalisadorPrompt() {
    const botaoAnalisador = document.querySelector("#btn-iniciar-analisador");
    if (botaoAnalisador) {
        botaoAnalisador.addEventListener("click", iniciarMenuInterativo);
    }

    const relatorioInicial = executarAnaliseCardapio(15.00, true);
    renderizarResumoAnalisador(relatorioInicial);
}

// Gráfico em Canvas 2D animado com requestAnimationFrame e clearRect
function iniciarGraficoCanvas() {
    const canvas = document.querySelector("#canvas-grafico-cafes");
    if (!canvas || !canvas.getContext) {
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    const metricas = [
        { nome: "Espresso", valor: 9, max: 10, cor: "#181411" },
        { nome: "Cappuccino", valor: 7, max: 10, cor: "#c2410c" },
        { nome: "Gelado", valor: 6, max: 10, cor: "#ea580c" },
        { nome: "Chá", valor: 4, max: 10, cor: "#6b7280" },
        { nome: "Mocha", valor: 8, max: 10, cor: "#43281c" }
    ];

    let fatorProgresso = 0;

    function renderizarQuadro() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const larguraBarra = 44;
        const espacamento = 34;
        const margemEsquerda = 45;
        const linhaBaseY = 160;

        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(25, linhaBaseY);
        ctx.lineTo(canvas.width - 25, linhaBaseY);
        ctx.stroke();

        metricas.forEach((item, indice) => {
            const x = margemEsquerda + indice * (larguraBarra + espacamento);
            const alturaMaxima = (item.valor / item.max) * 115;
            const alturaAtual = alturaMaxima * fatorProgresso;
            const y = linhaBaseY - alturaAtual;

            ctx.fillStyle = item.cor;
            ctx.beginPath();
            if (typeof ctx.roundRect === "function") {
                ctx.roundRect(x, y, larguraBarra, alturaAtual, [6, 6, 0, 0]);
            } else {
                ctx.rect(x, y, larguraBarra, alturaAtual);
            }
            ctx.fill();

            ctx.fillStyle = "#111827";
            ctx.font = "600 12px 'Inter', system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(`${item.valor}/10`, x + larguraBarra / 2, Math.max(16, y - 6));

            ctx.fillStyle = "#6b7280";
            ctx.font = "500 12px 'Inter', system-ui, sans-serif";
            ctx.fillText(item.nome, x + larguraBarra / 2, linhaBaseY + 20);
        });

        if (fatorProgresso < 1) {
            fatorProgresso = Math.min(1, fatorProgresso + 0.05);
            requestAnimationFrame(renderizarQuadro);
        }
    }

    renderizarQuadro();
}

// Detecta suporte de codec com canPlayType()
function verificarSuporteVideo() {
    const elementoInfo = document.querySelector("#info-formato-video");
    const video = document.createElement("video");
    if (!elementoInfo || !video.canPlayType) {
        return;
    }

    const suporteWebm = video.canPlayType('video/webm; codecs="vp9"');
    const suporteMp4 = video.canPlayType('video/mp4; codecs="avc1.42E01E"');

    let formatoEscolhido = "MP4 (H.264)";
    if (suporteWebm === "probably" || suporteWebm === "maybe") {
        formatoEscolhido = "WebM (VP9)";
    }

    elementoInfo.textContent = `Vídeo: formato ${formatoEscolhido} ativo (WebM: ${suporteWebm || "não"} | MP4: ${suporteMp4 || "não"}).`;
}

// Inicialização geral
iniciarMenuNavegacao();
iniciarCatalogoInterativo();
iniciarAvisoReserva();
iniciarAnalisadorPrompt();
iniciarGraficoCanvas();
verificarSuporteVideo();
iniciarMenuInterativo();
