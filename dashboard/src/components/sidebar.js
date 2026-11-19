import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Actions/userActions";

const LINKS = [
  ["/", "Resumen", true],
  ["/orders", "Ventas"],
  ["/products", "Productos"],
  ["/addproduct", "Añadir producto"],
  ["/users", "Usuarios"],
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <aside className="navbar-aside" id="offcanvas_aside">
      <Link to="/" className="brand-wrap">
        TUNING SHOP
        <br />
        <span>PANEL</span>
      </Link>
      <nav aria-label="Panel">
        <ul className="menu-aside">
          {LINKS.map(([to, label, exact]) => (
            <li key={to}>
              <NavLink className="menu-link" activeClassName="active" to={to} exact={exact}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="aside-foot">
        {userInfo ? userInfo.name : "Administrador"}
        <button type="button" onClick={() => dispatch(logout())}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
