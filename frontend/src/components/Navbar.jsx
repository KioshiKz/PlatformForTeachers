import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')

  if (!isAuthenticated() || !storedUser) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Система учёта
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {storedUser.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Админ-панель
                </Link>
              </li>
            )}
            {storedUser.role === 'teacher' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher">
                    Преподаватель
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/attestation">
                    Аттестация
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/exam">
                    Экзамен
                  </Link>
                </li>
              </>
            )}
            {storedUser.role === 'student' && (
              <li className="nav-item">
                <Link className="nav-link" to="/student">
                  Мои оценки
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 text-white">
              {storedUser.full_name} ({storedUser.role})
            </span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
