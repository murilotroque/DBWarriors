/* Painel Golden State Warriors — lógica de render.
   Depende de js/dados.js, que precisa vir antes no HTML. */

let VISTA = "2025-26";
const ehTodas = () => VISTA === "todas";
const OURO = "#FFC72C";
const corDe = v => META[v].cor;
/* na visão de uma temporada só, tudo usa o ouro oficial */
const corSerie = v => ehTodas() ? META[v].cor : OURO;

const $ = s => document.querySelector(s);
const el = (t,c) => { const n=document.createElement(t); if(c) n.className=c; return n; };
const nb = n => String(n).replace(".",",");
const pc = n => nb(Number(n).toFixed(1))+"%";
const um = n => nb(Number(n).toFixed(1));
const mil = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
const sinal = n => (n>0?"+":"")+nb(n);

const MES_LONGO = {Out:"outubro",Nov:"novembro",Dez:"dezembro",Jan:"janeiro",
                   Fev:"fevereiro",Mar:"março",Abr:"abril"};

function iniciais(nome){
  const p = nome.replace(/\b(III|II|Jr\.?|Sr\.?)\b/g,"").split(/\s+/).filter(Boolean);
  return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase();
}
/* foto oficial do jogador; cai nas iniciais quando não existe arquivo */
function fotoDe(nome){
  const id = (typeof FOTOS !== "undefined") ? FOTOS[nome] : null;
  return id ? ("img/jogadores/" + id + ".png") : null;
}
function avatar(nome, classe){
  const f = fotoDe(nome);
  return '<span class="' + classe + '">' + (f
    ? '<img src="' + f + '" alt="" decoding="async">'
    : '<b>' + esc(iniciais(nome)) + '</b>') + '</span>';
}
function dataPt(d){
  const M = {January:"jan",February:"fev",March:"mar",April:"abr",May:"mai",June:"jun",
             July:"jul",August:"ago",September:"set",October:"out",November:"nov",December:"dez"};
  const p = d.split(" ");
  return (p[1]||"")+"/"+(M[p[0]]||p[0]);
}
function barH(x,y,w,h,r){
  r = Math.max(0, Math.min(r, w, h/2));
  if(w<=0.5) return "";
  return "M"+x+","+y+" H"+(x+w-r)+" A"+r+","+r+" 0 0 1 "+(x+w)+","+(y+r)+
         " V"+(y+h-r)+" A"+r+","+r+" 0 0 1 "+(x+w-r)+","+(y+h)+" H"+x+" Z";
}
const SVG = (w,h,inner,label) =>
  '<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+esc(label||"")+'" preserveAspectRatio="xMidYMid meet">'+inner+'</svg>';

/* ---------------- ícones dos KPIs ---------------- */
const ICONES = {
 bola: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="currentColor" opacity=".22"/><circle cx="16" cy="16" r="11" fill="currentColor"/><g fill="none" stroke="#0a0c0f" stroke-width="1.5"><path d="M5 16h22M16 5v22"/><path d="M8.5 7.5c3.5 4 3.5 13 0 17M23.5 7.5c-3.5 4-3.5 13 0 17"/></g></svg>',
 tacas: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" opacity=".28" d="M7 5h18v6a9 9 0 0 1-18 0V5z"/><path fill="currentColor" d="M8 5h16v5a8 8 0 0 1-16 0V5zM10 3h12v3H10z"/><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M8 7H4v3a4 4 0 0 0 4 4M24 7h4v3a4 4 0 0 1-4 4"/><path fill="currentColor" d="M14 18h4v5h-4zM10 23h12v3H10zM8 26h16v3H8z"/></svg>',
 baixo: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="currentColor" opacity=".22"/><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" d="M7 10l7 8 4-4 7 8"/><path fill="currentColor" d="M27 15l1 8-8-1 7-7z"/></svg>',
 cesta: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="3" rx="1.5" fill="currentColor"/><path fill="currentColor" opacity=".35" d="M7 8h18l-2 9H9L7 8z"/><g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8l2 9M25 8l-2 9M11 8l1 9M16 8v9M21 8l-1 9M8.4 12.5h15.2"/></g><circle cx="16" cy="24" r="5" fill="currentColor"/><path fill="none" stroke="#0a0c0f" stroke-width="1.1" d="M11 24h10M16 19v10"/></svg>',
 escudo: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" opacity=".28" d="M16 3l11 3v10c0 7-4.5 11-11 13-6.5-2-11-6-11-13V6l11-3z"/><path fill="currentColor" d="M16 5l9 2.5v9c0 5.6-3.4 8.8-9 10.5-5.6-1.7-9-4.9-9-10.5v-9L16 5z"/><path fill="none" stroke="#0a0c0f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M11.5 16l3.2 3.2 6-6.4"/></svg>',
 saldo: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="15" y="5" width="2" height="22" fill="currentColor"/><rect x="10" y="26" width="12" height="2" rx="1" fill="currentColor"/><rect x="14" y="27" width="4" height="2" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M16 7 6 12M16 7l10 5"/><path fill="currentColor" opacity=".28" d="M2 12h8l-4 7-4-7zM22 12h8l-4 7-4-7z"/><path fill="currentColor" d="M3 12h6l-3 6-3-6zM23 12h6l-3 6-3-6z"/><circle cx="16" cy="6" r="2" fill="currentColor"/></svg>',
 fogo: '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" opacity=".28" d="M16 2c5 6 9 9 9 15a9 9 0 0 1-18 0c0-4 2-6 4-9 1 2 2 3 3 3 1-3 1-6 2-9z"/><path fill="currentColor" d="M16 5c4 5 7 8 7 12.5A7 7 0 0 1 9 17.5c0-3 1.4-4.8 3-7 .8 1.6 1.6 2.4 2.4 2.4.8-2.4.8-4.8 1.6-7.9z"/><path fill="#0a0c0f" opacity=".45" d="M16 15c1.8 2 2.8 3.2 2.8 4.8a2.8 2.8 0 0 1-5.6 0c0-1.6 1-2.8 2.8-4.8z"/></svg>',
 alvo: '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="14" cy="18" r="12" fill="currentColor" opacity=".22"/><circle cx="14" cy="18" r="10" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="14" cy="18" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="14" cy="18" r="2.5" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M20 12 30 2"/><path fill="currentColor" d="M27 1l4 0 0 4-2 1-3-3 1-2z"/></svg>'
};

