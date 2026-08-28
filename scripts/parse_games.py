import re, json, sys
sys.stdout.reconfigure(encoding="utf-8")
SEASONS = ["2021-22","2022-23","2023-24","2024-25","2025-26"]

def secoes(txt):
    out=[]
    pats=[("rs", r"^={2,4}\s*Regular season\s*={2,4}\s*$"),
          ("playin", r"^={2,4}\s*Play-?in\s*={2,4}\s*$"),
          ("po", r"^={2,4}\s*Playoffs\s*={2,4}\s*$")]
    marks=[]
    for tipo,p in pats:
        for m in re.finditer(p, txt, re.M|re.I):
            marks.append((m.start(), m.end(), tipo))
    marks.sort()
    for i,(ini,fim,tipo) in enumerate(marks):
        nxt = re.search(r"^={2,4}\s*\S", txt[fim:], re.M)
        end = fim + (nxt.start() if nxt else len(txt)-fim)
        corpo = txt[fim:end]
        if "NBA game log start" in corpo:
            out.append((tipo, corpo))
    return out

def limpa_link(s):
    s = re.sub(r"\[\[[^\]|]*\|([^\]]*)\]\]", r"\1", s)
    s = re.sub(r"\[\[([^\]]*)\]\]", r"\1", s)
    return s.strip()

def parse_bloco(body, tipo):
    jogos=[]
    for chunk in re.split(r"\n\|-", body)[1:]:
        cab = chunk.split("\n",1)[0].lower()
        if   re.search(r"game-won|#cfc|#ccffcc", cab): res="V"
        elif re.search(r"game-lost|#fcc|#ffcccc", cab): res="D"
        else: continue
        campos=[l[1:].strip() for l in chunk.split("\n") if l.startswith("|") and not l.startswith("|-")]
        if len(campos)<4: continue
        m = re.search(r"pf=(\d+)\s*\|\s*pa=(\d+)", campos[3])
        if not m: continue
        pf, pa = int(m.group(1)), int(m.group(2))
        ot = bool(re.search(r"\|ot=", campos[3]))
        fora = campos[2].strip().startswith("@")
        adv = limpa_link(campos[2].lstrip("@ ").strip())
        adv = re.sub(r"^\d{4}[–-]\d{2}\s+", "", adv)
        cest, cestp = "", None
        if len(campos)>4:
            mm = re.search(r"^(.*?)\s*\((\d+)\)", limpa_link(campos[4]))
            if mm: cest, cestp = mm.group(1).strip(), int(mm.group(2))
        jogos.append({"n":int(re.sub(r"\D","",campos[0]) or 0),"data":limpa_link(campos[1]),"adv":adv,
                      "casa":not fora,"pf":pf,"pa":pa,"ot":ot,"res":res,"tipo":tipo,
                      "cest":cest,"cestp":cestp})
    return jogos

DB={}
for s in SEASONS:
    txt=open(f"wiki/gsw_{s}.txt",encoding="utf-8").read()
    todos=[]
    for tipo, body in secoes(txt):
        todos += parse_bloco(body,tipo)
    DB[s]=todos
    for t,rot in [("rs","Temp. regular"),("playin","Play-in"),("po","Playoffs")]:
        g=[x for x in todos if x["tipo"]==t]
        if not g: continue
        v=sum(1 for x in g if x["res"]=="V")
        c=[x for x in g if x["casa"]]; f=[x for x in g if not x["casa"]]
        print(f"{s} {rot:14} {len(g):3} jogos  {v}-{len(g)-v}   casa {sum(1 for x in c if x['res']=='V')}-{sum(1 for x in c if x['res']=='D')}  fora {sum(1 for x in f if x['res']=='V')}-{sum(1 for x in f if x['res']=='D')}")
json.dump(DB,open("games.json","w",encoding="utf-8"),ensure_ascii=False)
