import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import AdicionarJogo from '../pages/AdicionarJogo'
import NovaAvaliacao from '../pages/NovaAvaliacao'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adicionar-jogo" element={<AdicionarJogo />} />
      <Route path="/nova-avaliacao" element={<NovaAvaliacao />} />
    </Routes>
  )
}