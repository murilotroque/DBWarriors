# -*- coding: utf-8 -*-
"""Recorta a logo dos Warriors, remove o fundo branco e gera img/logo.png."""
import os, sys
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8")

DESK = os.path.join(os.path.expanduser("~"), "OneDrive", "Área de Trabalho")
SRC = os.path.join(DESK, "Golden-State-Warriors-logo.png")
DEST = os.path.join(DESK, "TODOS OS PROJETOS", "warriors", "img")
os.makedirs(DEST, exist_ok=True)

im = Image.open(SRC).convert("RGBA")
print("original:", im.size)
px = im.load()
w, h = im.size

# 1) recorta pela caixa do conteúdo não-branco
minx, miny, maxx, maxy = w, h, 0, 0
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a > 8 and not (r > 238 and g > 238 and b > 238):
            if x < minx: minx = x
            if x > maxx: maxx = x
            if y < miny: miny = y
            if y > maxy: maxy = y
pad = 6
caixa = (max(0, minx - pad), max(0, miny - pad), min(w, maxx + pad + 1), min(h, maxy + pad + 1))
im = im.crop(caixa)
print("recortada:", im.size)

# 2) branco -> transparente, preservando a suavização das bordas
im = im.convert("RGBA")
dados = []
for r, g, b, a in im.getdata():
    if a == 0:
        dados.append((r, g, b, 0)); continue
    mn = min(r, g, b)
    # quanto mais claro e menos saturado, mais transparente
    if mn > 245 and max(r, g, b) - mn < 12:
        dados.append((r, g, b, 0))
    elif mn > 200 and max(r, g, b) - mn < 30:
        dados.append((r, g, b, int(a * (245 - mn) / 45)))
    else:
        dados.append((r, g, b, a))
im.putdata(dados)

# 3) reduz para uso no painel
alvo = 600
im = im.resize((alvo, round(im.height * alvo / im.width)), Image.LANCZOS)
saida = os.path.join(DEST, "logo.png")
im.save(saida, optimize=True)
print("salva:", saida, im.size, os.path.getsize(saida), "bytes")

# 4) versão só do escudo (círculo central), para o cabeçalho e a marca d'água
#    o escudo ocupa a faixa central da arte; recorta pelo quadrado central
cw, ch = im.size
lado = int(ch * 0.80)
cx, cy = cw // 2, ch // 2
escudo = im.crop((cx - lado // 2, cy - lado // 2, cx + lado // 2, cy + lado // 2))
escudo = escudo.resize((300, 300), Image.LANCZOS)
saida2 = os.path.join(DEST, "escudo.png")
escudo.save(saida2, optimize=True)
print("salva:", saida2, escudo.size, os.path.getsize(saida2), "bytes")
