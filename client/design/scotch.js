// Scotch (design system § 3.11, § 9.16) : angle borné et élément décoratif.
export const ANGLE_DU_SCOTCH_MIN = -4;
export const ANGLE_DU_SCOTCH_MAX = 3;

export function angleDuScotch(angle) {
  if (typeof angle !== 'number' || Number.isNaN(angle)) return 0;
  return Math.min(ANGLE_DU_SCOTCH_MAX, Math.max(ANGLE_DU_SCOTCH_MIN, angle));
}

// Enveloppe + scotch : l'ombre est un drop-shadow de l'enveloppe, parce que la découpe couperait une box-shadow.
export function creerScotch({ texte = '', revision = false, angle = 0, lu = false } = {}) {
  const enveloppe = document.createElement('span');
  enveloppe.className = 'scotch-enveloppe';
  const scotch = document.createElement('span');
  scotch.className = revision ? 'scotch scotch-revision' : 'scotch';
  scotch.textContent = texte;
  scotch.style.transform = `rotate(${angleDuScotch(angle)}deg)`;
  if (!lu) enveloppe.setAttribute('aria-hidden', 'true');
  enveloppe.append(scotch);
  return enveloppe;
}
