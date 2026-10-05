import { useEffect, useState } from 'react'
import { apiBaseUrl, normalizeCollection } from '../api.js'
import { CollectionState, PageIntro } from './PageFrame.jsx'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadTeams() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/teams/`)
        if (!response.ok) throw new Error(`Teams request failed (${response.status})`)
        const payload = await response.json()
        if (isCurrent) setTeams(normalizeCollection(payload))
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load teams.')
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    void loadTeams()
    return () => { isCurrent = false }
  }, [])

  return (
    <>
      <PageIntro
        eyebrow="COMMUNITY / 03"
        title="Teams"
        description="Find your crew and see who is moving together."
        count={`${teams.length} TEAMS`}
      />

      <CollectionState
        loading={loading}
        error={error}
        isEmpty={!teams.length}
        emptyMessage="No teams have been created yet."
      />

      {!loading && !error && teams.length > 0 && (
        <div className="team-grid">
          {teams.map((team, index) => (
            <article className="team-item" key={team._id || team.name}>
              <div className="team-topline">
                <span className="team-index">TEAM {String(index + 1).padStart(2, '0')}</span>
                <span className="member-count">{team.members?.length || 0} MEMBERS</span>
              </div>
              <h2>{team.name}</h2>
              <p className="team-description">{team.description || 'No team description yet.'}</p>
              <div className="team-divider" />
              <ul className="team-members" aria-label={`${team.name} members`}>
                {(team.members || []).map((member, memberIndex) => (
                  <li key={member?._id || memberIndex}>
                    <span className="member-initial" aria-hidden="true">
                      {(member?.displayName || member?.username || 'M').slice(0, 1).toUpperCase()}
                    </span>
                    <span>{member?.displayName || member?.username || 'Member'}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export default Teams