import React, { useState, useEffect } from 'react'
import { buscarPorCodigo, registrarAcesso } from '../config/supabase.js'

const BRASAO = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Bras%C3%A3o_Vitoria_da_Conquista.svg'

export default function BuscaPage({ codigoInicial, onEncontrado, onNaoEncontrado }) {
  const [codigo, setCodigo]         = useState(codigoInicial || '')
  const [buscando, setBuscando]     = useState(false)
  const [erro, setErro]             = useState('')

  // Auto-busca se vier código na URL
  useEffect(() => {
    if (codigoInicial && codigoInicial.length >= 6) {
      handleBuscar(codigoInicial)
    }
  }, [codigoInicial])

  async function handleBuscar(cod = codigo) {
    const c = cod.trim().toLowerCase()
    if (!c) { setErro('Informe o código de acesso.'); return }
    if (c.length < 6) { setErro('Código inválido. Verifique e tente novamente.'); return }
    setBuscando(true); setErro('')
    try {
      const registro = await buscarPorCodigo(c)
      if (!registro) { onNaoEncontrado(); return }
      await registrarAcesso(registro.id, c)
      onEncontrado(registro, c)
    } catch (err) {
      console.error(err)
      setErro('Erro ao consultar. Verifique sua conexão e tente novamente.')
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '8px' }}>
          <img src={BRASAO} alt="Brasão" style={{ width: '60px', height: '60px', marginBottom: '12px' }} />
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#001f5e', lineHeight: 1.2, marginBottom: '8px' }}>
            Portal de Defesa Administrativa
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Consulte sua notificação ou auto de infração e exerça seu direito de defesa de forma digital, segura e com validade jurídica.
          </p>
        </div>

        {/* Caixa de busca */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
            Código de Acesso
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
            O código está impresso no documento que você recebeu, abaixo do QR Code.
          </div>
          <input
            type="text"
            value={codigo}
            onChange={e => { setCodigo(e.target.value.toLowerCase()); setErro('') }}
            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
            placeholder="Ex: np4a7bx2"
            style={{ fontFamily: "'Courier New', monospace", fontSize: '1.2rem', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '12px' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {erro && (
            <div className="alert alert-red" style={{ marginBottom: '12px' }}>
              <span>⚠️</span><span>{erro}</span>
            </div>
          )}
          <button
            onClick={() => handleBuscar()}
            disabled={buscando}
            style={{
              width: '100%', background: '#001f5e', color: '#fff',
              padding: '14px', fontSize: '1rem', fontWeight: '700',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            {buscando ? '🔍 Consultando...' : '🔍 Consultar Processo'}
          </button>
        </div>

        {/* Como funciona */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="secao-titulo">Como Funciona</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { n: '1', t: 'Localize o código', d: 'O código de acesso está impresso na notificação ou auto que você recebeu, abaixo do QR Code.' },
              { n: '2', t: 'Consulte o processo', d: 'Digite o código e acesse os detalhes completos do documento oficial emitido pela fiscalização.' },
              { n: '3', t: 'Leia e entenda', d: 'Veja as infrações, o prazo, o guia de orientação e entenda seus direitos e obrigações.' },
              { n: '4', t: 'Envie sua defesa', d: 'Se discordar, apresente sua defesa por escrito com documentos comprobatórios. Tudo com validade jurídica.' },
            ].map(p => (
              <div key={p.n} style={{ display: 'flex', gap: '12px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: '#001f5e', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: '800',
                }}>
                  {p.n}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>{p.t}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerta importante */}
        <div className="alert alert-amber">
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚖️</span>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
            <strong>Atenção:</strong> Este portal tem validade jurídica. Os documentos, confirmações e defesas aqui registrados produzem efeitos legais conforme a legislação municipal. Mantenha o código de acesso em segurança.
          </div>
        </div>

      </div>
    </div>
  )
}
