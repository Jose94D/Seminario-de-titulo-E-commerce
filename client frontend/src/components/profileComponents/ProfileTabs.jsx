import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import { updateUserProfile } from "../../store/userSlice";

// Formulario "Mis datos" del perfil.
const ProfileTabs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rut, setRut] = useState("");
  const [notice, setNotice] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user.profile);
  const { loading: updateLoading, error: updateError } = useSelector((state) => state.user.update);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setTelefono(user.telefono || "");
      setDireccion(user.direccion || "");
      setRut(user.rut || "");
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setNotice({ kind: "error", text: "Las contraseñas no coinciden." });
      return;
    }
    try {
      // unwrap() lanza si la API rechaza el cambio; el error ya se muestra desde el store
      await dispatch(updateUserProfile({ id: user._id, name, email, password, telefono, direccion, rut })).unwrap();
    } catch {
      setNotice(null);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setNotice({ kind: "ok", text: "Tus datos fueron actualizados." });
  };

  const input = (label, value, set, props = {}) => (
    <label className={`field ${props.wide ? "span-all" : ""}`}>
      {label}
      <input className="input-x" value={value} onChange={(e) => set(e.target.value)} {...props.attrs} />
    </label>
  );

  return (
    <form className="card-white" onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {(loading || updateLoading) && <Loading />}
      {error && <Message variant="error">{error}</Message>}
      {updateError && <Message variant="error">{updateError}</Message>}
      {notice && !updateError && <Message variant={notice.kind}>{notice.text}</Message>}
      <div className="form-grid">
        {input("Nombre", name, setName, { attrs: { required: true, autoComplete: "name" } })}
        {input("RUT", rut, setRut)}
        {input("Correo", email, setEmail, { attrs: { type: "email", required: true, autoComplete: "email" } })}
        {input("Teléfono", telefono, setTelefono, { attrs: { type: "tel", autoComplete: "tel" } })}
        {input("Dirección", direccion, setDireccion, { wide: true, attrs: { autoComplete: "street-address" } })}
        {input("Contraseña nueva", password, setPassword, { attrs: { type: "password", autoComplete: "new-password" } })}
        {input("Confirmar contraseña", confirmPassword, setConfirmPassword, {
          attrs: { type: "password", autoComplete: "new-password" },
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn-x lg btn-dark-x" disabled={updateLoading}>
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default ProfileTabs;
