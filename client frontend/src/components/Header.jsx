import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Actions/userActions";
import { CATEGORIES } from "../format";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);
  const cartCount = cartItems.reduce((n, item) => n + Number(item.qty), 0);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/search/${encodeURIComponent(keyword.trim())}` : "/");
  };

  return (
    <header className="site-header wrap">
      <Link to="/" className="brand">
        TUNING SHOP<span> · </span>LINARES
      </Link>

      <nav className="main-nav" aria-label="Categorías">
        {CATEGORIES.map((c) => (
          <NavLink key={c.slug} to={`/categoria/${c.slug}`}>
            {c.name}
          </NavLink>
        ))}
        <NavLink to="/sobre_nosotros">
          Sobre nosotros
        </NavLink>
      </nav>

      <div className="header-tools">
        <form className="search-x" role="search" onSubmit={submitHandler}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Busca batería, aceite, LED…"
            aria-label="Buscar productos"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        {userInfo ? (
          <div className="dropdown">
            <button type="button" className="account-btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Hola, {userInfo.name.split(" ")[0]}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Mi cuenta y pedidos
                </Link>
              </li>
              <li>
                <button type="button" className="dropdown-item" onClick={() => dispatch(logout())}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="account-btn">
            Iniciar sesión
          </Link>
        )}

        <Link to="/cart" className="cart-btn" aria-label={`Carro, ${cartCount} productos`}>
          Carro <span className="cart-count">{cartCount}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
