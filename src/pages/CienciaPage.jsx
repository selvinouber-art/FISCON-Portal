import React, { useState } from 'react'
import { registrarCiencia } from '../config/supabase.js'

export default function CienciaPage({ registro, onConfirmar }) {
  const [confirmado, setConfirmado] = useState(false)
  const [salvando, setSalvando]     = useState(false)
  const ehAuto = registro?.type === 'auto'

  async function handleConfirmar() {
    setSalvando(true)
    try {
      await registrarCiencia(registro.id, registro.codigo_acesso)
    } catch { /* silencioso */ }
    finally {
      setSalvando(false)
      onConfirmar()
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '28px', paddingTop: '8px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{ehAuto ? '⚠️' : '📋'}</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#001f5e', marginBottom: '8px' }}>
            Confirmação de Recebimento
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
            Antes de visualizar o documento, confirme que recebeu e tomou ciência do seu conteúdo.
            Este registro tem validade jurídica equivalente à assinatura de recebimento.
          </p>
        </div>

        {/* Dados do documento */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="secao-titulo">Documento Localizado</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InfoItem label="Número" valor={registro?.num} />
            <InfoItem label="Tipo" valor={ehAuto ? 'Auto de Infração' : 'Notificação Preliminar'} />
            <InfoItem label="Data de Emissão" valor={registro?.date} />
            <InfoItem label="Prazo" valor={registro?.prazo} />
            <InfoItem label="Endereço" valor={`${registro?.addr}${registro?.bairro ? ` — ${registro?.bairro}` : ''}`} colSpan />
          </div>
        </div>

        {/* Alerta por tipo */}
        {ehAuto ? (
          <div className="alert alert-red" style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🚨</span>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>AUTO DE INFRAÇÃO</div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                Você recebeu um Auto de Infração. <strong>A atividade deve ser paralisada imediatamente.</strong> O prazo de 10 dias corridos é exclusivamente para apresentar defesa administrativa — não autoriza a continuação da irregularidade.
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-amber" style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>📋</span>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>NOTIFICAÇÃO PRELIMINAR</div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
                Você recebeu uma Notificação Preliminar. Regularize a situação dentro do prazo indicado para evitar a abertura de processo de autuação com multa.
              </div>
            </div>
          </div>
        )}

        {/* Checkbox de confirmação */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setConfirmado(c => !c)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              background: confirmado ? '#F0FDF4' : '#fff',
              border: `2px solid ${confirmado ? '#166534' : '#E2E8F0'}`,
              borderRadius: '12px', padding: '16px', width: '100%',
              textAlign: 'left', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0, marginTop: '1px',
              background: confirmado ? '#166534' : '#fff',
              border: `2px solid ${confirmado ? '#166534' : '#CBD5E0'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {confirmado && <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700' }}>✓</span>}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
              Confirmo que recebi e tomei ciência do{ehAuto ? ' Auto de Infração' : 'a Notificação Preliminar'}{' '}
              <strong>{registro?.num}</strong>, emitido em {registro?.date}, compreendendo seus termos,
              prazos e obrigações legais.
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleConfirmar}
            disabled={!confirmado || salvando}
            style={{
              width: '100%', padding: '16px',
              background: confirmado ? '#001f5e' : '#cbd5e0',
              color: '#fff', fontSize: '1rem', fontWeight: '700',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {salvando ? 'Registrando...' : '✅ Confirmar Ciência e Acessar Documento'}
          </button>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
            A confirmação registra data e hora de acesso. Este dado é armazenado com validade jurídica.
          </div>
        </div>

      </div>
    </div>
  )
}

function InfoItem({ label, valor, colSpan = false }) {
  if (!valor) return null
  return (
    <div style={colSpan ? { gridColumn: '1 / -1' } : {}}>
      <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1e293b' }}>{valor}</div>
    </div>
  )
}