/* ---------------- KPIs ---------------- */
function kpis(){
  const g = D[VISTA].geral, x = D[VISTA].extras, m = META[VISTA];
  const itens = [
    [ICONES.bola,   "Jogos", g.j, ehTodas() ? "5 temporadas regulares" : m.ato],
    [ICONES.tacas,  "Vitórias", g.v, "maior sequência: "+x.seqV],
    [ICONES.baixo,  "Derrotas", g.d, "maior sequência: "+x.seqD],
    [ICONES.cesta,  "Pontos por jogo", um(g.ppj), mil(g.pf)+" no total"],
    [ICONES.escudo, "Sofridos por jogo", um(g.paj), mil(g.pa)+" no total"],
    [ICONES.saldo,  "Saldo por jogo", sinal(g.sgj), sinal(g.sg)+" no total"],
    [ICONES.fogo,   "Jogos com 120+", x.c120, pc(x.c120/g.j*100)+" das partidas"],
    [ICONES.alvo,   "Aproveitamento", pc(g.ap), m.seed+" · "+m.fim]
  ];
  const box = $("#kpis"); box.innerHTML="";
  itens.forEach(function(it,i){
    const d = el("div","kpi"+(i===7?" hero":""));
    d.innerHTML = '<span class="ico" aria-hidden="true">'+it[0]+'</span>'+
      '<span class="txt"><span class="k">'+esc(it[1])+'</span><span class="v">'+esc(String(it[2]))+
      '</span><span class="n">'+esc(it[3])+'</span></span>';
    box.append(d);
  });
}

/* ---------------- pós-temporada ---------------- */
function pos(){
  const lista = POS[VISTA] || [];
  $("#posTit").textContent = ehTodas() ? "Pós-temporada do ciclo" : "Pós-temporada "+VISTA;
  const box = $("#pos"); box.innerHTML = "";

  if(ehTodas()){
    $("#posHint").textContent = "Como cada temporada terminou";
    ANOS.forEach(function(a){
      const m = META[a];
      const it = el("div","it mini "+(m.fim.indexOf("Eliminado")>=0 ? "d" : "v"));
      it.innerHTML = '<span class="who"><span class="adv" style="color:'+m.cor+'">'+a+
        '<em>'+esc(m.seed)+'</em></span></span>'+
        '<span class="fim">'+esc(m.fim)+'</span>';
      box.append(it);
    });
    const s = el("div","selo");
    s.innerHTML = '<b>1 título · 51 jogos de pós-temporada</b>'+
      '16-6 em 2022, 6-7 em 2023 e 5-7 em 2025.';
    box.append(s);
    return;
  }

  $("#posHint").textContent = NOTA[VISTA];
  if(!lista.length){
    box.innerHTML = '<p class="vazio">Sem jogos de pós-temporada.</p>';
    return;
  }
  lista.forEach(function(i){
    const it = el("div","it "+(i.res==="V"?"v":"d"));
    const sub = i.serie ? "série" : ("jogo único · "+(i.casa?"em casa":"fora"));
    it.innerHTML =
      '<span class="who"><span class="fase">'+esc(i.fase)+' · '+sub+'</span>'+
      '<span class="adv">'+esc(i.adv)+'</span></span>'+
      '<span class="pl '+(i.res==="V"?"v":"d")+'">'+esc(i.pl)+'</span>';
    box.append(it);
  });
  const s = el("div","selo");
  s.innerHTML = '<b>'+esc(META[VISTA].fim)+'</b>'+esc(META[VISTA].linha);
  box.append(s);
}

