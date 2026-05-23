import { useState, useEffect } from 'react'
import api from '../services/api'

const StudentDashboard = () => {
  const [grades, setGrades] = useState([])
  const [student, setStudent] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [average, setAverage] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [gradesRes, subjectsRes] = await Promise.all([
        api.get('/grades/'),
        api.get('/subjects/'),
      ])
      setGrades(gradesRes.data)
      setSubjects(subjectsRes.data)

      // Вычисляем средний балл
      if (gradesRes.data.length > 0) {
        const sum = gradesRes.data.reduce((acc, g) => acc + g.value, 0)
        setAverage((sum / gradesRes.data.length).toFixed(2))
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSubjectName = (subject) => {
    if (!subject) return 'Unknown'
    return subject.name || 'Unknown'
  }

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>
  }

  return (
    <div>
      <h2 className="mb-4">Мои оценки</h2>

      {/* Средний балл */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-secondary text-white">
            <div className="card-body text-center">
              <h3>Средний балл</h3>
              <h1 className="display-4">{average}</h1>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>Всего оценок</h3>
              <h1 className="display-4">{grades.length}</h1>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <div className="card-body text-center">
              <h3>Предметов</h3>
              <h1 className="display-4">{subjects.length}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица оценок */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">История оценок</h5>
        </div>
        <div className="card-body">
          {grades.length === 0 ? (
            <p className="text-muted text-center">Оценок пока нет</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Предмет</th>
                  <th>Преподаватель</th>
                  <th>Оценка</th>
                  <th>Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id}>
                    <td>{new Date(g.date).toLocaleDateString('ru-RU')}</td>
                    <td>{getSubjectName(g.subject)}</td>
                    <td>{g.subject?.teacher?.full_name || g.subject?.teacher?.email || g.teacher_name || '-'}</td>
                    <td>
                      <span className={`badge ${
                        g.value >= 85 ? 'bg-success' : 
                        g.value >= 60 ? 'bg-warning' : 
                        'bg-danger'
                      }`}>
                        {g.value}
                      </span>
                    </td>
                    <td>{g.comment || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
