# Cafeteria Aroma

Página HTML de uma cafeteria com galeria de bebidas e formulário acessível para reserva de mesa.

## Recursos

- Galeria com fotos de cafés
- Estrutura semântica com `header`, `main`, `section` e `footer`
- Formulário de reserva com campos obrigatórios e validações
- Seleção de bebida e preferência de atendimento
- Labels associados corretamente aos campos do formulário

## Como visualizar

Abra o arquivo `index.html` em qualquer navegador.

## Tecnologias

- HTML5
- CSS3

## Avaliação

- 02/09 - avaliação em pares -

### Aula 1 — Git e GitHub

**1. Repositório público e documentado**
- **Status:** Atende Plenamente
- **Comentário:** O repositório está público e o `README.md` explica claramente do que se trata o projeto: título, uma breve descrição, seção e tecnologias. Cumpre bem o objetivo de descrever o projeto a quem chega ao repositório.

**2. Histórico de commits**
- **Status:** Atende Plenamente
- **Comentário:** Os 4 commits do histórico têm mensagens descritivas e específicas: "Inicializa projeto da cafeteria", "Adiciona semântica e formulário de reserva", "Atualiza estrutura da pagina" e "Adiciona README do projeto". Dá para entender a evolução do projeto só lendo o log.

**3. Uso de branch e Pull Request**
- **Status:** Atende Plenamente
- **Comentário:** Encontrei um Pull Request, com status Merged, feito da branch `feature/html-semantica-formulario` para a `main`. Isso mostra que o fluxo de branch + PR foi feito e fechado corretamente.

**4. .gitignore presente**
- **Status:** Atende Plenamente
- **Comentário:** Encontrado um arquivo `.gitignore` no repositório, com o básico colocado (`node_modules`, `.env` ou arquivos de build que pudessem vazar), assim como o critério pede explicitamente.

### Aula 2 — Conceitos Fundamentais da Web

**5. HTML mínimo válido**
- **Status:** Atende Plenamente
- **Comentário:** `index.html`, linhas 1–8: `<!DOCTYPE html>`, `<html lang="pt-BR">`, `<head>` com `<meta charset="UTF-8">`, `<meta name="viewport">` e `<title>Cafeteria Aroma</title>`, seguido de `<body>` fechado corretamente.

**6. Página abre sem erros**
- **Status:** Atende Plenamente
- **Comentário:** Os três `<img>` correspondem exatamente às imagens presentes no repositório, nenhum link quebrado.

### Aula 3 — HTML5 — Semântica e Formulários

**7. Elementos semânticos**
- **Status:** Atende Plenamente
- **Comentário:** O documento usa `<header>` (linha ~9), `<main>` envolvendo o conteúdo, duas `<section>` e `<footer>` no final. Não usa `<nav>` nem `<article>`, mas isso faz sentido com o escopo do projeto.

**8. Labels associados aos campos**
- **Status:** Atende Plenamente
- **Comentário:** Todos os campos de texto/data/número/select têm `<label>` casando com o `id` do `<input>`/`<select>` correspondente. Nos radios, a associação é feita de forma correta.

**9. Validação nativa usada**
- **Status:** Atende Plenamente
- **Comentário:** Os tipos foram escolhidos corretamente para e-mail, telefone, data/horário e quantidade de pessoas. O atributo `required` está presente nos campos essenciais e ausente apenas no telefone, já que nem toda reserva depende de contato obrigatório.

### Cálculo da Nota Final

| # | Critério | Status | Pontos |
|---|----------|--------|--------|
| 1 | Repositório público e documentado | Atende Plenamente | 2 |
| 2 | Histórico de commits | Atende Plenamente | 2 |
| 3 | Uso de branch e Pull Request | Atende Plenamente | 2 |
| 4 | .gitignore presente | Atende Plenamente | 2 |
| 5 | HTML mínimo válido | Atende Plenamente | 2 |
| 6 | Página abre sem erros | Atende Plenamente | 2 |
| 7 | Elementos semânticos | Atende Plenamente | 2 |
| 8 | Labels associados aos campos | Atende Plenamente | 2 |
| 9 | Validação nativa usada | Atende Plenamente | 2 |

**Nota Final: 10,0**
