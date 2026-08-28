# -*- coding: utf-8 -*-
"""Escreve js/dados.js e dados/warriors_2021_2026_jogos.csv no projeto."""
import json, os, sys, csv
sys.stdout.reconfigure(encoding="utf-8")

DEST = os.path.join(os.path.expanduser("~"), "OneDrive", "Área de Trabalho",
                    "TODOS OS PROJETOS", "warriors")
base = json.load(open("base.json", encoding="utf-8"))
games = json.load(open("games.json", encoding="utf-8"))
D, POS = base["D"], base["POS"]
ANOS = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"]

META = {
 "2021-22": {"cor": "#FFC72C", "ato": "O quarto anel",
             "seed": "3º no Oeste", "fim": "Campeão da NBA",
             "linha": "Título sobre o Boston por 4-2, com Curry eleito MVP das Finais."},
 "2022-23": {"cor": "#5CD6A9", "ato": "Refém do Chase Center",
             "seed": "6º no Oeste", "fim": "Semifinal do Oeste",
             "linha": "80,5% de aproveitamento em casa e 26,8% fora — a maior disparidade do ciclo."},
 "2023-24": {"cor": "#4FC3F7", "ato": "O fim dos Splash Brothers",
             "seed": "10º no Oeste", "fim": "Eliminado no play-in",
             "linha": "Última temporada de Klay Thompson; queda no primeiro jogo do play-in."},
 "2024-25": {"cor": "#C88BFA", "ato": "O repique com Butler",
             "seed": "7º no Oeste", "fim": "Semifinal do Oeste",
             "linha": "A troca por Jimmy Butler em fevereiro recolocou o time entre os oito do Oeste."},
 "2025-26": {"cor": "#FF7A7A", "ato": "A queda",
             "seed": "10º no Oeste", "fim": "Eliminado no play-in",
             "linha": "Butler rompeu o LCA e Curry perdeu 39 jogos: pior campanha em 15 anos."},
 "todas":   {"cor": "#FFC72C", "ato": "Cinco temporadas",
             "seed": "410 jogos", "fim": "1 título · 3 play-ins",
             "linha": "Do quarto título em oito anos à primeira campanha negativa desde 2020."},
}

SUM = {
 "2021-22": [
   ["Quarto título em oito anos",
    "16-6 na pós-temporada: Denver 4-1, Memphis 4-2, Dallas 4-1 e Boston 4-2 nas Finais."],
   ["Curry, MVP das Finais",
    "o primeiro da carreira, aos 34 anos. Em 14 de dezembro ultrapassou Ray Allen e virou o maior cestinha de três pontos da história."],
   ["A volta de Klay",
    "estreou em 9 de janeiro após duas temporadas inteiras fora (LCA e tendão de Aquiles) e fechou o ano com 20,4 pontos em 32 jogos."],
   ["A melhor defesa do ciclo",
    "105,5 pontos sofridos por jogo, quase 10 a menos que na temporada seguinte."],
 ],
 "2022-23": [
   ["Invencível em casa, perdido fora",
    "33-8 no Chase Center contra 11-30 como visitante — o pior desempenho fora de casa de um campeão defensor em memória recente."],
   ["O soco no treino",
    "Draymond Green acertou Jordan Poole na pré-temporada; o vídeo vazou em 7 de outubro. Green foi multado, sem suspensão."],
   ["Curry no auge estatístico",
    "29,4 pontos por jogo, a melhor média do ciclo, mas em apenas 56 partidas."],
   ["Fim precoce",
    "venceu Sacramento por 4-3 e caiu para o Lakers (7º cabeça de chave) por 2-4, primeira queda em semifinal desde 2013."],
 ],
 "2023-24": [
   ["Sem playoffs",
    "10º lugar no Oeste e derrota por 118-94 em Sacramento no primeiro jogo do play-in."],
   ["A última dança dos Splash Brothers",
    "Klay Thompson, com 17,9 pontos por jogo, deixou o clube na agente livre rumo a Dallas."],
   ["Draymond suspenso",
    "por tempo indeterminado após acertar Jusuf Nurkić em 12 de dezembro; perdeu 16 jogos no total."],
   ["Luto no elenco",
    "morte do auxiliar Dejan Milojević em janeiro de 2024, de ataque cardíaco, com jogos adiados."],
 ],
 "2024-25": [
   ["A aposta em Jimmy Butler",
    "chegou em 5 de fevereiro numa troca de cinco times; saíram Andrew Wiggins, Kyle Anderson e escolhas de draft."],
   ["Play-in vencido",
    "121-116 sobre o Memphis em casa garantiu o 7º lugar e a vaga direta nos playoffs."],
   ["Sete jogos com Houston",
    "abriu 3-1, levou à decisão e fechou a série no Jogo 7, fora de casa, por 103-89."],
   ["A lesão que encerrou o ano",
    "Curry se machucou no Jogo 1 contra Minnesota e a série terminou em 1-4."],
 ],
 "2025-26": [
   ["Primeira campanha negativa desde 2020",
    "37-45, e a primeira em temporada completa desde 2011."],
   ["Butler fora em janeiro",
    "rompeu o ligamento cruzado em 19 de janeiro de 2026, contra o Miami, e não voltou mais."],
   ["Curry em 43 dos 82 jogos",
    "incluindo 27 partidas seguidas fora por síndrome patelofemoral, além de problemas no quadríceps e nos tornozelos."],
   ["Podziemski assumiu o time",
    "único a jogar as 82 partidas, com 13,8 pontos, 5,1 rebotes e 3,7 assistências."],
   ["Kuminga trocado por Porziņģis",
    "em fevereiro de 2026, com Buddy Hield, para Atlanta — o último ativo jovem de alto teto deixou o elenco."],
 ],
 "todas": [
   ["Um título e três play-ins",
    "campeão em 2022, semifinalista em 2023 e 2025, fora dos playoffs em 2024 e 2026."],
   ["228-182 na temporada regular",
    "55,6% de aproveitamento em 410 jogos, com saldo de +1.038 pontos."],
   ["Curry é o ciclo",
    "8.091 pontos em 307 jogos — mais que o dobro do segundo colocado. Nas duas temporadas em que perdeu tempo relevante, o time despencou."],
   ["O elenco envelheceu sem reposição",
    "saíram Klay, Poole, Wiggins e Kuminga; entraram Chris Paul, Butler, Horford e Porziņģis."],
   ["A casa deixou de ser fortaleza",
    "de 75,6% e 80,5% de aproveitamento em casa (2022 e 2023) para 53,7% em 2026."],
 ],
}

