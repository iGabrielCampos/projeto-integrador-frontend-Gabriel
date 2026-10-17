/**
 * Analise do cardapio da Cafeteria Aroma.
 * Le o preco maximo informado pelo usuario, calcula estatisticas gerais e
 * disponibiliza um menu de navegacao no terminal e em alertas.
 */

const cardapio = [
    { id: 1, nome: "Cafe Espresso Tradicional", categoria: "espresso", preco: 9.00 },
    { id: 2, nome: "Cappuccino Italiano", categoria: "cappuccino", preco: 14.50 },
    { id: 3, nome: "Cafe Gelado Caramelo", categoria: "gelado", preco: 18.00 },
    { id: 4, nome: "Cha Artesanal de Hibisco", categoria: "cha", preco: 11.00 },
    { id: 5, nome: "Mocha Especial com Chocolate", categoria: "especial", preco: 22.00 },
    { id: 6, nome: "Espresso Duplo com Leite Vegetal", categoria: "espresso", preco: 13.50 }
];

/**
 * Executa o fluxo de analise e o menu interativo.
 */
function iniciarMenuInterativo() {
    const valorPadrao = 15.00;
    let precoLimite = valorPadrao;

    const entradaUsuario = prompt("Informe um preco maximo em R$ para filtrar o cardapio (faixa valida: 5 a 50):", "15.00");
    const valorRecebido = entradaUsuario ?? "";

    if (entradaUsuario === null) {
        console.warn(`[Aviso] Entrada cancelada pelo usuario. Usando preco padrao de R$ ${valorPadrao.toFixed(2)}.`);
    } else if (valorRecebido.trim() === "") {
        console.warn(`[Aviso] Nao foi informado nenhum valor. Usando preco padrao de R$ ${valorPadrao.toFixed(2)}.`);
    } else {
        const numeroConvertido = Number(valorRecebido.replace(",", "."));
        if (Number.isNaN(numeroConvertido)) {
            console.warn(`[Aviso] O valor '${valorRecebido}' nao e um numero valido. Usando preco padrao de R$ ${valorPadrao.toFixed(2)}.`);
        } else if (numeroConvertido < 5 || numeroConvertido > 50) {
            console.warn(`[Aviso] Preco R$ ${numeroConvertido.toFixed(2)} fora da faixa esperada (5 a 50). Usando preco padrao de R$ ${valorPadrao.toFixed(2)}.`);
        } else {
            precoLimite = numeroConvertido;
            console.log(`[Sucesso] Filtro de preco definido: R$ ${precoLimite.toFixed(2)}.`);
        }
    }

    const itensProcessados = [];
    let totalPreco = 0;
    let contadorDentroDoLimite = 0;
    let itemMaisCaro = cardapio[0];
    let itemMaisBarato = cardapio[0];

    for (const item of cardapio) {
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

        let faixaPreco = "";
        if (item.preco < 12.00) {
            faixaPreco = "Economico";
        } else if (item.preco <= 17.00) {
            faixaPreco = "Intermediario";
        } else {
            faixaPreco = "Premium";
        }

        let etiquetaCategoria = "";
        switch (item.categoria) {
            case "espresso":
                etiquetaCategoria = "Espresso Tradicional da Casa";
                break;
            case "cappuccino":
                etiquetaCategoria = "Cappuccino com Leite Vaporizado";
                break;
            case "gelado":
                etiquetaCategoria = "Bebida Gelada Refrescante";
                break;
            case "cha":
                etiquetaCategoria = "Infusao Artesanal de Frutas e Ervas";
                break;
            case "especial":
                etiquetaCategoria = "Receita Autoral Gourmet";
                break;
            default:
                etiquetaCategoria = "Bebida Especial Aroma";
                break;
        }

        const statusOrcamento = item.preco <= precoLimite ? "Dentro do orcamento" : "Acima do orcamento";

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

    const mediaPreco = totalPreco / cardapio.length;

    /*
     * Teste de mesa (3 primeiras voltas com precoLimite = 15.00):
     *
     * 1. Cafe Espresso Tradicional (9.00)  -> Economico     -> Total: 9.00  -> No orcamento: 1
     * 2. Cappuccino Italiano (14.50)       -> Intermediario -> Total: 23.50 -> No orcamento: 2
     * 3. Cafe Gelado Caramelo (18.00)      -> Premium       -> Total: 41.50 -> No orcamento: 2
     */

    console.log(`\n======================================================`);
    console.log(`☕ RELATORIO GERAL - CARDAPIO CAFETERIA AROMA`);
    console.log(`======================================================`);
    console.log(`Parametro de preco maximo: R$ ${precoLimite.toFixed(2)}`);
    console.log(`Total acumulado do cardapio: R$ ${totalPreco.toFixed(2)}`);
    console.log(`Media de preco das bebidas: R$ ${mediaPreco.toFixed(2)}`);
    console.log(`Bebida mais cara: ${itemMaisCaro.nome} (R$ ${itemMaisCaro.preco.toFixed(2)})`);
    console.log(`Bebida mais acessivel: ${itemMaisBarato.nome} (R$ ${itemMaisBarato.preco.toFixed(2)})`);
    console.log(`Itens dentro do orcamento informado: ${contadorDentroDoLimite} de ${cardapio.length} bebidas`);
    console.log(`======================================================\n`);
    console.log("Tabela completa dos itens classificados:");
    console.table(itensProcessados);

    let opcaoMenu = "";

    do {
        const entradaMenu = prompt(
            "=== MENU INTERATIVO - CAFETERIA AROMA ===\n\n" +
            "1 - Listar itens analisados\n" +
            "2 - Exibir resumo estatistico\n" +
            "3 (ou 'sair') - Encerrar o sistema\n\n" +
            "Escolha uma opcao:"
        );

        const opcaoNormalizada = (entradaMenu ?? "3").trim().toLowerCase();

        switch (opcaoNormalizada) {
            case "1": {
                console.log("\n--- LISTAGEM DE BEBIDAS ANALISADAS ---");
                console.table(itensProcessados);

                let textoItens = "☕ BEBIDAS ANALISADAS - CAFETERIA AROMA\n\n";
                for (const itemCardapio of itensProcessados) {
                    textoItens += `${itemCardapio.id}. ${itemCardapio.nome}\n` +
                        `   Preco: R$ ${itemCardapio.preco.toFixed(2)} | Faixa: ${itemCardapio.faixaPreco}\n` +
                        `   Tipo: ${itemCardapio.etiquetaCategoria}\n` +
                        `   Status: ${itemCardapio.statusOrcamento}\n\n`;
                }
                textoItens += "(A tabela completa tambem foi impressa no Console F12)";
                alert(textoItens);
                break;
            }
            case "2": {
                console.log("\n--- RESUMO ESTATISTICO DA CAFETERIA ---");
                console.log(`Preco maximo informado: R$ ${precoLimite.toFixed(2)}`);
                console.log(`Total acumulado: R$ ${totalPreco.toFixed(2)}`);
                console.log(`Preco medio: R$ ${mediaPreco.toFixed(2)}`);
                console.log(`Bebida de maior valor: ${itemMaisCaro.nome} (R$ ${itemMaisCaro.preco.toFixed(2)})`);
                console.log(`Bebida de menor valor: ${itemMaisBarato.nome} (R$ ${itemMaisBarato.preco.toFixed(2)})`);
                console.log(`Bebidas dentro do orcamento: ${contadorDentroDoLimite} de ${cardapio.length}`);

                const textoResumo =
                    "📊 RESUMO ESTATISTICO - CAFETERIA AROMA\n\n" +
                    `• Preco limite informado: R$ ${precoLimite.toFixed(2)}\n` +
                    `• Total acumulado do cardapio: R$ ${totalPreco.toFixed(2)}\n` +
                    `• Preco medio das bebidas: R$ ${mediaPreco.toFixed(2)}\n` +
                    `• Bebida mais cara: ${itemMaisCaro.nome} (R$ ${itemMaisCaro.preco.toFixed(2)})\n` +
                    `• Bebida mais acessivel: ${itemMaisBarato.nome} (R$ ${itemMaisBarato.preco.toFixed(2)})\n` +
                    `• Bebidas dentro do orcamento: ${contadorDentroDoLimite} de ${cardapio.length} itens\n\n` +
                    "(Os dados estatisticos completos tambem foram impressos no Console F12)";
                alert(textoResumo);
                break;
            }
            case "3":
            case "sair":
                console.log("\n[Sistema Encerrado] Obrigado por utilizar o analisador da Cafeteria Aroma!");
                alert("☕ [Sistema Encerrado]\nObrigado por utilizar o analisador da Cafeteria Aroma!");
                opcaoMenu = "sair";
                break;
            default:
                console.warn("\n[Aviso] Opcao invalida. Por favor, escolha 1, 2, 3 ou digite 'sair'.");
                alert("⚠️ Opcao invalida!\nPor favor, escolha 1, 2, 3 ou digite 'sair'.");
                break;
        }

        if (opcaoNormalizada === "3" || opcaoNormalizada === "sair") {
            opcaoMenu = "sair";
        }
    } while (opcaoMenu !== "sair");
}

iniciarMenuInterativo();

// Permite reabrir a funcao pelo botao da pagina ou pelo console
if (typeof window !== "undefined") {
    window.iniciarMenuInterativo = iniciarMenuInterativo;
}
