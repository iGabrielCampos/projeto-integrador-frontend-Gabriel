/**
 * ============================================================================
 * ATIVIDADE PRATICA - AULA 09 (JAVASCRIPT LOGICA)
 * ============================================================================
 * Tema do Projeto: Cafeteria Aroma (Cardapio e Analise de Bebidas Especiais)
 * Entrada esperada: Preco maximo de analise/filtro informado pelo usuario via prompt (ex: R$ 15.00)
 * Processamento: Validacao robusta de entrada (coalescencia nula, string vazia, NaN, limites logicos),
 *                iteracao sobre array de bebidas (for...of), acumulacao de precos, contagem
 *                de bebidas no orcamento, identificacao de extremos (maior e menor valor),
 *                classificacao em faixas de preco (if/else if/else), rotulagem por categoria
 *                (switch), definicao de status rapido (operador ternario) e calculo de media.
 * Saida esperada: Exibicao formatada no console com template literals, exibicao em console.table
 *                 e navegacao interativa continuada via menu interativo (do...while).
 *
 * Pseudocodigo:
 * 1. Definir o array constante com os dados estruturados do cardapio da cafeteria
 * 2. Solicitar preco limite ao usuario via prompt, tratando cancelamento e validando entrada
 * 3. Percorrer os itens acumulando totais, contando elegiveis e classificando por faixa e tipo
 * 4. Calcular a media de precos e compor o array final de itens processados
 * 5. Apresentar os resultados formatados no console via template literals e tabela
 * 6. Executar o menu interativo com do...while permitindo consultar listagem, resumo ou sair
 * ============================================================================
 */

// 1. Declaracao de dados (Cardapio da Cafeteria Aroma)
const cardapio = [
    { id: 1, nome: "Cafe Espresso Tradicional", categoria: "espresso", preco: 9.00 },
    { id: 2, nome: "Cappuccino Italiano", categoria: "cappuccino", preco: 14.50 },
    { id: 3, nome: "Cafe Gelado Caramelo", categoria: "gelado", preco: 18.00 },
    { id: 4, nome: "Cha Artesanal de Hibisco", categoria: "cha", preco: 11.00 },
    { id: 5, nome: "Mocha Especial com Chocolate", categoria: "especial", preco: 22.00 },
    { id: 6, nome: "Espresso Duplo com Leite Vegetal", categoria: "espresso", preco: 13.50 }
];

// 2. Entrada de dados e validacao (prompt + Number + ??)
const valorPadrao = 15.00;
let precoLimite = valorPadrao;

const entradaUsuario = prompt("Informe um preco maximo em R$ para filtrar o cardapio (faixa valida: 5 a 50):");
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

// 3. Variaveis de controle, acumuladores, contadores e extremos
const itensProcessados = [];
let totalPreco = 0;
let contadorDentroDoLimite = 0;
let itemMaisCaro = cardapio[0];
let itemMaisBarato = cardapio[0];

// 4. Laco principal de classificacao e resumo (for...of)
for (const item of cardapio) {
    // Acumulador
    totalPreco += item.preco;

    // Contador de itens dentro do limite
    if (item.preco <= precoLimite) {
        contadorDentroDoLimite++;
    }

    // Identificacao de maior e menor valor
    if (item.preco > itemMaisCaro.preco) {
        itemMaisCaro = item;
    }
    if (item.preco < itemMaisBarato.preco) {
        itemMaisBarato = item;
    }

    // Classificacao em pelo menos 3 faixas logicas
    let faixaPreco = "";
    if (item.preco < 12.00) {
        faixaPreco = "Economico";
    } else if (item.preco <= 17.00) {
        faixaPreco = "Intermediario";
    } else {
        faixaPreco = "Premium";
    }

    // Estrutura switch para rotulagem descritiva da categoria
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

    // Operador ternario para status rapido de orcamento
    const statusOrcamento = item.preco <= precoLimite ? "Dentro do orcamento" : "Acima do orcamento";

    // Armazenamento do item processado no novo array
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

// Calculo de media aritmetica
const mediaPreco = totalPreco / cardapio.length;

/*
==================================================================================================================================
TESTE DE MESA - 3 PRIMEIRAS ITERACOES DO LACO PRINCIPAL (Considerando entrada padrao com precoLimite = 15.00)
==================================================================================================================================
| Volta   | item.nome                  | item.preco | faixaPreco    | etiquetaCategoria               | statusOrcamento     | totalPreco | contadorDentroDoLimite | itemMaisCaro.nome         | itemMaisBarato.nome       |
|---------|----------------------------|------------|---------------|---------------------------------|---------------------|------------|------------------------|---------------------------|---------------------------|
| Volta 1 | Cafe Espresso Tradicional  | 9.00       | Economico     | Espresso Tradicional da Casa    | Dentro do orcamento | 9.00       | 1                      | Cafe Espresso Tradicional | Cafe Espresso Tradicional |
| Volta 2 | Cappuccino Italiano        | 14.50      | Intermediario | Cappuccino com Leite Vaporizado | Dentro do orcamento | 23.50      | 2                      | Cappuccino Italiano       | Cafe Espresso Tradicional |
| Volta 3 | Cafe Gelado Caramelo       | 18.00      | Premium       | Bebida Gelada Refrescante       | Acima do orcamento  | 41.50      | 2                      | Cafe Gelado Caramelo      | Cafe Espresso Tradicional |
==================================================================================================================================
*/

// 5. Exibicao formatada dos resultados no console
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

// 6. Menu Interativo (do...while + prompt)
let opcaoMenu = "";

do {
    const entradaMenu = prompt(
        "=== MENU INTERATIVO - CAFETERIA AROMA ===\n\n" +
        "1 - Listar itens analisados no console\n" +
        "2 - Exibir resumo estatistico no console\n" +
        "3 (ou 'sair') - Encerrar o sistema\n\n" +
        "Escolha uma opcao:"
    );

    const opcaoNormalizada = (entradaMenu ?? "3").trim().toLowerCase();

    switch (opcaoNormalizada) {
        case "1":
            console.log("\n--- LISTAGEM DE BEBIDAS ANALISADAS ---");
            console.table(itensProcessados);
            break;
        case "2":
            console.log("\n--- RESUMO ESTATISTICO DA CAFETERIA ---");
            console.log(`Preco maximo informado: R$ ${precoLimite.toFixed(2)}`);
            console.log(`Total acumulado: R$ ${totalPreco.toFixed(2)}`);
            console.log(`Preco medio: R$ ${mediaPreco.toFixed(2)}`);
            console.log(`Bebida de maior valor: ${itemMaisCaro.nome} (R$ ${itemMaisCaro.preco.toFixed(2)})`);
            console.log(`Bebida de menor valor: ${itemMaisBarato.nome} (R$ ${itemMaisBarato.preco.toFixed(2)})`);
            console.log(`Bebidas dentro do orcamento: ${contadorDentroDoLimite} de ${cardapio.length}`);
            break;
        case "3":
        case "sair":
            console.log("\n[Sistema Encerrado] Obrigado por utilizar o analisador da Cafeteria Aroma!");
            opcaoMenu = "sair";
            break;
        default:
            console.warn("\n[Aviso] Opcao invalida. Por favor, escolha 1, 2, 3 ou digite 'sair'.");
            break;
    }

    if (opcaoNormalizada === "3" || opcaoNormalizada === "sair") {
        opcaoMenu = "sair";
    }
} while (opcaoMenu !== "sair");
