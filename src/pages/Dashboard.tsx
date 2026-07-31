import "../styles/Dashboard.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AirQualityChart } from "../components/charts/DashboardMeasurements/AirQualityChart";
import { ClimateChart } from "../components/charts/DashboardMeasurements/ClimateChart";
import { ParticlesChart } from "../components/charts/DashboardMeasurements/ParticlesChart";
import { WeatherChart} from "../components/charts/DashboardMeasurements/WeatherChart";
import { WindChart } from "../components/charts/DashboardMeasurements/WindChart";
 

function Dashboard() {
  return (
    <>
      <Navbar />

      <main className="dashboard-container">
        <AirQualityChart />
        <ClimateChart />
        <ParticlesChart />
        <WeatherChart />
        <WindChart />
      
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;