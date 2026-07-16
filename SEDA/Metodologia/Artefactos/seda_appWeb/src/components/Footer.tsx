import { ExternalLink } from 'lucide-react';

/**
 * Footer global de la aplicación SEDA.
 * Contiene el vínculo accesible al Aviso de Privacidad (WCAG 2.1 AA).
 * El PDF debe estar en /public/Aviso_de_Privacidad_SEDA.pdf
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white py-4 px-8 flex items-center justify-between text-xs text-slate-400">
      <span className="font-medium">
        © {currentYear} SEDA · Banco de Alimentos «La Comidita»
      </span>

      <nav aria-label="Pie de página legal">
        <a
          href="/Aviso_de_Privacidad_SEDA.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Aviso de privacidad, SEDA (abre en una nueva pestaña)"
          className="privacy-link"
        >
          Aviso de Privacidad
          <ExternalLink className="privacy-link__icon" aria-hidden="true" />
        </a>
      </nav>
    </footer>
  );
}
