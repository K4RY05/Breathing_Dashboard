import "../styles/Dashboard.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <h1>Dashboard</h1>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;