/* ---------------- curva de aproveitamento ---------------- */
function curva(){
  const series = ehTodas() ? ANOS : [VISTA];
  $("#curvaTit").textContent = ehTodas()
    ? "Evolução do aproveitamento" : "Evolução do aproveitamento em "+VISTA;
  $("#curvaHint").textContent = ehTodas()
    ? "Aproveitamento acumulado jogo a jogo, as cinco temporadas sobrepostas. Cada uma parte do resultado da estreia e estabiliza por volta do 20º jogo."
    : "Aproveitamento acumulado, jogo a jogo, ao longo dos 82 jogos da temporada regular.";

  const W=620,H=120,L=32,R=52,T=6,B=21;
  const iw=W-L-R, ih=H-T-B;
  const maxN = 82;
  const X = i => L + (i-1)/(maxN-1)*iw;
  const Y = v => T + ih - (v/100)*ih;
  let g = '<defs><clipPath id="cvClip"><rect x="'+(L-2)+'" y="'+(T-5)+'" width="'+(iw+4)+'" height="'+(ih+7)+'"/></clipPath></defs>';
  [0,25,50,75,100].forEach(function(t){
    g += '<line class="gl" x1="'+L+'" y1="'+Y(t)+'" x2="'+(L+iw)+'" y2="'+Y(t)+'"/>'+
         '<text class="tick" x="'+(L-6)+'" y="'+(Y(t)+3.5)+'" text-anchor="end">'+t+'%</text>';
  });
  g += '<line class="gl" x1="'+L+'" y1="'+Y(50)+'" x2="'+(L+iw)+'" y2="'+Y(50)+
       '" stroke="rgba(255,255,255,.18)" stroke-dasharray="3 3"/>';
  [1,10,20,30,40,50,60,70,82].forEach(function(t){
    g += '<text class="tick" x="'+X(t)+'" y="'+(T+ih+13)+'" text-anchor="middle">'+t+'</text>';
  });
  g += '<text class="tick" x="'+(L+iw/2)+'" y="'+(T+ih+23)+'" text-anchor="middle">Jogo nº da temporada regular</text>'+
       '<line class="axis" x1="'+L+'" y1="'+(T+ih)+'" x2="'+(L+iw)+'" y2="'+(T+ih)+'"/>';

  g += '<g clip-path="url(#cvClip)">';
  series.forEach(function(y){
    const pts = D[y].curva.map(function(v,i){ return X(i+1).toFixed(1)+","+Y(v).toFixed(1); }).join(" ");
    g += '<polyline points="'+pts+'" fill="none" stroke="'+corSerie(y)+'" stroke-width="2.2" '+
         'stroke-linejoin="round" stroke-linecap="round"/>';
  });
  g += '</g>';
  series.forEach(function(y){
    const c=D[y].curva, n=c.length;
    g += '<circle cx="'+X(n)+'" cy="'+Y(c[n-1])+'" r="4" fill="'+corSerie(y)+
         '" stroke="#111721" stroke-width="1.6"/>'+
         '<text class="val" x="'+(X(n)+8)+'" y="'+(Y(c[n-1])+3.5)+'" fill="'+corSerie(y)+'">'+pc(c[n-1])+'</text>';
  });
  g += '<g id="cvHov" opacity="0"><line y1="'+T+'" y2="'+(T+ih)+'" stroke="rgba(255,255,255,.35)" stroke-width="1"/></g>'+
       '<rect id="cvHit" x="'+L+'" y="'+T+'" width="'+iw+'" height="'+ih+'" fill="transparent" style="cursor:crosshair"/>';

  const host = $("#cCurva");
  host.innerHTML = SVG(W,H,g,"Aproveitamento acumulado jogo a jogo") + '<div class="tip" id="cvTip"></div>';
  $("#legCurva").innerHTML = series.map(function(y){
    const c=D[y].curva, gg=D[y].geral;
    return '<span><i class="dot" style="background:'+corSerie(y)+'"></i>'+
      '<span style="color:#fff;font-weight:600">'+y+'</span>'+
      '<b style="color:'+corSerie(y)+'">'+gg.v+'-'+gg.d+'</b></span>';
  }).join("");

  const svg = host.querySelector("svg"), tip=$("#cvTip"), hov=host.querySelector("#cvHov");
  const line = hov.querySelector("line"), hit = host.querySelector("#cvHit");
  hit.addEventListener("mousemove", function(ev){
    const r = svg.getBoundingClientRect();
    const px = (ev.clientX-r.left)/r.width*W;
    let i = Math.round((px-L)/iw*(maxN-1))+1;
    i = Math.max(1, Math.min(maxN, i));
    line.setAttribute("x1",X(i)); line.setAttribute("x2",X(i));
    hov.setAttribute("opacity","1");
    tip.innerHTML = '<div class="th">Jogo '+i+'</div>' + series.map(function(y){
      const v = D[y].curva[i-1];
      return '<div class="tr"><span><i style="background:'+corSerie(y)+'"></i>'+y+'</span><b>'+
             (v==null?"—":pc(v))+'</b></div>';
    }).join("");
    tip.classList.add("on");
    const lp = (X(i)/W)*r.width;
    tip.style.left = Math.min(Math.max(lp-68, 0), Math.max(0, r.width-148))+"px";
    tip.style.top  = "4px";
  });
  hit.addEventListener("mouseleave", function(){
    hov.setAttribute("opacity","0"); tip.classList.remove("on");
  });

  let linhas="";
  for(let i=10;i<=82;i+=12){
    linhas += "<tr><td>"+i+"</td>"+series.map(function(y){
      const v=D[y].curva[i-1]; return "<td>"+(v==null?"—":pc(v))+"</td>"; }).join("")+"</tr>";
  }
  linhas += "<tr><td>Final</td>"+series.map(function(y){
      const c=D[y].curva; return "<td>"+pc(c[c.length-1])+"</td>"; }).join("")+"</tr>";
  $("#tCurva").innerHTML =
    "<table><thead><tr><th>Jogo nº</th>"+series.map(function(y){return "<th>"+y+"</th>";}).join("")+
    "</tr></thead><tbody>"+linhas+"</tbody></table>";
}

