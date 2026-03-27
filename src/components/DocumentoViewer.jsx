import React from 'react'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

const INFO_MODULO = {
  obras: {
    secretaria: 'Secretaria Municipal de Infraestrutura Urbana',
    gerencia:   'Gerência de Fiscalização de Obras',
    lei:        'Lei Municipal nº 1.481/2007 — Código de Obras e Edificações',
  },
  posturas: {
    secretaria: 'Secretaria Municipal de Serviços Públicos',
    gerencia:   'Gerência de Fiscalização de Posturas',
    lei:        'Lei Municipal nº 695/1993 — Código de Polícia Administrativa',
  },
}

const BRASAO_URL = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'
const ENDERECO_PMVC = 'Praça Joaquim Correia, 55, Centro — CEP: 45.040-901 — Vitória da Conquista — BA'

export default function DocumentoViewer({ registro }) {
  function gerarHTML() {
    const info   = INFO_MODULO[registro.gerencia] || INFO_MODULO.obras
    const ehAuto = registro.type === 'auto'
    const titulo = ehAuto ? 'AUTO DE INFRAÇÃO' : 'NOTIFICAÇÃO PRELIMINAR'
    const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(`https://fiscon-portal.pmvc.ba.gov.br/?codigo=${registro.codigo_acesso}`)}`

    const infracoesHtml = (registro.infracoes || []).map((inf, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
        <td style="padding:7px 12px;font-size:12px;color:#374151;border-bottom:1px solid #e2e8f0;">
          ${inf.codigo ? `<strong>Art. ${inf.codigo}</strong> — ` : ''}${inf.descricao}
        </td>
        ${ehAuto ? `<td style="padding:7px 12px;text-align:right;font-size:12px;font-weight:700;color:#B91C1C;border-bottom:1px solid #e2e8f0;white-space:nowrap;">
          ${inf.valor > 0 ? `R$ ${Number(inf.valor).toFixed(2).replace('.', ',')}` : '—'}
        </td>` : ''}
      </tr>
    `).join('')

    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/>
    <title>${titulo} — ${registro.num}</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Barlow',sans-serif;font-size:12px;color:#1E293B;background:#fff;}
      .pg{width:210mm;min-height:297mm;margin:0 auto;padding:14mm 18mm 18mm;position:relative;background:#fff;}
      .dagua{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:140mm;height:140mm;
        background-image:url('${BRASAO_URL}');background-repeat:no-repeat;background-size:contain;
        background-position:center;opacity:0.05;pointer-events:none;z-index:0;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .c{position:relative;z-index:1;}
      .cab{display:flex;align-items:center;gap:16px;padding-bottom:10px;border-bottom:3px solid #1A56DB;margin-bottom:14px;}
      .cab img{width:60px;height:60px;flex-shrink:0;}
      .t-doc{text-align:center;margin-bottom:14px;padding:11px 12px;
        background:linear-gradient(135deg,#1A56DB,#1244A8);border-radius:8px;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .t-doc h1{font-size:20px;color:#fff;letter-spacing:0.1em;font-weight:700;margin-bottom:4px;}
      .t-num{font-size:14px;color:rgba(255,255,255,.9);font-weight:600;letter-spacing:0.05em;}
      .t-data{font-size:11px;color:rgba(255,255,255,.75);margin-top:2px;}
      .sec{margin-bottom:12px;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;}
      .sec-t{background:#F8FAFC;padding:5px 12px;font-size:10px;font-weight:700;color:#475569;
        text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid #E2E8F0;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .sec-b{padding:10px 12px;}
      .fld{margin-bottom:6px;display:flex;gap:8px;}
      .fl{font-size:10px;color:#94A3B8;min-width:90px;flex-shrink:0;text-transform:uppercase;letter-spacing:0.04em;}
      .fv{font-size:12px;color:#1E293B;font-weight:500;flex:1;}
      table{width:100%;border-collapse:collapse;font-size:11px;}
      th{background:#F1F5F9;padding:6px 12px;text-align:left;font-size:10px;font-weight:700;
        color:#475569;text-transform:uppercase;border-bottom:2px solid #E2E8F0;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .prazo{background:#FEF3C7;border:1px solid #FCD34D;border-radius:6px;padding:9px 14px;
        display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .multa{background:#FEE2E2;border:1px solid #FECACA;border-radius:6px;padding:9px 14px;
        display:flex;justify-content:space-between;align-items:center;margin-top:6px;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .assin{display:flex;gap:24px;margin-top:22px;margin-bottom:18px;}
      .assin-b{flex:1;border-top:1px solid #1E293B;padding-top:6px;text-align:center;}
      .rodape-p{display:flex;align-items:center;gap:14px;padding:10px 12px;
        background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;margin-top:14px;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .rodape-p img{width:68px;height:68px;flex-shrink:0;}
      .rodape-l{margin-top:14px;padding-top:8px;border-top:1px solid #E2E8F0;
        font-size:9px;color:#94A3B8;text-align:center;line-height:1.6;}
      @media print{body{background:#fff;}@page{size:A4;margin:0;}.pg{margin:0;padding:12mm 18mm 16mm;}}
    </style></head><body>
    <div class="dagua"></div>
    <div class="pg"><div class="c">
      <div class="cab">
        <img src="${BRASAO_URL}" alt="Brasão"/>
        <div>
          <div style="font-size:10px;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;">Prefeitura Municipal de Vitória da Conquista — Estado da Bahia</div>
          <div style="font-size:13px;font-weight:700;color:#1E293B;margin:2px 0;">${info.secretaria}</div>
          <div style="font-size:11px;color:#475569;">${info.gerencia}</div>
          <div style="font-size:10px;color:#94A3B8;margin-top:2px;">${info.lei}</div>
        </div>
      </div>
      <div class="t-doc">
        <h1>${titulo}</h1>
        <div class="t-num">Nº ${registro.num}</div>
        <div class="t-data">Vitória da Conquista, ${registro.date}</div>
      </div>
      ${registro.prazo ? `<div class="prazo">
        <span style="font-size:11px;color:#B45309;font-weight:600;">${ehAuto ? 'Prazo para apresentar defesa: 10 dias' : 'Prazo para regularização'}</span>
        <span style="font-size:15px;font-weight:700;color:#B45309;">${registro.prazo}</span>
      </div>` : ''}
      <div class="sec">
        <div class="sec-t">${ehAuto ? 'Dados do Autuado' : 'Dados do Notificado'}</div>
        <div class="sec-b">
          <div class="fld"><span class="fl">Nome</span><span class="fv"><strong>${registro.owner || '—'}</strong></span></div>
          ${registro.cpf ? `<div class="fld"><span class="fl">CPF/CNPJ</span><span class="fv">${registro.cpf}</span></div>` : ''}
          <div class="fld"><span class="fl">Endereço</span><span class="fv">${registro.addr || '—'}${registro.bairro ? `, ${registro.bairro}` : ''}</span></div>
        </div>
      </div>
      <div class="sec">
        <div class="sec-t">Infrações Constatadas</div>
        <div style="padding:0">
          <table><thead><tr>
            <th>Descrição da Infração</th>
            ${ehAuto ? '<th style="text-align:right;white-space:nowrap;">Multa (R$)</th>' : ''}
          </tr></thead><tbody>${infracoesHtml}</tbody></table>
        </div>
      </div>
      ${ehAuto && registro.multa && Number(registro.multa) > 0 ? `
      <div class="multa">
        <span style="font-size:11px;font-weight:700;color:#B91C1C;text-transform:uppercase;">Valor Total da Multa</span>
        <span style="font-size:18px;font-weight:700;color:#B91C1C;">R$ ${Number(registro.multa).toFixed(2).replace('.', ',')}</span>
      </div>` : ''}
      ${registro.descricao ? `<div class="sec" style="margin-top:12px;">
        <div class="sec-t">Descrição das Irregularidades</div>
        <div class="sec-b"><p style="font-size:12px;color:#374151;line-height:1.7;">${registro.descricao}</p></div>
      </div>` : ''}
      <div class="assin">
        <div class="assin-b">
          <div style="font-size:11px;font-weight:600;">${registro.fiscal || '—'}</div>
          <div style="font-size:10px;color:#64748B;">Agente de Fiscalização — Mat. ${registro.matricula || ''}</div>
        </div>
        <div class="assin-b">
          <div style="font-size:11px;">&nbsp;</div>
          <div style="font-size:10px;color:#64748B;">${ehAuto ? 'Assinatura do Autuado' : 'Assinatura do Notificado'}</div>
        </div>
      </div>
      <div class="rodape-p">
        <img src="${qrUrl}" alt="QR Code"/>
        <div>
          <div style="font-size:11px;font-weight:700;color:#1E293B;margin-bottom:3px;">Portal do Cidadão — Acesse online</div>
          <div style="font-size:10px;color:#64748B;line-height:1.5;">
            Escaneie o QR Code ou acesse <strong>fiscon-portal.pmvc.ba.gov.br</strong><br/>
            e informe o código abaixo para consultar e enviar defesa.
          </div>
          <div style="font-size:15px;font-weight:700;color:#1A56DB;letter-spacing:0.15em;font-family:monospace;margin-top:4px;">${registro.codigo_acesso}</div>
        </div>
      </div>
      <div class="rodape-l">
        Prefeitura Municipal de Vitória da Conquista — CNPJ: 14.105.183/0001-99 — ${ENDERECO_PMVC}<br/>
        ${ehAuto ? 'Documento emitido com fundamento na Lei Municipal nº 1.481/2007.' : 'O não cumprimento no prazo poderá resultar em autuação e aplicação das penalidades previstas em lei.'}
      </div>
    </div></div></body></html>`
  }

  function abrirDocumento() {
    const win = window.open('', '_blank', 'width=900,height=700')
    win.document.write(gerarHTML())
    win.document.close()
    setTimeout(() => { win.focus(); win.print() }, 800)
  }

  return (
    <div>
      <div className="secao-titulo">Documento Oficial</div>
      <div style={{ background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>📄</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>
            {registro.type === 'auto' ? 'Auto de Infração' : 'Notificação Preliminar'} — {registro.num}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
            Emitido em {registro.date} por {registro.fiscal}
          </div>
        </div>
        <button onClick={abrirDocumento} style={{
          background: '#001f5e', color: '#fff', padding: '10px 18px',
          fontWeight: '700', fontSize: '0.85rem', borderRadius: '10px',
          display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
        }}>
          📥 Ver / Baixar
        </button>
      </div>
    </div>
  )
}
