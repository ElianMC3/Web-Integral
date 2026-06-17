import { ExternalLink } from 'lucide-react';

/** URL del Aviso de Privacidad en PDF (servido desde /public). */
const PRIVACY_PDF_URL = '/Aviso_de_Privacidad_SEDA.pdf';

interface PrivacyConsentProps {
  /** ID único para conectar el <input> con su <label>. Úsalo para evitar conflictos entre formularios. */
  id?: string;
  /** Estado controlado del checkbox (opcional – si no se pasa, el componente es no-controlado). */
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * Campo reutilizable de consentimiento de Aviso de Privacidad (WCAG 2.1 AA).
 *
 * Uso básico (no-controlado):
 *   <PrivacyConsent id="consent-login" />
 *
 * Uso controlado:
 *   const [agreed, setAgreed] = useState(false);
 *   <PrivacyConsent id="consent-register" checked={agreed} onChange={setAgreed} />
 */
export default function PrivacyConsent({
  id = 'privacy-consent',
  checked,
  onChange,
}: PrivacyConsentProps) {
  const isControlled = checked !== undefined;

  return (
    <div className="privacy-consent-wrapper">
      {/* ── Fila: Checkbox + Label ── */}
      <div className="privacy-consent-row">
        <input
          type="checkbox"
          id={id}
          name={id}
          required
          defaultChecked={isControlled ? undefined : false}
          checked={isControlled ? checked : undefined}
          onChange={
            isControlled && onChange
              ? (e) => onChange(e.target.checked)
              : undefined
          }
          aria-describedby={`${id}-hint`}
          className="privacy-consent-checkbox"
        />

        <label htmlFor={id} className="privacy-consent-label">
          He leído y acepto el{' '}
          <a
            href={PRIVACY_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Aviso de privacidad, SEDA (abre en una nueva pestaña)"
            className="privacy-link privacy-link--inline"
            onClick={(e) => e.stopPropagation()}
          >
            Aviso de Privacidad
            <ExternalLink className="privacy-link__icon" aria-hidden="true" />
          </a>
        </label>
      </div>

      {/* ── Texto de finalidad (LFPDPPP Art. 15) ── */}
      <p id={`${id}-hint`} className="privacy-consent-hint">
        Tus datos personales serán tratados únicamente con la finalidad de
        gestionar tu acceso al sistema y coordinar la entrega de apoyos
        alimentarios. No se compartirán con terceros ajenos a SEDA sin tu
        consentimiento previo.
      </p>
    </div>
  );
}
