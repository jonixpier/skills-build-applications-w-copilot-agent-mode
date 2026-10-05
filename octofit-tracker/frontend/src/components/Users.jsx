import { useEffect, useState } from 'react'
import { apiBaseUrl, normalizeCollection } from '../api.js'
import { CollectionState, PageIntro } from './PageFrame.jsx'

function initials(name) {
  return (name || 'Member')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadUsers() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/users/`)
        if (!response.ok) throw new Error(`Members request failed (${response.status})`)
        const payload = await response.json()
        if (isCurrent) setUsers(normalizeCollection(payload))
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load members.')
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    void loadUsers()
    return () => { isCurrent = false }
  }, [])

  return (
    <>
      <PageIntro
        eyebrow="COMMUNITY / 04"
        title="Members"
        description="People making progress across the tracker."
        count={`${users.length} MEMBERS`}
      />

      <CollectionState
        loading={loading}
        error={error}
        isEmpty={!users.length}
        emptyMessage="No members have joined yet."
      />

      {!loading && !error && users.length > 0 && (
        <section className="data-section">
          <div className="section-toolbar">
            <h2>All members</h2>
            <span>PROFILE DIRECTORY</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 data-table">
              <thead>
                <tr><th>MEMBER</th><th>USERNAME</th><th>EMAIL</th><th>AGE</th><th>JOINED</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id || user.username}>
                    <td>
                      <span className="user-identity">
                        <span className="avatar-initials" aria-hidden="true">{initials(user.displayName)}</span>
                        <strong>{user.displayName || user.username || 'Member'}</strong>
                      </span>
                    </td>
                    <td className="muted-cell">@{user.username || 'member'}</td>
                    <td>{user.email || 'Email not set'}</td>
                    <td>{user.age ? `${user.age} yrs` : 'Not set'}</td>
                    <td className="muted-cell">
                      {user.createdAt ? new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(user.createdAt)) : 'Recently'}
                    </td>
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

export default Users