/* ---------------- campanha em casa ---------------- */
function campanhaCasa(){
  const c=D[VISTA].casa, g=D[VISTA].geral;
  $("#casaHint").textContent = ehTodas()
    ? "Jogos no Chase Center nas cinco temporadas" : "Jogos no Chase Center em "+VISTA;
  $("#casa").innerHTML =
    '<div class="crow">'+
      '<div><b>'+c.j+'</b><span>jogos em casa</span></div>'+
      '<div><b>'+pc(c.ap)+'</b><span>aproveitamento · '+c.v+'-'+c.d+'</span></div>'+
    '</div>'+
    '<div class="cg">'+
      '<div><b style="color:var(--good)">'+c.v+'</b><span>Vitórias</span></div>'+
      '<div><b style="color:var(--crit)">'+c.d+'</b><span>Derrotas</span></div>'+
      '<div><b>'+sinal(c.sgj)+'</b><span>Saldo/jogo</span></div>'+
    '</div>'+
    '<div class="cg">'+
      '<div><b style="color:var(--casa)">'+um(c.ppj)+'</b><span>Pts feitos</span></div>'+
      '<div><b style="color:var(--fora)">'+um(c.paj)+'</b><span>Pts sofridos</span></div>'+
      '<div><b>'+mil(c.pf)+'</b><span>Total</span></div>'+
    '</div>'+
    '<p class="cnote">'+Math.round(c.v/g.v*100)+'% das vitórias saíram de casa. '+
    'Melhor ataque em casa: <b>'+D[VISTA].extras.maior+' pontos</b> num jogo.</p>';
}

/* ---------------- casa x fora ---------------- */
function mando(){
  $("#legMando").innerHTML =
    '<span><i class="dot" style="background:var(--casa)"></i>Em casa</span>'+
    '<span><i class="dot" style="background:var(--fora)"></i>Fora</span>';
  const c = D[VISTA].casa, f = D[VISTA].fora;
  const W=330,H=76,L=6,R=44,T=12, iw=W-L-R;
  const sc = v => v/100*iw;
  let g = "";
  [0,25,50,75,100].forEach(function(t){
    g += '<line class="gl" x1="'+(L+sc(t))+'" y1="'+(T-7)+'" x2="'+(L+sc(t))+'" y2="'+(T+45)+'"/>'+
         '<text class="tick" x="'+(L+sc(t))+'" y="'+(T+57)+'" text-anchor="middle">'+t+'%</text>';
  });
  [[c,"var(--casa)","Em casa",0],[f,"var(--fora)","Fora",25]].forEach(function(a){
    const d=a[0], col=a[1], lab=a[2], off=a[3];
    g += '<text class="tick" x="'+L+'" y="'+(T+off-3)+'" style="font-size:8px;letter-spacing:.1em">'+
         lab.toUpperCase()+' · '+d.j+' JOGOS · '+d.v+'-'+d.d+'</text>'+
         '<path d="'+barH(L,T+off,sc(d.ap),14,3.5)+'" fill="'+col+'"/>'+
         '<text class="val" x="'+(L+sc(d.ap)+6)+'" y="'+(T+off+10.5)+'">'+pc(d.ap)+'</text>';
  });
  $("#cMando").innerHTML = SVG(W,H,g,"Aproveitamento em casa e fora de casa");
  $("#mtab").innerHTML =
    '<span></span><span class="hd">Pts feitos</span><span class="hd">Pts sofridos</span><span class="hd">Saldo/jogo</span>'+
    '<span class="rl"><i style="background:var(--casa)"></i>Casa</span>'+
    '<span class="n">'+um(c.ppj)+'</span><span class="n">'+um(c.paj)+'</span>'+
    '<span class="n" style="color:'+(c.sgj>=0?"var(--good)":"var(--crit)")+'">'+sinal(c.sgj)+'</span>'+
    '<span class="rl"><i style="background:var(--fora)"></i>Fora</span>'+
    '<span class="n">'+um(f.ppj)+'</span><span class="n">'+um(f.paj)+'</span>'+
    '<span class="n" style="color:'+(f.sgj>=0?"var(--good)":"var(--crit)")+'">'+sinal(f.sgj)+'</span>';
}

