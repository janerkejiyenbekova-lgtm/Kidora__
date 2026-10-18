export const GROUPS = ['all', 'Quyonchalar', 'Kapalakchalar', 'Gullar'];
export const TEACHERS = {
  Quyonchalar: 'Feruza opa',
  Kapalakchalar: 'Shahlo opa',
  Gullar: 'Zulfiya opa',
};
export const TEACHER_ACCOUNTS = [
  { login: 'feruza', pw: '1234', group: 'Quyonchalar' },
  { login: 'shahlo', pw: '1234', group: 'Kapalakchalar' },
  { login: 'zulfiya', pw: '1234', group: 'Gullar' },
];
export const MOODS =['😊', '🤩', '😐', '😢', '😴'];
export const AVATARS = ['🐰', '🐻', '🦊', '🐼', '🐸', '🐯'];
export const SHOP = [
  { id: 's1', cost: 30, emoji: '🌟', key: 'sh1' },
  { id: 's2', cost: 60, emoji: '🚲', key: 'sh2' },
  { id: 's3', cost: 90, emoji: '🎈', key: 'sh3' },
  { id: 's4', cost: 120, emoji: '🏆', key: 'sh4' },
  { id: 's5', cost: 150, emoji: '🦄', key: 'sh5' },
];

export const uid = () => Math.random().toString(36).slice(2, 9);
export const normPhone = (p) => (p || '').replace(/\D/g, '').slice(-9);

const P = (id, name, phone) => ({ id, name, phone, pw: '1234' });
const C = (id, name, age, group, parentId) => ({ id, name, age, group, parentId });

export const SEED = {
  lang: 'uz',
  theme: 'light',
  sound: true,
  session: null,
  tSession: null,
  parents: [
    P('p1', 'Dilnoza', '901112233'),
    P('p2', 'Bahrom', '901112244'),
    P('p3', 'Nigora', '901112255'),
    P('p4', 'Sherzod', '901112266'),
    P('p5', 'Ravshan', '901112277'),
    P('p6', 'Akmal', '901112288'),
  ],
  children: [
    C('c1', 'Amina', 4, 'Quyonchalar', 'p1'),
    C('c2', 'Ali', 5, 'Quyonchalar', 'p1'),
    C('c3', 'Sofiya', 3, 'Kapalakchalar', 'p2'),
    C('c4', 'Jasur', 6, 'Kapalakchalar', 'p2'),
    C('c5', 'Malika', 5, 'Gullar', 'p3'),
    C('c6', 'Timur', 4, 'Gullar', 'p3'),
    C('c7', 'Madina', 4, 'Quyonchalar', 'p4'),
    C('c8', 'Otabek', 5, 'Kapalakchalar', 'p4'),
    C('c9', 'Zarina', 3, 'Gullar', 'p5'),
    C('c10', 'Bekzod', 6, 'Quyonchalar', 'p5'),
    C('c11', 'Nilufar', 5, 'Kapalakchalar', 'p6'),
    C('c12', 'Shahzod', 4, 'Gullar', 'p6'),
  ],
  attendance: {},
  done: {},
  points: {},
  coins: {},
  owned: {},
  moods: {},
  cameraUrl: '',
  history: [
    { wd: 1, p: 9 },
    { wd: 2, p: 8 },
    { wd: 3, p: 10 },
    { wd: 4, p: 9 },
    { wd: 5, p: 8 },
    { wd: 6, p: 9 },
  ],
  schedule: [
    { id: 's1', time: '08:30', emoji: '👋', title: 'Salomlashish va kayfiyat' },
    { id: 's2', time: '09:00', emoji: '🎨', title: 'Rasm chizish' },
    { id: 's3', time: '09:45', emoji: '🔢', title: 'Sanash va matematika' },
    { id: 's4', time: '10:30', emoji: '🌳', title: 'Ochiq havoda o‘yin' },
    { id: 's5', time: '12:00', emoji: '🥗', title: 'Tushlik' },
    { id: 's6', time: '13:00', emoji: '😴', title: 'Dam olish' },
    { id: 's7', time: '15:00', emoji: '🎵', title: 'Musiqa va raqs' },
  ],
  videos: [
    { id: 'v1', emoji: '🔤', title: 'Alifbo qo‘shig‘i', url: 'https://www.youtube.com/results?search_query=alifbo+qoshiq+bolalar', group: 'all' },
    { id: 'v2', emoji: '🐾', title: 'Hayvonlar ovozi', url: 'https://www.youtube.com/results?search_query=hayvonlar+ovozi+bolalar', group: 'Quyonchalar' },
  ],
  homework: [
    { id: 'h1', emoji: '🔢', title: 'Uyda 3 ta narsani sanang', group: 'all' },
    { id: 'h2', emoji: '🎨', title: 'Quyosh rasmini chizing', group: 'all' },
    { id: 'h3', emoji: '🍎', title: 'Rangli mevalar nomini ayting', group: 'Kapalakchalar' },
  ],
  announcements: [{ id: 'a1', date: '2026-10-18', text: 'Juma kuni ota-onalar kuni — soat 10:00 da kutamiz!' }],
  learned: [],
  messages: [],
  events: [],
  celebrations: [],
};
