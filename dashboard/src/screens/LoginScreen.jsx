import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../components/LoadingError/Toast";
import { login } from "../Redux/Actions/userActions";
import Message from "./../components/LoadingError/Error";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { error, loading, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) history.push("/");
  }, [userInfo, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <main className="login-wrap">
      <Toast />
      <form className="login-card" onSubmit={submitHandler}>
        <div className="brand-wrap p-0" style={{ color: "var(--ink)" }}>
          TUNING SHOP <span style={{ color: "var(--green)" }}>PANEL</span>
        </div>
        <h1 className="content-title" style={{ fontSize: 32 }}>
          Iniciar sesión
        </h1>
        {error && (
          <Message variant="alert-danger">
            {error === "Invalid Email or Password" ? "Correo o contraseña incorrectos." : error}
          </Message>
        )}
        <div>
          <label htmlFor="email" className="form-label">
            Correo
          </label>
          <input id="email" className="form-control" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            id="password"
            className="form-control"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-dark w-100" style={{ minHeight: 52 }} disabled={loading}>
          {loading ? "Entrando…" : "Entrar al panel"}
        </button>
      </form>
    </main>
  );
};

export default Login;
