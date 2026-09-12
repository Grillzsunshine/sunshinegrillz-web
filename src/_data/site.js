// URL pública del sitio. Netlify la pone sola en la variable URL cuando el dominio está conectado.
const envUrl = process.env.URL || "";
export default {
  url: /^https:\/\/(?!.*localhost)/.test(envUrl) ? envUrl.replace(/\/$/, "") : "https://sunshinegrillz.com",
  fecha: new Date().toISOString().slice(0, 10),
};
