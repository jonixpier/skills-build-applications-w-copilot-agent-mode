import { useEffect, useState } from 'react'
import { apiBaseUrl, normalizeCollection } from '../api.js'
import { CollectionState, PageIntro } from './PageFrame.jsx'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadLeaderboard() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/leaderboard/`)
        if (!response.ok) throw new Error(`Leaderboard request failed (${response.status})`)
        const payload = await response.json()
        if (isCurrent) setEntries(normalizeCollection(payload))
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load leaderboard.')
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    void loadLeaderboard()
    return () => { isCurrent = false }
  }, [])

  return (
    <>
      <PageIntro
        eyebrow="COMMUNITY / 02"
        title="Leaderboard"
        description="Weekly points earned through consistent movement."
        count={`${entries.length} RANKED`}
      />

      <CollectionState
        loading={loading}
        error={error}
        isEmpty={!entries.length}
        emptyMessage="Leaderboard entries will appear after activities are scored."
      />

      {!loading && !error && entries.length > 0 && (
        <section className="data-section leaderboard-section">
          <div className="section-toolbar">
            <h2>This week</h2>
            <span>POINTS</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 data-table">
              <thead>
                <tr><th>RANK</th><th>MEMBER</th><th>TEAM</th><th>PERIOD</th><th className="number-cell">SCORE</th></tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={entry._id || `${entry.user?._id || entry.user}-${entry.period}`}>
                    <td><span className={`rank-number${index === 0 ? ' rank-first' : ''}`}>{entry.rank || index + 1}</span></td>
                    <td className="member-cell">{entry.user?.displayName || entry.user?.username || 'Member'}</td>
                    <td className="muted-cell">{entry.team?.name || 'Team'}</td>
                    <td><span className="period-tag">{entry.period || 'Current'}</span></td>
                    <td className="number-cell score-cell">{new Intl.NumberFormat().format(Number(entry.points) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  )
}

export default Leaderboard