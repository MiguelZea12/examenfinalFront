import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  Search, 
  User, 
  Edit, 
  Trash2, 
  Loader2 
} from "lucide-react";
import "../styles/Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type User = {
  id: number;
  username: string;
  email: string;
};

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("users");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get<User[]>(`${API_URL}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setError("");
      } catch (error: any) {
        setError(error.response?.data?.message || "Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Building2 className="company-icon" />
          <h1>Mi Empresa</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMenu('dashboard')}
          >
            <LayoutDashboard className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeMenu === 'users' ? 'active' : ''}`}
            onClick={() => setActiveMenu('users')}
          >
            <Users className="nav-icon" />
            <span className="nav-text">Gestión de Usuarios</span>
          </button>
          
          <button 
            className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveMenu('settings')}
          >
            <Settings className="nav-icon" />
            <span className="nav-text">Configuración</span>
          </button>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut className="logout-icon" />
          <span className="logout-text">Cerrar Sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <header className="top-bar">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="page-title">
            {activeMenu === 'users' && "Gestión de Usuarios"}
            {activeMenu === 'dashboard' && "Dashboard"}
            {activeMenu === 'settings' && "Configuración"}
          </div>
        </header>

        {activeMenu === 'users' && (
          <div className="content-area">
            <div className="dashboard-header">
              <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="stats-container">
                <div className="stat-card">
                  <Users className="stat-icon" />
                  <div className="stat-info">
                    <h3>Total Usuarios</h3>
                    <p>{users.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading-spinner">
                <Loader2 className="spinner" size={40} />
                <p>Cargando usuarios...</p>
              </div>
            ) : (
              <div className="users-container">
                <div className="users-header">
                  <div className="user-cell">Usuario</div>
                  <div className="user-cell">Correo</div>
                  <div className="user-cell">Acciones</div>
                </div>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="user-row">
                      <div className="user-cell">
                        <User className="user-icon" size={20} />
                        {user.username}
                      </div>
                      <div className="user-cell">{user.email}</div>
                      <div className="user-cell actions">
                        <button className="action-button edit">
                          <Edit size={18} />
                        </button>
                        <button className="action-button delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No se encontraron usuarios</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeMenu === 'dashboard' && (
          <div className="content-area">
            <h2>Bienvenido al Dashboard</h2>
            <p>Selecciona una opción del menú lateral para comenzar.</p>
          </div>
        )}

        {activeMenu === 'settings' && (
          <div className="content-area">
            <h2>Configuración</h2>
            <p>Página en construcción...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;