import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Message from "../components/LoadingError/Error";
import { login } from "../Redux/Actions/userActions";

const Login = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const { error, loading, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) history.push(redirect.startsWith("/") ? redirect : `/${redirect}`);
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Layout title="Iniciar sesión">
      <section className="auth wrap">
        <form className="auth-card" onSubmit={submitHandler}>
          <p className="eyebrow" style={{ marginBottom: 0 }}>
            Tu cuenta
          </p>
          <h1 className="display display-md">Inicia sesión</h1>
          {error && <Message variant="error">{error === "Invalid Email or Password" ? "Correo o contraseña incorrectos." : error}</Message>}
          <label className="field">
            Correo
            <input className="input-x" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            Contraseña
            <input
              className="input-x"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn-x lg btn-dark-x" disabled={loading}>
            {loading ? "Entrando…" : "Iniciar sesión"}
          </button>
          <p style={{ margin: 0, textAlign: "center" }} className="muted">
            ¿No tienes cuenta?{" "}
            <Link to={`/register?redirect=${redirect}`} style={{ fontWeight: 600 }}>
              Créala aquí
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Login;
