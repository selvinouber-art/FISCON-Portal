import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BuscaPage from './pages/BuscaPage.jsx'
import CienciaPage from './pages/CienciaPage.jsx'
import ProcessoPage from './pages/ProcessoPage.jsx'
import DefesaPage from './pages/DefesaPage.jsx'
import DefesaConfirmadaPage from './pages/DefesaConfirmadaPage.jsx'
import ProrrogacaoPage from './pages/ProrrogacaoPage.jsx'
import NaoEncontradoPage from './pages/NaoEncontradoPage.jsx'

export default function App() {
  const [pagina, setPagina]     = useState('busca')
  const [registro, setRegistro] = useState(null)
  const [defesa, setDefesa]     = useState(null)
  const [codigo, setCodigo]     = useState('')

  // Lê código da URL ao iniciar (?codigo=xxxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const c = params.get('codigo')
    if (c) setCodigo(c)
  }, [])

  function navegar(pag, dados = null) {
    if (dados?.registro) setRegistro(dados.registro)
    if (dados?.defesa)   setDefesa(dados.defesa)
    if (dados?.codigo)   setCodigo(dados.codigo)
    setPagina(pag)
    window.scrollTo(0, 0)
  }

  function renderPagina() {
    switch (pagina) {
      case 'busca':
        return <BuscaPage codigoInicial={codigo} onEncontrado={(reg, cod) => navegar('ciencia', { registro: reg, codigo: cod })} onNaoEncontrado={() => navegar('nao-encontrado')} />
      case 'ciencia':
        return <CienciaPage registro={registro} onConfirmar={() => navegar('processo')} />
      case 'processo':
        return <ProcessoPage registro={registro} onDefesa={() => navegar('defesa')} onProrrogacao={() => navegar('prorrogacao')} />
      case 'defesa':
        return <DefesaPage registro={registro} onEnviada={(d) => navegar('defesa-confirmada', { defesa: d })} onVoltar={() => navegar('processo')} />
      case 'defesa-confirmada':
        return <DefesaConfirmadaPage defesa={defesa} registro={registro} onVoltar={() => navegar('processo')} />
      case 'prorrogacao':
        return <ProrrogacaoPage registro={registro} onEnviada={() => navegar('processo')} onVoltar={() => navegar('processo')} />
      case 'nao-encontrado':
        return <NaoEncontradoPage onVoltar={() => navegar('busca')} />
      default:
        return <BuscaPage codigoInicial={codigo} onEncontrado={(reg, cod) => navegar('ciencia', { registro: reg, codigo: cod })} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '24px 0 48px' }}>
        {renderPagina()}
      </main>
      <Footer />
    </div>
  )
}
