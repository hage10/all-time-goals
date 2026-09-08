const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/oonurm30/fotolar';

const LOCAL_CRESTS = new Set([
  'albania.png', 'algeria.png', 'angola.png', 'argentina.png', 'austin.png', 'australia.png', 'austria.png',
  'bolivia.png', 'bosniaandherzegovina.png', 'brazil.png', 'canada.png', 'capeverde.png', 'chile.png',
  'colombia.png', 'costarica.png', 'croatia.png', 'curacao.png', 'ecuador.png', 'egypt.png', 'england.png',
  'estonia.png', 'france.png', 'germany.png', 'guatemala.png', 'haiti.png', 'honduras.png', 'hongkong.png',
  'iceland.png', 'iran.png', 'italy.png', 'jamaica.png', 'jordan.png', 'mexico.png', 'netherlands.png',
  'nicaragua.png', 'nigeria.png', 'panama.png', 'paraguay.png', 'peru.png', 'portlandtimbers.png',
  'portugal.png', 'puertorico.png', 'qatar.png', 'sanluis.png', 'saudiarabia.png', 'serbia.png',
  'slovenia.png', 'spain.png', 'switzerland.png', 'unitedarabemirates.png', 'uruguay.png', 'usa.png',
  'venezuela.png', 'zambia.png', 'barcelona.png', 'inter.png', 'psg.png', 'realmadrid.png', 'atleticomadrid.png',
  'valencia.png', 'sevilla.png', 'athleticbilbao.png', 'espanyol.png', 'getafe.png', 'montreal.png'
]);

export function getCrestUrl(filename?: string): string {
  if (!filename) {
    return '/crests/argentina.png';
  }
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const cleanName = filename.toLowerCase().endsWith('.png') || filename.toLowerCase().endsWith('.svg')
    ? filename.toLowerCase()
    : `${filename.toLowerCase()}.png`;

  if (LOCAL_CRESTS.has(cleanName)) {
    return `/crests/${cleanName}`;
  }
  return `${CDN_BASE_URL}/${cleanName}`;
}
