import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import Layout from "../components/Layout";
import Message from "../components/LoadingError/Error";
import { register } from "../store/userSlice";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rut, setRut] = useState("");

  const dispatch = useDispatch();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const { userInfo } = useSelector((state) => state.user);
  const { error, loading } = useSelector((state) => state.user.register);

  useEffect(() => {
    if (userInfo) navigate(redirect.startsWith("/") ? redirect : `/${redirect}`);
  }, [userInfo, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register({ name, email, password, telefono, direccion, rut }));
  };

  const field = (label, value, set, attrs = {}, wide = false) => (
    <label className={`field ${wide ? "span-all" : ""}`}>
      {label}
      <input className="input-x" value={value} onChange={(e) => set(e.target.value)} {...attrs} />
    </label>
  );

  return (
    <Layout title="Crear cuenta">
      <section className="auth wrap">
        <form className="auth-card wide" onSubmit={submitHandler}>
          <p className="eyebrow" style={{ marginBottom: 0 }}>
            Tu cuenta
          </p>
          <h1 className="display display-md">Crea tu cuenta</h1>
          <p className="muted" style={{ margin: 0 }}>
            Para comprar y seguir tus pedidos.
          </p>
          {error && <Message variant="error">{error === "User already exists" ? "Ya existe una cuenta con ese correo." : error}</Message>}
          <div className="form-grid">
            {field("Nombre", name, setName, { required: true, autoComplete: "name" })}
            {field("RUT", rut, setRut, { placeholder: "12.345.678-9" })}
            {field("Correo", email, setEmail, { type: "email", required: true, autoComplete: "email" })}
            {field("Teléfono", telefono, setTelefono, { type: "tel", autoComplete: "tel" })}
            {field("Dirección", direccion, setDireccion, { autoComplete: "street-address" }, true)}
            {field("Contraseña", password, setPassword, { type: "password", required: true, autoComplete: "new-password" }, true)}
          </div>
          <button type="submit" className="btn-x lg btn-primary-x" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
          <p style={{ margin: 0, textAlign: "center" }} className="muted">
            ¿Ya tienes cuenta?{" "}
            <Link to={`/login?redirect=${redirect}`} style={{ fontWeight: 600 }}>
              Inicia sesión
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Register;
