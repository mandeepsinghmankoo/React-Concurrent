function SearchBox({ value, onChange, resultCount, isPending }) {
  return (
    <div className="search-card">
      <label className="search-label" htmlFor="search-input">
        Search products
      </label>
      <div className="search-row">
        <input
          id="search-input"
          className="search-input"
          type="text"
          placeholder="Try “phone”, “laptop”, “apple”, or “watch”"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={`search-pill${isPending ? ' pending' : ''}`}>
          {isPending ? 'Loading…' : `${resultCount} matches`}
        </span>
      </div>
    </div>
  )
}

export default SearchBox
