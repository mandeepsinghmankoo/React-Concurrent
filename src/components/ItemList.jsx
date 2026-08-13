import { memo, useMemo } from 'react'
import { highlightMatch } from '../utils/filterData'

const STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★']
const EMPTY = ['', '☆', '☆☆', '☆☆☆', '☆☆☆☆', '☆☆☆☆☆']

function renderParts(parts) {
  return parts.map((part) =>
    part.type === 'match' ? <mark key={part.key}>{part.text}</mark> : <span key={part.key}>{part.text}</span>
  )
}

const ItemCard = memo(function ItemCard({ item, searchTerm }) {
  const nameParts = useMemo(() => highlightMatch(item.name, searchTerm), [item.name, searchTerm])
  const catParts = useMemo(() => highlightMatch(item.category, searchTerm), [item.category, searchTerm])

  return (
    <article className="item-card">
      <div className="item-card__top">
        <div>
          <h3>{renderParts(nameParts)}</h3>
          <p className="item-meta">{renderParts(catParts)}</p>
        </div>
        <div className="price-pill">${item.price}</div>
      </div>
      <div className="item-card__bottom">
        <div className="rating-row">
          {STARS[item.rating]}{EMPTY[5 - item.rating]}
        </div>
        <span className={`stock-pill ${item.inStock ? 'in-stock' : 'out-stock'}`}>
          {item.inStock ? 'In stock' : 'Out of stock'}
        </span>
      </div>
    </article>
  )
})

const ItemList = memo(function ItemList({ items, searchTerm }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <h3>No matching products</h3>
        <p>Try a broader search term to see more results.</p>
      </div>
    )
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} searchTerm={searchTerm} />
      ))}
    </div>
  )
})

export default ItemList
