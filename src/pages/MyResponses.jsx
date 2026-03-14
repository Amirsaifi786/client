import React from "react";
import MyAccountSidebar from "./MyAccountSidebar";
function MyResponses() {
  return (
    <div>

      {/* PAGE TITLE */}
      <div style={{ background: "#6c6c6c", padding: "40px 0", color: "white" }}>
        <div className="container">
          <h2>My Responses</h2>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          < MyAccountSidebar />
          {/* RIGHT CONTENT */}
          <div className="col-md-9">

            <div className="alert alert-danger">

              Please, <b>Submit Property</b> to see responses.

            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default MyResponses;