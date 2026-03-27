import Link from "next/link";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MissingContactsPage() {
  const { prisma } = await import("@/lib/prisma");

  const clients = await prisma.client.findMany({
    include: {
      contacts: true,
    },
    orderBy: { name: "asc" },
  });

  const noContacts = clients.filter((c) => c.contacts.length === 0);

  const noEmail = clients.filter(
    (c) =>
      c.contacts.length &&
      !c.contacts.some((ct) => ct.email && ct.email.trim() !== "")
  );

  const noPhone = clients.filter(
    (c) =>
      c.contacts.length &&
      !c.contacts.some((ct) => ct.phone && ct.phone.trim() !== "")
  );

  return (
    <div className="card">

      <h1>Clienti con dati mancanti</h1>

      {/* SENZA CONTATTI */}

      <div className="card" style={{ marginTop: 12 }}>

        <h2>Clienti senza contatti</h2>

        <div className="muted">
          Totale: <b>{noContacts.length}</b>
        </div>

        {noContacts.length ? (

          <table className="table" style={{ marginTop: 10 }}>

            <thead>
              <tr>
                <th>Cliente</th>
                <th>Apri</th>
              </tr>
            </thead>

            <tbody>

              {noContacts.map((c) => (

                <tr key={c.id}>

                  <td>
                    <b>{c.name}</b>
                  </td>

                  <td>
                    <Link
                      className="btn"
                      href={`/clients/${c.id}`}
                    >
                      Apri cliente
                    </Link>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          <div className="muted" style={{ marginTop: 10 }}>
            Nessun cliente senza contatti
          </div>

        )}

      </div>

      {/* SENZA EMAIL */}

      <div className="card" style={{ marginTop: 12 }}>

        <h2>Clienti senza email</h2>

        <div className="muted">
          Totale: <b>{noEmail.length}</b>
        </div>

        {noEmail.length ? (

          <table className="table" style={{ marginTop: 10 }}>

            <thead>
              <tr>
                <th>Cliente</th>
                <th>Apri</th>
              </tr>
            </thead>

            <tbody>

              {noEmail.map((c) => (

                <tr key={c.id}>

                  <td>
                    <b>{c.name}</b>
                  </td>

                  <td>
                    <Link
                      className="btn"
                      href={`/clients/${c.id}`}
                    >
                      Apri cliente
                    </Link>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          <div className="muted" style={{ marginTop: 10 }}>
            Tutti hanno email
          </div>

        )}

      </div>

      {/* SENZA TELEFONO */}

      <div className="card" style={{ marginTop: 12 }}>

        <h2>Clienti senza telefono</h2>

        <div className="muted">
          Totale: <b>{noPhone.length}</b>
        </div>

        {noPhone.length ? (

          <table className="table" style={{ marginTop: 10 }}>

            <thead>
              <tr>
                <th>Cliente</th>
                <th>Apri</th>
              </tr>
            </thead>

            <tbody>

              {noPhone.map((c) => (

                <tr key={c.id}>

                  <td>
                    <b>{c.name}</b>
                  </td>

                  <td>
                    <Link
                      className="btn"
                      href={`/clients/${c.id}`}
                    >
                      Apri cliente
                    </Link>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        ) : (

          <div className="muted" style={{ marginTop: 10 }}>
            Tutti hanno telefono
          </div>

        )}

      </div>

    </div>
  );
}