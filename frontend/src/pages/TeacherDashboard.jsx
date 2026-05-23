import { useState, useEffect } from 'react'
import api from '../services/api'

const TeacherDashboard = () => {
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  const [showGradeForm, setShowGradeForm] = useState(false)
  const [newGrade, setNewGrade] = useState({
    student_id: '',
    subject_id: '',
    value: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) setCurrentUser(user)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [subjectsRes, studentsRes, gradesRes] = await Promise.all([
        api.get('/subjects/'),
        api.get('/students/'),
        api.get('/grades/'),
      ])

      console.log('Subjects:', subjectsRes.data)
      console.log('Grades:', gradesRes.data)
      
      setSubjects(subjectsRes.data)
      setStudents(studentsRes.data)
      setGrades(gradesRes.data)
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGrade = async (e) => {
    e.preventDefault()
    console.log('Отправка оценки:', newGrade)
    try {
      const response = await api.post('/grades/', newGrade)
      console.log('Ответ сервера:', response.data)
      fetchData()
      setShowGradeForm(false)
      setNewGrade({
        student_id: '',
        subject_id: '',
        value: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
      })
      alert('Оценка выставлена!')
    } catch (err) {
      console.error('Ошибка при выставлении оценки:', err)
      console.error('Ответ сервера:', err.response?.data)
      alert('Ошибка: ' + JSON.stringify(err.response?.data))
    }
  }

  const handleDeleteGrade = async (id) => {
    if (!confirm('Удалить оценку?')) return
    try {
      await api.delete(`/grades/${id}/`)
      fetchData()
    } catch (err) {
      alert('Ошибка удаления')
    }
  }

  const getStudentName = (student) => {
    console.log('getStudentName input:', student)
    if (!student) return '-'
    if (typeof student === 'object') {
      const name = student.user?.full_name || student.user?.email || '-'
      console.log('getStudentName result:', name)
      return name
    }
    return student
  }

  const getSubjectName = (subject) => {
    console.log('getSubjectName input:', subject)
    if (!subject) return '-'
    if (typeof subject === 'object') {
      const name = subject.name || '-'
      console.log('getSubjectName result:', name)
      return name
    }
    // Если subject это ID, ищем в списке предметов
    const found = subjects.find(s => s.id === subject)
    return found?.name || '-'
  }

  // Проверка: может ли текущий пользователь удалить оценку
  const canDeleteGrade = (grade) => {
    if (!currentUser) return false
    return grade.subject?.teacher?.id === currentUser.id
  }

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>
  }

  return (
    <div>
      <h2 className="mb-4">Панель преподавателя</h2>

      {/* Мои предметы */}
      <div className="card mb-4">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Мои предметы</h5>
        </div>
        <div className="card-body">
          {subjects.length === 0 ? (
            <p className="text-muted">У вас пока нет предметов</p>
          ) : (
            <div className="row">
              {subjects.map(subject => (
                <div className="col-md-4 mb-3" key={subject.id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{subject.name}</h5>
                      <p className="card-text">
                        <small className="text-muted">
                          Группа: {subject.group?.name || '-'}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Выставить оценку */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Выставить оценку</h5>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setShowGradeForm(!showGradeForm)}
          >
            {showGradeForm ? 'Закрыть' : '+ Добавить'}
          </button>
        </div>
        {showGradeForm && (
          <div className="card-body">
            <form onSubmit={handleCreateGrade} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Студент</label>
                <select
                  className="form-select"
                  value={newGrade.student_id}
                  onChange={(e) => setNewGrade({...newGrade, student_id: e.target.value})}
                  required
                >
                  <option value="">Выберите студента</option>
                  {students.length === 0 ? (
                    <option disabled>Нет студентов</option>
                  ) : (
                    students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.user?.full_name || s.user?.email} ({s.group?.name})
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Предмет</label>
                <select
                  className="form-select"
                  value={newGrade.subject_id}
                  onChange={(e) => setNewGrade({...newGrade, subject_id: e.target.value})}
                  required
                >
                  <option value="">Выберите предмет</option>
                  {subjects.length === 0 ? (
                    <option disabled>Нет предметов</option>
                  ) : (
                    subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Оценка (0-100)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newGrade.value}
                  onChange={(e) => setNewGrade({...newGrade, value: parseInt(e.target.value) || 0})}
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Дата</label>
                <input
                  type="date"
                  className="form-control"
                  value={newGrade.date}
                  onChange={(e) => setNewGrade({...newGrade, date: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-success w-100">Поставить</button>
              </div>
              <div className="col-md-12">
                <label className="form-label">Комментарий (необязательно)</label>
                <input
                  type="text"
                  className="form-control"
                  value={newGrade.comment}
                  onChange={(e) => setNewGrade({...newGrade, comment: e.target.value})}
                  placeholder="Комментарий к оценке"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Оценки */}
      <div className="card">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Оценки</h5>
        </div>
        <div className="card-body">
          {grades.length === 0 ? (
            <p className="text-muted">Оценок пока нет</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Студент</th>
                  <th>Предмет</th>
                  <th>Преподаватель</th>
                  <th>Оценка</th>
                  <th>Комментарий</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id}>
                    <td>{new Date(g.date).toLocaleDateString('ru-RU')}</td>
                    <td>{getStudentName(g.student)}</td>
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
                    <td>
                      {canDeleteGrade(g) && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteGrade(g.id)}
                        >
                          Удалить
                        </button>
                      )}
                    </td>
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

export default TeacherDashboard
