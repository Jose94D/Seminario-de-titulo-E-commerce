import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUser } from "../../Redux/Actions/userActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const UserComponent = () => {
  const dispatch = useDispatch();
  const { loading, error, users } = useSelector((state) => state.userList);

  useEffect(() => {
    dispatch(listUser());
  }, [dispatch]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h1 className="content-title">Usuarios</h1>
      </div>
      <div className="card">
        <div className="card-body">
          {loading ? (
            <Loading />
          ) : error ? (
            <Message variant="alert-danger">{error}</Message>
          ) : (
            <div className="row g-3">
              {users.map((user) => (
                <div className="col-sm-6 col-lg-4 col-xxl-3" key={user._id}>
                  <article className="user-tile">
                    <div className="avatar" aria-hidden="true">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="fw-semibold mt-3" style={{ fontSize: 17 }}>
                      {user.name}
                    </div>
                    <span className={`pill mt-2 ${user.isAdmin ? "pill-ok" : "pill-wait"}`}>
                      {user.isAdmin ? "Administrador" : "Cliente"}
                    </span>
                    <div className="mt-3 text-truncate">
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserComponent;
