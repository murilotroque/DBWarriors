# -*- coding: utf-8 -*-
"""Baixa os headshots da ESPN, recorta em quadrado e grava em img/jogadores/."""
import json, os, sys, urllib.request
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8")

PROJ = os.path.join(os.path.expanduser("~"), "OneDrive", "Área de Trabalho",
                    "TODOS OS PROJETOS", "warriors")
DEST = os.path.join(PROJ, "img", "jogadores")
os.makedirs(DEST, exist_ok=True)
TMP = "headshots_brutos"
os.makedirs(TMP, exist_ok=True)

dados = json.load(open("espn_elenco.json", encoding="utf-8"))

# nome usado na base do painel (Wikipedia) -> id da ESPN
FOTOS = {}
for j in dados["elenco"]:
    FOTOS[j["nome"]] = j["id"]
FOTOS.update(dados["idsHistoricos"])
# a base do painel escreve alguns nomes de forma diferente da ESPN
FOTOS["Kristaps Porziņģis"] = "3102531"
FOTOS["Gui Santos"] = "4997536"
FOTOS["Jimmy Butler III"] = "6430"
FOTOS["Gary Payton II"] = "3134903"

URL = "https://a.espncdn.com/i/headshots/nba/players/full/{}.png"
req = lambda u: urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})

ok, falhas = [], []
for pid in sorted(set(FOTOS.values())):
    bruto = os.path.join(TMP, pid + ".png")
    if not os.path.exists(bruto):
        try:
            with urllib.request.urlopen(req(URL.format(pid)), timeout=30) as r:
                open(bruto, "wb").write(r.read())
        except Exception as e:
            falhas.append((pid, str(e)))
            continue
    try:
        im = Image.open(bruto).convert("RGBA")
        w, h = im.size
        # recorte quadrado centrado na cabeça: usa a altura toda, centrado na largura
        lado = min(w, h)
        x0 = (w - lado) // 2
        im = im.crop((x0, 0, x0 + lado, lado))
        im = im.resize((200, 200), Image.LANCZOS)
        saida = os.path.join(DEST, pid + ".png")
        im.save(saida, optimize=True)
        ok.append((pid, os.path.getsize(saida)))
    except Exception as e:
        falhas.append((pid, "processar: " + str(e)))

print("baixadas e recortadas:", len(ok))
print("peso total: {:.0f} KB".format(sum(t for _, t in ok) / 1024))
if falhas:
    print("FALHAS:", falhas)

json.dump(FOTOS, open("fotos_map.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("mapa nome->id:", len(FOTOS), "entradas")
