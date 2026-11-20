import React from "react";

// valor por defecto en el parámetro: React 19 ya no admite defaultProps en componentes de función
const Message = ({ variant = "alert-info", children }) => {
  return (
    <div className="d-flex justify-content-center col-12">
      <div className={`alert ${variant}`}>{children}</div>
    </div>
  );
};

export default Message;
