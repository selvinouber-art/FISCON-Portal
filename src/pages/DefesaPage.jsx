import React, { useState } from 'react'
import { enviarDefesa, uploadAnexo } from '../config/supabase.js'

function gerarNumDefesa(registroNum) {
  const ano  = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 9000) + 1000
  const tipo = registroNum?.startsWith('AI') ? 'DEF-AI' : 'DEF-NP'
  return `${tipo}-${rand}/${ano}`
}

// Máscara CPF/CNPJ — detecta automaticamente pelo número de dígitos
function mascaraCpfCnpj(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 14)
  if (n.length <= 11) {
    if (n.length <= 3) return n
    if (n.length <= 6) return `${n.slice(0,3)}.${n.slice(3)}`
    if (n.length <= 9) return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6)}`
    return `${n.slice(0,3)}.${n.slice(3,6)}.${n.slice(6,9)}-${n.slice(9)}`
  } else {
    if (n.length <= 12) return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}/${n.slice(8)}`
    return `${n.slice(0,2)}.${n.slice(2,5)}.${n.slice(5,8)}/${n.slice(8,12)}-${n.slice(12)}`
  }
}

export default function DefesaPage({ registro, onEnviada, onVoltar }) {
  const [form, setForm] = useState({
    nome:     registro?.owner || '',
    cpf:      registro?.cpf   || '',
    email:    '',
    telefone: '',
    texto:    '',
  })
  const [anexos, setAnexos]         = useState([])
  const [enviando, setEnviando]     = useState(false)
  const [erros, setErros]           = useState({})
  const [uploadando, setUploadando] = useState(false)

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
    setErros(e => ({ ...e, [campo]: '' }))
  }

  function handleCpf(e) {
    const mascarado = mascaraCpfCnpj(e.target.value)
    set('cpf', mascarado)
  }

  async function handleAnexo(e) {
    const files = Array.from(e.target.files)
    if (anexos.length + files.length > 3) {
      setErros(er => ({ ...er, anexos: 'Máximo de 3 anexos' }))
      return
    }
    setUploadando(true)
    try {
      const urls = []
      for (let i = 0; i < files.length; i++) {
        const url = await uploadAnexo(files[i], registro.id, anexos.length + i)
        urls.push({ nome: files[i].name, url })
      }
      setAnexos(a => [...a, ...urls])
    } catch { setErros(er => ({ ...er, anexos: 'Erro ao enviar arquivo' })) }
    finally { setUploadando(false); e.target.value = '' }
  }

  function validar() {
    const e = {}
    if (!form.nome.trim())             e.nome  = 'Nome obrigatório'
    if (!form.cpf.trim())              e.cpf   = 'CPF ou CNPJ obrigatório'
    if (form.texto.trim().length < 30) e.texto = `Mínimo 30 caracteres (${form.texto.trim().length}/30)`
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleEnviar() {
    if (!validar()) return
    setEnviando(true)
    try {
      const numDefesa = gerarNumDefesa(registro.num)
      const defesa = await enviarDefesa({
        id:         `def-${Date.now()}`,
        gerencia:   registro.gerencia,
        record_id:  registro.id,
        record_num: registro.num,
        num:        numDefesa,
        nome:       form.nome.trim(),
        cpf:        form.cpf.trim(),
        email:      form.email.trim(),
        telefone:   form.telefone.trim(),
        texto:      form.texto.trim(),
        anexos:     anexos.map(a => a.url),
        status:     'pendente',
      })
      onEnviada(defesa || { id: `def-${Date.now()}`, num: numDefesa, ...form, record_num: registro.num })
    } catch (err) {
      console.error(err)
      setErros(e => ({ ...e, geral: `Erro ao enviar: ${err.message || 'tente novamente'}` }))
    } finally {
      setEnviando(false)
    }
  }

  const ehAuto = registro?.type === 'auto'
  const chars  = form.texto.trim().length

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onVoltar} style={{ background: 'none', padding: '8px', borderRadius: '8px', border: '2px solid #E2E8F0', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
            ← Voltar
          </button>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#001f5e', margin: 0 }}>Defesa Administrativa</h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              Ref.: {registro?.num} — {ehAuto ? 'Auto de Infração' : 'Notificação Preliminar'}
            </div>
          </div>
        </div>

        <div className={`alert ${ehAuto ? 'alert-red' : 'alert-amber'}`} style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⏰</span>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
            {ehAuto
              ? <><strong>Prazo: 10 dias corridos</strong> a partir da data de autuação ({registro?.date}). Prazo final: <strong>{registro?.prazo}</strong></>
              : <>Prazo de regularização: <strong>{registro?.prazo}</strong>. Envie sua defesa se discordar da notificação.</>
            }
          </div>
        </div>

        {/* Dados do defensor */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="secao-titulo">Dados do Defensor</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Campo label="Nome completo *" erro={erros.nome}>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome completo" />
            </Campo>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Campo label="CPF / CNPJ *" erro={erros.cpf}>
                <input
                  value={form.cpf}
                  onChange={handleCpf}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </Campo>
              <Campo label="Telefone">
                <input value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(77) 99999-9999" />
              </Campo>
            </div>
            <Campo label="E-mail (para receber confirmação)">
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="seuemail@exemplo.com" />
            </Campo>
          </div>
        </div>

        {/* Texto da defesa */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="secao-titulo">Texto da Defesa</div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px', lineHeight: 1.6 }}>
            Descreva de forma clara e objetiva os fatos que embasam sua defesa. Inclua datas, documentos mencionados e qualquer informação relevante.
          </div>
          <Campo erro={erros.texto}>
            <textarea
              value={form.texto}
              onChange={e => set('texto', e.target.value)}
              placeholder={`Apresento defesa referente à ${ehAuto ? `Autuação ${registro?.num}` : `Notificação ${registro?.num}`}, pelos seguintes motivos:\n\n1. ...\n2. ...\n\nDiante do exposto, requer-se o deferimento da presente defesa.`}
              rows={10}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </Campo>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <div style={{ fontSize: '0.75rem', color: chars < 30 ? '#B91C1C' : '#166534', fontWeight: '600' }}>
              {chars} caracteres {chars < 30 ? `(mínimo 30)` : '✓'}
            </div>
          </div>
        </div>

        {/* Anexos */}
        <div className="card" style={{ marginBottom: '16px' }}>
          <div className="secao-titulo">Documentos Comprobatórios (opcional)</div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>
            Anexe até 3 documentos: alvará, nota fiscal, foto, procuração ou qualquer comprovante relevante.
          </div>
          {anexos.length < 3 && (
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px', border: '2px dashed #CBD5E0', borderRadius: '10px',
              cursor: uploadando ? 'wait' : 'pointer', background: '#F8FAFC',
              color: '#64748b', fontWeight: '600', fontSize: '0.88rem',
              marginBottom: anexos.length > 0 ? '12px' : 0,
            }}>
              {uploadando ? '⏳ Enviando...' : '📎 Clique para anexar arquivo'}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleAnexo} style={{ display: 'none' }} disabled={uploadando} />
            </label>
          )}
          {erros.anexos && <div style={{ fontSize: '0.78rem', color: '#B91C1C', marginTop: '6px' }}>{erros.anexos}</div>}
          {anexos.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {anexos.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#166534' }}>
                    <span>📎</span>
                    <span style={{ fontWeight: '600' }}>{a.nome}</span>
                  </div>
                  <button onClick={() => setAnexos(anx => anx.filter((_, j) => j !== i))} style={{ background: 'none', color: '#B91C1C', padding: '2px 6px', fontSize: '0.8rem', fontWeight: '700' }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Declaração */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.7 }}>
            <strong style={{ color: '#001f5e' }}>Declaração:</strong> Ao enviar esta defesa, declaro que as informações prestadas são verdadeiras e que os documentos anexados são autênticos, assumindo as responsabilidades legais pelo seu conteúdo. Os dados informados são tratados conforme a LGPD para fins de fiscalização municipal.
          </div>
        </div>

        {erros.geral && (
          <div className="alert alert-red" style={{ marginBottom: '16px' }}>
            <span>⚠️</span><span>{erros.geral}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleEnviar} disabled={enviando} style={{
            width: '100%', background: '#001f5e', color: '#fff', padding: '16px',
            fontSize: '1rem', fontWeight: '700', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            {enviando ? '⏳ Enviando defesa...' : '⚖️ Enviar Defesa Administrativa'}
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
