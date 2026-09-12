// Configuración de Eleventy (el generador del sitio).
// El contenido editable vive en /content/*.json y lo escribe el editor de /admin/.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const readJSON = (file) => JSON.parse(fs.readFileSync(path.join("content", file), "utf8"));

export default function (eleventyConfig) {
  // --- Contenido editable (un objeto global por archivo) ---
  for (const name of ["negocio", "textos", "galeria", "preguntas"]) {
    eleventyConfig.addGlobalData(name, () => readJSON(`${name}.json`));
  }
  eleventyConfig.addWatchTarget("content/");

  // --- Archivos que se copian tal cual ---
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "src/img/uploads": "img/uploads" }); // originales (respaldo)
  eleventyConfig.addPassthroughCopy({ "src/img/logo.png": "img/logo.png" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  // --- Imágenes: cada <img> del HTML se convierte en AVIF/WebP en varios tamaños ---
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "jpeg"],
    widths: [480, 800, 1200, 1600],
    urlPath: "/img/",
    outputDir: "_site/img/",
    failOnError: false, // una foto rara no debe tumbar el sitio: se deja el original
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
    sharpOptions: { animated: false },
  });

  // Imagen para compartir (WhatsApp / Instagram / Google): un JPEG de 1200px.
  eleventyConfig.addAsyncShortcode("ogImage", async (src) => {
    try {
      const stats = await Image(path.join("src", src), {
        widths: [1200], formats: ["jpeg"], urlPath: "/img/", outputDir: "_site/img/",
      });
      return stats.jpeg[0].url;
    } catch { return src; }
  });

  // --- Filtros de plantilla ---
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Resalta una parte del título en cursiva dorada: destacar("Grillz a tu medida", "a tu medida")
  eleventyConfig.addFilter("destacar", (texto = "", parte = "") => {
    const t = esc(texto), p = esc(parte);
    if (!p || !t.includes(p)) return t;
    return t.replace(p, `<span class="it">${p}</span>`);
  });
  eleventyConfig.addFilter("wa", (numero = "", mensaje = "") => {
    const n = String(numero).replace(/\D/g, "");
    return `https://wa.me/${n}${mensaje ? "?text=" + encodeURIComponent(mensaje) : ""}`;
  });
  eleventyConfig.addFilter("telInternacional", (numero = "") => "+" + String(numero).replace(/\D/g, ""));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // --- Favicons a partir del logo (se regeneran en cada build) ---
  eleventyConfig.on("eleventy.after", async () => {
    try {
      const logo = (readJSON("negocio.json").logo || "/img/logo.png").replace(/^\//, "");
      const input = path.join("src", logo);
      const out = "_site/icons"; fs.mkdirSync(out, { recursive: true });
      for (const [name, size] of [["favicon-32.png", 32], ["favicon-192.png", 192], ["apple-touch-icon.png", 180], ["icon-512.png", 512]]) {
        await sharp(input).resize(size, size, { fit: "cover" }).png().toFile(path.join(out, name));
      }
    } catch (e) { console.warn("[icons] no se pudieron generar los favicons:", e.message); }
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
