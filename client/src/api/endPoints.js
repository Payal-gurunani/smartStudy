export const endpoints = {
  login: { method: "POST", url: "/users/login" },
  register: { method: "POST", url: "/users/register" },
  logout: { method: "POST", url: "/users/logout" },
  Profile : { method: "GET", url: "/users/profile" },
  checkLogin: { method: "GET", url: "/users/check-login" },
 getNotes: { method: "GET", url: "/notes" },
  createNote: { method: "POST", url: "/notes" },
  updateNote: (id) => ({ method: "PUT", url: `/notes/${id}` }),
  deleteNote: (id) => ({ method: "DELETE", url: `/notes/${id}` }),
  getNote: (id) => ({ method: "GET", url: `/notes/${id}` }),

  uploadPdf: { method: "POST", url: "/notes/upload-pdf" },

  summarizeNote: (id) => ({ method: "POST", url: `/notes/${id}/summarize` }),

};
