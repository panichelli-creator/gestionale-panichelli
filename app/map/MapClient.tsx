"use client";

import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

type MarkerRow = {
  id: string;
  clientId: string;
  clientName: string;
  clientType?: string;
  serviceName: string;
  siteName: string;
  address: string;
  dueDate: string;
  referenteName?: string;
  referenteRole?: string;
  referentePhone?: string;
  rxEndoralCount?: number;
  rxOptCount?: number;
  lat: number;
  lng: number;
  mapsUrl: string;
};

type Props = {
  markers: MarkerRow[];
};

function createMarkerIcon(index: number) {
  return L.divIcon({
    className: "custom-numbered-marker",
    html: `
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 999px;
        background: #2563eb;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 800;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  });
}

function avgCenter(markers: MarkerRow[]) {
  if (!markers.length) return { lat: 41.9028, lng: 12.4964 };
  const lat = markers.reduce((a, m) => a + m.lat, 0) / markers.length;
  const lng = markers.reduce((a, m) => a + m.lng, 0) / markers.length;
  return { lat, lng };
}

export default function MapClient({ markers }: Props) {
  const center = avgCenter(markers);
  const routePositions = markers.map((m) => [m.lat, m.lng] as [number, number]);

  return (
    <div
      style={{
        marginTop: 10,
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        scrollWheelZoom
        style={{ width: "100%", height: 520 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routePositions.length >= 2 ? <Polyline positions={routePositions} /> : null}

        {markers.map((m, index) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createMarkerIcon(index)}
          >
            <Popup>
              <div style={{ minWidth: 240 }}>
                <div style={{ fontWeight: 800 }}>
                  #{index + 1} - {m.clientName}
                </div>

                <div style={{ marginTop: 4 }}>{m.serviceName}</div>
                <div style={{ marginTop: 4 }}>{m.siteName}</div>
                <div style={{ marginTop: 4, color: "#475569" }}>{m.address}</div>
                <div style={{ marginTop: 4, color: "#475569" }}>
                  Scadenza: {m.dueDate}
                </div>

                {m.referenteName && m.referenteName !== "—" ? (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontWeight: 700 }}>Referente: {m.referenteName}</div>
                    {m.referenteRole && m.referenteRole !== "—" ? (
                      <div style={{ color: "#475569", marginTop: 2 }}>
                        {m.referenteRole}
                      </div>
                    ) : null}
                    {m.referentePhone && m.referentePhone !== "—" ? (
                      <div style={{ marginTop: 4 }}>
                        <a href={`tel:${m.referentePhone}`}>{m.referentePhone}</a>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {Number(m.rxEndoralCount ?? 0) > 0 || Number(m.rxOptCount ?? 0) > 0 ? (
                  <div style={{ marginTop: 8, color: "#475569" }}>
                    RX Endorali: <b>{Number(m.rxEndoralCount ?? 0)}</b> • RX OPT: <b>{Number(m.rxOptCount ?? 0)}</b>
                  </div>
                ) : null}

                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <a
                    className="btn"
                    href={m.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Maps
                  </a>

                  <Link className="btn" href={`/clients/${m.clientId}`}>
                    Apri cliente
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}