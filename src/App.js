import { useState, useEffect, useCallback, useRef } from "react";

const w = window.api;

const Ic = ({ d, s = 18, color }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const I = {
  plus:    "M12 5v14M5 12h14",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  back:    "M19 12H5M12 19l-7-7 7-7",
  close:   "M18 6L6 18M6 6l12 12",
  doc:     ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  trash:   ["M3 6h18","M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6","M10 11v6","M14 11v6","M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"],
  restore: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  check:   "M20 6L9 17l-5-5",
  truck:   ["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z","M18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"],
  dollar:  "M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6",
  user:    ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  tag:     ["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z","M7 7h.01"],
  menu:    "M3 12h18M3 6h18M3 18h18",
  home:    ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  tooth:   ["M12 2c-1.5 0-3 .8-3.8 2C7.4 5.2 7 6.6 7 8c0 2 .5 3.5 1 5s1 3 1 5h6c0-2 .5-3.5 1-5s1-3 1-5c0-1.4-.4-2.8-1.2-4C14.8 2.8 13.5 2 12 2z"],
  chevron: "M9 18l6-6-6-6",
  edit:    ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
};

const C = {
  blue:"#1a73e8",blueL:"#e8f0fe",green:"#0f9d58",greenL:"#e6f4ea",
  amber:"#f4a400",amberL:"#fef3e2",purple:"#9334ea",purpleL:"#f3e8fd",
  red:"#e53935",redL:"#fce8e6",bg:"#f8f9fa",white:"#ffffff",
  border:"#e0e0e0",text:"#202124",muted:"#5f6368",dim:"#9aa0a6",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:#f8f9fa;color:#202124;font-family:'Roboto',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#dadce0;border-radius:4px;}
  button{cursor:pointer;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
  @keyframes scaleIn{from{opacity:0;transform:scale(.97);}to{opacity:1;transform:scale(1);}}
  @keyframes shimmer{from{background-position:-200% 0;}to{background-position:200% 0;}}
  .fade-up{animation:fadeUp .25s ease both;}
  .scale-in{animation:scaleIn .2s ease both;}
  .card-tap{transition:box-shadow .15s,transform .15s;cursor:pointer;}
  .card-tap:active{transform:scale(.98);}
  .btn-tap{transition:opacity .12s,transform .12s;}
  .btn-tap:active{transform:scale(.95);opacity:.85;}
  .row-item{animation:fadeUp .22s ease both;}
  .shimmer{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}
`;

const fmt = n => "R$ " + Number(n||0).toLocaleString("pt-BR",{minimumFractionDigits:2});
const initials = name => (name||"?").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const avatarColors = [
  {bg:"#e8f0fe",color:"#1a73e8"},{bg:"#e6f4ea",color:"#0f9d58"},
  {bg:"#f3e8fd",color:"#9334ea"},{bg:"#fef3e2",color:"#f4a400"},
  {bg:"#fce8e6",color:"#e53935"},{bg:"#e8f5e9",color:"#388e3c"},
];
const avatarColor = name => avatarColors[(name||"").charCodeAt(0)%avatarColors.length];
const statusConfig = {
  EM_PRODUCAO:{label:"Em produção",color:C.blue,bg:C.blueL},
  PRONTO:     {label:"Pronto",     color:C.green,bg:C.greenL},
  ENTREGUE:   {label:"Entregue",   color:C.amber,bg:C.amberL},
  RECEBIDO:   {label:"Recebido",   color:C.purple,bg:C.purpleL},
};

const buildNota = list => {
  const nf = 900000+list[0].id;
  const data = new Date().toLocaleDateString("pt-BR");
  const dentista = list[0].dentista?.nome||"N/A";
  const total = list.reduce((a,p)=>a+Number(p.trabalho?.valor||0),0);
  const rows = list.map(p=>`<tr><td>${p.paciente}</td><td>${p.trabalho?.descricao||"N/A"}</td><td>${p.dataEntrega||"N/A"}</td><td>R$ ${Number(p.trabalho?.valor||0).toFixed(2).replace(".",",")}</td></tr>`).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>NF-${nf}</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:30px;color:#1a1a2e}.co{font-size:26px;font-weight:800;color:#1a73e8}.hdr{text-align:center;padding-bottom:20px;border-bottom:3px solid #1a73e8;margin-bottom:28px}table{width:100%;border-collapse:collapse}th{background:#1a73e8;color:#fff;padding:10px 12px;text-align:left;font-size:12px}td{padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px}.total{font-weight:700;background:#f0f9ff}.sig{margin-top:50px;text-align:center}.sig-line{border-top:1px solid #ccc;width:260px;margin:0 auto;padding-top:8px;font-size:12px;color:#666}</style></head><body><div class="hdr"><div class="co">🦷 ProteControl</div></div><table><thead><tr><th>Paciente</th><th>Trabalho</th><th>Data Entrega</th><th>Valor</th></tr></thead><tbody>${rows}<tr class="total"><td colspan="3">TOTAL</td><td>R$ ${total.toFixed(2).replace(".",",")}</td></tr></tbody></table><div class="sig"><div class="sig-line">Assinatura do Responsável</div></div></body></html>`;
};

// ── Componentes base ──────────────────────────────────────────────────────────
const Badge = ({status}) => {
  const s = statusConfig[status]||{label:status||"—",color:C.muted,bg:"#f5f5f5"};
  return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.color}25`,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:500,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:s.color}}/>{s.label}</span>;
};

const Avatar = ({name,size=36}) => {
  const ac = avatarColor(name);
  return <div style={{width:size,height:size,borderRadius:"50%",background:ac.bg,color:ac.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.35,fontWeight:500,flexShrink:0}}>{initials(name)}</div>;
};

const Btn = ({children,onClick,variant="primary",size="md",disabled,full,style:sx}) => {
  const sz = {sm:{padding:"7px 14px",fontSize:12},md:{padding:"9px 18px",fontSize:13},lg:{padding:"12px 24px",fontSize:14}}[size];
  const v = {
    primary:{background:C.blue,color:"#fff",border:"none",shadow:"0 1px 3px rgba(26,115,232,.4)"},
    ghost:  {background:"transparent",color:C.muted,border:`1px solid ${C.border}`,shadow:"none"},
    danger: {background:C.redL,color:C.red,border:`1px solid ${C.red}30`,shadow:"none"},
    success:{background:C.greenL,color:C.green,border:`1px solid ${C.green}30`,shadow:"none"},
    warning:{background:C.amberL,color:C.amber,border:`1px solid ${C.amber}30`,shadow:"none"},
    purple: {background:C.purpleL,color:C.purple,border:`1px solid ${C.purple}30`,shadow:"none"},
    outline:{background:C.white,color:C.blue,border:`1px solid ${C.blue}`,shadow:"none"},
  }[variant];
  return <button className="btn-tap" onClick={onClick} disabled={disabled} style={{...sz,...v,borderRadius:8,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,fontWeight:500,fontFamily:"inherit",opacity:disabled?.5:1,whiteSpace:"nowrap",boxShadow:v.shadow,width:full?"100%":undefined,...sx}}>{children}</button>;
};

const inputStyle = {width:"100%",padding:"10px 14px",background:C.white,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:14,outline:"none",fontFamily:"inherit",transition:"border .15s"};
const Field = ({label,children}) => <div style={{marginBottom:14}}>{label&&<label style={{fontSize:12,color:C.muted,fontWeight:500,display:"block",marginBottom:5}}>{label}</label>}{children}</div>;
const TextInput = ({label,...p}) => <Field label={label}><input {...p} style={inputStyle} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/></Field>;
const SelectInput = ({label,children,...p}) => <Field label={label}><select {...p} style={{...inputStyle,appearance:"none"}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}>{children}</select></Field>;

const Sheet = ({title,onClose,children}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{animation:"scaleIn .2s ease both",background:C.white,borderRadius:16,width:"100%",maxWidth:500,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(0,0,0,.18)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontSize:16,fontWeight:500,color:C.text}}>{title}</span>
        <button onClick={onClose} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",padding:"6px 8px",display:"flex",lineHeight:0}}><Ic d={I.close} s={16}/></button>
      </div>
      <div style={{overflowY:"auto",padding:"16px 20px 24px",flex:1}}>{children}</div>
    </div>
  </div>
);

const Toast = ({msg}) => msg ? <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.text,color:"#fff",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:500,zIndex:999,whiteSpace:"nowrap",animation:"scaleIn .2s ease both"}}>{msg}</div> : null;

const Skeleton = () => (
  <div style={{display:"flex",flexDirection:"column",gap:10,padding:16}}>
    {[1,2,3].map(i=><div key={i} className="shimmer" style={{height:72,borderRadius:12}}/>)}
  </div>
);

const GlobalSearch = ({pedidos,dentistas,trabalhos,onClose,goTo}) => {
  const [q,setQ] = useState("");
  const ref = useRef(null);
  useEffect(()=>{setTimeout(()=>ref.current?.focus(),100);},[]);
  const results = q.length<2?[]:[
    ...pedidos.filter(p=>[p.paciente,p.dentista?.nome,p.trabalho?.descricao,p.cor].some(v=>v?.toLowerCase().includes(q.toLowerCase()))).map(p=>({type:"pedido",label:p.paciente,sub:`${p.dentista?.nome} · ${p.trabalho?.descricao}`})),
    ...dentistas.filter(d=>d.nome?.toLowerCase().includes(q.toLowerCase())).map(d=>({type:"dentista",label:d.nome,sub:d.telefone||"Sem telefone"})),
    ...trabalhos.filter(t=>t.descricao?.toLowerCase().includes(q.toLowerCase())).map(t=>({type:"trabalho",label:t.descricao,sub:fmt(t.valor)})),
  ];
  const typeColor={pedido:C.blue,dentista:C.green,trabalho:C.amber};
  const typeLabel={pedido:"Pedido",dentista:"Dentista",trabalho:"Trabalho"};
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex",flexDirection:"column",alignItems:"center",padding:"80px 16px 0"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"100%",maxWidth:560,animation:"fadeUp .2s ease both"}}>
        <div style={{position:"relative",marginBottom:10}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.muted,pointerEvents:"none"}}><Ic d={I.search} s={18}/></div>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar paciente, dentista, trabalho..."
            style={{width:"100%",padding:"14px 46px",background:C.white,border:`1px solid ${C.border}`,borderRadius:12,color:C.text,fontSize:15,outline:"none",fontFamily:"inherit"}}/>
          <button onClick={onClose} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.muted,cursor:"pointer",padding:"5px 7px",display:"flex"}}><Ic d={I.close} s={15}/></button>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",maxHeight:"55vh",overflowY:"auto"}}>
          {q.length<2?<div style={{padding:"28px",textAlign:"center",color:C.dim,fontSize:13}}>Digite pelo menos 2 letras...</div>
          :results.length===0?<div style={{padding:"28px",textAlign:"center",color:C.dim,fontSize:13}}>Nenhum resultado.</div>
          :results.map((r,i)=>(
            <div key={i} onClick={()=>{goTo(r.type==="pedido"?"ativos":r.type+"s");onClose();}}
              style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:34,height:34,borderRadius:8,background:typeColor[r.type]+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                {r.type==="pedido"?"🦷":r.type==="dentista"?"👨‍⚕️":"🏷️"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.label}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:1}}>{r.sub}</div>
              </div>
              <span style={{fontSize:11,fontWeight:500,color:typeColor[r.type],background:typeColor[r.type]+"15",padding:"3px 9px",borderRadius:20,flexShrink:0}}>{typeLabel[r.type]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [tab,setTab]               = useState("dashboard");
  const [prevTab,setPrevTab]       = useState(null);
  const [pedidos,setPedidos]       = useState([]);
  const [dentistas,setDentistas]   = useState([]);
  const [trabalhos,setTrabalhos]   = useState([]);
  const [lixeira,setLixeira]       = useState([]);
  const [modal,setModal]           = useState(null);
  const [selected,setSelected]     = useState([]);
  const [search,setSearch]         = useState("");
  const [filterDentista,setFilterDentista] = useState("");
  const [filterStatus,setFilterStatus]     = useState("");
  const [loadingData,setLoadingData] = useState(true);
  const [saving,setSaving]         = useState(false);
  const [toast,setToast]           = useState("");
  const [editando,setEditando]     = useState(null);
  const [editandoDentista,setEditandoDentista] = useState(null);
  const [editandoTipo,setEditandoTipo]         = useState(null);
  const [showGlobalSearch,setShowGlobalSearch] = useState(false);
  const [form,setForm] = useState({paciente:"",dentistaId:"",trabalhoId:"",dataEntrega:"",cor:"",observacao:"",descricao:"",valor:"",nomeD:"",telefone:"",email:""});
  const mainRef = useRef(null);

  const showToast = msg=>{setToast(msg);setTimeout(()=>setToast(""),3000);};
  const goTo = t=>{setPrevTab(tab);setTab(t);setSearch("");setSelected([]);setFilterStatus("");if(mainRef.current)mainRef.current.scrollTop=0;};
  const setF = (k,v)=>setForm(f=>({...f,[k]:v}));

  const load = useCallback(async()=>{
    setLoadingData(true);
    try{
      const [p,d,t] = await Promise.all([w.listarPedidos(),w.listarDentistas(),w.listarTrabalhos()]);
      setPedidos(p);setDentistas(d);setTrabalhos(t);
    }catch(e){console.error(e);}
    finally{setLoadingData(false);}
  },[]);
  useEffect(()=>{load();},[load]);

  const salvarPedido = async()=>{
    if(!form.paciente||!form.dentistaId||!form.trabalhoId) return alert("Preencha os campos obrigatórios!");
    setSaving(true);
    try{
      await w.criarPedido({paciente:form.paciente,dentistaId:+form.dentistaId,trabalhoId:+form.trabalhoId,dataEntrega:form.dataEntrega,cor:form.cor||null,observacao:form.observacao||null});
      setModal(null);setForm(f=>({...f,paciente:"",dentistaId:"",trabalhoId:"",dataEntrega:"",cor:"",observacao:""}));
      load();showToast("✅ Trabalho criado!");
    }catch{alert("Erro ao salvar");}finally{setSaving(false);}
  };

  const salvarDentista = async()=>{
    if(!form.nomeD) return alert("Informe o nome!");
    setSaving(true);
    try{
      await w.criarDentista({nome:form.nomeD,telefone:form.telefone,email:form.email});
      setModal(null);setForm(f=>({...f,nomeD:"",telefone:"",email:""}));
      load();showToast("✅ Dentista cadastrado!");
    }catch{alert("Erro ao salvar");}finally{setSaving(false);}
  };

  const salvarTipo = async()=>{
    if(!form.descricao||!form.valor) return alert("Preencha todos os campos!");
    setSaving(true);
    try{
      await w.criarTrabalho({descricao:form.descricao,valor:+form.valor});
      setModal(null);setForm(f=>({...f,descricao:"",valor:""}));
      load();showToast("✅ Tipo cadastrado!");
    }catch{alert("Erro ao salvar");}finally{setSaving(false);}
  };

  const abrirEdicao = p=>{
    setEditando(p);
    setForm({paciente:p.paciente||"",dentistaId:String(p.dentista?.id||""),trabalhoId:String(p.trabalho?.id||""),dataEntrega:p.dataEntrega||"",cor:p.cor||"",observacao:p.observacao||"",descricao:"",valor:"",nomeD:"",telefone:"",email:""});
    setModal("editar-pedido");
  };

  const salvarEdicao = async()=>{
    if(!form.paciente||!form.dentistaId||!form.trabalhoId) return alert("Preencha os campos obrigatórios!");
    setSaving(true);
    try{
      await w.atualizarPedido({id:editando.id,paciente:form.paciente,dentistaId:+form.dentistaId,trabalhoId:+form.trabalhoId,dataEntrega:form.dataEntrega,cor:form.cor||null,observacao:form.observacao||null});
      setModal(null);setEditando(null);load();showToast("✅ Pedido atualizado!");
    }catch{alert("Erro ao editar");}finally{setSaving(false);}
  };

  const abrirEdicaoDentista = d=>{
    setEditandoDentista(d);
    setForm(f=>({...f,nomeD:d.nome||"",telefone:d.telefone||"",email:d.email||""}));
    setModal("editar-dentista");
  };

  const salvarEdicaoDentista = async()=>{
    if(!form.nomeD) return alert("Informe o nome!");
    setSaving(true);
    try{
      await w.atualizarDentista({id:editandoDentista.id,nome:form.nomeD,telefone:form.telefone,email:form.email});
      setModal(null);setEditandoDentista(null);load();showToast("✅ Dentista atualizado!");
    }catch{alert("Erro ao editar");}finally{setSaving(false);}
  };

  const abrirEdicaoTipo = t=>{
    setEditandoTipo(t);
    setForm(f=>({...f,descricao:t.descricao||"",valor:String(t.valor||"")}));
    setModal("editar-tipo");
  };

  const salvarEdicaoTipo = async()=>{
    if(!form.descricao||!form.valor) return alert("Preencha todos os campos!");
    setSaving(true);
    try{
      await w.atualizarTrabalho({id:editandoTipo.id,descricao:form.descricao,valor:+form.valor});
      setModal(null);setEditandoTipo(null);load();showToast("✅ Trabalho atualizado!");
    }catch{alert("Erro ao editar");}finally{setSaving(false);}
  };

  const atualizarStatus = async(id,status)=>{
    try{
      await w.atualizarStatus({id,status});load();
      showToast({PRONTO:"✅ Pronto!",ENTREGUE:"📦 Entregue!",RECEBIDO:"💰 Recebido!"}[status]||"Atualizado!");
    }catch{alert("Erro");}
  };

  const marcarPago = async(id,pago)=>{
    try{
      await w.marcarPago({id,pago});
      setPedidos(ps=>ps.map(p=>p.id===id?{...p,pago}:p));
      showToast(pago?"💰 Marcado como pago!":"↩️ Desmarcado");
    }catch{load();}
  };

  const deletarItem = (tipo,item)=>{
    setLixeira(l=>[...l,{tipo,item,at:new Date().toLocaleString("pt-BR")}]);
    if(tipo==="dentista") setDentistas(d=>d.filter(x=>x.id!==item.id));
    if(tipo==="trabalho") setTrabalhos(t=>t.filter(x=>x.id!==item.id));
    if(tipo==="pedido")   setPedidos(p=>p.filter(x=>x.id!==item.id));
    showToast("🗑 Movido para a lixeira");
  };

  const restaurarItem = async idx=>{
    const e = lixeira[idx];
    try{
      if(e.tipo==="dentista") await w.criarDentista({nome:e.item.nome,telefone:e.item.telefone,email:e.item.email});
      if(e.tipo==="trabalho") await w.criarTrabalho({descricao:e.item.descricao,valor:e.item.valor});
      if(e.tipo==="pedido")   await w.criarPedido({paciente:e.item.paciente,dentistaId:e.item.dentista?.id,trabalhoId:e.item.trabalho?.id,dataEntrega:e.item.dataEntrega});
      setLixeira(l=>l.filter((_,i)=>i!==idx));load();showToast("♻️ Restaurado!");
    }catch{showToast("❌ Erro ao restaurar");}
  };

  const deletarPermanente = async idx=>{
    const e = lixeira[idx];
    try{
      if(e.tipo==="dentista") await w.deletarDentista(e.item.id);
      if(e.tipo==="trabalho") await w.deletarTrabalho(e.item.id);
      if(e.tipo==="pedido")   await w.deletarPedido(e.item.id);
    }catch(_){}
    setLixeira(l=>l.filter((_,i)=>i!==idx));showToast("🗑 Deletado permanentemente");
  };

  const emitirNota = list=>{
    if(!list.length) return;
    const html = buildNota(list);
    const url = URL.createObjectURL(new Blob([html],{type:"text/html"}));
    Object.assign(document.createElement("a"),{href:url,download:`Nota_NF-${900000+list[0].id}.html`}).click();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
    setSelected([]);showToast("📄 Nota gerada!");
  };

  const ativos    = pedidos.filter(p=>p.status==="EM_PRODUCAO");
  const prontos   = pedidos.filter(p=>p.status==="PRONTO");
  const entregues = pedidos.filter(p=>p.status==="ENTREGUE"||p.status==="RECEBIDO");

  const filtered = list=>list.filter(p=>{
    const ms=!search||[p.paciente,p.dentista?.nome,p.trabalho?.descricao,p.cor].some(v=>v?.toLowerCase().includes(search.toLowerCase()));
    const md=!filterDentista||String(p.dentista?.id)===filterDentista;
    const mst=!filterStatus||p.status===filterStatus;
    return ms&&md&&mst;
  });

  // ── Helpers de UI ──
  const IconBtn = ({onClick,color=C.muted,bg=C.bg,border=C.border,icon})=>(
    <button onClick={onClick} style={{width:32,height:32,borderRadius:8,border:`1px solid ${border}`,background:bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
      <Ic d={icon} s={15} color={color}/>
    </button>
  );

  const CoresField = ()=>(
    <Field label="Cor / Tonalidade">
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["A1","A2","A3","A3.5","B1","B2","B3","C2","C3","D2","Outro"].map(c=>(
          <button key={c} onClick={()=>setF("cor",form.cor===c?"":c)}
            style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${form.cor===c?C.blue:C.border}`,background:form.cor===c?C.blueL:C.white,color:form.cor===c?C.blue:C.muted,cursor:"pointer",fontSize:12,fontWeight:500,fontFamily:"inherit",transition:"all .12s"}}>
            {c}
          </button>
        ))}
      </div>
    </Field>
  );

  const StatusTabs = ({value,onChange,list})=>{
    const tabs=[
      {key:"",label:"Todos",count:list.length},
      {key:"EM_PRODUCAO",label:"Produção",count:list.filter(p=>p.status==="EM_PRODUCAO").length},
      {key:"PRONTO",label:"Prontos",count:list.filter(p=>p.status==="PRONTO").length},
      {key:"ENTREGUE",label:"Entregues",count:list.filter(p=>p.status==="ENTREGUE"||p.status==="RECEBIDO").length},
    ];
    return(
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.white,marginBottom:16}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>onChange(t.key)}
            style={{padding:"11px 16px",border:"none",borderBottom:`2px solid ${value===t.key?C.blue:"transparent"}`,background:"transparent",color:value===t.key?C.blue:C.muted,fontSize:13,fontWeight:value===t.key?500:400,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"inherit"}}>
            {t.label}
            <span style={{background:value===t.key?C.blueL:C.bg,color:value===t.key?C.blue:C.dim,fontSize:11,padding:"1px 7px",borderRadius:20}}>{t.count}</span>
          </button>
        ))}
      </div>
    );
  };

  // ── PedidoRow ──
  const PedidoRow = ({p,i})=>(
    <tr key={p.id} className="row-item" style={{borderBottom:`1px solid ${C.border}`,animationDelay:`${i*.03}s`}}
      onMouseEnter={e=>e.currentTarget.style.background=C.bg}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <td style={{padding:"12px 16px"}}>
        <input type="checkbox" checked={selected.includes(p.id)} onChange={()=>setSelected(s=>s.includes(p.id)?s.filter(x=>x!==p.id):[...s,p.id])}/>
      </td>
      <td style={{padding:"12px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Avatar name={p.paciente} size={30}/>
          <span style={{fontWeight:500,fontSize:14,color:C.text}}>{p.paciente}</span>
        </div>
      </td>
      <td style={{padding:"12px 16px",color:C.muted,fontSize:13}}>{p.dentista?.nome}</td>
      <td style={{padding:"12px 16px",color:C.muted,fontSize:13}}>{p.trabalho?.descricao}</td>
      <td style={{padding:"12px 16px",color:C.green,fontWeight:500,fontSize:13}}>{fmt(p.trabalho?.valor)}</td>
      <td style={{padding:"12px 16px",color:C.muted,fontSize:13}}>{p.dataEntrega||"—"}</td>
      <td style={{padding:"12px 16px"}}>{p.cor&&<span style={{fontSize:11,background:C.blueL,color:C.blue,padding:"2px 8px",borderRadius:12,fontWeight:500}}>🎨 {p.cor}</span>}</td>
      <td style={{padding:"12px 16px"}}><Badge status={p.status}/></td>
      <td style={{padding:"12px 16px"}}>
        <div style={{display:"flex",gap:5}}>
          {p.status==="EM_PRODUCAO"&&<Btn variant="success" size="sm" onClick={()=>atualizarStatus(p.id,"PRONTO")}>✓ Pronto</Btn>}
          {p.status==="PRONTO"     &&<Btn variant="warning" size="sm" onClick={()=>atualizarStatus(p.id,"ENTREGUE")}>📦 Entregar</Btn>}
          {p.status==="ENTREGUE"   &&<Btn variant="purple"  size="sm" onClick={()=>atualizarStatus(p.id,"RECEBIDO")}>💰 Receber</Btn>}
          <Btn variant={p.pago?"success":"ghost"} size="sm" onClick={()=>marcarPago(p.id,!p.pago)}>{p.pago?"✅":"💰"}</Btn>
          <Btn variant="ghost" size="sm" onClick={()=>abrirEdicao(p)}><Ic d={I.edit} s={13}/></Btn>
          <Btn variant="ghost" size="sm" onClick={()=>emitirNota([p])}>📄</Btn>
          <Btn variant="danger" size="sm" onClick={()=>deletarItem("pedido",p)}><Ic d={I.trash} s={13}/></Btn>
        </div>
      </td>
    </tr>
  );

  // ── PedidosScreen ──
  const PedidosScreen = ({list,title})=>{
    const displayList = filterStatus?list.filter(p=>p.status===filterStatus||(filterStatus==="ENTREGUE"&&p.status==="RECEBIDO")):list;
    const rows = filtered(displayList);
    return(
      <div className="fade-up">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Btn variant="ghost" size="sm" onClick={()=>goTo(prevTab||"dashboard")}><Ic d={I.back} s={14}/> Voltar</Btn>
            <h2 style={{fontSize:22,fontWeight:500,color:C.text}}>{title}</h2>
          </div>
          <Btn onClick={()=>setModal("novo-pedido")}><Ic d={I.plus} s={15}/> Novo trabalho</Btn>
        </div>
        <StatusTabs value={filterStatus} onChange={setFilterStatus} list={list}/>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <div style={{position:"relative",flex:1,minWidth:200}}>
            <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.dim}}><Ic d={I.search} s={15}/></div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{...inputStyle,paddingLeft:36}}/>
          </div>
          <select value={filterDentista} onChange={e=>setFilterDentista(e.target.value)} style={{...inputStyle,width:"auto",minWidth:160}}>
            <option value="">Todos dentistas</option>
            {dentistas.map(d=><option key={d.id} value={String(d.id)}>{d.nome}</option>)}
          </select>
        </div>
        {selected.length>0&&(
          <div style={{background:C.blueL,border:`1px solid ${C.blue}30`,borderRadius:10,padding:"10px 16px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
            <span style={{fontSize:13,color:C.blue,fontWeight:500}}>{selected.length} selecionado(s)</span>
            <div style={{display:"flex",gap:8}}>
              <Btn variant="ghost" size="sm" onClick={()=>setSelected([])}>Limpar</Btn>
              <Btn size="sm" onClick={()=>emitirNota(pedidos.filter(p=>selected.includes(p.id)))}><Ic d={I.doc} s={13}/> Emitir nota</Btn>
            </div>
          </div>
        )}
        {loadingData?<Skeleton/>:rows.length===0?(
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"60px",textAlign:"center",color:C.dim}}>
            <div style={{fontSize:32,marginBottom:10,opacity:.5}}>📋</div>
            <div style={{fontSize:14}}>Nenhum trabalho encontrado.</div>
          </div>
        ):(
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                  <th style={{padding:"11px 16px"}}><input type="checkbox" onChange={e=>setSelected(e.target.checked?rows.map(p=>p.id):[])}/></th>
                  {["Paciente","Dentista","Trabalho","Valor","Entrega","Cor","Status","Ações"].map(h=>(
                    <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:11,color:C.muted,fontWeight:500,letterSpacing:".05em",textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{rows.map((p,i)=><PedidoRow key={p.id} p={p} i={i}/>)}</tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ── Dashboard ──
  const Dashboard = ()=>(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <div style={{fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>Sistema Protético</div>
          <h1 style={{fontSize:28,fontWeight:500,color:C.text}}>🦷 ProteControl</h1>
        </div>
        <Btn size="lg" onClick={()=>setModal("novo-pedido")}><Ic d={I.plus} s={17}/> Novo trabalho</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        {[
          {label:"Em produção",value:ativos.length,color:C.blue,tab:"ativos"},
          {label:"Prontos para entrega",value:prontos.length,color:C.green,tab:"prontos"},
          {label:"Entregues / Recebidos",value:entregues.length,color:C.amber,tab:"entregues"},
        ].map(c=>(
          <div key={c.label} className="card-tap" onClick={()=>goTo(c.tab)}
            style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px"}}>
            <div style={{fontSize:13,color:C.muted,marginBottom:8}}>{c.label}</div>
            <div style={{fontSize:32,fontWeight:500,color:c.color}}>{c.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:16,fontWeight:500,color:C.text}}>Em produção</span>
        <button onClick={()=>goTo("ativos")} style={{background:"none",border:"none",color:C.blue,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>Ver todos <Ic d={I.chevron} s={14} color={C.blue}/></button>
      </div>
      {loadingData?<Skeleton/>:ativos.length===0?(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"40px",textAlign:"center",color:C.dim}}>
          <div style={{fontSize:32,marginBottom:10,opacity:.4}}>🦷</div>
          <div style={{fontSize:14,marginBottom:14}}>Nenhum trabalho em produção.</div>
          <Btn onClick={()=>setModal("novo-pedido")}><Ic d={I.plus} s={14}/> Criar trabalho</Btn>
        </div>
      ):(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {ativos.slice(0,5).map((p,i)=>(
            <div key={p.id} className="row-item" style={{display:"flex",alignItems:"center",gap:14,padding:"13px 20px",borderBottom:i<Math.min(ativos.length,5)-1?`1px solid ${C.border}`:"none",animationDelay:`${i*.04}s`}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Avatar name={p.paciente} size={32}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text}}>{p.paciente}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:1}}>{p.dentista?.nome} · {p.trabalho?.descricao}</div>
              </div>
              {p.cor&&<span style={{fontSize:11,background:C.blueL,color:C.blue,padding:"2px 8px",borderRadius:12,fontWeight:500}}>🎨 {p.cor}</span>}
              <span style={{color:C.green,fontWeight:500,fontSize:14,flexShrink:0}}>{fmt(p.trabalho?.valor)}</span>
              <Btn variant="success" size="sm" onClick={()=>atualizarStatus(p.id,"PRONTO")}><Ic d={I.check} s={13}/> Pronto</Btn>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Financeiro ──
  const Financeiro = ()=>{
    const recebidos = pedidos.filter(p=>p.pago);
    const aReceber  = pedidos.filter(p=>!p.pago&&p.status==="ENTREGUE");
    const sum = l=>l.reduce((a,p)=>a+Number(p.trabalho?.valor||0),0);
    return(
      <div className="fade-up">
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
          <Btn variant="ghost" size="sm" onClick={()=>goTo("dashboard")}><Ic d={I.back} s={14}/> Voltar</Btn>
          <h2 style={{fontSize:22,fontWeight:500,color:C.text}}>Financeiro</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:22}}>
          {[{label:"Recebido",color:C.green,v:sum(recebidos)},{label:"A receber",color:C.amber,v:sum(aReceber)}].map(c=>(
            <div key={c.label} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px"}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{c.label}</div>
              <div style={{fontSize:28,fontWeight:500,color:c.color}}>{fmt(c.v)}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {pedidos.map((p,i)=>(
            <div key={p.id} className="row-item" style={{display:"flex",alignItems:"center",gap:14,padding:"13px 20px",borderBottom:i<pedidos.length-1?`1px solid ${C.border}`:"none",animationDelay:`${i*.03}s`}}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Avatar name={p.paciente} size={32}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text}}>{p.paciente}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:1}}>{p.dentista?.nome} · {p.trabalho?.descricao}</div>
              </div>
              <Badge status={p.status}/>
              <span style={{color:C.green,fontWeight:500,fontSize:14}}>{fmt(p.trabalho?.valor)}</span>
              <Btn variant={p.pago?"success":"ghost"} size="sm" onClick={()=>marcarPago(p.id,!p.pago)}>{p.pago?"✅ Pago":"💰 Pagar"}</Btn>
              <Btn variant="ghost" size="sm" onClick={()=>emitirNota([p])}>📄</Btn>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── Dentistas ──
  const Dentistas = ()=>(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Btn variant="ghost" size="sm" onClick={()=>goTo("dashboard")}><Ic d={I.back} s={14}/> Voltar</Btn>
          <h2 style={{fontSize:22,fontWeight:500,color:C.text}}>Dentistas</h2>
        </div>
        <Btn onClick={()=>setModal("novo-dentista")}><Ic d={I.plus} s={15}/> Novo dentista</Btn>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        {dentistas.length===0?(
          <div style={{padding:"48px",textAlign:"center",color:C.dim}}>
            <div style={{fontSize:32,marginBottom:10,opacity:.4}}>👨‍⚕️</div>
            <div style={{fontSize:14,marginBottom:14}}>Nenhum dentista cadastrado.</div>
            <Btn onClick={()=>setModal("novo-dentista")}><Ic d={I.plus} s={14}/> Cadastrar</Btn>
          </div>
        ):dentistas.map((d,i)=>(
          <div key={d.id} className="row-item" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:i<dentistas.length-1?`1px solid ${C.border}`:"none",animationDelay:`${i*.04}s`}}
            onMouseEnter={e=>e.currentTarget.style.background=C.bg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Avatar name={d.nome} size={38}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:15,color:C.text}}>{d.nome}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>{d.telefone||"Sem telefone"}{d.email?" · "+d.email:""}</div>
            </div>
            <Btn variant="ghost" size="sm" onClick={()=>abrirEdicaoDentista(d)}><Ic d={I.edit} s={13}/> Editar</Btn>
            <Btn variant="danger" size="sm" onClick={()=>deletarItem("dentista",d)}><Ic d={I.trash} s={13}/></Btn>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Tipos ──
  const Tipos = ()=>(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Btn variant="ghost" size="sm" onClick={()=>goTo("dashboard")}><Ic d={I.back} s={14}/> Voltar</Btn>
          <h2 style={{fontSize:22,fontWeight:500,color:C.text}}>Trabalhos & Preços</h2>
        </div>
        <Btn onClick={()=>setModal("novo-tipo")}><Ic d={I.plus} s={15}/> Novo tipo</Btn>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        {trabalhos.map((t,i)=>(
          <div key={t.id} className="row-item" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:i<trabalhos.length-1?`1px solid ${C.border}`:"none",animationDelay:`${i*.04}s`}}
            onMouseEnter={e=>e.currentTarget.style.background=C.bg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:38,height:38,borderRadius:10,background:C.greenL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🦷</div>
            <div style={{flex:1}}><div style={{fontWeight:500,fontSize:15,color:C.text}}>{t.descricao}</div></div>
            <span style={{fontWeight:500,color:C.green,fontSize:15}}>{fmt(t.valor)}</span>
            <Btn variant="ghost" size="sm" onClick={()=>abrirEdicaoTipo(t)}><Ic d={I.edit} s={13}/> Editar</Btn>
            <Btn variant="danger" size="sm" onClick={()=>deletarItem("trabalho",t)}><Ic d={I.trash} s={13}/></Btn>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Lixeira ──
  const Lixeira = ()=>(
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Btn variant="ghost" size="sm" onClick={()=>goTo(prevTab||"dashboard")}><Ic d={I.back} s={14}/> Voltar</Btn>
          <h2 style={{fontSize:22,fontWeight:500,color:C.text}}>Lixeira</h2>
        </div>
        {lixeira.length>0&&<Btn variant="danger" onClick={()=>{if(window.confirm("Esvaziar?"))lixeira.forEach((_,i)=>deletarPermanente(i));setLixeira([]);}}>Esvaziar</Btn>}
      </div>
      {lixeira.length===0?(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"48px",textAlign:"center",color:C.dim}}>
          <div style={{fontSize:32,marginBottom:10,opacity:.4}}>🗑</div>
          <div style={{fontSize:14}}>Lixeira vazia.</div>
        </div>
      ):(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {lixeira.map((e,i)=>(
            <div key={i} className="row-item" style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:i<lixeira.length-1?`1px solid ${C.border}`:"none",animationDelay:`${i*.04}s`}}>
              <div style={{width:36,height:36,borderRadius:8,background:C.redL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic d={I.trash} s={16} color={C.red}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text}}>
                  {e.tipo==="dentista"&&e.item.nome}
                  {e.tipo==="trabalho"&&`${e.item.descricao} — ${fmt(e.item.valor)}`}
                  {e.tipo==="pedido"&&`${e.item.paciente} (${e.item.dentista?.nome})`}
                </div>
                <div style={{fontSize:11,color:C.dim,marginTop:2}}>{e.tipo} · {e.at}</div>
              </div>
              <Btn variant="outline" size="sm" onClick={()=>restaurarItem(i)}><Ic d={I.restore} s={13}/> Restaurar</Btn>
              <Btn variant="danger"  size="sm" onClick={()=>deletarPermanente(i)}><Ic d={I.trash} s={13}/> Excluir</Btn>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const sidebarW = 240;
  const sidebarItems = [
    {key:"dashboard", label:"Início",            icon:I.home},
    {key:"ativos",    label:`Ativos (${ativos.length})`,  icon:I.tooth},
    {key:"prontos",   label:`Prontos (${prontos.length})`, icon:I.check},
    {key:"entregues", label:"Entregues",          icon:I.truck},
    {key:"financeiro",label:"Financeiro",         icon:I.dollar},
    {key:"dentistas", label:"Dentistas",          icon:I.user},
    {key:"tipos",     label:"Trabalhos & Preços", icon:I.tag},
    {key:"lixeira",   label:`Lixeira${lixeira.length?` (${lixeira.length})`:""}`, icon:I.trash},
  ];

  return(
    <>
      <style>{css}</style>
      <Toast msg={toast}/>
      {showGlobalSearch&&<GlobalSearch pedidos={pedidos} dentistas={dentistas} trabalhos={trabalhos} onClose={()=>setShowGlobalSearch(false)} goTo={goTo}/>}

      {/* Sidebar */}
      <div style={{position:"fixed",top:0,left:0,width:sidebarW,height:"100vh",background:C.white,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",zIndex:50,overflowY:"auto"}}>
        <div style={{padding:"20px 18px 16px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:18,fontWeight:500,color:C.text}}>🦷 ProteControl</div>
          <div style={{fontSize:11,color:C.muted,marginTop:3}}>Sistema Protético</div>
          <button onClick={()=>setShowGlobalSearch(true)} style={{marginTop:12,width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.dim,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>
            <Ic d={I.search} s={14}/> Busca global...
          </button>
        </div>
        <nav style={{flex:1,padding:"10px 10px"}}>
          {sidebarItems.map(n=>(
            <button key={n.key} onClick={()=>goTo(n.key)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",cursor:"pointer",marginBottom:2,fontFamily:"inherit",fontSize:13,fontWeight:tab===n.key?500:400,background:tab===n.key?C.blueL:"transparent",color:tab===n.key?C.blue:C.muted,transition:"all .12s"}}>
              <Ic d={n.icon} s={16} color={tab===n.key?C.blue:C.muted}/> {n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"14px 16px",borderTop:`1px solid ${C.border}`}}>
          <Btn full onClick={()=>setModal("novo-pedido")} style={{justifyContent:"center"}}><Ic d={I.plus} s={15}/> Novo trabalho</Btn>
        </div>
      </div>

      {/* Main */}
      <div ref={mainRef} style={{marginLeft:sidebarW,minHeight:"100vh",background:C.bg,padding:"24px 32px",overflowY:"auto"}}>
        {tab==="dashboard" &&<Dashboard/>}
        {tab==="ativos"    &&<PedidosScreen list={ativos}    title="Em Produção"/>}
        {tab==="prontos"   &&<PedidosScreen list={prontos}   title="Prontos para Entrega"/>}
        {tab==="entregues" &&<PedidosScreen list={entregues} title="Trabalhos Entregues"/>}
        {tab==="financeiro"&&<Financeiro/>}
        {tab==="dentistas" &&<Dentistas/>}
        {tab==="tipos"     &&<Tipos/>}
        {tab==="lixeira"   &&<Lixeira/>}
      </div>

      {/* Modals */}
      {modal==="novo-pedido"&&(
        <Sheet title="Novo trabalho" onClose={()=>setModal(null)}>
          <SelectInput label="Dentista *" value={form.dentistaId} onChange={e=>setF("dentistaId",e.target.value)}>
            <option value="">Selecione um dentista...</option>
            {dentistas.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}
          </SelectInput>
          <TextInput label="Paciente *" placeholder="Nome completo" value={form.paciente} onChange={e=>setF("paciente",e.target.value)}/>
          <SelectInput label="Tipo de trabalho *" value={form.trabalhoId} onChange={e=>setF("trabalhoId",e.target.value)}>
            <option value="">Selecione o trabalho...</option>
            {trabalhos.map(t=><option key={t.id} value={t.id}>{t.descricao} — {fmt(t.valor)}</option>)}
          </SelectInput>
          <TextInput label="Data de entrega" type="date" value={form.dataEntrega} onChange={e=>setF("dataEntrega",e.target.value)}/>
          <CoresField/>
          <TextInput label="Observações" placeholder="Ex: urgente, alérgico a metal..." value={form.observacao} onChange={e=>setF("observacao",e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
            <Btn onClick={salvarPedido} disabled={saving} style={{flex:2,justifyContent:"center"}}>{saving?"Salvando...":"✓ Criar trabalho"}</Btn>
          </div>
        </Sheet>
      )}
      {modal==="editar-pedido"&&editando&&(
        <Sheet title="Editar trabalho" onClose={()=>{setModal(null);setEditando(null);}}>
          <div style={{background:C.amberL,border:`1px solid ${C.amber}30`,borderRadius:8,padding:"9px 13px",marginBottom:14,fontSize:13,color:C.amber}}>
            Editando: <strong>{editando.paciente}</strong>
          </div>
          <SelectInput label="Dentista *" value={form.dentistaId} onChange={e=>setF("dentistaId",e.target.value)}>
            <option value="">Selecione...</option>
            {dentistas.map(d=><option key={d.id} value={d.id}>{d.nome}</option>)}
          </SelectInput>
          <TextInput label="Paciente *" value={form.paciente} onChange={e=>setF("paciente",e.target.value)}/>
          <SelectInput label="Tipo de trabalho *" value={form.trabalhoId} onChange={e=>setF("trabalhoId",e.target.value)}>
            <option value="">Selecione...</option>
            {trabalhos.map(t=><option key={t.id} value={t.id}>{t.descricao} — {fmt(t.valor)}</option>)}
          </SelectInput>
          <TextInput label="Data de entrega" type="date" value={form.dataEntrega} onChange={e=>setF("dataEntrega",e.target.value)}/>
          <CoresField/>
          <TextInput label="Observações" value={form.observacao} onChange={e=>setF("observacao",e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>{setModal(null);setEditando(null);}} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
            <Btn onClick={salvarEdicao} disabled={saving} style={{flex:2,justifyContent:"center"}}>{saving?"Salvando...":"✓ Salvar"}</Btn>
          </div>
        </Sheet>
      )}
      {modal==="novo-dentista"&&(
        <Sheet title="Novo dentista" onClose={()=>setModal(null)}>
          <TextInput label="Nome *" placeholder="Nome do dentista" value={form.nomeD} onChange={e=>setF("nomeD",e.target.value)}/>
          <TextInput label="Telefone" placeholder="(11) 99999-9999" value={form.telefone} onChange={e=>setF("telefone",e.target.value)}/>
          <TextInput label="Email" placeholder="email@exemplo.com" value={form.email} onChange={e=>setF("email",e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
            <Btn onClick={salvarDentista} disabled={saving} style={{flex:2,justifyContent:"center"}}>{saving?"Salvando...":"✓ Salvar"}</Btn>
          </div>
        </Sheet>
      )}
      {modal==="editar-dentista"&&editandoDentista&&(
        <Sheet title="Editar dentista" onClose={()=>{setModal(null);setEditandoDentista(null);}}>
          <TextInput label="Nome *" value={form.nomeD} onChange={e=>setF("nomeD",e.target.value)}/>
          <TextInput label="Telefone" value={form.telefone} onChange={e=>setF("telefone",e.target.value)}/>
          <TextInput label="Email" value={form.email} onChange={e=>setF("email",e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>{setModal(null);setEditandoDentista(null);}} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
            <Btn onClick={salvarEdicaoDentista} disabled={saving} style={{flex:2,justifyContent:"center"}}>{saving?"Salvando...":"✓ Salvar"}</Btn>
          </div>
        </Sheet>
      )}
      {modal==="novo-tipo"&&(
        <Sheet title="Novo trabalho & preço" onClose={()=>setModal(null)}>
          <TextInput label="Descrição *" placeholder="Ex: Dentadura completa" value={form.descricao} onChange={e=>setF("descricao",e.target.value)}/>
          <TextInput label="Valor (R$) *" type="number" placeholder="Ex: 1200" value={form.valor} onChange={e=>setF("valor",e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>setModal(null)} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
            <Btn onClick={salvarTipo} disabled={saving} style={{flex:2,justifyContent:"center"}}>{saving?"Salvando...":"✓ Salvar"}</Btn>
          </div>
        </Sheet>
      )}
      {modal==="editar-tipo"&&editandoTipo&&(
        <Sheet title="Editar trabalho & preço" onClose={()=>{setModal(null);setEditandoTipo(null);}}>
          <TextInput label="Descrição *" value={form.descricao} onChange={e=>setF("descricao",e.target.value)}/>
          <TextInput label="Valor (R$) *" type="number" value={form.valor} onChange={e=>setF("valor",e.target.value)}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn variant="ghost" onClick={()=>{setModal(null);setEditandoTipo(null);}} style={{flex:1,justifyContent:"center"}}>Cancelar</Btn>
            <Btn onClick={salvarEdicaoTipo} disabled={saving} style={{flex:2,justifyContent:"center"}}>{saving?"Salvando...":"✓ Salvar"}</Btn>
          </div>
        </Sheet>
      )}
    </>
  );
}
