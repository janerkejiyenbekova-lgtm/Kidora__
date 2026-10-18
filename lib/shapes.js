// Coloring templates. Every shape is a fillable region.
export const TEMPLATES = {
  house: {
    viewBox: '0 0 400 400',
    shapes: [
      { id: 'sky', tag: 'rect', attrs: { x: 0, y: 0, width: 400, height: 350 } },
      { id: 'sun', tag: 'circle', attrs: { cx: 340, cy: 70, r: 36 } },
      { id: 'roof', tag: 'polygon', attrs: { points: '80,185 200,70 320,185' } },
      { id: 'wall', tag: 'rect', attrs: { x: 100, y: 185, width: 200, height: 165 } },
      { id: 'win1', tag: 'rect', attrs: { x: 118, y: 215, width: 44, height: 44 } },
      { id: 'win2', tag: 'rect', attrs: { x: 238, y: 215, width: 44, height: 44 } },
      { id: 'door', tag: 'rect', attrs: { x: 175, y: 255, width: 50, height: 95 } },
      { id: 'grass', tag: 'rect', attrs: { x: 0, y: 350, width: 400, height: 50 } },
    ],
  },
  fish: {
    viewBox: '0 0 400 400',
    shapes: [
      { id: 'body', tag: 'ellipse', attrs: { cx: 190, cy: 200, rx: 120, ry: 75 } },
      { id: 'tail', tag: 'polygon', attrs: { points: '300,200 370,135 370,265' } },
      { id: 'fin1', tag: 'path', attrs: { d: 'M180 130 Q200 75 245 128 Z' } },
      { id: 'fin2', tag: 'path', attrs: { d: 'M180 270 Q200 325 245 272 Z' } },
      { id: 'stripe', tag: 'path', attrs: { d: 'M225 140 Q235 200 225 260 L240 260 Q250 200 240 140 Z' } },
      { id: 'eye', tag: 'circle', attrs: { cx: 130, cy: 185, r: 14 } },
    ],
  },
  flower: {
    viewBox: '0 0 400 400',
    shapes: [
      { id: 'p1', tag: 'circle', attrs: { cx: 200, cy: 95, r: 45 } },
      { id: 'p2', tag: 'circle', attrs: { cx: 275, cy: 140, r: 45 } },
      { id: 'p3', tag: 'circle', attrs: { cx: 250, cy: 225, r: 45 } },
      { id: 'p4', tag: 'circle', attrs: { cx: 150, cy: 225, r: 45 } },
      { id: 'p5', tag: 'circle', attrs: { cx: 125, cy: 140, r: 45 } },
      { id: 'center', tag: 'circle', attrs: { cx: 200, cy: 170, r: 40 } },
      { id: 'stem', tag: 'rect', attrs: { x: 195, y: 250, width: 10, height: 130 } },
      { id: 'leaf', tag: 'ellipse', attrs: { cx: 240, cy: 330, rx: 40, ry: 16, transform: 'rotate(-20 240 330)' } },
    ],
  },
  tree: {
    viewBox: '0 0 400 400',
    shapes: [
      { id: 'sky', tag: 'rect', attrs: { x: 0, y: 0, width: 400, height: 370 } },
      { id: 'sun', tag: 'circle', attrs: { cx: 60, cy: 60, r: 36 } },
      { id: 'trunk', tag: 'rect', attrs: { x: 180, y: 240, width: 40, height: 130 } },
      { id: 'crown1', tag: 'circle', attrs: { cx: 200, cy: 150, r: 75 } },
      { id: 'crown2', tag: 'circle', attrs: { cx: 135, cy: 205, r: 55 } },
      { id: 'crown3', tag: 'circle', attrs: { cx: 265, cy: 205, r: 55 } },
      { id: 'ground', tag: 'rect', attrs: { x: 0, y: 370, width: 400, height: 30 } },
    ],
  },
  rocket: {
    viewBox: '0 0 400 400',
    shapes: [
      { id: 'body', tag: 'ellipse', attrs: { cx: 200, cy: 200, rx: 55, ry: 130 } },
      { id: 'nose', tag: 'path', attrs: { d: 'M160 110 Q200 10 240 110 Z' } },
      { id: 'finL', tag: 'polygon', attrs: { points: '150,250 105,320 155,300' } },
      { id: 'finR', tag: 'polygon', attrs: { points: '250,250 295,320 245,300' } },
      { id: 'window', tag: 'circle', attrs: { cx: 200, cy: 180, r: 24 } },
      { id: 'flame', tag: 'path', attrs: { d: 'M180 330 Q200 400 220 330 Z' } },
      { id: 'sky', tag: 'rect', attrs: { x: 0, y: 0, width: 400, height: 400 } },
    ],
  },
  cat: {
    viewBox: '0 0 400 400',
    shapes: [
      { id: 'earL', tag: 'polygon', attrs: { points: '125,150 135,60 185,120' } },
      { id: 'earR', tag: 'polygon', attrs: { points: '275,150 265,60 215,120' } },
      { id: 'head', tag: 'ellipse', attrs: { cx: 200, cy: 200, rx: 95, ry: 80 } },
      { id: 'body', tag: 'ellipse', attrs: { cx: 200, cy: 330, rx: 80, ry: 55 } },
      { id: 'tail', tag: 'path', attrs: { d: 'M270 360 Q340 340 330 280 Q320 260 310 290 Q320 330 260 345 Z' } },
      { id: 'eyeL', tag: 'circle', attrs: { cx: 165, cy: 195, r: 14 } },
      { id: 'eyeR', tag: 'circle', attrs: { cx: 235, cy: 195, r: 14 } },
      { id: 'nose', tag: 'polygon', attrs: { points: '193,225 207,225 200,236' } },
    ],
  },
};
