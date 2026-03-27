import React from 'react'

const ETAPAS_NOTIF = [
  { id: 'emissao',       label: 'Notificação Emitida',     desc: 'O fiscal emitiu a notificação preliminar no local da irregularidade.' },
  { id: 'ciencia',       label: 'Ciência Confirmada',      desc: 'O notificado confirmou o recebimento do documento pelo portal.' },
  { id: 'defesa',        label: 'Defesa / Regularização',  desc: 'O notificado enviou defesa ou está providenciando a regularização.' },
  { id: 'analise',       label: 'Análise da Gerência',     desc: 'A gerência analisa a defesa ou verifica a regularização in loco.' },
  { id: 'encerramento',  label: 'Encerramento',            desc: 'Processo arquivado após regularização ou decisão final.' },
]

const ETAPAS_AUTO = [
  { id: 'emissao',       label: 'Auto de Infração Lavrado', desc: 'O fiscal lavrou o auto de infração. A atividade deve ser paralisada imediatamente.' },
  { id: 'ciencia',       label: 'Ciência Confirmada',       desc: 'O autuado confirmou o recebimento pelo portal.' },
  { id: 'defesa',        label: 'Defesa Administrativa',    desc: 'O autuado tem 10 dias para apresentar defesa por escrito.' },
  { id: 'analise',       label: 'Julgamento',               desc: 'A gerência julga a defesa. Pode deferir (cancelar multa) ou indeferir.' },
  { id: 'encerramento',  label: 'Decisão Final',            desc: 'Processo encerrado. Em caso de indeferimento, multa pode ser encaminhada para cobrança.' },
]

function getEtapaAtual(registro, defesaEnviada) {
  if (!registro) return 0
  if (registro.status === 'Cancelado' || registro.status === 'Regularizado') return 4
  if (defesaEnviada) return 3
  if (registro.ciencia_em) return 2
  return 1
}

export default function LinhaTempo({ registro, defesa }) {
  const ehAuto  = registro?.type === 'auto'
  const etapas  = ehAuto ? ETAPAS_AUTO : ETAPAS_NOTIF
  const atual   = getEtapaAtual(registro, !!defesa)

  return (
    <div>
      <div className="secao-titulo">Linha do Tempo do Processo</div>
      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        {/* Linha vertical */}
        <div style={{
          position: 'absolute', left: '10px', top: '12px',
          bottom: '12px', width: '2px',
          background: 'linear-gradient(to bottom, #1a56db, #e2e8f0)',
        }} />

        {etapas.map((etapa, i) => {
          const concluida = i < atual
          const ativa     = i === atual
          const futura    = i > atual

          return (
            <div key={etapa.id} style={{ display: 'flex', gap: '14px', marginBottom: i < etapas.length - 1 ? '20px' : 0, position: 'relative' }}>
              {/* Círculo */}
              <div style={{
                position: 'absolute', left: '-28px', top: '2px',
                width: '22px', height: '22px', borderRadius: '50%',
                background: concluida ? '#166534' : ativa ? '#1a56db' : '#e2e8f0',
                border: `3px solid ${concluida ? '#166534' : ativa ? '#1a56db' : '#cbd5e0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
              }}>
                {concluida && <span style={{ color: '#fff', fontSize: '11px', fontWeight: '700' }}>✓</span>}
                {ativa && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
              </div>

              <div style={{ opacity: futura ? 0.45 : 1 }}>
                <div style={{
                  fontSize: '0.88rem', fontWeight: '700',
                  color: concluida ? '#166534' : ativa ? '#1a56db' : '#64748b',
                  marginBottom: '2px',
                }}>
                  {etapa.label}
                  {ativa && <span style={{ marginLeft: '8px', fontSize: '0.65rem', background: '#EBF5FF', color: '#1a56db', borderRadius: '999px', padding: '2px 8px', fontWeight: '700' }}>ATUAL</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{etapa.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
