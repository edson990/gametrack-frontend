
export function formatarPlataformas(plataforma) {
  if (Array.isArray(plataforma)) {
    return plataforma.join(', ')
  }

  if (typeof plataforma !== 'string' || !plataforma.trim()) {
    return 'Não informada'
  }

  const valor = plataforma.trim()

  // Trata o formato JSON: ["PC", "PlayStation"]
  try {
    const convertido = JSON.parse(valor)

    if (Array.isArray(convertido)) {
      return convertido.join(', ')
    }
  } catch {
    // O valor pode estar no formato de array do PostgreSQL.
  }

  // Trata o formato PostgreSQL: {PC} ou {"PC","PlayStation"}
  if (valor.startsWith('{') && valor.endsWith('}')) {
    return (
      valor
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^"|"$/g, ''))
        .filter(Boolean)
        .join(', ') || 'Não informada'
    )
  }

  return valor
}
