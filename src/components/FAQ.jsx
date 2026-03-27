import React, { useState } from 'react'

const PERGUNTAS = [
  {
    q: 'Posso continuar a obra após receber uma notificação?',
    a: 'Depende da situação. A notificação preliminar determina a paralisação da obra ou a retirada do material irregular. Você deve paralisar e providenciar a regularização dentro do prazo. Continuar a obra sem regularizar pode resultar em auto de infração, embargo e interdição judicial.',
  },
  {
    q: 'Posso continuar a obra após ser autuado?',
    a: 'NÃO. O auto de infração determina a paralisação imediata da obra. O prazo de 10 dias é exclusivamente para apresentar defesa administrativa — não autoriza a continuação da atividade irregular.',
  },
  {
    q: 'O que é um Auto de Infração?',
    a: 'O Auto de Infração é um documento que formaliza a infração à legislação municipal. Ao contrário da notificação (que é um aviso), o auto abre um processo administrativo, pode gerar multa e submete o infrator a sanções como embargo da obra e interdição judicial.',
  },
  {
    q: 'O que é embargo de obra?',
    a: 'O embargo é a interdição oficial da obra, determinando sua paralisação total. Uma obra embargada não pode ter nenhuma atividade até que a irregularidade seja sanada e o embargo seja levantado pela fiscalização.',
  },
  {
    q: 'O que acontece se eu não apresentar defesa no prazo?',
    a: 'A defesa é considerada intempestiva (fora do prazo). O processo segue com o julgamento baseado nas informações do auto. A multa pode ser mantida e o processo encaminhado para cobrança.',
  },
  {
    q: 'Preciso de advogado para fazer a defesa?',
    a: 'Não é obrigatório, mas é recomendado para casos mais complexos. Você pode fazer a defesa diretamente por este portal, por escrito, apresentando os fatos e documentos que comprovam sua situação.',
  },
  {
    q: 'Como obter alvará de construção?',
    a: 'O processo de obtenção de alvará é feito na Secretaria Municipal de Infraestrutura Urbana (SMIU). Você precisará de um responsável técnico (engenheiro ou arquiteto), projeto aprovado e documentação do imóvel. Acesse o Portal da Prefeitura para mais informações.',
  },
  {
    q: 'A notificação e o auto de infração se anulam?',
    a: 'Não. Uma notificação prévia não é pré-requisito para o auto de infração. O fiscal pode autuar diretamente quando a infração justificar. Regularizar após a notificação não cancela automaticamente um auto já lavrado.',
  },
  {
    q: 'Minha defesa foi indeferida. O que posso fazer?',
    a: 'Você pode recorrer da decisão no prazo estabelecido pela legislação municipal. Consulte a Gerência de Fiscalização pessoalmente ou por meio de seu advogado para orientações sobre o recurso.',
  },
  {
    q: 'Como sei se minha defesa foi analisada?',
    a: 'Acesse este portal com o mesmo código de acesso a qualquer momento. O status da defesa será atualizado para "Deferida" ou "Indeferida" junto com o parecer da gerência.',
  },
]

export default function FAQ({ tipo }) {
  const [aberta, setAberta] = useState(null)

  return (
    <div>
      <div className="secao-titulo">Perguntas Frequentes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PERGUNTAS.map((item, i) => (
          <div key={i} style={{
            border: `2px solid ${aberta === i ? '#BFDBFE' : '#E2E8F0'}`,
            borderRadius: '12px', overflow: 'hidden',
            background: aberta === i ? '#F0F7FF' : '#fff',
          }}>
            <button onClick={() => setAberta(aberta === i ? null : i)} style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: '12px',
              padding: '14px 16px', background: 'transparent',
              borderRadius: 0, textAlign: 'left',
            }}>
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1e293b', lineHeight: 1.4 }}>
                {item.q}
              </span>
              <span style={{
                fontSize: '1.1rem', color: '#1a56db', flexShrink: 0,
                transform: aberta === i ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}>▾</span>
            </button>
            {aberta === i && (
              <div style={{ padding: '0 16px 14px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
