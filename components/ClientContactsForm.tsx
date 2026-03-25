"use client";

import { useState } from "react";

type Contact = {
  id?: string;
  role: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export default function ClientContactsForm({
  initialContacts,
  clientId,
}: {
  initialContacts: Contact[];
  clientId: string;
}) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  function update(i: number, field: keyof Contact, value: string) {
    const copy = [...contacts];
    copy[i] = { ...copy[i], [field]: value };
    setContacts(copy);
  }

  function addContact() {
    setContacts([
      ...contacts,
      { role: "", name: "", email: "", phone: "", notes: "" },
    ]);
  }

  function remove(i: number) {
    const copy = [...contacts];
    copy.splice(i, 1);
    setContacts(copy);
  }

  return (
    <div className="card">

      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h2>Contatti cliente</h2>

        <button
          type="button"
          className="btn"
          onClick={addContact}
        >
          + Nuovo contatto
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>

        {contacts.map((c, i) => (

          <div
            key={i}
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 12,
              padding: 12,
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 1fr auto",
              gap: 8,
              alignItems: "center",
            }}
          >

            <input
              className="input"
              placeholder="Ruolo (ASO, titolare...)"
              value={c.role}
              onChange={(e) => update(i, "role", e.target.value)}
            />

            <input
              className="input"
              placeholder="Nome"
              value={c.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />

            <input
              className="input"
              placeholder="Email"
              value={c.email ?? ""}
              onChange={(e) => update(i, "email", e.target.value)}
            />

            <input
              className="input"
              placeholder="Telefono"
              value={c.phone ?? ""}
              onChange={(e) => update(i, "phone", e.target.value)}
            />

            <button
              type="button"
              className="btn danger"
              onClick={() => remove(i)}
            >
              Elimina
            </button>

          </div>

        ))}

      </div>

      <input
        type="hidden"
        name="contacts"
        value={JSON.stringify(contacts)}
      />

    </div>
  );
}