/* ---------------- mês a mês ---------------- */
function mes(){
  $("#legMes").innerHTML =
    '<span><i class="dot" style="background:var(--good)"></i>Vitórias</span>'+
    '<span><i class="dot" style="background:var(--crit)"></i>Derrotas</span>'+
    '<span style="color:var(--ink-3)">números à direita: saldo por jogo</span>';
  const ms = D[VISTA].meses;
  const W=330, L=26, R=40, T=3, rowH=16, H=T+ms.length*rowH+3, iw=W-L-R;
  const mx = Math.max.apply(null, ms.map(function(m){ return m.j; }));
  let g="";
  ms.forEach(function(m,i){
    const y = T+i*rowH, w = m.j/mx*iw, wv = m.v/mx*iw;
    g += '<text class="tickb" x="0" y="'+(y+10)+'" style="font-size:9.5px">'+esc(m.m)+'</text>'+
         '<rect x="'+L+'" y="'+(y+2)+'" width="'+w.toFixed(1)+'" height="11" fill="var(--crit)" opacity=".85"/>'+
         '<path d="'+barH(L,y+2,wv,11,0)+'" fill="var(--good)"/>'+
         '<text class="val" x="'+(L+6)+'" y="'+(y+10.5)+'" style="font-size:9px;fill:#0b1015;font-weight:700">'+
         m.v+'</text>'+
         '<text class="val" x="'+(L+w-6)+'" y="'+(y+10.5)+'" text-anchor="end" '+
         'style="font-size:9px;fill:#0B1015;font-weight:700">'+(m.d||"")+'</text>'+
         '<text class="val" x="'+W+'" y="'+(y+10.5)+'" text-anchor="end" style="font-size:10px;fill:'+
         ((m.ppj-m.paj)>=0?"var(--good)":"var(--crit)")+'">'+
         sinal(Number((m.ppj-m.paj).toFixed(1)))+'</text>';
  });
  $("#cMes").innerHTML = SVG(W,H,g,"Vitórias e derrotas por mês");
}

/* ---------------- as cinco temporadas (visão ciclo) ---------------- */
function ciclo(){
  const W=330,H=142,L=44,R=46,T=6, iw=W-L-R, rowH=(H-T-13)/ANOS.length;
  const sc = v => v/100*iw;
  let g="";
  [0,25,50,75,100].forEach(function(t){
    g += '<line class="gl" x1="'+(L+sc(t))+'" y1="'+T+'" x2="'+(L+sc(t))+'" y2="'+(T+ANOS.length*rowH)+'"/>'+
         '<text class="tick" x="'+(L+sc(t))+'" y="'+(T+ANOS.length*rowH+11)+'" text-anchor="middle">'+t+'%</text>';
  });
  g += '<line class="gl" x1="'+(L+sc(50))+'" y1="'+T+'" x2="'+(L+sc(50))+'" y2="'+(T+ANOS.length*rowH)+
       '" stroke="rgba(255,255,255,.2)" stroke-dasharray="3 3"/>';
  ANOS.forEach(function(a,i){
    const d=D[a].geral, y=T+i*rowH+rowH/2-7, c=META[a].cor;
    g += '<text class="tickb" x="'+(L-7)+'" y="'+(y+10)+'" text-anchor="end" '+
         'style="font-weight:600;fill:#fff;font-size:9.5px">'+a+'</text>'+
         '<path d="'+barH(L,y,sc(d.ap),13,3)+'" fill="'+c+'" opacity=".9"/>'+
         '<text class="val" x="'+(L+sc(d.ap)+6)+'" y="'+(y+10)+'" style="font-size:10px" fill="'+c+'">'+
         pc(d.ap)+'</text>'+
         '<text class="tick" x="'+(L+4)+'" y="'+(y+10)+'" style="font-size:9px;fill:#0B1015;font-weight:700">'+
         d.v+'-'+d.d+'</text>';
  });
  $("#cCiclo").innerHTML = SVG(W,H,g,"Aproveitamento das cinco temporadas");
}

/* ---------------- casa x fora nas cinco temporadas ---------------- */
function dumbbell(){
  $("#legDum").innerHTML =
    '<span><i class="dot" style="background:var(--ink-2)"></i>Em casa (círculo cheio)</span>'+
    '<span><i class="ring"></i>Fora</span>';
  const W=330,H=126,L=44,R=42,T=6, iw=W-L-R, ih=H-T-16;
  const X = v => L + v/100*iw;
  let g="";
  [0,25,50,75,100].forEach(function(t){
    g += '<line class="gl" x1="'+X(t)+'" y1="'+T+'" x2="'+X(t)+'" y2="'+(T+ih)+'"/>'+
         '<text class="tick" x="'+X(t)+'" y="'+(T+ih+11)+'" text-anchor="middle">'+t+'%</text>';
  });
  ANOS.forEach(function(a,i){
    const d=D[a], yy=T+10+i*((ih-16)/(ANOS.length-1)), c=META[a].cor;
    g += '<line x1="'+X(d.fora.ap)+'" y1="'+yy+'" x2="'+X(d.casa.ap)+'" y2="'+yy+'" stroke="'+c+
         '" stroke-width="2.5" opacity=".6"/>'+
         '<circle cx="'+X(d.fora.ap)+'" cy="'+yy+'" r="4.6" fill="#111721" stroke="'+c+'" stroke-width="2.2"/>'+
         '<circle cx="'+X(d.casa.ap)+'" cy="'+yy+'" r="4.6" fill="'+c+'" stroke="#111721" stroke-width="1.3"/>'+
         '<text class="tickb" x="'+(L-7)+'" y="'+(yy+3.5)+'" text-anchor="end" '+
         'style="font-weight:600;fill:#fff;font-size:9.5px">'+a+'</text>'+
         '<text class="val" x="'+(X(Math.max(d.casa.ap,d.fora.ap))+8)+'" y="'+(yy+3.5)+
         '" style="font-size:9px" fill="'+c+'">'+
         nb((d.casa.ap-d.fora.ap).toFixed(1))+' p.p.</text>';
  });
  $("#cDum").innerHTML = SVG(W,H,g,"Diferença de aproveitamento entre casa e fora por temporada");
}

