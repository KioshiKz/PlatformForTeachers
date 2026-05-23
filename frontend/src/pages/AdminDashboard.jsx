import { useState, useEffect } from 'react'
import api from '../services/api'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(true)

  // Формы для добавления
  const [showUserForm, setShowUserForm] = useState(false)
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [showSubjectForm, setShowSubjectForm] = useState(false)

  const [newUser, setNewUser] = useState({ email: '', full_name: '', password: '', role: 'student' })
  const [newGroup, setNewGroup] = useState({ name: '', year: 1 })
  const [newStudent, setNewStudent] = useState({ user: '', student_id_number: '', group: '' })
  const [newSubject, setNewSubject] = useState({ name: '', teacher: '', group: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, groupsRes, studentsRes, subjectsRes] = await Promise.all([
        api.get('/users/'),
        api.get('/groups/'),
        api.get('/students/'),
        api.get('/subjects/'),
      ])
      setUsers(usersRes.data)
      setGroups(groupsRes.data)
      setStudents(studentsRes.data)
      setSubjects(subjectsRes.data)
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register/', newUser)
      fetchData()
      setShowUserForm(false)
      setNewUser({ email: '', full_name: '', password: '', role: 'student' })
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.email?.[0] || 'Не удалось создать'))
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    try {
      await api.post('/groups/', newGroup)
      fetchData()
      setShowGroupForm(false)
      setNewGroup({ name: '', year: 1 })
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.name?.[0] || 'Не удалось создать'))
    }
  }

  const handleCreateStudent = async (e) => {
    e.preventDefault()
    try {
      await api.post('/students/', newStudent)
      fetchData()
      setShowStudentForm(false)
      setNewStudent({ user: '', student_id_number: '', group: '' })
    } catch (err) {
      alert('Ошибка: ' + JSON.stringify(err.response?.data))
    }
  }

  const handleCreateSubject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/subjects/', newSubject)
      fetchData()
      setShowSubjectForm(false)
      setNewSubject({ name: '', teacher: '', group: '' })
    } catch (err) {
      alert('Ошибка: ' + JSON.stringify(err.response?.data))
    }
  }

  const handleDelete = async (endpoint, id) => {
    if (!confirm('Вы уверены?')) return
    try {
      await api.delete(`/${endpoint}/${id}/`)
      fetchData()
    } catch (err) {
      alert('Ошибка удаления')
    }
  }

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>
  }

  return (
    <div>
      <h2 className="mb-4">Панель администратора</h2>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Пользователи ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            Группы ({groups.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Студенты ({students.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            Предметы ({subjects.length})
          </button>
        </li>
      </ul>

      {/* USERS */}
      {activeTab === 'users' && (
        <div>
          <button className="btn btn-secondary mb-3" onClick={() => setShowUserForm(!showUserForm)}>
            + Добавить пользователя
          </button>
          {showUserForm && (
            <div className="card mb-3">
              <div className="card-body">
                <form onSubmit={handleCreateUser} className="row g-3">
                  <div className="col-md-3">
                    <input className="form-control" placeholder="Email" value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})} required />
                  </div>
                  <div className="col-md-3">
                    <input className="form-control" placeholder="ФИО" value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})} required />
                  </div>
                  <div className="col-md-2">
                    <input type="password" className="form-control" placeholder="Пароль" value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})} required />
                  </div>
                  <div className="col-md-2">
                    <select className="form-select" value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                      <option value="student">Студент</option>
                      <option value="teacher">Преподаватель</option>
                      <option value="admin">Админ</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-success w-100">Создать</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-striped">
            <thead><tr><th>ID</th><th>Email</th><th>ФИО</th><th>Роль</th><th>Действия</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.full_name || '-'}</td>
                  <td><span className="badge bg-secondary">{u.role}</span></td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete('users', u.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GROUPS */}
      {activeTab === 'groups' && (
        <div>
          <button className="btn btn-secondary mb-3" onClick={() => setShowGroupForm(!showGroupForm)}>
            + Добавить группу
          </button>
          {showGroupForm && (
            <div className="card mb-3">
              <div className="card-body">
                <form onSubmit={handleCreateGroup} className="row g-3">
                  <div className="col-md-4">
                    <input className="form-control" placeholder="Название группы" value={newGroup.name}
                      onChange={(e) => setNewGroup({...newGroup, name: e.target.value})} required />
                  </div>
                  <div className="col-md-3">
                    <input type="number" className="form-control" placeholder="Курс" value={newGroup.year}
                      onChange={(e) => setNewGroup({...newGroup, year: parseInt(e.target.value)})} min="1" max="6" required />
                  </div>
                  <div className="col-md-3">
                    <button type="submit" className="btn btn-success w-100">Создать</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-striped">
            <thead><tr><th>ID</th><th>Название</th><th>Курс</th><th>Действия</th></tr></thead>
            <tbody>
              {groups.map(g => (
                <tr key={g.id}>
                  <td>{g.id}</td>
                  <td>{g.name}</td>
                  <td>{g.year}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete('groups', g.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STUDENTS */}
      {activeTab === 'students' && (
        <div>
          <button className="btn btn-secondary mb-3" onClick={() => setShowStudentForm(!showStudentForm)}>
            + Добавить студента
          </button>
          {showStudentForm && (
            <div className="card mb-3">
              <div className="card-body">
                <form onSubmit={handleCreateStudent} className="row g-3">
                  <div className="col-md-3">
                    <select className="form-select" value={newStudent.user}
                      onChange={(e) => setNewStudent({...newStudent, user: e.target.value})} required>
                      <option value="">Выберите пользователя</option>
                      {users.filter(u => u.role === 'student').map(u => (
                        <option key={u.id} value={u.id}>{u.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <input className="form-control" placeholder="№ билета" value={newStudent.student_id_number}
                      onChange={(e) => setNewStudent({...newStudent, student_id_number: e.target.value})} required />
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={newStudent.group}
                      onChange={(e) => setNewStudent({...newStudent, group: e.target.value})} required>
                      <option value="">Выберите группу</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-success w-100">Создать</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-striped">
            <thead><tr><th>ID</th><th>Студент</th><th>№ билета</th><th>Группа</th><th>Действия</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.user?.full_name || s.user?.email || '-'}</td>
                  <td>{s.student_id_number}</td>
                  <td>{s.group?.name || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete('students', s.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBJECTS */}
      {activeTab === 'subjects' && (
        <div>
          <button className="btn btn-secondary mb-3" onClick={() => setShowSubjectForm(!showSubjectForm)}>
            + Добавить предмет
          </button>
          {showSubjectForm && (
            <div className="card mb-3">
              <div className="card-body">
                <form onSubmit={handleCreateSubject} className="row g-3">
                  <div className="col-md-3">
                    <input className="form-control" placeholder="Название предмета" value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})} required />
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={newSubject.teacher}
                      onChange={(e) => setNewSubject({...newSubject, teacher: e.target.value})} required>
                      <option value="">Выберите преподавателя</option>
                      {users.filter(u => u.role === 'teacher').map(u => (
                        <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={newSubject.group}
                      onChange={(e) => setNewSubject({...newSubject, group: e.target.value})} required>
                      <option value="">Выберите группу</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-success w-100">Создать</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <table className="table table-striped">
            <thead><tr><th>ID</th><th>Предмет</th><th>Преподаватель</th><th>Группа</th><th>Действия</th></tr></thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.teacher?.full_name || s.teacher?.email || '-'}</td>
                  <td>{s.group?.name || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete('subjects', s.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
