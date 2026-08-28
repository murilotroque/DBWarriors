import re, json, sys, html
sys.stdout.reconfigure(encoding="utf-8")
h=open('lob2223.html',encoding='utf-8',errors='replace').read()
t=html.unescape(re.sub(r'\|+','|',re.sub(r'<[^>]+>','|',h)))
cel=[c.strip() for c in t.split('|')]

def bloco(depois, ncols, campos_esperados):
    i=cel.index(depois)
    out={}
    j=i
    while j < len(cel):
        nome=cel[j]
        if nome and re.match(r"^[A-Z][A-Za-z.'\u00C0-\u017F\- ]+$", nome) and len(nome)>3:
            nums=[]
            k=j+1
            while k<len(cel) and len(nums)<ncols:
                c=cel[k]
                if c=='' : k+=1; continue
                if re.match(r'^-?\.?\d+(\.\d+)?$', c): nums.append(c); k+=1
                else: break
            if len(nums)==ncols:
                out[nome]=dict(zip(campos_esperados,nums)); j=k; continue
        j+=1
    return out

# tabela 1: G Min Pts ORb DRb TRb Ast Stl Blk TO PF
t1 = bloco('ORb', 11, ['g','min','pts','orb','drb','trb','ast','stl','blk','to','pf'])
# tabela 2: Pts FGM FGA FG% 3PM 3PA 3P% FTM FTA FT%
t2 = bloco('Scoring Details', 10, ['pts','fgm','fga','fgp','tpm','tpa','tpp','ftm','fta','ftp'])
merged={}
for n,d in t1.items():
    if n in t2: d.update({k:v for k,v in t2[n].items() if k!='pts'})
    merged[n]=d
print(len(merged),"jogadores")
for n,d in sorted(merged.items(), key=lambda x:-float(x[1]['pts'])):
    print(f"{n:22} G{d['g']:>3} {d['pts']:>5} pts  {d['trb']:>4} reb  {d['ast']:>4} ast  FG{d.get('fgp','?')} 3P{d.get('tpp','?')} FT{d.get('ftp','?')}  min {d['min']}")
json.dump(merged, open('stats_2022-23.json','w',encoding='utf-8'), ensure_ascii=False, indent=1)