# nota de rodape por temporada
NOTA = {
 "2021-22": "Temporada regular de 82 jogos + 22 de playoffs.",
 "2022-23": "Temporada regular de 82 jogos + 13 de playoffs.",
 "2023-24": "Temporada regular de 82 jogos + 1 de play-in.",
 "2024-25": "Temporada regular de 82 jogos + 1 de play-in + 12 de playoffs.",
 "2025-26": "Temporada regular de 82 jogos + 2 de play-in.",
 "todas":   "410 jogos de temporada regular e 51 de pós-temporada.",
}

cab = ("/* Painel Golden State Warriors — dados.\n"
       "   D    : 410 jogos de temporada regular agregados (fonte: game logs da Wikipedia).\n"
       "   POS  : pós-temporada apurada série a série a partir dos mesmos logs.\n"
       "   D[x].jog : estatísticas individuais por temporada.\n"
       "   META, SUM, NOTA: rótulos e leitura escritos à mão. */\n\n")

def js(nome, obj, indent=1):
    return "const " + nome + " = " + json.dumps(obj, ensure_ascii=False, indent=indent) + ";\n\n"

os.makedirs(os.path.join(DEST, "js"), exist_ok=True)
os.makedirs(os.path.join(DEST, "css"), exist_ok=True)
os.makedirs(os.path.join(DEST, "dados"), exist_ok=True)

out = cab
out += js("ANOS", ANOS, None)
out += js("META", META)
out += js("SUM", SUM)
out += js("NOTA", NOTA)
out += js("POS", POS)
out += js("D", D)
with open(os.path.join(DEST, "js", "dados.js"), "w", encoding="utf-8") as f:
    f.write(out)

# ---------------- csv dos jogos ----------------
linhas = []
for a in ANOS:
    for g in games[a]:
        linhas.append({
            "temporada": a,
            "fase": {"rs": "temporada regular", "playin": "play-in", "po": "playoffs"}[g["tipo"]],
            "jogo": g["n"], "data": g["data"], "adversario": g["adv"],
            "local": "casa" if g["casa"] else "fora",
            "pontos_pro": g["pf"], "pontos_contra": g["pa"],
            "prorrogacao": "sim" if g["ot"] else "nao",
            "resultado": "vitoria" if g["res"] == "V" else "derrota",
            "cestinha": g["cest"], "pontos_cestinha": g["cestp"] if g["cestp"] else "",
        })
csvp = os.path.join(DEST, "dados", "warriors_2021_2026_jogos.csv")
with open(csvp, "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(linhas[0].keys()))
    w.writeheader()
    w.writerows(linhas)

print("js/dados.js  ->", os.path.getsize(os.path.join(DEST, "js", "dados.js")), "bytes")
print("dados/warriors_2021_2026_jogos.csv ->", len(linhas), "linhas")
