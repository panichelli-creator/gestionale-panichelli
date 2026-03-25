import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const lists = [
  {
    name: "ASO",
    params: {
      role: "ASO",
    },
  },
  {
    name: "Medici",
    params: {
      role: "MEDICO",
    },
  },
  {
    name: "Radioprotezione",
    params: {
      service: "Radioprotezione",
    },
  },
  {
    name: "Clienti DVR",
    params: {
      service: "DVR",
    },
  },
  {
    name: "Clienti HACCP",
    params: {
      service: "HACCP",
    },
  },
];

export default function MarketingListsPage() {
  return (
    <div className="card">

      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Liste Marketing</h1>

        <Link className="btn" href="/contacts">
          Apri Contatti
        </Link>
      </div>

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Lista</th>
            <th>Apri contatti</th>
            <th>Export Voxmail</th>
          </tr>
        </thead>

        <tbody>
          {lists.map((l) => {

            const qs = new URLSearchParams(l.params).toString();

            return (
              <tr key={l.name}>

                <td>
                  <b>{l.name}</b>
                </td>

                <td>
                  <Link
                    className="btn"
                    href={`/contacts?${qs}`}
                  >
                    Apri
                  </Link>
                </td>

                <td>
                  <a
                    className="btn primary"
                    href={`/api/contacts/export-voxmail?${qs}`}
                  >
                    Export Voxmail
                  </a>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

    </div>
  );
}