/* ---------------- carrascos ---------------- */
function carr(){
  $("#carrTit").firstChild.textContent = ehTodas() ? "Carrascos do ciclo" : "Carrascos";
  const lista = D[VISTA].carrascos.slice(0,6);
  const mx = lista.length ? lista[0].d : 1;
  $("#carr").innerHTML = lista.map(function(c,i){
    return '<div class="r"><span class="pos">'+(i+1)+'</span>'+
      '<span class="who"><b>'+esc(c.nome)+'</b>'+
      '<span class="bar"><i style="width:'+(c.d/mx*100)+'%"></i></span></span>'+
      '<span class="num" title="'+c.d+' derrotas em '+c.j+' confrontos">'+c.d+
      '<em>/'+c.j+'</em></span></div>';
  }).join("");
}

/* ---------------- maiores margens ---------------- */
function res(){
  $("#resTit").textContent = ehTodas() ? "Maiores margens do ciclo" : "Maiores margens";
  const box=$("#res"); box.innerHTML="";
  function bloco(titulo, cor, lista){
    const wrap = el("div");
    const h = el("h3"); h.innerHTML = '<em style="background:'+cor+'"></em>'+titulo;
    const s = el("div","g");
    lista.slice(0,3).forEach(function(m){
      const nome = m.casa ? ("Warriors x "+m.adv) : (m.adv+" x Warriors");
      const placar = m.casa ? (m.pf+"x"+m.pa) : (m.pa+"x"+m.pf);
      const dif = Math.abs(m.pf-m.pa);
      const r = el("div","m");
      const ctx = (ehTodas() && m.temp ? m.temp+' · ' : '') +
        (m.casa?"casa":"fora")+' · '+dataPt(m.data)+' · '+dif+' pts';
      r.innerHTML = '<b>'+esc(nome)+'<i>'+esc(ctx)+'</i></b>'+
        '<span class="sc" style="color:'+cor+'">'+placar+'</span>';
      s.append(r);
    });
    wrap.append(h,s);
    return wrap;
  }
  box.append(bloco("Maiores vitórias","var(--good)", D[VISTA].melhores));
  box.append(bloco("Maiores derrotas","var(--crit)", D[VISTA].piores));
}

/* ---------------- cestinhas ---------------- */
function topCestinhas(v, n){
  const lista = D[v].jog.filter(function(j){ return v==="todas" || j.g >= 15; });
  return lista.slice(0, n||6);
}
function cest(){
  $("#cestTit").firstChild.textContent = ehTodas() ? "Cestinhas do ciclo" : "Cestinhas da temporada";
  $("#cestHint").textContent = ehTodas()
    ? "ordenados por pontos totais no ciclo · mínimo de 40 jogos"
    : "pontos por jogo na temporada regular · mínimo de 15 jogos";
  const lista = topCestinhas(VISTA, 6);
  const lid = {};
  D[VISTA].lideres.forEach(function(l){ lid[l.nome] = l.n; });
  $("#cest").style.gridTemplateColumns = "repeat("+lista.length+",1fr)";
  $("#cest").innerHTML = lista.map(function(j){
    const n = lid[j.nome];
    const sub = ehTodas()
      ? (j.g+" jogos · "+mil(j.total)+" pts · "+j.temps+(j.temps>1?" temps.":" temp."))
      : (j.g+" jogos · "+um(j.reb)+" reb · "+um(j.ast)+" ast");
    const badge = n
      ? '<span class="lid">liderou <b>'+n+'</b> jogos</span>'
      : '<span class="lid off">não liderou jogos</span>';
    return '<div class="ceste">'+
      '<span class="g">'+um(j.pts)+'</span><span class="gl">pts / jogo</span>'+
      avatar(j.nome, "av")+
      '<span class="nm" title="'+esc(j.nome)+'">'+esc(j.nome)+'</span>'+
      '<span class="sb">'+esc(sub)+'</span>'+badge+'</div>';
  }).join("");
}

/* ---------------- resumo ---------------- */
function sum(){
  $("#sumTit").textContent = ehTodas() ? "Resumo do ciclo" : "Resumo da temporada";
  $("#sumHint").textContent = META[VISTA].linha;
  const box=$("#sum"); box.innerHTML="";
  SUM[VISTA].forEach(function(a){
    const li=el("li");
    li.innerHTML = '<em style="background:'+corDe(VISTA)+'"></em><span><b>'+esc(a[0])+'</b> — '+esc(a[1])+'</span>';
    box.append(li);
  });
}

