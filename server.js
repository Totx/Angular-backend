const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "/contactos";

app.use(cors());
app.use(express.json());

let contactos = [
  {
    id: "1",
    documento: 12345678,
    nombre: "Juan Pérez",
    fechaNacimiento: "1985-10-15T00:00:00.000Z",
    genero: "Masculino",
  },
  {
    id: "2",
    documento: 23456789,
    nombre: "María García",
    fechaNacimiento: "1990-05-25T00:00:00.000Z",
    genero: "Femenino",
  },
  {
    id: "3",
    documento: 34567890,
    nombre: "Alex Fernández",
    fechaNacimiento: "2000-12-01T00:00:00.000Z",
    genero: "No Binario",
  },
  {
    id: "4",
    documento: 45678901,
    nombre: "Laura Martínez",
    fechaNacimiento: "1992-07-18T00:00:00.000Z",
    genero: "Femenino",
  },
];

function salvarContactosEnArchivo() {
  const fs = require("fs");
  fs.writeFileSync("contactos.json", JSON.stringify(contactos));
}

function leerContactosDeArchivo() {
  const fs = require("fs");
  contactos = JSON.parse(fs.readFileSync("contactos.json"));
}

leerContactosDeArchivo();

app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a mi api de contactos!!</h1>");
});

app.get(BASE_URL, (req, res) => {
  console.log("GET /contactos");
  leerContactosDeArchivo();
  res.json(contactos);
});

function validarContacto(nuevoContacto) {
  if (
    !nuevoContacto ||
    !nuevoContacto.nombre ||
    nuevoContacto.nombre.length <= 4
  ) {
    return false;
  }
  return true;
}

app.post(`${BASE_URL}`, (req, res) => {
  console.log("POST /contactos");
  const nuevoContacto = {
    id: contactos.length + 1,
    documento: req.body.documento,
    nombre: req.body.nombre,
    fechaNacimiento: req.body.fechaNacimiento,
    genero: req.body.genero,
  };

  if (!validarContacto(nuevoContacto)) {
    res.status(400).send("Contacto o nombre inválido");
    return;
  }

  contactos.push(nuevoContacto);
  res.json(nuevoContacto);

  salvarContactosEnArchivo();
});

app.put(`${BASE_URL}/:id`, (req, res) => {
  console.log(`PUT /contactos/${req.params.id}`);
  const id = req.params.id;
  const contacto = contactos.find((c) => c.id === id);
  if (!contacto) {
    res.status(404).send("Contacto no encontrado");
    return;
  }
  contacto.documento = req.body.documento;
  contacto.nombre = req.body.nombre;
  contacto.fechaNacimiento = req.body.fechaNacimiento;
  contacto.genero = req.body.genero;
  res.json(contacto);

  salvarContactosEnArchivo();
});

app.delete(`${BASE_URL}/:id`, (req, res) => {
  console.log(`DELETE /contactos/${req.params.id}`);
  const id = req.params.id;
  const index = contactos.findIndex((c) => parseInt(c.id) === parseInt(id));
  if (index === -1) {
    res.status(404).send("Contacto no encontrado");
    return;
  }
  contactos.splice(index, 1);
  res.send("Contacto eliminado");

  salvarContactosEnArchivo();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
