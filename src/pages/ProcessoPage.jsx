import React, { useState, useEffect } from 'react'
import { buscarDefesaDoRegistro, buscarSolicitacaoProrrogacao } from '../config/supabase.js'
import ContadorPrazo from '../components/ContadorPrazo.jsx'
import LinhaTempo from '../components/LinhaTempo.jsx'
import DocumentoViewer from '../components/DocumentoViewer.jsx'
import StatusDefesa from '../components/StatusDefesa.jsx'
import GuiaOQueFazer from '../components/GuiaOQueFazer.jsx'
import ChecklistRegularizacao from '../components/ChecklistRegularizacao.jsx'
import FAQ from '../components/FAQ.jsx'

export default function ProcessoPage({ registro, onDefesa, onProrrogacao }) {
  const [defesa, setDefesa]               = useState(null)
  const [prorrogacao, setProrrogacao]     = useState(null)
  const [carregando, setCarregando]       = useState(true)

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

  const ehAuto       = registro.type === 'auto'
  const temDefesa    = !!defesa
  const cancelado    = registro.status === 'Cancelado'
  const regularizado = registro.status === 'Regularizado'
  const encerrado    = cancelado || regularizado

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

        {/* Status geral do processo */}
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
            background: sc.fundo, color: sc.cor,
            fontSize: '0.82rem', fontWeight: '700',
            borderRadius: '10px', padding: '8px 16px',
          }}>
            {registro.status}
          </span>
        </div>

        {/* Encerrado */}
        {encerrado && (
          <div className={`alert ${cancelado ? 'alert-blue' : 'alert-green'}`} style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{cancelado ? '📁' : '✅'}</span>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                {cancelado ? 'Processo Cancelado' : 'Processo Regularizado'}
              </div>
              <div style={{ fontSize: '0.82rem' }}>
                {cancelado
                  ? 'Este processo foi cancelado pela Gerência de Fiscalização. Nenhuma ação adicional é necessária.'
                  : 'Parabéns! A situação foi regularizada e o processo foi encerrado com êxito.'}
              </div>
            </div>
          </div>
        )}

        {/* Contador de prazo */}
        {!encerrado && (
          <div style={{ marginBottom: '20px' }}>
            <ContadorPrazo prazo={registro.prazo} tipo={registro.type} />
          </div>
        )}

        {/* Status da defesa (se existir) */}
        {temDefesa && (
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
                Sua solicitação de prorrogação de prazo está em análise. Justificativa: <em>{prorrogacao.justificativa}</em>
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#1a56db' }}>
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

        {/* Guia O que fazer */}
        {!encerrado && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <GuiaOQueFazer tipo={registro.type} gerencia={registro.gerencia} />
          </div>
        )}

        {/* Botões de ação */}
        {!encerrado && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="secao-titulo">Suas Opções</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Enviar defesa */}
              {!temDefesa ? (
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
              ) : (
                <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>✅</span>
                  <div style={{ fontSize: '0.88rem', color: '#166534', fontWeight: '600' }}>
                    Defesa enviada em {defesa?.created_at ? new Date(defesa.created_at).toLocaleDateString('pt-BR') : '—'}
                  </div>
                </div>
              )}

              {/* Solicitar prorrogação */}
              {!prorrogacao && (
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
        )}

        {/* Checklist */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <ChecklistRegularizacao tipo={registro.type} gerencia={registro.gerencia} />
        </div>

        {/* FAQ */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <FAQ tipo={registro.type} />
        </div>

        {/* Histórico de acessos */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <HistoricoAcessos registro={registro} />
        </div>

        {/* Links úteis */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <LinksUteis />
        </div>

      </div>
    </div>
  )
}

function HistoricoAcessos({ registro }) {
  return (
    <div>
      <div className="secao-titulo">Registro de Acessos</div>
      <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ color: '#1a56db' }}>🔐</span>
          <span>Documento emitido em <strong>{registro.date}</strong></span>
        </div>
        {registro.ciencia_em && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ color: '#166534' }}>✅</span>
            <span>Ciência confirmada em <strong>{new Date(registro.ciencia_em).toLocaleString('pt-BR')}</strong></span>
          </div>
        )}
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
          Os registros de acesso são armazenados para fins de comprovação legal.
        </div>
      </div>
    </div>
  )
}

function LinksUteis() {
  const links = [
    { label: 'Portal da Prefeitura', url: 'https://www.pmvc.ba.gov.br', icone: '🏛️' },
    { label: 'Sec. de Infraestrutura Urbana', url: 'https://www.pmvc.ba.gov.br/secretarias/infraestrutura', icone: '🏗️' },
    { label: 'Consultar Alvará Online', url: 'https://www.pmvc.ba.gov.br/alvara', icone: '📋' },
    { label: 'Ouvidoria Municipal', url: 'https://www.pmvc.ba.gov.br/ouvidoria', icone: '📢' },
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
            transition: 'border-color 0.15s',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{l.icone}</span>
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
