// Holidays (recurring by MM-DD) and kindergarten events. kind: holiday | kids
// Teachers add their own events with full dates (YYYY-MM-DD); those are kind "custom".
export const HOLIDAYS = [
  {
    d: '01-01', e: '🎄', kind: 'holiday',
    title: { uz: 'Yangi yil', ru: 'Новый год', en: 'New Year' },
    tip: {
      uz: 'Qorbobo va Qorqiz bilan kichik raqs qiling, bolaga she‘r yod oldiring.',
      ru: 'Станцуйте с Дедом Морозом и выучите стихотворение.',
      en: 'Dance with Santa and learn a short poem together.',
    },
  },
  {
    d: '01-14', e: '🛡️', kind: 'holiday',
    title: { uz: 'Vatan himoyachilari kuni', ru: 'День защитников Отечества', en: 'Defenders of the Homeland Day' },
    tip: {
      uz: 'Bayroq rasmini chizdiring va Vatan haqida qisqa suhbat qiling.',
      ru: 'Нарисуйте флаг и поговорите о Родине.',
      en: 'Draw a flag and talk about the homeland.',
    },
  },
  {
    d: '03-08', e: '🌷', kind: 'holiday',
    title: { uz: 'Xotin-qizlar kuni', ru: 'Международный женский день', en: "Women's Day" },
    tip: {
      uz: 'Onaga she‘r yod oldiring yoki o‘zingiz qo‘l bilan sovg‘a qiling.',
      ru: 'Выучите стих для мамы или сделайте подарок своими руками.',
      en: 'Learn a poem for mom or make a handmade gift.',
    },
  },
  {
    d: '03-21', e: '🌸', kind: 'holiday',
    title: { uz: 'Navro‘z bayrami', ru: 'Навруз', en: 'Navruz' },
    tip: {
      uz: 'Milliy raqs va qo‘shiq mashqi — bolalar uchun ajoyib vaqt.',
      ru: 'Национальный танец и песня — отличное время для детей.',
      en: 'National dance and songs — great fun for kids.',
    },
  },
  {
    d: '05-09', e: '🕊️', kind: 'holiday',
    title: { uz: 'Xotira va qadrlash kuni', ru: 'День памяти и почестей', en: 'Day of Remembrance' },
    tip: {
      uz: 'Bobo-buvilar va qahramonlar haqida oddiy so‘zlar bilan gapirib bering.',
      ru: 'Расскажите простыми словами о дедушках и героях.',
      en: 'Talk simply about grandparents and heroes.',
    },
  },
  {
    d: '06-01', e: '🎈', kind: 'holiday',
    title: { uz: 'Xalqaro bolalar kuni', ru: 'Международный день защиты детей', en: "Children's Day" },
    tip: {
      uz: 'Bolalar uchun o‘yin kuni — kichik sayr yoki rangli bo‘yash.',
      ru: 'День игр — прогулка или раскраска.',
      en: 'Play day — a walk or coloring together.',
    },
  },
  {
    d: '09-01', e: '🇺🇿', kind: 'holiday',
    title: { uz: 'Mustaqillik kuni', ru: 'День независимости', en: 'Independence Day' },
    tip: {
      uz: 'Bayroq va gerb haqida qisqa suhbat, she‘r o‘qish.',
      ru: 'Поговорите о флаге и гербе, почитайте стихи.',
      en: 'Talk about the flag and emblem, read a poem.',
    },
  },
  {
    d: '10-01', e: '🍎', kind: 'holiday',
    title: { uz: 'O‘qituvchilar kuni', ru: 'День учителя', en: "Teachers' Day" },
    tip: {
      uz: 'Tarbiyachiga kichik rasm yoki she‘r tayyorlang.',
      ru: 'Подготовьте рисунок или стих для воспитателя.',
      en: 'Prepare a drawing or poem for the teacher.',
    },
  },
  {
    d: '12-08', e: '📜', kind: 'holiday',
    title: { uz: 'Konstitutsiya kuni', ru: 'День Конституции', en: 'Constitution Day' },
    tip: {
      uz: 'Bolalar huquqlari haqida oddiy so‘zlar bilan suhbat.',
      ru: 'Простой разговор о правах ребёнка.',
      en: "A simple talk about children's rights.",
    },
  },
  {
    d: '10-25', e: '📖', kind: 'kids',
    title: { uz: 'She‘r kuni', ru: 'День стихов', en: 'Poetry day' },
    tip: {
      uz: 'Bolaga bitta qisqa she‘r yod oldiring, kechqurun o‘qib bering.',
      ru: 'Выучите короткое стихотворение и почитайте вечером.',
      en: 'Learn one short poem and read it at bedtime.',
    },
  },
  {
    d: '11-14', e: '💃', kind: 'kids',
    title: { uz: 'Raqs kuni', ru: 'День танца', en: 'Dance day' },
    tip: {
      uz: 'Bolangiz bilan 5 daqiqa qo‘shiqqa qarab raqs qiling.',
      ru: '5 минут танца под песню вместе с ребёнком.',
      en: 'Five minutes of dancing to a song together.',
    },
  },
  {
    d: '11-27', e: '🎨', kind: 'kids',
    title: { uz: 'Rasm kuni', ru: 'День рисования', en: 'Drawing day' },
    tip: {
      uz: 'Oila bilan rasm chizing va devorga osing.',
      ru: 'Нарисуйте рисунок вместе и повесьте на стену.',
      en: 'Draw together as a family and hang it up.',
    },
  },
];

export const loc = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.uz || '';
};

// day number -> events in the given month (0-based month)
export function monthEvents(year, month, custom = []) {
  const map = {};
  const add = (day, ev) => {
    (map[day] = map[day] || []).push(ev);
  };
  const mm = String(month + 1).padStart(2, '0');
  HOLIDAYS.forEach((h) => {
    const [m, d] = h.d.split('-');
    if (m === mm) add(Number(d), h);
  });
  custom.forEach((c) => {
    const [y, m, d] = c.date.split('-');
    if (Number(y) === year && m === mm) add(Number(d), { ...c, kind: 'custom' });
  });
  return map;
}

// next N events starting today
export function upcoming(now, custom = [], limit = 5) {
  const out = [];
  for (let i = 0; i <= 366 && out.length < limit; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${d.getFullYear()}-${mm}-${dd}`;
    HOLIDAYS.filter((h) => h.d === `${mm}-${dd}`).forEach((h) => out.push({ date: d, ev: h }));
    custom.filter((c) => c.date === iso).forEach((c) => out.push({ date: d, ev: { ...c, kind: 'custom' } }));
  }
  return out.slice(0, limit);
}
