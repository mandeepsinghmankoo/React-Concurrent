function filterData(items, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return items
  }

  return items.filter((item) => {
    const haystack = `${item.name} ${item.category}`.toLowerCase()
    return haystack.includes(normalized)
  })
}

const regexCache = new Map()

function highlightMatch(text, query) {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) {
    return [{ type: 'text', text, key: `text-${text}` }]
  }

  let regex = regexCache.get(normalizedQuery)
  if (!regex) {
    regex = new RegExp(`(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
    regexCache.set(normalizedQuery, regex)
  }

  const parts = text.split(regex)
  return parts.map((part, index) => {
    if (part.toLowerCase() === normalizedQuery.toLowerCase()) {
      return { type: 'match', text: part, key: `${part}-${index}` }
    }
    return { type: 'text', text: part, key: `${part}-${index}` }
  })
}

export { filterData, highlightMatch }
export default filterData
