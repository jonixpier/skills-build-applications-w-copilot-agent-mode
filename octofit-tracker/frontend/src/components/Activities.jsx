import { useEffect, useState } from 'react'
import { apiBaseUrl, formatDate, normalizeCollection } from '../api.js'
import { CollectionState, PageIntro } from './PageFrame.jsx'

function memberName(user) {
  return user?.displayName || user?.username || 'Member'
}

function teamName(team) {
  return team?.name || 'Independent'
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(Number(value) || 0)
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadActivities() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/activities/`)
        if (!response.ok) throw new Error(`Activities request failed (${response.status})`)
        const payload = await response.json()
        if (isCurrent) setActivities(normalizeCollection(payload))
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load activities.')
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    void loadActivities()
    return () => { isCurrent = false }
  }, [])

  const totalMinutes = activities.reduce((total, activity) => total + (Number(activity.durationMinutes) || 0), 0)
  const totalCalories = activities.reduce((total, activity) => total + (Number(activity.caloriesBurned) || 0), 0)
  const totalDistance = activities.reduce((total, activity) => total + (Number(activity.distanceKm) || 0), 0)

  return (
    <>
      <PageIntro
        eyebrow="MOVEMENT / 01"
        title="Activity log"
        description="Recent sessions across your OctoFit community."
        count={`${activities.length} ENTRIES`}
      />

      <CollectionState
        loading={loading}
        error={error}
        isEmpty={!activities.length}
        emptyMessage="No activities have been logged yet."
      />

      {!loading && !error && activities.length > 0 && (
        <>
          <section className="metric-strip" aria-label="Activity totals">
            <div className="metric-item">
              <span className="metric-label">TOTAL TIME</span>
              <strong>{formatNumber(totalMinutes)} <small>min</small></strong>
            </div>
            <div className="metric-item metric-accent">
              <span className="metric-label">CALORIES BURNED</span>
              <strong>{formatNumber(totalCalories)} <small>kcal</small></strong>
            </div>
            <div className="metric-item">
              <span className="metric-label">DISTANCE</span>
              <strong>{totalDistance.toFixed(1)} <small>km</small></strong>
            </div>
          </section>

          <section className="data-section">
            <div className="section-toolbar">
              <h2>Recent sessions</h2>
              <span>{activities.length} TOTAL</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 data-table">
                <thead>
                  <tr><th>MEMBER</th><th>ACTIVITY</th><th>TEAM</th><th>DATE</th><th>TIME</th><th>ENERGY</th></tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity._id || `${activity.type}-${activity.performedAt}`}>
                      <td className="member-cell">{memberName(activity.user)}</td>
                      <td><span className="activity-type">{activity.type || 'Activity'}</span></td>
                      <td className="muted-cell">{teamName(activity.team)}</td>
                      <td className="muted-cell">{formatDate(activity.performedAt)}</td>
                      <td>{formatNumber(activity.durationMinutes)} min</td>
                      <td>{formatNumber(activity.caloriesBurned)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default Activities