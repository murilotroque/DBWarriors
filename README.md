# 🔵🟡 Dashboard Golden State Warriors — Ciclo 2021-22 a 2025-26

Dashboard analítico interativo do Golden State Warriors cobrindo cinco temporadas completas: do quarto título em oito anos, em 2022, até a primeira campanha negativa em quinze anos, em 2026.

![HTML](https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

---

## Sobre o Projeto

Projeto pessoal feito por hobby, no mesmo espírito do meu [dashboard do Santos FC](https://github.com/mucamuca/DBSantos) — desta vez aplicado ao basquete. A ideia foi reunir **461 jogos** em cinco temporadas (410 de temporada regular e 51 de pós-temporada) e transformar os dados brutos numa narrativa visual completa sobre o ciclo recente do Golden State Warriors: do quarto título em oito anos, em 2022, até a primeira campanha negativa em quinze anos, em 2026.

O painel tem dimensão fixa de 1600×900px e se adapta a qualquer tela via escala proporcional. Uma página só, sem frameworks e sem bibliotecas externas além das fontes do Google — todos os gráficos são SVG gerados à mão.

## Funcionalidades

- **Filtros por temporada** — abas para 2021-22, 2022-23, 2023-24, 2024-25, 2025-26 e "Todas" (ciclo completo)
- **8 KPI Cards** — jogos, vitórias, derrotas, pontos marcados e sofridos por jogo, saldo, jogos com 120+ pontos e aproveitamento
- **Pós-temporada** — playoffs e play-in série a série, com o desfecho de cada temporada
- **Evolução do aproveitamento** — gráfico de linha jogo a jogo, com as cinco temporadas sobrepostas e tooltip de comparação
- **Campanha em casa** — desempenho detalhado no Chase Center
- **Casa × Fora** — aproveitamento, pontos feitos, sofridos e saldo em cada condição
- **Mês a mês** — vitórias, derrotas e saldo por jogo em cada mês da temporada
- **As cinco temporadas** — comparativo de aproveitamento no recorte do ciclo
- **Carrascos** — adversários que mais venceram os Warriors no período
- **Maiores margens** — as maiores vitórias e derrotas
- **Cestinhas** — os seis maiores pontuadores com foto oficial, e quantas partidas cada um liderou a pontuação do time
- **Modal de estatísticas** — tabela completa de todos os jogadores usados, navegável por temporada
- **Modal de elenco** — plantel atual em cards com foto, filtrável por posição, e um botão que alterna para a **ficha técnica**: número, posição, idade, altura, peso, universidade, experiência e salário

## Números do Ciclo

| | 21-22 | 22-23 | 23-24 | 24-25 | 25-26 | Ciclo |
|---|---|---|---|---|---|---|
| **Campanha** | 53-29 | 44-38 | 46-36 | 48-34 | 37-45 | 228-182 |
| **Aproveitamento** | 64,6% | 53,7% | 56,1% | 58,5% | 45,1% | 55,6% |
| **Posição no Oeste** | 3º | 6º | 10º | 7º | 10º | — |
| **Pontos por jogo** | 111,0 | 118,9 | 117,8 | 113,8 | 114,5 | 115,2 |
| **Sofridos por jogo** | 105,5 | 117,1 | 115,2 | 110,5 | 115,1 | 112,7 |
| **Em casa** | 31-10 | 33-8 | 21-20 | 24-17 | 22-19 | 131-74 |
| **Fora** | 22-19 | 11-30 | 25-16 | 24-17 | 15-26 | 97-108 |
| **Desfecho** | 🏆 Campeão | Semifinal | Play-in | Semifinal | Play-in | 1 título |

**Cestinha do ciclo:** Stephen Curry — 8.091 pontos em 307 jogos (26,4 por jogo)

## Como Rodar

Precisa de um servidor local porque carrega CSS e JS por caminho relativo.

```bash
python -m http.server 8788
```

Abrir no navegador: `http://localhost:8788`

## Estrutura do Projeto

```
warriors/
├── index.html                          # Página principal
├── css/
│   └── painel.css                      # Estilos do dashboard
├── js/
│   ├── dados.js                        # Dados agregados, metadados e textos
│   ├── elenco.js                       # Elenco atual e mapa de fotos
│   └── painel.js                       # Renderização, filtros, gráficos e modais
├── img/
│   ├── logo.png                        # Escudo oficial, fundo removido
│   ├── chase.jpg                       # Chase Center, recortado para o painel
│   └── jogadores/                      # 57 headshots oficiais (<id da ESPN>.png)
├── dados/
│   ├── warriors_2021_2026_jogos.csv    # Base bruta: 461 jogos
│   └── espn_elenco.json                # Elenco cru raspado da ESPN
└── scripts/                            # Pipeline de coleta (Python)
    ├── parse_games.py                  # Game logs do wikitext -> games.json
    ├── parse_stats.py                  # Tabelas de estatística -> player_stats.json
    ├── parse_2223.py                   # Complemento de 2022-23
    ├── build_base.py                   # Agregação -> base.json
    ├── gera_dados_js.py                # Escreve js/dados.js e o CSV
    ├── baixa_fotos.py                  # Headshots da ESPN -> img/jogadores/
    ├── gera_elenco_js.py               # Escreve js/elenco.js
    ├── prepara_logo.py                 # Recorta o escudo e tira o fundo branco
    └── prepara_chase.py                # Recorta a foto do Chase Center
```

Os scripts esperam o wikitext bruto em `wiki/gsw_<temporada>.txt`, baixado com
`curl -sL "https://en.wikipedia.org/wiki/2025%E2%80%9326_Golden_State_Warriors_season?action=raw"`.

## Identidade Visual

O painel usa apenas as cores oficiais do clube:

| | Hex | Uso |
|---|---|---|
| 🟡 **Ouro** | `#FFC72C` | Acento do painel, vitórias, mandante e valores positivos |
| 🔵 **Azul real** | `#1D428A` | Cabeçalho, fundo do Chase Center e a base institucional |
| 🔹 **Azul claro** | `#5B8AD9` | Derrotas, visitante e valores negativos |
| ⚪ **Branco** | `#F2F6FB` | Texto e neutros |

Na visão de uma temporada só, tudo é ouro sobre o escuro. Na visão **Todas**, as cinco temporadas precisam ser distinguidas ao mesmo tempo, então cada uma recebe um tom de uma rampa ordinal que vai do ouro (2021-22, o título) ao azul (2025-26, a queda), passando pelo branco — sem sair da paleta.

As barras de rolagem também seguem o tema: trilho quase invisível e polegar em ouro translúcido, que firma no hover — em vez do cinza padrão do navegador.

O escudo em `img/logo.png` é a arte oficial com o fundo branco removido, usado no cabeçalho e como marca d'água. A foto do interior do Chase Center (`img/chase.jpg`) ilustra o painel de campanha em casa, recortada no formato do slot e esmaecida por um gradiente para não competir com os números.

## Fontes de Dados

- **Jogos** — game logs das páginas de temporada do Golden State Warriors na [Wikipedia](https://en.wikipedia.org), extraídos do wikitext bruto (placar, mando, prorrogação e cestinha de cada partida)
- **Estatísticas individuais** — tabelas de *Player statistics* das mesmas páginas; a temporada 2022-23 não tem essa tabela na Wikipedia e foi complementada pelo [landofbasketball](https://www.landofbasketball.com)
- **Elenco atual e fotos** — [ESPN Brasil](https://www.espn.com.br/nba/time/elenco/_/nome/gs/golden-state-warriors). Os dados saem do JSON que a própria página embute (`__espnfitt__`); as fotos são os headshots oficiais, resolvidos por ID e baixados uma vez para `img/jogadores/`, de modo que o painel não depende de rede para renderizar

Todos os agregados do painel (campanhas, splits casa/fora, curvas, sequências, carrascos, maiores margens) são calculados a partir do CSV de 461 jogos, não copiados de terceiros. As campanhas conferem com os registros oficiais em todas as cinco temporadas.

## O que o painel não cobre

Rating ofensivo e defensivo, ritmo, posses e estatísticas de arremesso por região da quadra — exigem dados de play-by-play, que não estão nas fontes usadas.

## Tecnologias

- **Python** — coleta, parsing do wikitext, agregação e geração da base
- **HTML / CSS / JS** — construção do dashboard, sem frameworks e sem bibliotecas de gráficos (todos os gráficos são SVG gerados à mão)

## Licença

Projeto de uso pessoal e educacional. Painel analítico não oficial, sem vínculo com o Golden State Warriors, com a NBA ou com a ESPN. O escudo, a foto do Chase Center e os headshots dos jogadores pertencem aos seus respectivos detentores de direitos.
