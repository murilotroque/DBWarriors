# -*- coding: utf-8 -*-
"""Recorta a foto do Chase Center para o formato vertical do painel."""
import os, sys
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8")

DESK = os.path.join(os.path.expanduser("~"), "OneDrive", "Área de Trabalho")
SRC = os.path.join(DESK, "chasecenter101719tj-13_1200xx4848-4848-1208-0.jpg")
DEST = os.path.join(DESK, "TODOS OS PROJETOS", "warriors", "img")

im = Image.open(SRC).convert("RGB")
w, h = im.size
print("original:", im.size)

# o slot do painel tem 126x248 -> recorte retrato de proporção 0,508
prop = 126 / 248
lw = int(h * prop)                  # largura do recorte usando a altura toda
cx = int(w * 0.42)                  # centro da quadra fica um pouco à esquerda
x0 = max(0, min(w - lw, cx - lw // 2))
im = im.crop((x0, 0, x0 + lw, h))
print("recortada:", im.size, "a partir de x =", x0)

# 2x do tamanho de exibição, para telas densas
im = im.resize((252, 496), Image.LANCZOS)
saida = os.path.join(DEST, "chase.jpg")
im.save(saida, quality=86, optimize=True, progressive=True)
print("salva:", saida, im.size, os.path.getsize(saida), "bytes")
