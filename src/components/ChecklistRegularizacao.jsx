import React, { useState } from 'react'

const ITENS_NOTIF_OBRAS = [
  { id: 'paralisar',   texto: 'Paralise imediatamente a obra ou retire o material irregular' },
  { id: 'tecnico',     texto: 'Contrate um responsável técnico (engenheiro ou arquiteto)' },
  { id: 'entrada',     texto: 'Dê entrada no processo de licenciamento (alvará) na SMIU' },
  { id: 'documentos',  texto: 'Reúna os documentos: escritura, projeto, ART/RRT do responsável' },
  { id: 'acompanhar',  texto: 'Acompanhe o processo de alvará e cumpra as exigências' },
  { id: 'solicitar',   texto: 'Após regularizar, solicite vistoria pelo portal para arquivamento' },
]

const ITENS_AUTO_OBRAS = [
  { id: 'paralisar',   texto: 'PARE A OBRA IMEDIATAMENTE — isso é obrigatório desde o momento da autuação' },
  { id: 'defesa',      texto: 'Prepare e envie sua defesa em até 10 dias corridos' },
  { id: 'tecnico',     texto: 'Contrate um responsável técnico (engenheiro ou arquiteto)' },
  { id: 'entrada',     texto: 'Dê entrada no processo de licenciamento (alvará) na SMIU' },
  { id: 'advogado',    texto: 'Considere consultar um advogado para acompanhar o processo administrativo' },
  { id: 'acompanhar',  texto: 'Aguarde o julgamento da defesa pela gerência' },
  { id: 'regularizar', texto: 'Após decisão, providencie a regularização conforme determinado' },
]

const ITENS_NOTIF_POSTURAS = [
  { id: 'solucionar',  texto: 'Solucione a irregularidade apontada no prazo da notificação' },
  { id: 'documentar',  texto: 'Documente a solução (foto, nota fiscal, etc.) para comprovar' },
  { id: 'defesa',      texto: 'Se discordar, envie sua defesa justificando a situação' },
  { id: 'solicitar',   texto: 'Após regularizar, solicite vistoria pelo portal para arquivamento' },
]

export default function ChecklistRegularizacao({ tipo, gerencia }) {
  const [marcados, setMarcados] = useState([])

  const itens = tipo === 'auto'
    ? (gerencia === 'obras' ? ITENS_AUTO_OBRAS : ITENS_NOTIF_POSTURAS)
    : (gerencia === 'obras' ? ITENS_NOTIF_OBRAS : ITENS_NOTIF_POSTURAS)

  function toggle(id) {
    setMarcados(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id])
  }

  const pct = Math.round((marcados.length / itens.length) * 100)

  return (
    <div>
      <div className="secao-titulo">Checklist de Regularização</div>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>
          <span>{marcados.length} de {itens.length} etapas</span>
          <span style={{ fontWeight: '700', color: pct === 100 ? '#166534' : '#1a56db' }}>{pct}%</span>
        </div>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: pct === 100 ? '#166534' : '#1a56db',
            borderRadius: '999px', transition: 'width 0.3s',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {itens.map((item, i) => {
          const feito = marcados.includes(item.id)
          const urgente = item.id === 'paralisar'
          return (
            <button key={item.id} onClick={() => toggle(item.id)} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '12px 14px', borderRadius: '10px', textAlign: 'left',
              background: feito ? '#F0FDF4' : urgente ? '#FEF3C7' : '#F8FAFC',
              border: `2px solid ${feito ? '#BBF7D0' : urgente ? '#FCD34D' : '#E2E8F0'}`,
              cursor: 'pointer',
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                background: feito ? '#166534' : '#fff',
                border: `2px solid ${feito ? '#166534' : '#CBD5E0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {feito && <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700' }}>✓</span>}
              </div>
              <div>
                <div style={{
                  fontSize: '0.85rem', fontWeight: feito ? '600' : '500',
                  color: feito ? '#166534' : urgente ? '#B45309' : '#374151',
                  textDecoration: feito ? 'line-through' : 'none',
                  lineHeight: 1.4,
                }}>
                  {urgente && '⚠️ '}
                  {item.texto}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      {pct === 100 && (
        <div className="alert alert-green" style={{ marginTop: '14px' }}>
          <span>🎉</span>
          <span>Parabéns! Você concluiu todas as etapas. Solicite a vistoria de arquivamento pelo portal.</span>
        </div>
      )}
    </div>
  )
}
