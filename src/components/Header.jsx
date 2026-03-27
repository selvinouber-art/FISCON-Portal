import React from 'react'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

export default function Header() {
  return (
    <header>
      <div className="tricolor" />
      <div style={{ background: '#001f5e', padding: '14px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img src={BRASAO} alt="Brasão PMVC" style={{ width: '52px', height: '52px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Prefeitura Municipal de Vitória da Conquista — BA
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', lineHeight: 1.2 }}>
                Portal do Cidadão — Fiscalização
              </div>
              <div style={{ fontSize: '0.75rem', color: '#ffdf00', fontWeight: '600', marginTop: '1px' }}>
                Defesa Administrativa de Notificações e Autos de Infração
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: '#1a56db', padding: '6px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>
            <span>🔒 Ambiente seguro e oficial</span>
            <span>📋 Processo 100% digital</span>
            <span>⚖️ Validade jurídica garantida</span>
          </div>
        </div>
      </div>
    </header>
  )
}
