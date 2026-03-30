import React from 'react'

export default function Footer() {
  return (
    <footer style={{ background: '#001f5e', color: 'rgba(255,255,255,0.7)', padding: '24px 0 16px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prefeitura Municipal</div>
            <div style={{ fontSize: '0.78rem', lineHeight: 1.8 }}>
              <div>Praça Joaquim Correia, 55</div>
              <div>Centro — CEP: 45.040-901</div>
              <div>Vitória da Conquista — BA</div>
              <div>CNPJ: 14.105.183/0001-99</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Links Úteis</div>
            <div style={{ fontSize: '0.78rem', lineHeight: 2 }}>
              <div><a href="https://www.pmvc.ba.gov.br" target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>Portal da Prefeitura</a></div>
              <div><a href="https://www.pmvc.ba.gov.br/infraestrutura-urbana/" target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>SEINFRA — Sec. de Infraestrutura Urbana</a></div>
              <div><a href="https://tudofacil.pmvc.ba.gov.br" target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>Tudo Fácil — Serviços Municipais</a></div>
              <div><a href="https://www.pmvc.ba.gov.br/ouvidoria" target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>Ouvidoria Municipal</a></div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Atendimento</div>
            <div style={{ fontSize: '0.78rem', lineHeight: 1.8 }}>
              <div>Gerência de Fiscalização de Obras</div>
              <div>Seg a Sex: 08h às 14h</div>
              <div style={{ marginTop: '4px' }}>Gerência de Fiscalização de Posturas</div>
              <div>Seg a Sex: 08h às 14h</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '14px', fontSize: '0.72rem', textAlign: 'center' }}>
          FISCON Portal — Sistema de Defesa Administrativa Digital © {new Date().getFullYear()} — Prefeitura Municipal de Vitória da Conquista
        </div>
      </div>
    </footer>
  )
}
