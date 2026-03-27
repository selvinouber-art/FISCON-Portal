import React from 'react'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

export default function DefesaConfirmadaPage({ defesa, registro, onVoltar }) {
  const protocolo   = defesa?.num || defesa?.id?.slice(-12).toUpperCase()
  const dataEnvio   = defesa?.created_at
    ? new Date(defesa.created_at).toLocaleString('pt-BR')
    : new Date().toLocaleString('pt-BR')

  function imprimirProtocolo() {
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/>
    <title>Protocolo de Defesa — ${protocolo}</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Barlow',sans-serif;background:#fff;color:#1e293b;}
      .pg{width:210mm;min-height:148mm;margin:0 auto;padding:14mm 18mm;border:2px solid #001f5e;}
      .tri{height:6px;background:linear-gradient(90deg,#009c3b 33.33%,#ffdf00 33.33% 66.66%,#002776 66.66%);margin-bottom:16px;}
      .cab{display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #001f5e;}
      .cab img{width:52px;height:52px;}
      h1{font-size:16px;color:#001f5e;margin-bottom:2px;}
      .prot{font-size:22px;font-weight:800;color:#001f5e;letter-spacing:0.05em;margin:12px 0;}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
      .it{padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;}
      .it-l{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.06em;}
      .it-v{font-size:13px;font-weight:600;color:#1e293b;}
      .aviso{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px;font-size:11px;color:#166534;margin-bottom:14px;}
      .rodape{font-size:9px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:10px;}
      @media print{@page{size:A5 landscape;margin:0;}.pg{margin:0;border:none;}}
    </style></head><body>
    <div class="pg">
      <div class="tri"></div>
      <div class="cab">
        <img src="${BRASAO}" alt="Brasão"/>
        <div>
          <div style="font-size:10px;color:#64748B;text-transform:uppercase;">Prefeitura Municipal de Vitória da Conquista — BA</div>
          <h1>Comprovante de Protocolo de Defesa Administrativa</h1>
        </div>
      </div>
      <div class="prot">Protocolo Nº ${protocolo}</div>
      <div class="grid">
        <div class="it"><div class="it-l">Referência</div><div class="it-v">${registro?.num || '—'}</div></div>
        <div class="it"><div class="it-l">Tipo</div><div class="it-v">${registro?.type === 'auto' ? 'Auto de Infração' : 'Notificação Preliminar'}</div></div>
        <div class="it"><div class="it-l">Defensor</div><div class="it-v">${defesa?.nome || '—'}</div></div>
        <div class="it"><div class="it-l">CPF</div><div class="it-v">${defesa?.cpf || '—'}</div></div>
        <div class="it"><div class="it-l">Data e Hora do Envio</div><div class="it-v">${dataEnvio}</div></div>
        <div class="it"><div class="it-l">Situação</div><div class="it-v">Recebida — Aguardando Julgamento</div></div>
      </div>
      <div class="aviso">
        ✅ Esta defesa foi recebida com sucesso pelo sistema FISCON e encaminhada para análise da Gerência de Fiscalização.
        Guarde este comprovante. A decisão estará disponível no Portal do Cidadão em: <strong>fiscon-portal.pmvc.ba.gov.br</strong>
      </div>
      <div class="rodape">
        FISCON — Sistema de Defesa Administrativa Digital · Prefeitura Municipal de Vitória da Conquista · CNPJ: 14.105.183/0001-99
        <br/>Praça Joaquim Correia, 55, Centro — CEP: 45.040-901 — Vitória da Conquista — BA
        <br/>Documento gerado em ${new Date().toLocaleString('pt-BR')} · Validade jurídica garantida conforme legislação municipal vigente.
      </div>
    </div>
    <script>window.onload=()=>{window.print()}</script>
    </body></html>`

    const win = window.open('', '_blank', 'width=800,height=500')
    win.document.write(html)
    win.document.close()
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        {/* Sucesso */}
        <div style={{ textAlign: 'center', marginBottom: '28px', paddingTop: '8px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534', marginBottom: '8px' }}>
            Defesa Enviada com Sucesso!
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Sua defesa administrativa foi recebida e está na fila de análise da Gerência de Fiscalização.
          </p>
        </div>

        {/* Card protocolo */}
        <div style={{
          background: '#001f5e', borderRadius: '16px', padding: '24px',
          textAlign: 'center', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            Número do Protocolo
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', letterSpacing: '0.08em', fontFamily: 'monospace', marginBottom: '4px' }}>
            {protocolo}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
            Enviado em {dataEnvio}
          </div>
        </div>

        {/* Resumo */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="secao-titulo">Resumo do Protocolo</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Referência</span>
              <span style={{ fontWeight: '600' }}>{registro?.num}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Tipo</span>
              <span style={{ fontWeight: '600' }}>{registro?.type === 'auto' ? 'Auto de Infração' : 'Notificação Preliminar'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Defensor</span>
              <span style={{ fontWeight: '600' }}>{defesa?.nome}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Status</span>
              <span style={{ fontWeight: '700', color: '#B45309' }}>⏳ Aguardando Julgamento</span>
            </div>
          </div>
        </div>

        {/* Próximos passos */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="secao-titulo">Próximos Passos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icone: '📋', t: 'Sua defesa foi recebida', d: 'O sistema registrou o protocolo com data e hora.' },
              { icone: '🔍', t: 'A gerência vai analisar', d: 'A Gerência de Fiscalização vai analisar os argumentos e documentos.' },
              { icone: '📬', t: 'Acompanhe pelo portal', d: 'Volte a qualquer momento com seu código de acesso para ver a decisão.' },
              { icone: '⚖️', t: 'Decisão fundamentada', d: 'Você receberá um parecer explicando a decisão (deferida ou indeferida).' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.icone}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{p.t}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={imprimirProtocolo} style={{
            width: '100%', background: '#166534', color: '#fff', padding: '14px',
            fontSize: '0.95rem', fontWeight: '700', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            🖨️ Imprimir / Baixar Comprovante
          </button>
          <button onClick={onVoltar} style={{
            width: '100%', background: '#fff', color: '#001f5e',
            border: '2px solid #001f5e', padding: '13px',
            fontSize: '0.95rem', fontWeight: '700', borderRadius: '12px',
          }}>
            ← Voltar ao Processo
          </button>
        </div>

      </div>
    </div>
  )
}
