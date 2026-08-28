# -*- coding: utf-8 -*-
"""Agrega os dados brutos dos Warriors (jogos + estatisticas individuais) em base.json."""
import json, sys
from collections import Counter, defaultdict
sys.stdout.reconfigure(encoding="utf-8")

G   = json.load(open("games.json", encoding="utf-8"))
PS  = json.load(open("player_stats.json", encoding="utf-8"))
P23 = json.load(open("stats_2022-23.json", encoding="utf-8"))
ANOS = ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"]

MESES_PT = {"October": "Out", "November": "Nov", "December": "Dez", "January": "Jan",
            "February": "Fev", "March": "Mar", "April": "Abr"}
ORDEM_MES = ["October", "November", "December", "January", "February", "March", "April"]

# ---------------- estatisticas individuais ----------------
CAMPOS = ["g", "gs", "min", "fg", "tp", "ft", "reb", "ast", "stl", "blk", "pts"]

def num(x):
    x = (x or "").strip()
    if x in ("", "-", "–", "—"):
        return None
    try:
        return float(x)
    except ValueError:
        return None

JOG = {}
for a in ANOS:
    lista = []
    if a == "2022-23":
        for nome, d in P23.items():
            lista.append({"nome": nome, "g": int(float(d["g"])), "gs": None,
                          "min": num(d["min"]), "fg": num(d.get("fgp")), "tp": num(d.get("tpp")),
                          "ft": num(d.get("ftp")), "reb": num(d["trb"]), "ast": num(d["ast"]),
                          "stl": num(d["stl"]), "blk": num(d["blk"]), "pts": num(d["pts"]),
                          "tr": False})
    else:
        for r in PS[a]:
            c = r["cells"]
            d = {"nome": r["nome"], "tr": r["traded"]}
            for i, k in enumerate(CAMPOS):
                d[k] = num(c[i])
            d["g"] = int(d["g"])
            d["gs"] = int(d["gs"]) if d["gs"] is not None else None
            lista.append(d)
    lista.sort(key=lambda d: -(d["pts"] or 0))
    JOG[a] = lista

# cestinhas do ciclo: pontos totais estimados (jogos x media)
tot = defaultdict(lambda: {"g": 0, "pt": 0.0, "reb": 0.0, "ast": 0.0, "temps": 0})
for a in ANOS:
    for d in JOG[a]:
        t = tot[d["nome"]]
        t["g"] += d["g"]
        t["pt"] += d["g"] * (d["pts"] or 0)
        t["reb"] += d["g"] * (d["reb"] or 0)
        t["ast"] += d["g"] * (d["ast"] or 0)
        t["temps"] += 1

CICLO_JOG = []
for n, t in tot.items():
    if t["g"] < 40:
        continue
    CICLO_JOG.append({"nome": n, "g": t["g"], "gs": None, "min": None, "fg": None,
                      "tp": None, "ft": None,
                      "reb": round(t["reb"] / t["g"], 1), "ast": round(t["ast"] / t["g"], 1),
                      "stl": None, "blk": None, "pts": round(t["pt"] / t["g"], 1),
                      "total": int(round(t["pt"])), "temps": t["temps"], "tr": False})
CICLO_JOG.sort(key=lambda d: -d["total"])

# ---------------- agregacao dos jogos ----------------
def bloco(js):
    n = len(js)
    if not n:
        return {"j": 0, "v": 0, "d": 0, "ap": 0, "pf": 0, "pa": 0,
                "ppj": 0, "paj": 0, "sg": 0, "sgj": 0}
    v = sum(1 for x in js if x["res"] == "V")
    pf = sum(x["pf"] for x in js)
    pa = sum(x["pa"] for x in js)
    return {"j": n, "v": v, "d": n - v, "ap": round(v / n * 100, 1), "pf": pf, "pa": pa,
            "ppj": round(pf / n, 1), "paj": round(pa / n, 1),
            "sg": pf - pa, "sgj": round((pf - pa) / n, 1)}

def sequencias(js):
    mv = mc = cv = cc = 0
    for g in js:
        if g["res"] == "V":
            cv += 1; cc = 0
        else:
            cc += 1; cv = 0
        mv = max(mv, cv); mc = max(mc, cc)
    return mv, mc

def jogo_pub(g):
    return {"data": g["data"], "adv": g["adv"], "casa": g["casa"], "pf": g["pf"],
            "pa": g["pa"], "ot": g["ot"], "res": g["res"], "temp": g.get("temp", ""),
            "cest": g["cest"], "cestp": g["cestp"]}

