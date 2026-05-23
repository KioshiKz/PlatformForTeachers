import { useState, useEffect } from 'react'
import api from '../services/api'

const Exam = () => {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0])
  const [grade, setGrade] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsRes, subjectsRes, gradesRes] = await Promise.all([
        api.get('/students/'),
        api.get('/subjects/'),
        api.get('/grades/'),
      ])
      setStudents(studentsRes.data)
      setSubjects(subjectsRes.data)
      setGrades(gradesRes.data)
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGrade = async (e) => {
    e.preventDefault()
    if (!selectedStudent || !selectedSubject || !grade) {
      alert('Заполните все обязательные поля')
      return
    }

    try {
      await api.post('/grades/', {
        student_id: parseInt(selectedStudent),
        subject_id: parseInt(selectedSubject),
        value: parseInt(grade),
        comment: comment,
        date: examDate,
      })
      fetchData()
      setGrade('')
      setComment('')
      alert('Оценка выставлена!')
    } catch (err) {
      alert('Ошибка: ' + JSON.stringify(err.response?.data))
    }
  }

  const getStudentName = (student) => {
    if (!student) return '-'
    return student.user?.full_name || student.user?.email || '-'
  }

  // История оценок выбранного студента по предмету
  const studentHistory = selectedStudent
    ? grades.filter(g => 
        String(g.student?.id) === String(selectedStudent) &&
        (!selectedSubject || String(g.subject?.id) === String(selectedSubject))
      )
    : []

  // Средняя оценка студента по предмету
  const averageGrade = studentHistory.length > 0
    ? (studentHistory.reduce((acc, g) => acc + g.value, 0) / studentHistory.length).toFixed(2)
    : '0.00'

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>
  }

  return (
    <div>
      <h2 className="mb-4">Экзамен</h2>

      {/* Форма выставления экзаменационной оценки */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Выставление оценки студенту</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddGrade} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Студент *</label>
              <select
                className="form-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                required
              >
                <option value="">Выберите студента</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.user?.full_name || s.user?.email} ({s.group?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Предмет *</label>
              <select
                className="form-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                required
              >
                <option value="">Выберите предмет</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Оценка (0-100) *</label>
              <input
                type="number"
                className="form-control"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="0"
                max="100"
                placeholder="0-100"
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Дата экзамена</label>
              <input
                type="date"
                className="form-control"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button type="submit" className="btn btn-secondary w-100">
                Выставить
              </button>
            </div>

            <div className="col-md-12">
              <label className="form-label">Комментарий (необязательно)</label>
              <input
                type="text"
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Например: Экзаменационная работа"
              />
            </div>
          </form>
        </div>
      </div>

      {/* История оценок студента по предмету */}
      <div className="card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Оценки по предмету: {selectedSubject ? subjects.find(s => String(s.id) === String(selectedSubject))?.name : 'не выбран'}
          </h5>
          {selectedStudent && selectedSubject && (
            <span className="badge bg-secondary text-white">
              Средний балл: <strong>{averageGrade}</strong>
            </span>
          )}
        </div>
        <div className="card-body">
          {!selectedStudent ? (
            <p className="text-muted">Выберите студента для просмотра истории оценок</p>
          ) : !selectedSubject ? (
            <p className="text-muted">Выберите предмет для просмотра оценок</p>
          ) : studentHistory.length === 0 ? (
            <p className="text-muted">У этого студента пока нет оценок по этому предмету</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Оценка</th>
                  <th>Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {studentHistory.map(g => (
                  <tr key={g.id}>
                    <td>{new Date(g.date).toLocaleDateString('ru-RU')}</td>
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

export default Exam
