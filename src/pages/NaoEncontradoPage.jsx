import React from 'react'

export default function NaoEncontradoPage({ onVoltar }) {
  return (
    <div className="container">
      <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', paddingTop: '16px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#001f5e', marginBottom: '10px' }}>
          Código Não Encontrado
        </h2>
        <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.9rem' }}>
          Não encontramos nenhum processo com o código informado. Verifique se digitou corretamente.
        </p>

        <div className="card" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <div className="secao-titulo">Dicas</div>
          <ul style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 2, paddingLeft: '20px' }}>
            <li>O código está impresso na notificação ou auto que você recebeu</li>
            <li>Fica logo abaixo do QR Code</li>
            <li>São 8 caracteres (letras e números)</li>
            <li>Não há diferença entre maiúsculas e minúsculas</li>
            <li>Não inclua espaços</li>
          </ul>
        </div>

        <div className="alert alert-amber" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <span style={{ fontSize: '1.2rem' }}>📞</span>
          <div style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>
            Se não encontrar o código, procure presencialmente a Gerência de Fiscalização na Prefeitura Municipal de Vitória da Conquista.
            <br/><strong>Endereço:</strong> Praça Joaquim Correia, 55, Centro — Seg a Sex: 08h às 14h
          </div>
        </div>

        <button onClick={onVoltar} style={{
          background: '#001f5e', color: '#fff', padding: '14px 32px',
          fontSize: '1rem', fontWeight: '700', borderRadius: '12px',
        }}>
          ← Tentar Novamente
        </button>
      </div>
    </div>
  )
}
