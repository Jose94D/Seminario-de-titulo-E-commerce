import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import ProfileTabs from "../components/profileComponents/ProfileTabs";
import Orders from "../components/profileComponents/Orders";
import { getUserDetails, logout } from "../store/userSlice";
import { listMyOrders } from "../store/ordersSlice";

const ProfileScreen = () => {
  const [tab, setTab] = useState("pedidos");
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { loading, error, orders } = useSelector((state) => state.orders.mine);

  useEffect(() => {
    dispatch(listMyOrders());
    dispatch(getUserDetails("profile"));
  }, [dispatch]);

  if (!userInfo) return null;

  return (
    <Layout title="Mi cuenta">
      <section className="account wrap">
        <aside className="account-aside">
          <div className="card-dark">
            <div className="avatar" aria-hidden="true">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="display display-sm" style={{ marginTop: 18, fontSize: 26 }}>
              {userInfo.name}
            </div>
            <div style={{ marginTop: 6, color: "var(--line)", fontSize: 15 }}>{userInfo.email}</div>
          </div>
          <div className="tabs-x" role="tablist" aria-label="Secciones de la cuenta">
            <button type="button" role="tab" aria-selected={tab === "pedidos"} onClick={() => setTab("pedidos")}>
              Mis pedidos
              <span className="pill pill-wait">{orders ? orders.length : 0}</span>
            </button>
            <button type="button" role="tab" aria-selected={tab === "datos"} onClick={() => setTab("datos")}>
              Mis datos
            </button>
            <button type="button" onClick={() => dispatch(logout())}>
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="account-main" role="tabpanel">
          {tab === "pedidos" ? (
            <>
              <h1 className="display display-lg">Mis pedidos</h1>
              <Orders orders={orders} loading={loading} error={error} />
            </>
          ) : (
            <>
              <h1 className="display display-lg">Mis datos</h1>
              <ProfileTabs />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProfileScreen;
