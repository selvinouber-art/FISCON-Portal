import React from 'react'

const ETAPAS_NOTIF = [
  { id: 'emissao',      label: 'Notificação Emitida',    desc: 'O fiscal emitiu a notificação preliminar no local da irregularidade.' },
  { id: 'ciencia',      label: 'Ciência Confirmada',     desc: 'O notificado confirmou o recebimento do documento pelo portal.' },
  { id: 'defesa',       label: 'Defesa / Regularização', desc: 'O notificado enviou defesa ou está providenciando a regularização.' },
  { id: 'analise',      label: 'Análise da Gerência',    desc: 'A gerência analisa a defesa ou verifica a regularização in loco.' },
  { id: 'encerramento', label: 'Encerramento',           desc: 'Processo arquivado após regularização ou decisão final.' },
]

const ETAPAS_AUTO = [
  { id: 'emissao',      label: 'Auto de Infração Lavrado', desc: 'O fiscal lavrou o auto de infração. A atividade deve ser paralisada imediatamente.' },
  { id: 'ciencia',      label: 'Ciência Confirmada',       desc: 'O autuado confirmou o recebimento pelo portal.' },
  { id: 'defesa',       label: 'Defesa Administrativa',    desc: 'O autuado tem 10 dias para apresentar defesa por escrito.' },
  { id: 'analise',      label: 'Julgamento',               desc: 'A gerência julga a defesa. Pode deferir (encerrar o processo) ou indeferir (manter a autuação).' },
  { id: 'encerramento', label: 'Decisão Final',            desc: 'Processo encerrado. Em caso de indeferimento, multa pode ser encaminhada para cobrança.' },
]

function getEtapaAtual(registro, defesa) {
  if (!registro) return 0

  // Processo encerrado: cancelado, regularizado, ou defesa DEFERIDA
  const encerrado =
    registro.status === 'Cancelado' ||
    registro.status === 'Regularizado' ||
    defesa?.status === 'deferida'

  if (encerrado) return 5  // Todas concluídas → encerramento

  // Defesa julgada (indeferida) → análise concluída, aguarda próximo passo
  if (defesa?.status === 'indeferida') return 4

  // Defesa enviada e pendente → em análise
  if (defesa?.status === 'pendente') return 3

  // Ciência confirmada, defesa ainda não enviada
  if (registro.ciencia_em) return 2

  return 1
}

export default function LinhaTempo({ registro, defesa }) {
  const ehAuto  = registro?.type === 'auto'
  const etapas  = ehAuto ? ETAPAS_AUTO : ETAPAS_NOTIF
  const atual   = getEtapaAtual(registro, defesa)
  const encerrado = atual >= 5

  return (
    <div>
      <div className="secao-titulo">Linha do Tempo do Processo</div>

      {encerrado && (
        <div className="alert alert-green" style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>✅</span>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '2px' }}>
              {defesa?.status === 'deferida' ? 'Defesa Deferida — Processo Encerrado' : 'Processo Encerrado'}
            </div>
            <div style={{ fontSize: '0.82rem' }}>
              {defesa?.status === 'deferida'
                ? 'Sua defesa foi aceita pela Gerência de Fiscalização. O processo está encerrado.'
                : 'A situação foi regularizada e o processo foi arquivado.'}
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', paddingLeft: '28px' }}>
        <div style={{
          position: 'absolute', left: '10px', top: '12px', bottom: '12px',
          width: '2px',
          background: `linear-gradient(to bottom, ${encerrado ? '#166534' : '#1a56db'}, #e2e8f0)`,
        }} />

        {etapas.map((etapa, i) => {
          const concluida = i < atual
          const ativa     = i === atual && !encerrado
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

              <div style={{ opacity: futura ? 0.4 : 1 }}>
                <div style={{
                  fontSize: '0.88rem', fontWeight: '700',
                  color: concluida ? '#166534' : ativa ? '#1a56db' : '#64748b',
                  marginBottom: '2px',
                }}>
                  {etapa.label}
                  {ativa && (
                    <span style={{ marginLeft: '8px', fontSize: '0.65rem', background: '#EBF5FF', color: '#1a56db', borderRadius: '999px', padding: '2px 8px', fontWeight: '700' }}>
                      ATUAL
                    </span>
                  )}
                  {concluida && i === etapas.length - 1 && (
                    <span style={{ marginLeft: '8px', fontSize: '0.65rem', background: '#F0FDF4', color: '#166534', borderRadius: '999px', padding: '2px 8px', fontWeight: '700' }}>
                      CONCLUÍDO
                    </span>
                  )}
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