def monta(rs, jogadores):
    casa = [g for g in rs if g["casa"]]
    fora = [g for g in rs if not g["casa"]]
    curva = []
    v = 0
    for i, g in enumerate(rs, 1):
        if g["res"] == "V":
            v += 1
        curva.append(round(v / i * 100, 1))
    meses = []
    for m in ORDEM_MES:
        gs = [g for g in rs if g["data"].split()[0] == m]
        if not gs:
            continue
        b = bloco(gs)
        meses.append({"m": MESES_PT[m], "j": b["j"], "v": b["v"], "d": b["d"],
                      "ap": b["ap"], "ppj": b["ppj"], "paj": b["paj"]})
    mv, mc = sequencias(rs)
    lid = Counter(g["cest"] for g in rs if g["cest"] and "," not in g["cest"])
    return {
        "geral": bloco(rs), "casa": bloco(casa), "fora": bloco(fora),
        "curva": curva, "meses": meses,
        "melhores": [jogo_pub(g) for g in sorted([x for x in rs if x["res"] == "V"],
                     key=lambda x: -(x["pf"] - x["pa"]))[:4]],
        "piores": [jogo_pub(g) for g in sorted([x for x in rs if x["res"] == "D"],
                   key=lambda x: (x["pf"] - x["pa"]))[:4]],
        "carrascos": [{"nome": n, "d": c, "j": sum(1 for g in rs if g["adv"] == n)}
                      for n, c in Counter(g["adv"] for g in rs
                                          if g["res"] == "D").most_common(6)],
        "lideres": [{"nome": n, "n": c} for n, c in lid.most_common(6)],
        "extras": {"ot": sum(1 for g in rs if g["ot"]),
                   "c120": sum(1 for g in rs if g["pf"] >= 120),
                   "s120": sum(1 for g in rs if g["pa"] >= 120),
                   "seqV": mv, "seqD": mc,
                   "maior": max(g["pf"] for g in rs),
                   "menor": min(g["pf"] for g in rs)},
        "jog": jogadores,
    }

for a in ANOS:
    for g in G[a]:
        g["temp"] = a

D = {a: monta([g for g in G[a] if g["tipo"] == "rs"], JOG[a]) for a in ANOS}
D["todas"] = monta([g for a in ANOS for g in G[a] if g["tipo"] == "rs"], CICLO_JOG)

# ---------------- pos-temporada ----------------
ROD = {
    "2021-22": ["Primeira rodada", "Semifinal do Oeste", "Final do Oeste", "Finais da NBA"],
    "2022-23": ["Primeira rodada", "Semifinal do Oeste"],
    "2024-25": ["Primeira rodada", "Semifinal do Oeste"],
}
POS = {}
for a in ANOS:
    itens = []
    for g in [x for x in G[a] if x["tipo"] == "playin"]:
        itens.append({"fase": "Play-in", "adv": g["adv"], "res": g["res"],
                      "pl": str(g["pf"]) + "–" + str(g["pa"]),
                      "casa": g["casa"], "serie": False})
    po = [x for x in G[a] if x["tipo"] == "po"]
    series = []
    atual = None
    for g in po:
        if atual is None or g["adv"] != atual["adv"]:
            atual = {"adv": g["adv"], "v": 0, "d": 0}
            series.append(atual)
        if g["res"] == "V":
            atual["v"] += 1
        else:
            atual["d"] += 1
    for i, s in enumerate(series):
        fases = ROD.get(a, [])
        itens.append({"fase": fases[i] if i < len(fases) else "Série " + str(i + 1),
                      "adv": s["adv"], "res": "V" if s["v"] > s["d"] else "D",
                      "pl": str(s["v"]) + "–" + str(s["d"]),
                      "casa": None, "serie": True})
    POS[a] = itens
POS["todas"] = []

json.dump({"D": D, "POS": POS}, open("base.json", "w", encoding="utf-8"), ensure_ascii=False)

print("Series apuradas:")
for a in ANOS:
    print("  " + a, [(i["fase"], i["adv"], i["res"], i["pl"]) for i in POS[a]])
print()
for a in ANOS + ["todas"]:
    g = D[a]["geral"]; e = D[a]["extras"]
    print("  {:8} {}-{}  {}%   {} x {}   seqV {} seqD {}  120+: {}".format(
        a, g["v"], g["d"], g["ap"], g["ppj"], g["paj"], e["seqV"], e["seqD"], e["c120"]))
print()
print("Cestinhas do ciclo (top 8 por pontos totais):")
for d in CICLO_JOG[:8]:
    print("  {:22} {:4} jogos  {:6} pts  media {}".format(d["nome"], d["g"], d["total"], d["pts"]))
