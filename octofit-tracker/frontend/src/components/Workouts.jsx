import { useEffect, useState } from 'react'
import { apiBaseUrl, normalizeCollection } from '../api.js'
import { CollectionState, PageIntro } from './PageFrame.jsx'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadWorkouts() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/workouts/`)
        if (!response.ok) throw new Error(`Workouts request failed (${response.status})`)
        const payload = await response.json()
        if (isCurrent) setWorkouts(normalizeCollection(payload))
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load workouts.')
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    void loadWorkouts()
    return () => { isCurrent = false }
  }, [])

  return (
    <>
      <PageIntro
        eyebrow="TRAINING / 05"
        title="Workouts"
        description="Choose a session that fits your time and pace."
        count={`${workouts.length} SESSIONS`}
      />

      <CollectionState
        loading={loading}
        error={error}
        isEmpty={!workouts.length}
        emptyMessage="No workout plans are available yet."
      />

      {!loading && !error && workouts.length > 0 && (
        <div className="workout-list">
          {workouts.map((workout, index) => (
            <article className="workout-row" key={workout._id || workout.name}>
              <span className="workout-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="workout-main">
                <div className="workout-title-line">
                  <h2>{workout.name}</h2>
                  <span className={`difficulty-tag difficulty-${workout.difficulty || 'beginner'}`}>
                    {workout.difficulty || 'beginner'}
                  </span>
                </div>
                <p>{workout.description || 'A guided training session.'}</p>
                {Array.isArray(workout.exercises) && workout.exercises.length > 0 && (
                  <ul className="exercise-list">
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <li key={`${exercise.name}-${exerciseIndex}`}>{exercise.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span className="workout-duration">{Number(workout.durationMinutes) || 0}<small>MIN</small></span>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export default Workouts