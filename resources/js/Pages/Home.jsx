import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import { useEffect, useState } from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

function Home() {
  const [data, setData] = useState([]);
  const [position, setPosition] = useState([-7.8166, 112.0114]);
  const [locationName, setLocationName] = useState("");

  let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  useEffect(() => {
    axios.get("https://imas-58e85-default-rtdb.asia-southeast1.firebasedatabase.app/data.json")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
      });
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        setLocationName("");
        fetchLocationName(lat, lng);
      },
    });

    const fetchLocationName = async (lat, lng) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        setLocationName(response.data.display_name);
      } catch (error) {
        console.error("Failed to fetch location name:", error);
        setLocationName("Nama lokasi tidak ditemukan");
      }
    };

    const handleSave = () => {
      console.log("Location saved:", data);
      // bisa kirim ke Firebase
    };

    return (
      <Marker position={position}>
        <Popup>
          <div>
            <strong>Lokasi yang dipilih:</strong>
            <p>{locationName || "Memuat nama lokasi..."}</p>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              📌 Save Location
            </button>
          </div>
        </Popup>
      </Marker>
    );
  }

  return (
    <>
      <main className="flex-shrink-0">
        <header className="pt-5">
          <div className="container px-5 pb-5">
            {/* Bagian Header */}
            <div className="row gx-5 align-items-center">
              <div className="col-xxl-5">
                <div className="text-center text-xxl-start">
                  <div className="badge bg-gradient-primary-to-secondary text-white mb-4">
                    <div className="text-uppercase">Inovasi &middot; Tekhnologi &middot; Ekologi</div>
                  </div>
                  <h1 className="display-3 fw-bolder">
                    <span className="text-gradient d-inline">Efisiensi Monitoring Air Sungai</span>
                  </h1>
                  <div className="container my-4">
                    <div className="row justify-content-center">
                      <div className="col-md-9">
                        <p className="fs-5 text-muted text-justify">
                          EMAS mendeteksi mikroplastik di sungai dengan sensor pintar dan analisis data,
                          mendukung kebijakan lingkungan serta menjaga keberlanjutan ekosistem air.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
                      <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </main>

      {/* Footer dan Author */}
      <section className="bg-light py-5">
        <div className="container px-5">
          <div className="row gx-5 justify-content-center">
            <div className="col-xxl-8">
              <div className="text-center my-4">
                <span className="text-uppercase text-secondary small d-block mb-2">
                  dibuat oleh
                </span>
                <p className="lead fw-semibold text-dark mb-1">
                  Rani Rahayu <span className="mx-2">•</span> Dewi Mustika
                </p>
                <p className="fw-light text-muted">SMAN 5 Kediri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-top py-4 mt-auto shadow-sm">
        <div className="container px-5">
          <div className="row align-items-center justify-content-between flex-column flex-sm-row">
            <div className="col-auto">
              <div className="small text-muted">
                © 2025 SMAN 5 Kediri Project. All rights reserved.
              </div>
            </div>
            <div className="col-auto">
              <a className="small text-decoration-none me-3 text-primary" href="#!">
                Privacy
              </a>
              <a className="small text-decoration-none me-3 text-primary" href="#!">
                Terms
              </a>
              <a className="small text-decoration-none text-primary" href="#!">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
