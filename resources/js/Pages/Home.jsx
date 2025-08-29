import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import L from 'leaflet';
import { useForm } from '@inertiajs/react';

export const DefaultIcon = L.icon({
  iconUrl: 'assets/lokasi.png',
  iconSize: [40, 40], 
  iconAnchor: [20, 40],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Home() {
  const [dataSensor, setDataSensor] = useState({});
  const [position, setPosition] = useState([-7.8166, 112.0114]);
  const [locationName, setLocationName] = useState("");
  const [savelokasi, setSavelokasi] = useState([]);

  const { data, setData, post, processing } = useForm({
    name: '',
    latitude: '',
    longitude: '',
    status: dataSensor.partikel || '',
  });

  useEffect(() => {
    axios.get("https://imas-58e85-default-rtdb.asia-southeast1.firebasedatabase.app/data.json")
      .then((response) => {
        setDataSensor(response.data);
      });
  }, []);

  useEffect(() => {
    axios.get(('/lokasi'))
      .then((lokasisaved) => {
        console.log(lokasisaved.data);
        setSavelokasi(lokasisaved.data);
      });
  }, [data]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        const status_sensor = dataSensor.partikel;
        setPosition([lat, lng]);
        setLocationName("");
        fetchLocationName(lat, lng, status_sensor);
      },
    });

    const fetchLocationName = async (lat, lng, status_sensor ) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        setLocationName(response.data.display_name);
        setData({
          name: response.data.display_name,
          latitude: lat,
          longitude: lng,
          status: status_sensor
        });
      } catch (error) {
        console.error("Failed to fetch location name:", error);
        setLocationName("Nama lokasi tidak ditemukan");
      }
    };

    return (
      <Marker position={position}>
        <Popup>
          <div>
            <strong>Lokasi yang dipilih:</strong>
            <p>{locationName || "Memuat nama lokasi..."}</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={processing}
            >
              {processing ? "⏳ Saving..." : "📌 Save Location"}
            </button>
          </div>
        </Popup>
      </Marker>
    );
  }

  const handleSave = () => {
    if (!locationName || !position[0] || !position[1] || !dataSensor.partikel) {
      Swal.fire({
        title: 'Warning!',
        text: 'Data tidak lengkap. Pastikan lokasi dan sensor tersedia.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    post(('/save'), {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Lokasi berhasil disimpan.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        setData("");
      },
      onError: () => {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menyimpan lokasi.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  };

  return (
    <>
      <main className="flex-shrink-0">
        <header className="pt-5">
          <div className="container px-5 pb-5">
            <div className="row gx-5 align-items-center">
              <div className="col-xxl-5">
                <div className="text-center text-xxl-start">
                  <div className="badge bg-gradient-primary-to-secondary text-white mb-4">
                    <div className="text-uppercase">Inovasi · Teknologi · Ekologi</div>
                  </div>
                  <h3 className="fw-bolder">
                    <span className="text-gradient d-inline">Integrated Microplastic Aquatic Sensor</span>
                  </h3>
                  <div className="container my-4">
                    <div className="row justify-content-center">
                      <div className="col-12 col-md-9">
                        <p className="fs-6 text-muted text-sm-justify text-md-center" style={{ fontSize: "14px", fontFamily: "Roboto, sans-serif" }}>
                          IMAS adalah sensor inovatif yang mendeteksi dan memantau keberadaan mikroplastik di perairan untuk mendukung riset lingkungan serta pengelolaan kualitas air.
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

                      {savelokasi.map((item) => (
                        <Marker
                          key={item.id}
                          position={[parseFloat(item.latitude), parseFloat(item.longitude)]}
                        >
                          <Popup>
                            <strong>📌{item.name}</strong>
                            <hr />
                            <span className={`badge ${item.status === 'tercemar' ? 'bg-danger'
                              : item.status === 'sedikit_tercemar'
                                ? 'bg-warning text-dark'
                                : 'bg-success'
                              }`} style={{ fontSize: '14px' }}>
                              Status: {item.status === 'tercemar'
                                ? 'Tercemar'
                                : item.status === 'sedikit_tercemar'
                                  ? 'Sedikit Tercemar'
                                  : 'Tidak Tercemar'}
                            </span>

                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </header>
      </main>

      <footer className="bg-white border-top py-4 mt-auto shadow-sm">
        <div className="container px-5">
          <div className="row align-items-center justify-content-between flex-column flex-sm-row">
            <div className="col-auto">
              <div className="small text-muted">
                © 2025 SMAN 5 Kediri Project.
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
