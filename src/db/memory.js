const authors = [
  { id: 1, name: "Ana García", email: "ana@example.com", bio: "Desarrolladora full-stack apasionada por Node.js" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@example.com", bio: "Escritor técnico especializado en bases de datos" },
  { id: 3, name: "María López", email: "maria@example.com", bio: "Ingeniera de software con foco en APIs REST" },
];

const posts = [
  { id: 1, title: "Introducción a Node.js", content: "Node.js es un runtime de JavaScript...", author_id: 1, published: true },
  { id: 2, title: "PostgreSQL vs MySQL", content: "Ambas bases de datos tienen ventajas...", author_id: 2, published: true },
  { id: 3, title: "APIs RESTful", content: "REST es un estilo arquitectónico...", author_id: 1, published: true },
  { id: 4, title: "Manejo de errores en Express", content: "El manejo apropiado de errores...", author_id: 3, published: false },
  { id: 5, title: "Async/Await explicado", content: "Las promesas simplifican el código asíncrono...", author_id: 1, published: false },
];

module.exports = { authors, posts };