import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth, isStudent, isTeacher, useAuth } from "../store/authStore";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const navLinkClass = ({ isActive }) => (isActive ? 'active' : '')

    return (
      <header className="navbar">
        <div className="navbar__brand">
          <Link to="/">ASAG</Link>
        </div>
        <nav className="navbar__links">
          {user ? (
            <>
              {isStudent(user) && <NavLink to="/student" className={navLinkClass}>Questions</NavLink>}
              {isTeacher(user) && (
                <>
                  <NavLink to="/teacher/review" className={navLinkClass}>
                    Review
                  </NavLink>
                  <NavLink to="/teacher/analytics" className={navLinkClass}>
                    Analytics
                  </NavLink>
                </>
              )}
              <button className="btn btn-ghost" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          )}
        </nav>
      </header>
    )
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
