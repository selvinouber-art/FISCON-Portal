import React from 'react'

export default function StatusDefesa({ defesa }) {
  if (!defesa) return null

  const STATUS = {
    pendente:   { cor: '#B45309', fundo: '#FEF3C7', borda: '#FCD34D', icone: '⏳', label: 'Aguardando Julgamento' },
    deferida:   { cor: '#166534', fundo: '#F0FDF4', borda: '#BBF7D0', icone: '✅', label: 'Defesa Deferida' },
    indeferida: { cor: '#B91C1C', fundo: '#FEE2E2', borda: '#FECACA', icone: '❌', label: 'Defesa Indeferida' },
  }
  const s = STATUS[defesa.status] || STATUS.pendente

  return (
    <div>
      <div className="secao-titulo">Status da sua Defesa</div>
      <div style={{ background: s.fundo, border: `2px solid ${s.borda}`, borderRadius: '14px', padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: defesa.status !== 'pendente' ? '14px' : 0 }}>
          <div style={{ fontSize: '2rem', flexShrink: 0 }}>{s.icone}</div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: s.cor }}>{s.label}</div>
            <div style={{ fontSize: '0.8rem', color: s.cor, marginTop: '2px' }}>
              Protocolo: <strong>{defesa.id?.slice(-12).toUpperCase()}</strong>
            </div>
            <div style={{ fontSize: '0.8rem', color: s.cor }}>
              Enviada em: {defesa.created_at ? new Date(defesa.created_at).toLocaleString('pt-BR') : '—'}
            </div>
          </div>
        </div>

        {defesa.status === 'pendente' && (
          <div style={{ fontSize: '0.82rem', color: s.cor, borderTop: `1px solid ${s.borda}`, paddingTop: '12px' }}>
            Sua defesa foi recebida e está na fila de análise da Gerência de Fiscalização. Acompanhe esta página para ver a decisão.
          </div>
        )}

        {defesa.status !== 'pendente' && defesa.parecer && (
          <div style={{ borderTop: `1px solid ${s.borda}`, paddingTop: '14px' }}>
            <div style={{ fontSize: '0.78rem', color: s.cor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              Parecer da Gerência
            </div>
            <div style={{ fontSize: '0.88rem', color: '#374151', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '12px', lineHeight: 1.6 }}>
              {defesa.parecer}
            </div>
            {defesa.julgado_por && (
              <div style={{ fontSize: '0.72rem', color: s.cor, marginTop: '8px' }}>
                Julgado por {defesa.julgado_por} em {defesa.julgado_em}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
