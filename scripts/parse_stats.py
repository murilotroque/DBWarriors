import re, json, io, sys
sys.stdout.reconfigure(encoding="utf-8")

SEASONS = ["2021-22","2023-24","2024-25","2025-26"]

def clean_cell(c):
    c = re.sub(r'style="[^"]*"\s*\|', '', c)
    c = re.sub(r"\{\{sort\|[^|}]*\|([^}]*)\}\}", r"\1", c)
    c = c.replace("'''","").strip()
    return c

def parse_name(line):
    m = re.search(r"\{\{sortname\|([^|}]+)\|([^|}]+)", line)
    if m:
        return (m.group(1).strip()+" "+m.group(2).strip())
    m = re.search(r"\|\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", line)
    if m:
        return (m.group(2) or m.group(1)).strip()
    t = re.sub(r'\|\s*style="[^"]*"\s*\|', '', line).strip("| ")
    t = re.sub(r"<sup>.*?</sup>","",t)
    return t.strip()

out = {}
for s in SEASONS:
    txt = open(f"wiki/gsw_{s}.txt", encoding="utf-8").read()
    # isolate regular season player stats table
    i = txt.find("==Player statistics==")
    if i < 0: i = txt.find("== Player statistics ==")
    seg = txt[i:]
    j = seg.lower().find("regular season")
    seg = seg[j:]
    k = seg.find("\n|}")
    seg = seg[:k]
    rows = []
    lines = seg.split("\n")
    n = 0
    while n < len(lines):
        L = lines[n]
        if "sortname" in L or (L.startswith("|") and "[[" in L and "roster statistics" not in L):
            name = parse_name(L)
            traded = "<sup>†</sup>" in L or "†" in L
            # next line holds the numbers
            if n+1 < len(lines):
                data = lines[n+1]
                cells = [clean_cell(c) for c in data.strip().strip("|").split("||")]
                if len(cells) >= 11:
                    rows.append({"nome":name,"traded":traded,"cells":cells[:11]})
                    n += 2
                    continue
        n += 1
    out[s] = rows
    print(f"--- {s}: {len(rows)} jogadores")
    for r in rows:
        print("   ", r["nome"], "†" if r["traded"] else "", r["cells"])
json.dump(out, open("player_stats.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
