// Table des milieux de gélose (design system § 3.8) : seul fichier JavaScript du client qui contient des couleurs.
export const MILIEUX = Object.freeze({
  sang: Object.freeze({ centre: '#A83A45', milieu: '#87212D', bord: '#6A1520' }),
  bcp: Object.freeze({ centre: '#86AED3', milieu: '#5E8CB9', bord: '#46709E' }),
  chocolat: Object.freeze({ centre: '#94694A', milieu: '#74502F', bord: '#5A3B20' }),
  neutre: Object.freeze({ centre: '#E3D7B4', milieu: '#CDBE93', bord: '#B8A77A' }),
});

export const CLE_MILIEU_DE_SECOURS = 'neutre';

// Toute clé inconnue (vide, autre casse, absente, non texte) donne le milieu neutre, sans erreur ni message.
export function milieuDe(cle) {
  if (typeof cle === 'string') {
    const nette = cle.trim();
    if (Object.hasOwn(MILIEUX, nette)) return MILIEUX[nette];
  }
  return MILIEUX[CLE_MILIEU_DE_SECOURS];
}

export function poserMilieu(element, cle) {
  const milieu = milieuDe(cle);
  element.style.setProperty('--gelose-centre', milieu.centre);
  element.style.setProperty('--gelose-milieu', milieu.milieu);
  element.style.setProperty('--gelose-bord', milieu.bord);
}
