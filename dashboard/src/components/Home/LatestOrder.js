import React from "react";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import Orders from "../orders/Orders";

const LatestOrder = ({ loading, error, orders }) => {
  if (loading) return <Loading />;
  if (error) return <Message variant="alert-danger">{error}</Message>;
  if (!orders || orders.length === 0) return <p className="text-muted m-0">Todavía no hay pedidos.</p>;
  return (
    <div className="table-responsive">
      <Orders orders={orders.slice(0, 5)} />
    </div>
  );
};

export default LatestOrder;