/* ---------------- modal com a tabela completa ---------------- */
let ABA = "2025-26";
function tabelaCest(){
  const ciclo = ABA === "todas";
  const lista = D[ABA].jog.slice();
  const mx = Math.max.apply(null, lista.map(function(j){ return j.pts||0; })) || 1;
  const cols = ciclo
    ? ["Jogador","Temps.","Jogos","Pts totais","Pts/jogo","Reb","Ast"]
    : ["Jogador","Jogos","Titular","Min","Pts","Reb","Ast","Rou","Toc","FG%","3P%","LL%"];
  const pct = v => v==null ? "—" : nb((v*100).toFixed(1));
  const md  = v => v==null ? "—" : um(v);
  const linhas = lista.map(function(j){
    const nome = '<td class="nm"><span class="jog">'+avatar(j.nome,"mini")+
      '<span>'+esc(j.nome)+(j.tr?' <i>parcial</i>':'')+'</span></span></td>';
    const pts  = '<td class="pts">'+um(j.pts)+
      '<span class="barc"><i style="width:'+((j.pts||0)/mx*100).toFixed(1)+'%"></i></span></td>';
    if(ciclo){
      return "<tr>"+nome+"<td>"+j.temps+"</td><td>"+j.g+"</td><td>"+mil(j.total)+"</td>"+
             pts+"<td>"+md(j.reb)+"</td><td>"+md(j.ast)+"</td></tr>";
    }
    return "<tr>"+nome+"<td>"+j.g+"</td><td>"+(j.gs==null?"—":j.gs)+"</td><td>"+md(j.min)+"</td>"+
           pts+"<td>"+md(j.reb)+"</td><td>"+md(j.ast)+"</td><td>"+md(j.stl)+"</td>"+
           "<td>"+md(j.blk)+"</td><td>"+pct(j.fg)+"</td><td>"+pct(j.tp)+"</td><td>"+pct(j.ft)+"</td></tr>";
  }).join("");
  $("#mGrid").innerHTML = '<table class="mtbl"><thead><tr>'+
    cols.map(function(c){ return "<th>"+c+"</th>"; }).join("")+
    '</tr></thead><tbody>'+linhas+'</tbody></table>';
  $("#mSub").textContent = ciclo
    ? lista.length+" jogadores com 40 jogos ou mais no ciclo · ordenados por pontos totais"
    : lista.length+" jogadores usados em "+ABA+" · médias por jogo, ordenadas por pontuação";
  $("#mTitulo").textContent = ciclo ? "Cestinhas do ciclo" : "Cestinhas "+ABA;
}
function abasCest(){
  const abas = ANOS.concat(["todas"]);
  $("#mTabs").innerHTML = abas.map(function(a){
    return '<button type="button" role="tab" data-a="'+a+'" aria-selected="'+
           (a===ABA)+'">'+(a==="todas"?"Ciclo":a)+'</button>';
  }).join("");
  $("#mTabs").querySelectorAll("button").forEach(function(b){
    b.addEventListener("click", function(){
      ABA = b.dataset.a;
      $("#mTabs").querySelectorAll("button").forEach(function(x){
        x.setAttribute("aria-selected", String(x.dataset.a===ABA)); });
      tabelaCest();
      $(".mbody").scrollTop = 0;
    });
  });
}
function abrirCest(){
  ABA = VISTA;
  $("#modalCest").hidden = false;
  $("#btnCest").setAttribute("aria-expanded","true");
  abasCest(); tabelaCest();
  $("#btnFechar").focus();
}
function fecharCest(){
  $("#modalCest").hidden = true;
  $("#btnCest").setAttribute("aria-expanded","false");
  $("#btnCest").focus();
}
$("#btnCest").addEventListener("click", abrirCest);
$("#btnFechar").addEventListener("click", fecharCest);

/* ---------------- modal do elenco ---------------- */
let POS_ABA = "todos";       /* filtro por posição */
let FICHA = false;           /* false = cards com foto, true = ficha técnica */

