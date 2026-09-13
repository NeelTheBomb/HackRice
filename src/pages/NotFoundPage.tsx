import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main>
      <h1>Location not found</h1>
      <p>That campus tour location is not available.</p>
      <Link to="/">Return home</Link>
    </main>
  );
}
