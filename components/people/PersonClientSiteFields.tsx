"use client";

import { useEffect, useMemo, useState } from "react";

type ClientRow = {
  id: string;
  name: string;
};

type SiteRow = {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
};

type ExtraPair = {
  clientId: string;
  siteId: string;
};

export default function PersonClientSiteFields({
  clients,
  sites,
  defaultClientId = "",
  defaultMainSiteId = "",
  initialExtraPairs = [{ clientId: "", siteId: "" }],
}: {
  clients: ClientRow[];
  sites: SiteRow[];
  defaultClientId?: string;
  defaultMainSiteId?: string;
  initialExtraPairs?: ExtraPair[];
}) {
  const [mainClientId, setMainClientId] = useState(defaultClientId);
  const [mainSiteId, setMainSiteId] = useState(defaultMainSiteId);
  const [extraPairs, setExtraPairs] = useState<ExtraPair[]>(
    initialExtraPairs.length > 0 ? initialExtraPairs : [{ clientId: "", siteId: "" }]
  );

  const mainSites = useMemo(
    () => sites.filter((s) => s.clientId === mainClientId),
    [sites, mainClientId]
  );

  useEffect(() => {
    if (!mainClientId) {
      setMainSiteId("");
      return;
    }

    const exists = mainSites.some((s) => s.id === mainSiteId);
    if (!exists) setMainSiteId("");
  }, [mainClientId, mainSiteId, mainSites]);

  function getSitesByClient(clientId: string) {
    if (!clientId) return [];
    return sites.filter((s) => s.clientId === clientId);
  }

  function updateExtraClient(index: number, clientId: string) {
    setExtraPairs((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const allowedSites = getSitesByClient(clientId);
        const siteStillValid = allowedSites.some((s) => s.id === row.siteId);
        return {
          clientId,
          siteId: siteStillValid ? row.siteId : "",
        };
      })
    );
  }

  function updateExtraSite(index: number, siteId: string) {
    setExtraPairs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, siteId } : row))
    );
  }

  function addRow() {
    setExtraPairs((prev) => [...prev, { clientId: "", siteId: "" }]);
  }

  function removeRow(index: number) {
    setExtraPairs((prev) => {
      if (prev.length <= 1) return [{ clientId: "", siteId: "" }];
      return prev.filter((_, i) => i !== index);
    });
  }

  return (
    <>
      <div className="card" style={{ marginTop: 12 }}>
        <h2>Cliente principale</h2>

        <div className="grid2" style={{ marginTop: 10 }}>
          <div style={{ minWidth: 0 }}>
            <label>Cliente principale</label>
            <select
              className="input"
              name="clientId"
              value={mainClientId}
              onChange={(e) => setMainClientId(e.target.value)}
            >
              <option value="">— nessun cliente —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: 0 }}>
            <label>Sede principale</label>
            <select
              className="input"
              name="mainSiteId"
              value={mainSiteId}
              onChange={(e) => setMainSiteId(e.target.value)}
            >
              <option value="">— nessuna sede —</option>
              {mainSites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="muted" style={{ marginTop: 6 }}>
          Prima scegli il cliente principale, poi seleziona una sede di quel cliente.
        </div>
      </div>

      <div className="card" style={{ marginTop: 12, overflow: "hidden" }}>
        <div
          className="row"
          style={{ justifyContent: "space-between", alignItems: "center", gap: 8 }}
        >
          <h2 style={{ margin: 0 }}>Altri collegamenti cliente / sede</h2>
          <button className="btn" type="button" onClick={addRow}>
            + Aggiungi riga
          </button>
        </div>

        <div className="muted" style={{ marginTop: 6 }}>
          Per ogni riga scegli un cliente e, se vuoi, una sede di quel cliente.
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {extraPairs.map((row, idx) => {
            const rowSites = getSitesByClient(row.clientId);

            return (
              <div
                key={`${idx}-${row.clientId}-${row.siteId}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto",
                  gap: 10,
                  alignItems: "end",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <label>Cliente</label>
                  <select
                    className="input"
                    name="extraClientIds"
                    value={row.clientId}
                    onChange={(e) => updateExtraClient(idx, e.target.value)}
                  >
                    <option value="">— nessun cliente —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ minWidth: 0 }}>
                  <label>Sede</label>
                  <select
                    className="input"
                    name="extraSiteIds"
                    value={row.siteId}
                    onChange={(e) => updateExtraSite(idx, e.target.value)}
                  >
                    <option value="">— nessuna sede —</option>
                    {rowSites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button className="btn" type="button" onClick={() => removeRow(idx)}>
                    Rimuovi
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}