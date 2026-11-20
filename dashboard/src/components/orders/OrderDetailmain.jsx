import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/es";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderDetailInfo from "./OrderDetailInfo";
import { deliverOrder, getOrderDetails } from "../../Redux/Actions/OrderActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

const OrderDetailmain = ({ orderId }) => {
  const dispatch = useDispatch();
  const { loading, error, order } = useSelector((state) => state.orderDetails);
  const { loading: loadingDelivered, success: successDelivered } = useSelector((state) => state.orderDeliver);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, successDelivered]);

  return (
    <section className="content-main">
      <Link to="/orders" className="fw-semibold">
        ← Ventas
      </Link>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="alert-danger">{error}</Message>
      ) : (
        <>
          <div className="content-header mt-2">
            <div>
              <h1 className="content-title">Pedido #{order._id.slice(-6).toUpperCase()}</h1>
              <p className="text-muted m-0 mt-2">{moment(order.createdAt).locale("es").format("LLLL")}</p>
            </div>
            {order.isDelivered ? (
              <span className="pill pill-ok">Entregado · {moment(order.deliveredAt).locale("es").format("D MMM YYYY")}</span>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(deliverOrder(order))}
                className="btn btn-dark"
                disabled={loadingDelivered || !order.isPaid}
                title={order.isPaid ? undefined : "El pedido aún no está pagado"}
              >
                {loadingDelivered ? "Guardando…" : "Marcar como entregado"}
              </button>
            )}
          </div>

          <div className="card">
            <div className="card-body">
              <OrderDetailInfo order={order} />
              <div className="table-responsive">
                <OrderDetailProducts order={order} />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default OrderDetailmain;
