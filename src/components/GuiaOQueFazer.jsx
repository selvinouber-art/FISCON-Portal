import React from 'react'

export default function GuiaOQueFazer({ tipo, gerencia }) {
  const ehAuto = tipo === 'auto'
  const ehObras = gerencia === 'obras'

  if (ehAuto) {
    return (
      <div>
        <div className="secao-titulo">O Que Fazer Agora</div>
        <div className="alert alert-red" style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🚨</span>
          <div>
            <div style={{ fontWeight: '700', marginBottom: '4px' }}>AUTO DE INFRAÇÃO — Ação imediata obrigatória</div>
            <div>Você foi autuado por infração à legislação municipal. <strong>A atividade deve ser paralisada imediatamente</strong>, independentemente do prazo de defesa.</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Passo num={1} cor="#B91C1C" titulo="Paralise a atividade AGORA" desc="O prazo de 10 dias para defesa não autoriza a continuação. A paralisação é imediata e obrigatória desde o momento da autuação." urgente />
          <Passo num={2} cor="#1a56db" titulo="Leia o auto com atenção" desc="Verifique as infrações apontadas, os artigos violados e o valor da multa. Entenda exatamente o que foi autuado." />
          <Passo num={3} cor="#1a56db" titulo="Prepare sua defesa em até 10 dias" desc="Você tem 10 dias corridos para apresentar defesa escrita por este portal. Reúna documentos que comprovem sua situação." />
          <Passo num={4} cor="#1a56db" titulo="Considere consultar um advogado" desc="Para processos com multa elevada, a orientação jurídica é recomendada. O processo administrativo tem consequências legais." />
          <Passo num={5} cor="#166534" titulo="Providencie a regularização" desc={ehObras ? "Contrate responsável técnico e dê entrada no processo de alvará junto à SMIU." : "Regularize a situação que originou a infração conforme determinado."} />
        </div>

        <div style={{ marginTop: '14px', padding: '14px 16px', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '12px', fontSize: '0.82rem', color: '#B45309' }}>
          <strong>⚖️ Atenção:</strong> O não cumprimento das determinações pode resultar em embargo da obra, interdição judicial e inscrição da multa em dívida ativa.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="secao-titulo">O Que Fazer Agora</div>
      <div className="alert alert-amber" style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>📋</span>
        <div>
          <div style={{ fontWeight: '700', marginBottom: '4px' }}>NOTIFICAÇÃO PRELIMINAR — Oportunidade de regularização</div>
          <div>Você recebeu uma notificação. Este é o momento de <strong>regularizar a situação</strong> antes que seja necessário abrir um processo de autuação.</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Passo num={1} cor="#B45309" titulo="Paralise a atividade irregular" desc="Pare a obra ou retire o material do passeio público imediatamente, conforme as infrações indicadas na notificação." urgente />
        <Passo num={2} cor="#1a56db" titulo="Entenda a irregularidade" desc="Leia as infrações apontadas. Se tiver dúvidas sobre o que precisa ser feito, procure a Gerência de Fiscalização." />
        <Passo num={3} cor="#1a56db" titulo={ehObras ? "Providencie o alvará" : "Regularize a situação"} desc={ehObras ? "Contrate um responsável técnico (engenheiro ou arquiteto), prepare o projeto e dê entrada no processo de alvará na SMIU." : "Tome as providências para sanar a irregularidade dentro do prazo indicado."} />
        <Passo num={4} cor="#1a56db" titulo="Se discordar, envie sua defesa" desc="Se acreditar que a notificação foi indevida, apresente sua defesa por escrito com os documentos comprobatórios." />
        <Passo num={5} cor="#166534" titulo="Solicite o arquivamento" desc="Após regularizar, solicite uma vistoria pelo portal para que a notificação seja arquivada." />
      </div>

      <div style={{ marginTop: '14px', padding: '14px 16px', background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '12px', fontSize: '0.82rem', color: '#166534' }}>
        <strong>✅ Boa notícia:</strong> Na maioria dos casos, a regularização dentro do prazo resulta no arquivamento da notificação sem autuação.
      </div>
    </div>
  )
}

function Passo({ num, cor, titulo, desc, urgente = false }) {
  return (
    <div style={{
      display: 'flex', gap: '14px', padding: '14px',
      background: urgente ? '#FFF7ED' : '#F8FAFC',
      border: `2px solid ${urgente ? '#FED7AA' : '#E2E8F0'}`,
      borderRadius: '12px',
    }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '50%',
        background: cor, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem', fontWeight: '800', flexShrink: 0,
      }}>
        {num}
      </div>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: '700', color: cor, marginBottom: '3px' }}>{titulo}</div>
        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  )
}
