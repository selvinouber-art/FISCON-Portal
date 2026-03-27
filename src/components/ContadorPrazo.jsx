import React, { useState, useEffect } from 'react'

function parsePrazo(prazoStr) {
  if (!prazoStr) return null
  try {
    const [d, m, a] = prazoStr.split('/')
    return new Date(`${a}-${m.padStart(2,'0')}-${d.padStart(2,'0')}T23:59:59`)
  } catch { return null }
}

export default function ContadorPrazo({ prazo, tipo = 'notif' }) {
  const [agora, setAgora] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const dataLimite = parsePrazo(prazo)
  if (!dataLimite) return null

  const diffMs   = dataLimite - agora
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const vencido  = diffDias < 0

  const cor   = vencido ? '#B91C1C' : diffDias <= 2 ? '#B45309' : '#166534'
  const fundo = vencido ? '#FEE2E2' : diffDias <= 2 ? '#FEF3C7' : '#F0FDF4'
  const borda = vencido ? '#FECACA' : diffDias <= 2 ? '#FCD34D' : '#BBF7D0'

  return (
    <div style={{ background: fundo, border: `2px solid ${borda}`, borderRadius: '14px', padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: cor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
            {tipo === 'auto' ? 'Prazo para apresentar defesa' : 'Prazo para regularização'}
          </div>
          <div style={{ fontSize: '0.85rem', color: cor }}>
            Vence em <strong>{prazo}</strong>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          {vencido ? (
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: cor }}>VENCIDO</div>
          ) : (
            <>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: cor, lineHeight: 1 }}>
                {diffDias}
              </div>
              <div style={{ fontSize: '0.72rem', color: cor, fontWeight: '600' }}>
                {diffDias === 1 ? 'DIA RESTANTE' : 'DIAS RESTANTES'}
              </div>
            </>
          )}
        </div>
      </div>
      {vencido && (
        <div style={{ marginTop: '10px', fontSize: '0.82rem', color: cor }}>
          ⚠️ O prazo expirou. Ainda é possível enviar defesa, mas sujeita à análise de tempestividade.
        </div>
      )}
      {!vencido && diffDias <= 2 && (
        <div style={{ marginTop: '10px', fontSize: '0.82rem', color: cor }}>
          ⚠️ Prazo crítico! Envie sua defesa o quanto antes.
        </div>
      )}
    </div>
  )
}
