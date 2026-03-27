import React, { useState } from 'react'
import { enviarProrrogacao } from '../config/supabase.js'

export default function ProrrogacaoPage({ registro, onEnviada, onVoltar }) {
  const [form, setForm] = useState({ nome: registro?.owner || '', cpf: registro?.cpf || '', justificativa: '' })
  const [enviando, setEnviando] = useState(false)
  const [erros, setErros]       = useState({})

  function validar() {
    const e = {}
    if (!form.nome.trim())             e.nome          = 'Nome obrigatório'
    if (!form.cpf.trim())              e.cpf           = 'CPF obrigatório'
    if (form.justificativa.trim().length < 30) e.justificativa = `Mínimo 30 caracteres (${form.justificativa.trim().length}/30)`
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleEnviar() {
    if (!validar()) return
    setEnviando(true)
    try {
      await enviarProrrogacao({
        id:             `prorr-${Date.now()}`,
        record_id:      registro.id,
        record_num:     registro.num,
        nome:           form.nome.trim(),
        cpf:            form.cpf.trim(),
        justificativa:  form.justificativa.trim(),
        status:         'pendente',
        solicitado_em:  new Date().toISOString(),
      })
      onEnviada()
    } catch (err) {
      setErros(e => ({ ...e, geral: `Erro: ${err.message || 'tente novamente'}` }))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onVoltar} style={{ background: 'none', padding: '8px', borderRadius: '8px', border: '2px solid #E2E8F0', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
            ← Voltar
          </button>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#001f5e', margin: 0 }}>Solicitar Prorrogação</h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Ref.: {registro?.num}</div>
          </div>
        </div>

        <div className="alert alert-amber" style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>📅</span>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
            <strong>Atenção:</strong> A prorrogação de prazo está sujeita à análise e aprovação pela Gerência de Fiscalização. Não é automática. Enquanto aguarda, respeite o prazo original <strong>({registro?.prazo})</strong>.
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="secao-titulo">Dados do Solicitante</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Campo label="Nome completo *" erro={erros.nome}>
              <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Seu nome completo" />
            </Campo>
            <Campo label="CPF *" erro={erros.cpf}>
              <input value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
            </Campo>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="secao-titulo">Justificativa *</div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '10px' }}>
            Explique detalhadamente por que precisa de mais prazo. Justificativas vagas têm menor chance de aprovação.
          </div>
          <Campo erro={erros.justificativa}>
            <textarea
              value={form.justificativa}
              onChange={e => setForm(f => ({ ...f, justificativa: e.target.value }))}
              placeholder="Ex: Estou em tratamento de saúde e preciso de mais tempo para reunir os documentos necessários para regularização. Segue comprovante em anexo..."
              rows={6} style={{ resize: 'vertical' }}
            />
          </Campo>
          <div style={{ fontSize: '0.75rem', color: form.justificativa.trim().length < 30 ? '#B91C1C' : '#166534', marginTop: '4px', fontWeight: '600' }}>
            {form.justificativa.trim().length} caracteres {form.justificativa.trim().length < 30 ? '(mínimo 30)' : '✓'}
          </div>
        </div>

        {erros.geral && <div className="alert alert-red" style={{ marginBottom: '16px' }}><span>⚠️</span><span>{erros.geral}</span></div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleEnviar} disabled={enviando} style={{
            width: '100%', background: '#001f5e', color: '#fff', padding: '16px',
            fontSize: '1rem', fontWeight: '700', borderRadius: '12px',
          }}>
            {enviando ? '⏳ Enviando...' : '📅 Enviar Solicitação de Prorrogação'}
          </button>
          <button onClick={onVoltar} style={{
            width: '100%', background: '#fff', color: '#64748b',
            border: '2px solid #E2E8F0', padding: '13px',
            fontSize: '0.95rem', fontWeight: '600', borderRadius: '12px',
          }}>
            Cancelar
          </button>
        </div>

      </div>
    </div>
  )
}

function Campo({ label, children, erro }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {label && <label style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>{label}</label>}
      {children}
      {erro && <span style={{ fontSize: '0.75rem', color: '#B91C1C', fontWeight: '500' }}>{erro}</span>}
    </div>
  )
}
