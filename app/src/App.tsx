import { useTrilha } from './hooks/useTrilha'
import './App.css'

export default function App() {
  const { trilha, erro } = useTrilha()

  if (erro) return <p style={{ color: 'red', padding: 24 }}>{erro}</p>
  if (!trilha) return <p style={{ color: '#b3c0ee', padding: 24 }}>Carregando…</p>

  return (
    <div style={{ padding: 24, fontFamily: 'Nunito, sans-serif', color: '#f1f4ff', background: '#070c22', minHeight: '100vh' }}>
      <h1 style={{ color: '#ffc531' }}>QPlano Kids ✓</h1>
      <p>Trilha carregada: <strong>{trilha.titulo}</strong></p>
      <p>
        {trilha.missoes.length} missões ·{' '}
        {trilha.missoes.reduce((s, m) => s + m.cartoes.length, 0)} cartões ·{' '}
        {trilha.missoes.reduce((s, m) => s + m.perguntas.length, 0)} perguntas
      </p>
      <ul style={{ marginTop: 16, display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
        {trilha.missoes.map((m) => (
          <li
            key={m.id}
            style={{
              background: 'rgba(22,34,88,.6)',
              borderRadius: 12,
              padding: '10px 14px',
              border: '1px solid rgba(165,190,255,.2)',
            }}
          >
            <strong>M{m.nivel}: {m.titulo}</strong> — {m.cartoes.length} cartões, {m.perguntas.length} perguntas
          </li>
        ))}
      </ul>
    </div>
  )
}
