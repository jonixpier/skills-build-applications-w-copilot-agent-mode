export function PageIntro({ eyebrow, title, description, count }) {
  return (
    <div className="page-intro">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {count && <span className="page-count">{count}</span>}
    </div>
  )
}

export function CollectionState({ loading, error, isEmpty, emptyMessage }) {
  if (loading) {
    return <div className="collection-state" role="status">Loading records...</div>
  }

  if (error) {
    return <div className="collection-state state-error" role="alert">{error}</div>
  }

  if (isEmpty) {
    return <div className="collection-state">{emptyMessage}</div>
  }

  return null
}