function elencoFiltrado(){
  return POS_ABA === "todos" ? ELENCO : ELENCO.filter(function(j){ return j.pos === POS_ABA; });
}
function cardsElenco(lista){
  const cols = Math.max(1, Math.min(6, lista.length));
  return '<div class="egrid" style="grid-template-columns:repeat('+cols+',1fr);'+
         'max-width:'+Math.min(1520, cols*190)+'px;margin:0 auto">'+
    lista.map(function(j){
      const num = j.num ? '<span class="num">'+esc(j.num)+'</span>' : '';
      return '<div class="ejog">'+num+avatar(j.nome,"ft")+
        '<span class="nm"><b>'+esc(j.nome)+'</b>'+
        '<span>'+esc(POS_ROTULO[j.pos] || j.pos)+' · '+j.idade+' anos</span></span></div>';
    }).join("")+'</div>';
}
function fichaElenco(lista){
  const cols = ["Jogador","Nº","Posição","Idade","Altura","Peso","Univ.","Exp.","Salário"];
  const linhas = lista.map(function(j){
    const univ = j.univ ? esc(j.univ) : '<span class="vazio">—</span>';
    const sal  = j.salario
      ? '<td class="sal">'+esc(j.salario)+'</td>'
      : '<td class="vazio">—</td>';
    const exp  = j.exp === 0 ? "novato" : j.exp + (j.exp === 1 ? " ano" : " anos");
    return '<tr>'+
      '<td class="esq"><span class="jog">'+avatar(j.nome,"mini")+
        '<span>'+esc(j.nome)+'</span></span></td>'+
      '<td>'+(j.num || '<span class="vazio">—</span>')+'</td>'+
      '<td class="esq">'+esc(POS_ROTULO[j.pos] || j.pos)+'</td>'+
      '<td>'+j.idade+'</td><td>'+esc(j.alt)+'</td><td>'+esc(j.peso)+'</td>'+
      '<td class="esq">'+univ+'</td><td>'+esc(exp)+'</td>'+sal+'</tr>';
  }).join("");
  return '<table class="etbl"><thead><tr>'+
    cols.map(function(c,i){ return '<th'+(i===0||i===2||i===6?' class="esq"':'')+'>'+c+'</th>'; }).join("")+
    '</tr></thead><tbody>'+linhas+'</tbody></table>';
}
function desenhaElenco(){
  const lista = elencoFiltrado();
  $("#eGrid").innerHTML = FICHA ? fichaElenco(lista) : cardsElenco(lista);
  $("#btnVista").textContent = FICHA ? "Ver fotos" : "Ver ficha técnica";
  $("#btnVista").setAttribute("aria-pressed", String(FICHA));
  const comSalario = lista.filter(function(j){ return j.salario; }).length;
  $("#eSub").textContent = lista.length + (lista.length===1 ? " jogador" : " jogadores") +
    (POS_ABA==="todos" ? " no elenco atual" : " · "+POS_PLURAL[POS_ABA]) +
    " · técnico " + TECNICO +
    (FICHA ? " · "+comSalario+" com salário divulgado" : "");
  $("#eFoot").textContent = FICHA
    ? "Idade, altura, peso, universidade e salário conforme espn.com.br · temporada 2025-26"
    : "Elenco e fotos oficiais · espn.com.br · temporada 2025-26";
}
function abasElenco(){
  const conta = function(p){ return ELENCO.filter(function(j){ return j.pos===p; }).length; };
  const abas = [["todos","Todos ("+ELENCO.length+")"]].concat(
    ["G","A","C"].filter(function(p){ return conta(p)>0; })
                 .map(function(p){ return [p, POS_PLURAL[p]+" ("+conta(p)+")"]; }));
  $("#eTabs").innerHTML = abas.map(function(a){
    return '<button type="button" role="tab" data-p="'+a[0]+'" aria-selected="'+
           (a[0]===POS_ABA)+'">'+esc(a[1])+'</button>';
  }).join("");
  $("#eTabs").querySelectorAll("button").forEach(function(b){
    b.addEventListener("click", function(){
      POS_ABA = b.dataset.p;
      $("#eTabs").querySelectorAll("button").forEach(function(x){
        x.setAttribute("aria-selected", String(x.dataset.p===POS_ABA)); });
      desenhaElenco();
      $("#modalElenco .mbody").scrollTop = 0;
    });
  });
}
function abrirElenco(){
  $("#modalElenco").hidden = false;
  $("#btnElenco").setAttribute("aria-expanded","true");
  abasElenco(); desenhaElenco();
  $("#btnFecharElenco").focus();
}
function fecharElenco(){
  $("#modalElenco").hidden = true;
  $("#btnElenco").setAttribute("aria-expanded","false");
  $("#btnElenco").focus();
}
$("#btnElenco").addEventListener("click", abrirElenco);
$("#btnFecharElenco").addEventListener("click", fecharElenco);
$("#btnVista").addEventListener("click", function(){
  FICHA = !FICHA;
  desenhaElenco();
  $("#modalElenco .mbody").scrollTop = 0;
});

document.addEventListener("keydown", function(e){
  if(e.key !== "Escape") return;
  if(!$("#modalCest").hidden) fecharCest();
  else if(!$("#modalElenco").hidden) fecharElenco();
});

/* ---------------- render ---------------- */
function render(){
  document.documentElement.style.setProperty("--sc", OURO);
  document.querySelectorAll(".seasons button[data-v]").forEach(function(b){
    b.setAttribute("aria-pressed", String(b.dataset.v === VISTA));
  });
  document.querySelectorAll("[data-vista]").forEach(function(p){
    const so = p.dataset.vista;
    p.hidden = (so === "ano" && ehTodas()) || (so === "todas" && !ehTodas());
  });
  kpis(); pos(); curva(); campanhaCasa(); carr(); cest(); res(); sum();
  if(ehTodas()){ ciclo(); dumbbell(); } else { mando(); mes(); }
}
document.querySelectorAll(".seasons button[data-v]").forEach(function(b){
  b.addEventListener("click", function(){
    VISTA = b.dataset.v;
    render();
  });
});

/* escala o canvas para caber inteiro em uma tela */
function fit(){
  if(window.innerWidth<=900){ document.documentElement.style.setProperty("--k",1); return; }
  const k = Math.min(window.innerWidth/1600, window.innerHeight/900);
  document.documentElement.style.setProperty("--k", k);
}
window.addEventListener("resize", fit);
window.addEventListener("orientationchange", fit);
if(window.ResizeObserver) new ResizeObserver(fit).observe(document.documentElement);
fit();
render();
window.addEventListener("load", fit);
