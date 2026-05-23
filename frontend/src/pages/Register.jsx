import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirm_password: '',
    role: 'student',
    group_id: '',
    teacher_group_name: '',
    teacher_group_year: 1,
    teacher_course_name: '',
  })
  const [groups, setGroups] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups/')
      setGroups(response.data)
    } catch (err) {
      console.error('Ошибка загрузки групп:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirm_password) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
      return
    }

    // Проверка для студентов
    if (formData.role === 'student' && !formData.group_id) {
      setError('Студент должен выбрать группу')
      return
    }

    // Проверка для преподавателей
    if (formData.role === 'teacher' && !formData.teacher_group_name) {
      setError('Преподаватель должен указать название группы')
      return
    }

    setLoading(true)

    try {
      const submitData = {
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password,
        role: formData.role,
      }
      
      // Добавляем поля только для студентов
      if (formData.role === 'student') {
        submitData.group_id = parseInt(formData.group_id)
      }
      
      // Добавляем поля для преподавателей
      if (formData.role === 'teacher') {
        submitData.teacher_group_name = formData.teacher_group_name
        submitData.teacher_group_year = parseInt(formData.teacher_group_year)
        submitData.teacher_course_name = formData.teacher_course_name
      }
      
      await register(submitData)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.non_field_errors?.[0] || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card">
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">Регистрация</h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@mail.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="full_name" className="form-label">
                  ФИО
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Иванов Иван Иванович"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Роль
                </label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="student">Студент</option>
                  <option value="teacher">Преподаватель</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <div className="mb-3">
                  <label htmlFor="group_id" className="form-label">
                    Группа
                  </label>
                  <select
                    className="form-select"
                    id="group_id"
                    name="group_id"
                    value={formData.group_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите группу</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  {groups.length === 0 && (
                    <small className="text-muted">Группы пока не созданы. Обратитесь к администратору.</small>
                  )}
                </div>
              )}

              {formData.role === 'teacher' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="teacher_group_name" className="form-label">
                      Название вашей группы
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="teacher_group_name"
                      name="teacher_group_name"
                      value={formData.teacher_group_name}
                      onChange={handleChange}
                      required
                      placeholder="ИВТ-21"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="teacher_group_year" className="form-label">
                      Курс группы
                    </label>
                    <select
                      className="form-select"
                      id="teacher_group_year"
                      name="teacher_group_year"
                      value={formData.teacher_group_year}
                      onChange={handleChange}
                      required
                    >
                      <option value={1}>1 курс</option>
                      <option value={2}>2 курс</option>
                      <option value={3}>3 курс</option>
                      <option value={4}>4 курс</option>
                      <option value={5}>5 курс</option>
                      <option value={6}>6 курс</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="teacher_course_name" className="form-label">
                      Название предмета (курса)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="teacher_course_name"
                      name="teacher_course_name"
                      value={formData.teacher_course_name}
                      onChange={handleChange}
                      placeholder="Математика (оставьте пустым для названия по умолчанию)"
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirm_password" className="form-label">
                  Подтверждение пароля
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>

            <div className="mt-3 text-center">
              <p className="mb-0">
                Уже есть аккаунт?{' '}
                <Link to="/login">Войти</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
