import React, { useState, useEffect } from 'react'
import { buscarDefesaDoRegistro, buscarSolicitacaoProrrogacao } from '../config/supabase.js'
import ContadorPrazo from '../components/ContadorPrazo.jsx'
import LinhaTempo from '../components/LinhaTempo.jsx'
import DocumentoViewer from '../components/DocumentoViewer.jsx'
import StatusDefesa from '../components/StatusDefesa.jsx'
import GuiaOQueFazer from '../components/GuiaOQueFazer.jsx'
import FAQ from '../components/FAQ.jsx'

export default function ProcessoPage({ registro, onDefesa, onProrrogacao }) {
  const [defesa, setDefesa]           = useState(null)
  const [prorrogacao, setProrrogacao] = useState(null)
  const [carregando, setCarregando]   = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const [d, p] = await Promise.all([
          buscarDefesaDoRegistro(registro.id),
          buscarSolicitacaoProrrogacao(registro.id),
        ])
        setDefesa(d)
        setProrrogacao(p)
      } catch { /* silencioso */ }
      finally { setCarregando(false) }
    }
    carregar()
  }, [registro.id])

  const ehAuto        = registro.type === 'auto'
  const cancelado     = registro.status === 'Cancelado'
  const regularizado  = registro.status === 'Regularizado'
  const deferida      = defesa?.status === 'deferida'
  const encerrado     = cancelado || regularizado || deferida

  const STATUS_CORES = {
    'Pendente':          { cor: '#B45309', fundo: '#FEF3C7' },
    'Regularizado':      { cor: '#166534', fundo: '#F0FDF4' },
    'Em recurso':        { cor: '#1a56db', fundo: '#EBF5FF' },
    'Autuado':           { cor: '#B91C1C', fundo: '#FEE2E2' },
    'Cancelado':         { cor: '#6B7280', fundo: '#F1F5F9' },
    'Multa Encaminhada': { cor: '#B91C1C', fundo: '#FEE2E2' },
  }
  const sc = STATUS_CORES[registro.status] || { cor: '#6B7280', fundo: '#F1F5F9' }

  if (carregando) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
        <div style={{ color: '#64748b' }}>Carregando processo...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header do processo */}
        <div style={{
          background: '#001f5e', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '14px',
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {ehAuto ? 'Auto de Infração' : 'Notificação Preliminar'}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', letterSpacing: '0.04em' }}>
              {registro.num}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
              Emitido em {registro.date} • {registro.addr}
            </div>
          </div>
          <span style={{
            background: deferida ? '#F0FDF4' : sc.fundo,
            color: deferida ? '#166534' : sc.cor,
            fontSize: '0.82rem', fontWeight: '700',
            borderRadius: '10px', padding: '8px 16px',
          }}>
            {deferida ? '✅ Defesa Deferida' : registro.status}
          </span>
        </div>

        {/* Banner de encerramento */}
        {encerrado && (
          <div className={`alert ${deferida || regularizado ? 'alert-green' : 'alert-blue'}`} style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
              {deferida ? '⚖️' : regularizado ? '✅' : '📁'}
            </span>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                {deferida ? 'Defesa Deferida — Processo Encerrado'
                  : regularizado ? 'Processo Regularizado'
                  : 'Processo Cancelado'}
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                {deferida
                  ? 'Sua defesa foi aceita pela Gerência de Fiscalização. O processo está encerrado e nenhuma penalidade será aplicada.'
                  : regularizado
                  ? 'Parabéns! A situação foi regularizada e o processo foi encerrado com êxito.'
                  : 'Este processo foi cancelado pela Gerência. Nenhuma ação adicional é necessária.'}
              </div>
            </div>
          </div>
        )}

        {/* Contador de prazo — só aparece se não julgado e não encerrado */}
        {!encerrado && (
          <div style={{ marginBottom: '20px' }}>
            <ContadorPrazo prazo={registro.prazo} tipo={registro.type} defesa={defesa} />
          </div>
        )}

        {/* Status da defesa */}
        {defesa && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <StatusDefesa defesa={defesa} />
          </div>
        )}

        {/* Prorrogação solicitada */}
        {prorrogacao && (
          <div className="alert alert-blue" style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>📅</span>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>Prorrogação Solicitada</div>
              <div style={{ fontSize: '0.82rem' }}>
                Status: {prorrogacao.status === 'pendente' ? 'Aguardando análise' : prorrogacao.status}
              </div>
            </div>
          </div>
        )}

        {/* Linha do tempo */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <LinhaTempo registro={registro} defesa={defesa} />
        </div>

        {/* Documento oficial */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <DocumentoViewer registro={registro} />
        </div>

        {/* Guia e ações — só se não encerrado */}
        {!encerrado && (
          <>
            <div className="card" style={{ marginBottom: '20px' }}>
              <GuiaOQueFazer tipo={registro.type} gerencia={registro.gerencia} />
            </div>

            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="secao-titulo">Suas Opções</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {!defesa ? (
                  <button onClick={onDefesa} style={{
                    background: '#001f5e', color: '#fff', padding: '16px',
                    fontSize: '1rem', fontWeight: '700', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>⚖️</span>
                    <div style={{ textAlign: 'left' }}>
                      <div>Enviar Defesa Administrativa</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.8, marginTop: '1px' }}>
                        {ehAuto ? 'Prazo: 10 dias corridos a partir da autuação' : 'Apresente sua contestação por escrito'}
                      </div>
                    </div>
                  </button>
                ) : defesa.status === 'pendente' ? (
                  <div style={{ background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3rem' }}>⏳</span>
                    <div style={{ fontSize: '0.88rem', color: '#B45309', fontWeight: '600' }}>
                      Defesa enviada em {defesa?.created_at ? new Date(defesa.created_at).toLocaleDateString('pt-BR') : '—'} — Aguardando julgamento
                    </div>
                  </div>
                ) : null}

                {!prorrogacao && !defesa && (
                  <button onClick={onProrrogacao} style={{
                    background: '#fff', color: '#001f5e',
                    border: '2px solid #001f5e',
                    padding: '14px', fontSize: '0.95rem', fontWeight: '700', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                  }}>
                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                    <div style={{ textAlign: 'left' }}>
                      <div>Solicitar Prorrogação de Prazo</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '400', opacity: 0.7, marginTop: '1px' }}>
                        Sujeito à análise e aprovação da Gerência
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* FAQ */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <FAQ tipo={registro.type} />
        </div>

        {/* Histórico de acessos */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <HistoricoAcessos registro={registro} defesa={defesa} />
        </div>

        {/* Links úteis */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <LinksUteis />
        </div>

      </div>
    </div>
  )
}

function HistoricoAcessos({ registro, defesa }) {
  return (
    <div>
      <div className="secao-titulo">Registro de Acessos e Movimentações</div>
      <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ color: '#1a56db' }}>🔐</span>
          <span>Documento emitido em <strong>{registro.date}</strong> por {registro.fiscal}</span>
        </div>
        {registro.ciencia_em && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ color: '#166534' }}>✅</span>
            <span>Ciência confirmada em <strong>{new Date(registro.ciencia_em).toLocaleString('pt-BR')}</strong></span>
          </div>
        )}
        {defesa && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ color: '#1a56db' }}>⚖️</span>
            <span>
              Defesa enviada em <strong>{defesa.created_at ? new Date(defesa.created_at).toLocaleString('pt-BR') : '—'}</strong>
              {defesa.num && <span> — Protocolo: <strong>{defesa.num}</strong></span>}
            </span>
          </div>
        )}
        {defesa?.status !== 'pendente' && defesa && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ color: defesa.status === 'deferida' ? '#166534' : '#B91C1C' }}>
              {defesa.status === 'deferida' ? '✅' : '❌'}
            </span>
            <span>
              Defesa <strong>{defesa.status === 'deferida' ? 'deferida' : 'indeferida'}</strong> por {defesa.julgado_por} em {defesa.julgado_em}
            </span>
          </div>
        )}
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
          O número de protocolo da defesa (ex: DEF-NP-XXXX/XXXX) é o comprovante oficial de que sua defesa foi recebida e protocolada. Guarde-o para eventuais recursos.
        </div>
      </div>
    </div>
  )
}

function LinksUteis() {
  const links = [
    { label: 'Portal da Prefeitura',         url: 'https://www.pmvc.ba.gov.br',                           icone: '🏛️' },
    { label: 'SEINFRA — Infraestrutura',     url: 'https://www.pmvc.ba.gov.br/infraestrutura-urbana/',    icone: '🏗️' },
    { label: 'Tudo Fácil — Alvará Online',   url: 'https://tudofacil.pmvc.ba.gov.br',                     icone: '📋' },
    { label: 'Ouvidoria Municipal',           url: 'https://www.pmvc.ba.gov.br/ouvidoria',                 icone: '📢' },
  ]
  return (
    <div>
      <div className="secao-titulo">Links Úteis</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {links.map(l => (
          <a key={l.label} href={l.url} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px', borderRadius: '10px',
            border: '2px solid #E2E8F0', background: '#F8FAFC',
            color: '#1e293b', textDecoration: 'none',
            fontSize: '0.8rem', fontWeight: '600',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{l.icone}</span>
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
