# -*- coding: utf-8 -*-
"""Escreve js/elenco.js com o elenco atual da ESPN e o mapa de fotos."""
import json, os, sys
sys.stdout.reconfigure(encoding="utf-8")

PROJ = os.path.join(os.path.expanduser("~"), "OneDrive", "Área de Trabalho",
                    "TODOS OS PROJETOS", "warriors")
dados = json.load(open("espn_elenco.json", encoding="utf-8"))
fotos = json.load(open("fotos_map.json", encoding="utf-8"))

# só mantém no mapa os nomes cuja foto foi realmente gravada
tem = {f[:-4] for f in os.listdir(os.path.join(PROJ, "img", "jogadores")) if f.endswith(".png")}
fotos = {n: i for n, i in fotos.items() if i in tem}

elenco = dados["elenco"]
# ordena por posição (G, A, C) e depois por nome
ordem = {"G": 0, "A": 1, "C": 2}
elenco.sort(key=lambda j: (ordem.get(j["pos"], 9), j["nome"]))

cab = ("/* Painel Golden State Warriors — elenco.\n"
       "   ELENCO : plantel atual raspado de espn.com.br/nba/time/elenco (17 jogadores).\n"
       "   FOTOS  : nome do jogador -> id da ESPN; a imagem fica em img/jogadores/<id>.png.\n"
       "   Headshots oficiais da ESPN, recortados em quadrado. */\n\n")

def js(nome, obj, indent=1):
    return "const " + nome + " = " + json.dumps(obj, ensure_ascii=False, indent=indent) + ";\n\n"

out = cab
out += 'const TECNICO = "' + dados["tecnico"] + '";\n\n'
out += js("POS_ROTULO", {"G": "Armador", "A": "Ala", "C": "Pivô"}, None)
out += js("POS_PLURAL", {"G": "Armadores", "A": "Alas", "C": "Pivôs"}, None)
out += js("ELENCO", elenco)
out += js("FOTOS", dict(sorted(fotos.items())))

caminho = os.path.join(PROJ, "js", "elenco.js")
open(caminho, "w", encoding="utf-8").write(out)
print("js/elenco.js ->", os.path.getsize(caminho), "bytes")
print("elenco:", len(elenco), "jogadores |", "fotos:", len(fotos))
print("sem foto no elenco:", [j["nome"] for j in elenco if j["nome"] not in fotos])
