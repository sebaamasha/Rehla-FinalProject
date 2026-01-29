import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <h1>404 – Page not found</h1>
      <p>Sorry, this page does not exist.</p>
      <Link to="/">Go back Home</Link>
    </div>
  );
}

export default NotFoundPage;
