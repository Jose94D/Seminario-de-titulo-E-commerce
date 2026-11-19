import React from "react";

// variant: "error" | "info" | "ok" (los nombres antiguos "alert-danger", "alert-info"… también sirven)
const Message = ({ variant = "info", children }) => {
  const kind = /danger|error/.test(variant) ? "error" : /success|ok/.test(variant) ? "ok" : "info";
  return (
    <div className={`notice notice-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
};

export default Message;
