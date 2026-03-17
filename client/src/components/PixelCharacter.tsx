import { motion, type TargetAndTransition } from 'framer-motion';
// arm-base class and @keyframes armSwing/Celebrate/LevelUp defined in index.css

// Canvas: 48×104px  (12 wide × 26 tall grid at P=4px per unit)
// Wizard gets extra headroom via viewBox "0 -16 48 120"
const P = 4;

function r(col: number, row: number, w: number, h: number, fill: string, k: string): JSX.Element {
  return <rect key={k} x={col * P} y={row * P} width={w * P} height={h * P} fill={fill} />;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

interface ClassDef { id: string; label: string; }

export const CHARACTERS: ClassDef[] = [
  { id: 'knight',   label: 'Knight'   },
  { id: 'wizard',   label: 'Wizard'   },
  { id: 'ranger',   label: 'Ranger'   },
  { id: 'rogue',    label: 'Rogue'    },
  { id: 'bard',     label: 'Bard'     },
  { id: 'druid',    label: 'Druid'    },
  { id: 'sorcerer', label: 'Sorcerer' },
  { id: 'paladin',  label: 'Paladin'  },
];

export const CLASS_COLORS: Record<string, string> = {
  knight:   '#9098b0',
  wizard:   '#6830b8',
  ranger:   '#2a7030',
  rogue:    '#7a3010',
  bard:     '#a030d0',
  druid:    '#208020',
  sorcerer: '#2080ff',
  paladin:  '#d4a020',
};

const VIEWBOXES: Record<string, string> = {
  wizard: '0 -20 48 132',
};
const DEFAULT_VB = '0 0 48 104';

// ─── Face helpers ─────────────────────────────────────────────────────────────

function drawFace(skin: string, sd: string, eye: string, brow: string): JSX.Element[] {
  return [
    r(2, 3, 8, 1, skin,     'head-top'),
    r(1, 4,10, 5, skin,     'head-main'),
    r(0, 5, 1, 3, skin,     'ear-l'),
    r(11,5, 1, 3, skin,     'ear-r'),
    r(2, 5, 2, 2,'#f8f8f0','ew-l'),
    r(7, 5, 2, 2,'#f8f8f0','ew-r'),
    r(3, 6, 1, 1, eye,      'ep-l'),
    r(8, 6, 1, 1, eye,      'ep-r'),
    r(2, 5, 1, 1,'#ffffff','es-l'),
    r(7, 5, 1, 1,'#ffffff','es-r'),
    r(2, 4, 2, 1, brow,     'br-l'),
    r(7, 4, 2, 1, brow,     'br-r'),
    r(2, 7, 1, 1,'#ff8888','ck-l'),
    r(9, 7, 1, 1,'#ff8888','ck-r'),
    r(5, 7, 2, 1, sd,       'nose'),
    r(3, 8, 6, 1, sd,       'mouth'),
    r(2, 9, 8, 1, sd,       'chin'),
  ];
}

function drawFemaleFace(skin: string, sd: string, eye: string, brow: string): JSX.Element[] {
  return [
    r(2, 3, 8, 1, skin,     'head-top'),
    r(1, 4,10, 5, skin,     'head-main'),
    r(0, 5, 1, 3, skin,     'ear-l'),
    r(11,5, 1, 3, skin,     'ear-r'),
    r(2, 5, 2, 2,'#f8f8f0','ew-l'),
    r(7, 5, 2, 2,'#f8f8f0','ew-r'),
    r(3, 6, 1, 1, eye,      'ep-l'),
    r(8, 6, 1, 1, eye,      'ep-r'),
    r(2, 5, 1, 1,'#ffffff','es-l'),
    r(7, 5, 1, 1,'#ffffff','es-r'),
    r(2, 4, 3, 1,'#202020','la-l'),
    r(7, 4, 3, 1,'#202020','la-r'),
    r(2, 3, 2, 1, brow,     'br-l'),
    r(7, 3, 2, 1, brow,     'br-r'),
    r(1, 7, 2, 1,'#ff9999','ck-l'),
    r(9, 7, 2, 1,'#ff9999','ck-r'),
    r(5, 7, 2, 1, sd,       'nose'),
    r(3, 8, 6, 1,'#cc5555','lips'),
    r(4, 8, 4, 1,'#e06868','lips-hi'),
    r(2, 9, 8, 1, sd,       'chin'),
  ];
}

function neck(skin: string): JSX.Element[] {
  return [r(4,10, 4, 2, skin, 'neck')];
}

// ─── SpriteParts ──────────────────────────────────────────────────────────────
// Render order: behind → legs → body → armL → armR → head → front
// behind: hair / capes that sit behind the body
// head:   hat / helm / face / neck
// body:   torso + belt (no arms)
// armL/R: arms + hands — each gets its own motion.g for swing
// legs:   legs + feet / lower robes
// front:  hair front layer draped over shoulders

interface SpriteParts {
  behind: JSX.Element[];
  head:   JSX.Element[];
  body:   JSX.Element[];
  armL:   JSX.Element[];
  armR:   JSX.Element[];
  legs:   JSX.Element[];
  front:  JSX.Element[];
}

// ─── KNIGHT ───────────────────────────────────────────────────────────────────
function drawKnight(): SpriteParts {
  const a='#8e96ae', ad='#5e6476', al='#b2bad2', v='#181e30', pl='#4488ff';
  return {
    behind: [],
    head: [
      r(5,0,2,1,'#88aaff','plume-tip'), r(4,1,4,2,pl,'plume'), r(3,2,6,1,'#2260cc','plume-base'),
      r(3,2,6,1,al,'helm-crown'), r(2,3,8,1,al,'helm-top'),
      r(1,4,10,6,a,'helm-main'),
      r(0,4,1,6,ad,'helm-ls'), r(11,4,1,6,ad,'helm-rs'), r(1,4,1,6,al,'helm-lh'),
      r(2,6,8,2,v,'visor'), r(1,6,1,2,ad,'vis-l'), r(10,6,1,2,ad,'vis-r'),
      r(2,9,8,2,'#8088a0','chin-g'), r(3,10,6,1,ad,'gorget'), r(4,10,4,2,'#707888','neck'),
    ],
    body: [
      r(0,12,12,2,al,'pauld-hi'), r(0,13,12,1,a,'pauld-lo'),
      r(1,14,10,4,a,'chest'), r(2,14,8,1,al,'chest-hi'), r(5,15,2,2,ad,'seam'),
      r(1,18,10,1,'#30384a','belt'),
    ],
    armL: [r(0,14,1,4,a,'arm-l'), r(0,18,1,2,ad,'gaunt-l')],
    armR: [r(11,14,1,4,a,'arm-r'), r(11,18,1,2,ad,'gaunt-r')],
    legs: [
      r(1,19,4,5,'#70788a','leg-l'), r(7,19,4,5,'#70788a','leg-r'), r(5,19,2,5,ad,'leg-g'),
      r(1,21,4,1,al,'knee-l'), r(7,21,4,1,al,'knee-r'),
      r(0,24,6,2,ad,'boot-l'), r(6,24,6,2,ad,'boot-r'),
    ],
    front: [],
  };
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
function drawWizard(): SpriteParts {
  const sk='#f0e0d0', sd='#c09870';
  const rb='#3a1070', rl='#5020a0', rd='#20085a', gt='#c08000';
  const hd='#0e0618', hm='#1a0a30', hl='#2a1048'; // darker, moodier hat
  const hc='#cc7000'; // amber crack glow
  return {
    behind: [
      // long white hair flowing down behind body
      r(0, 4, 2, 20, '#dcdce8', 'hair-l'),
      r(10, 4, 2, 20, '#dcdce8', 'hair-r'),
      r(0, 4, 1, 20, '#eeeef8', 'hair-lh'),
      r(11, 4, 1, 20, '#c8c8d4', 'hair-rs'),
    ],
    head: [
      // Hat — wide bendy silhouette, tip leans right
      r(7,-5,2,1,hd,'hat-tip'),
      r(6,-4,3,1,hd,'hat-t2'),
      r(5,-3,4,1,hd,'hat-t3'),
      r(4,-2,5,2,hm,'hat-c1'),
      r(2,0,8,2,hm,'hat-c2'),
      r(1,2,10,3,hl,'hat-c3'),
      // amber crack lines on hat
      r(8,-3,1,3,hc,'crack1'), r(7,0,1,2,hc,'crack2'), r(5,2,1,2,hc,'crack3'),
      r(9,-1,1,1,hc,'crack4'),
      // wide brim
      r(0,5,12,3,hd,'brim'), r(0,5,12,1,hm,'brim-top'), r(0,7,12,1,gt,'brim-trim'),
      ...drawFace(sk, sd, '#5030c0','#c0a880'),
      // long white beard
      r(1, 9,10,1,'#eeeef4','brd0'),
      r(1,10,10,2,'#e6e6f0','brd1'),
      r(2,12, 8,2,'#deded8','brd2'),
      r(2,14, 8,2,'#d6d6d0','brd3'),
      r(3,16, 6,2,'#cecec8','brd4'),
      r(4,18, 4,1,'#c6c6c0','brd5'),
      r(4,10, 4,2,sk,'neck'),
    ],
    body: [
      r(2,12,8,5,rb,'robe-up'), r(2,12,8,1,rl,'robe-uhi'),
    ],
    armL: [r(0,12,2,7,rl,'slv-l'), r(0,19,2,2,sk,'hand-l')],
    armR: [r(10,12,2,7,rl,'slv-r'), r(10,19,2,2,sk,'hand-r')],
    legs: [
      r(0,17,12,7,rb,'robe-lo'), r(0,17,12,1,rl,'robe-lhi'),
      r(5,17,2,7,rd,'robe-sh'),
      r(1,22,10,1,gt,'robe-trim'),
      r(1,24,4,2,hd,'shoe-l'), r(7,24,4,2,hd,'shoe-r'),
    ],
    front: [],
  };
}

// ─── RANGER ───────────────────────────────────────────────────────────────────
function drawRanger(): SpriteParts {
  const sk='#c07040', sd='#8a4018';
  const hd='#142e18', hdk='#0c1e10';
  const tu='#8a5028', tud='#603010';
  const pt='#1e3818', ptd='#122410';
  return {
    behind: [
      r(0,12,1,10,hdk,'cloak-l'), r(11,12,1,10,hdk,'cloak-r'),
    ],
    head: [
      r(1,1,10,4,hdk,'hood-back'), r(2,2,8,2,hd,'hood-top'),
      r(0,3,3,9,hdk,'hood-sl'), r(1,4,2,8,hd,'hood-sl2'),
      r(9,3,3,9,hdk,'hood-sr'), r(10,4,1,8,hd,'hood-sr2'),
      ...drawFace(sk, sd, '#2a5010','#4a2808'),
      ...neck(sk),
    ],
    body: [
      r(0,12,12,2,hd,'cloak-top'),
      r(1,13,10,5,tu,'tunic'), r(1,13,10,1,'#a06030','tunic-hi'), r(5,14,2,3,tud,'seam'),
      r(1,18,10,1,'#3a2010','belt'),
    ],
    armL: [r(0,13,1,5,tu,'arm-l'), r(0,18,1,2,sk,'hand-l')],
    armR: [r(11,13,1,5,tu,'arm-r'), r(11,18,1,2,sk,'hand-r')],
    legs: [
      r(1,19,4,5,pt,'leg-l'), r(7,19,4,5,pt,'leg-r'), r(5,19,2,5,ptd,'leg-g'),
      r(0,24,5,2,'#3a2010','boot-l'), r(6,24,5,2,'#3a2010','boot-r'),
    ],
    front: [],
  };
}

// ─── ROGUE ────────────────────────────────────────────────────────────────────
function drawRogue(): SpriteParts {
  const hair='#6a3010', hairD='#3a1808', hairL='#8a4820';
  const hd='#0d1520', he='#182030', hdk='#080d14';
  const lt='#1a1830', ll='#2a2848', ac='#c02808';
  return {
    behind: [
      r(1,0,10,3,hair,'hair-cap'),
      r(0,3,2,18,hair,'hair-l'), r(10,3,2,18,hair,'hair-r'),
      r(0,3,1,18,hairL,'hair-lhi'), r(11,3,1,18,hairD,'hair-rsh'),
      r(0,19,2,3,hairD,'hair-lend'), r(10,19,2,3,hairD,'hair-rend'),
    ],
    head: [
      r(2,0,8,3,hdk,'hood-top'), r(2,1,8,2,he,'hood-top2'),
      r(2,3,8,7,hd,'hood-centre'),
      r(2,3,1,7,he,'hood-l-edge'), r(9,3,1,7,he,'hood-r-edge'),
      r(3,4,6,5,'#0a1018','face-sh'),
      r(3,5,2,2,'#1a0808','sock-l'), r(7,5,2,2,'#1a0808','sock-r'),
      r(4,6,1,1,'#ff2000','eye-l'), r(8,6,1,1,'#ff2000','eye-r'),
      r(4,5,1,1,'#ff6040','eye-sh-l'), r(8,5,1,1,'#ff6040','eye-sh-r'),
      r(3,8,6,1,hdk,'mask'),
      r(4,10,4,2,'#181020','neck'),
    ],
    body: [
      r(1,12,10,6,lt,'jacket'), r(1,12,10,1,ll,'jacket-hi'),
      r(5,13,2,4,'#10101e','jacket-sh'),
      r(1,12,1,6,ac,'trim-l'), r(10,12,1,6,ac,'trim-r'),
      r(1,18,10,1,'#101018','belt'),
      r(3,18,1,1,'#c0c0d0','dag-l'), r(8,18,1,1,'#c0c0d0','dag-r'),
    ],
    armL: [r(0,12,1,5,lt,'arm-l'), r(0,17,1,2,'#1a1018','glove-l')],
    armR: [r(11,12,1,5,lt,'arm-r'), r(11,17,1,2,'#1a1018','glove-r')],
    legs: [
      r(1,19,4,5,'#14181e','leg-l'), r(7,19,4,5,'#14181e','leg-r'), r(5,19,2,5,'#0c1014','leg-g'),
      r(0,24,5,2,'#080c10','boot-l'), r(6,24,5,2,'#080c10','boot-r'),
    ],
    front: [
      r(0,12,1,9,hair,'hair-lf'), r(11,12,1,9,hair,'hair-rf'),
    ],
  };
}

// ─── BARD ─────────────────────────────────────────────────────────────────────
function drawBard(): SpriteParts {
  const sk='#ffd0a0', sd='#d08040';
  const ht='#8020c0', hd='#5010a0', hl='#a030e0';
  const tu='#d0a020', tud='#a07010';
  const pt='#8020a0', ptd='#601080';
  return {
    behind: [],
    head: [
      r(9,0,2,1,'#ff8060','feat-tip'), r(9,1,2,3,'#ff4040','feat'), r(9,4,2,1,'#cc2020','feat-base'),
      r(1,2,9,2,ht,'hat'), r(1,2,9,1,hl,'hat-hi'), r(1,3,9,1,'#6010a0','hat-sh'),
      r(0,4,10,1,hd,'brim'), r(2,2,1,1,'#ffd700','bell'),
      ...drawFace(sk, sd, '#802080','#603010'),
      ...neck(sk),
    ],
    body: [
      r(1,12,5,6,tu,'tun-l'), r(6,12,5,6,pt,'tun-r'),
      r(1,12,10,1,'#e0b030','tun-hi'), r(5,12,2,6,tud,'seam'),
      r(1,18,10,1,'#4a2808','belt'),
    ],
    armL: [r(0,12,1,5,tu,'arm-l'), r(0,17,1,2,sk,'hand-l')],
    armR: [r(11,12,1,5,pt,'arm-r'), r(11,17,1,2,sk,'hand-r')],
    legs: [
      r(1,19,4,5,'#a030c0','leg-l'), r(7,19,4,5,tu,'leg-r'), r(5,19,2,5,ptd,'leg-g'),
      r(0,24,5,2,'#4a2808','boot-l'), r(6,24,5,2,'#4a2808','boot-r'),
    ],
    front: [],
  };
}

// ─── DRUID ────────────────────────────────────────────────────────────────────
function drawDruid(): SpriteParts {
  const sk='#c87848', sd='#8a4818';
  const hair='#e8c830', hairD='#b89010', hairL='#f8e060';
  const lf='#207820', lfl='#38bb38';
  const rb='#6a4020', rl='#8a5830', rd='#4a2810', tr='#208020';
  return {
    behind: [
      r(1,0,10,3,hair,'hair-cap'), r(1,0,8,1,hairL,'hair-hi'),
      r(0,3,2,18,hair,'hair-l'), r(10,3,2,18,hair,'hair-r'),
      r(0,3,1,18,hairL,'hair-lhi'), r(11,3,1,18,hairD,'hair-rsh'),
      r(0,18,2,4,hairD,'hair-lend'), r(10,18,2,4,hairD,'hair-rend'),
    ],
    head: [
      r(1,3,2,2,lf,'lf-l1'), r(3,3,2,1,lfl,'lf-l2'),
      r(9,3,2,2,lf,'lf-r1'), r(7,3,2,1,lfl,'lf-r2'),
      r(5,3,2,1,lfl,'lf-c'),
      ...drawFemaleFace(sk, sd, '#1a6010','#3a1808'),
      ...neck(sk),
    ],
    body: [
      r(2,12,8,5,rb,'robe-up'), r(2,12,8,1,rl,'robe-uhi'),
    ],
    armL: [r(0,12,2,8,rd,'slv-l'), r(0,19,2,2,sk,'hand-l')],
    armR: [r(10,12,2,8,rd,'slv-r'), r(10,19,2,2,sk,'hand-r')],
    legs: [
      r(0,17,12,7,rb,'robe-lo'), r(0,17,12,1,rl,'robe-lhi'),
      r(5,17,2,7,rd,'robe-sh'),
      r(0,22,12,1,tr,'robe-trim'),
      r(1,24,4,2,'#3a2010','sandal-l'), r(7,24,4,2,'#3a2010','sandal-r'),
    ],
    front: [
      r(0,12,1,9,hair,'hair-lf'), r(11,12,1,9,hair,'hair-rf'),
    ],
  };
}

// ─── SORCERER ─────────────────────────────────────────────────────────────────
function drawSorcerer(): SpriteParts {
  const sk='#e8d0d8', sd='#b09098';
  const hair='#180810', hairD='#0c0408', hairL='#2a1020';
  const rb='#100820', rl='#1a1038', rd='#060410', rn='#2080ff';
  const eg='#00ccff';
  return {
    behind: [
      r(1,0,10,3,hair,'hair-cap'), r(1,0,10,1,hairL,'hair-cap-hi'),
      r(0,3,2,19,hair,'hair-l'), r(10,3,2,19,hair,'hair-r'),
      r(0,3,1,19,hairL,'hair-lhi'), r(11,3,1,19,hairD,'hair-rsh'),
      r(0,19,2,5,hairD,'hair-lend'), r(10,19,2,5,hairD,'hair-rend'),
      r(1,0,10,2,hairD,'cowl-top'),
      r(0,2,3,7,hairD,'cowl-l'), r(9,2,3,7,hairD,'cowl-r'),
    ],
    head: [
      ...drawFemaleFace(sk, sd, '#1060a0','#180810'),
      r(3,6,1,1,eg,'eye-l'), r(8,6,1,1,eg,'eye-r'),
      r(3,5,1,1,'#80eeff','eye-shl'), r(8,5,1,1,'#80eeff','eye-shr'),
      r(2,5,2,1,'#301040','shadow-l'), r(7,5,2,1,'#301040','shadow-r'),
      r(3,8,6,1,'#8020a0','lips'),
      ...neck(sk),
    ],
    body: [
      r(1,12,10,6,rb,'robe-up'), r(1,12,10,1,rl,'robe-uhi'),
      r(5,13,2,1,rn,'rune-v'), r(4,14,4,1,rn,'rune-h'),
    ],
    armL: [r(0,12,1,8,rd,'slv-l'), r(0,19,1,2,'#0c102c','hand-l')],
    armR: [r(11,12,1,8,rd,'slv-r'), r(11,19,1,2,'#0c102c','hand-r')],
    legs: [
      r(0,17,12,7,rb,'robe-lo'), r(0,17,12,1,rl,'robe-lhi'),
      r(5,17,2,7,rd,'robe-sh'),
      r(0,22,12,1,rn,'robe-trim'),
      r(1,24,4,2,'#060410','boot-l'), r(7,24,4,2,'#060410','boot-r'),
    ],
    front: [
      r(0,12,1,10,hair,'hair-lf'), r(11,12,1,10,hair,'hair-rf'),
    ],
  };
}

// ─── PALADIN ──────────────────────────────────────────────────────────────────
function drawPaladin(): SpriteParts {
  const sk='#f0c898', sd='#c89050';
  const gd='#d4a020', gdl='#f0c840', gdd='#9a7010';
  const wh='#f0f0f8', whd='#c0c0d0', wg='#f8f0a0';
  return {
    behind: [],
    head: [
      r(0,2,1,5,wg,'wing-l'), r(0,2,1,1,'#fffff0','wing-lt'),
      r(11,2,1,5,wg,'wing-r'), r(11,2,1,1,'#fffff0','wing-rt'),
      r(3,2,6,1,gdl,'hcrown'), r(2,3,8,1,gdl,'htop'),
      r(1,4,10,6,gd,'hmain'),
      r(1,4,1,6,gdl,'hlhi'), r(10,4,1,6,gdd,'hrsh'),
      r(2,5,8,4,sk,'face-v'),
      r(2,5,2,2,'#f8f8f0','ew-l'), r(7,5,2,2,'#f8f8f0','ew-r'),
      r(3,6,1,1,'#2040c0','ep-l'), r(8,6,1,1,'#2040c0','ep-r'),
      r(2,5,1,1,'#fff','es-l'), r(7,5,1,1,'#fff','es-r'),
      r(5,7,2,1,sd,'nose'), r(4,8,4,1,sd,'mouth'),
      r(2,9,8,1,gd,'chin-g'), r(4,10,4,2,gdd,'gorget'),
    ],
    body: [
      r(3,12,6,6,wh,'tabard'), r(3,12,6,1,'#fff','tab-hi'), r(5,14,2,3,whd,'tab-sh'),
      r(5,13,2,1,gd,'cross-h'), r(5,14,2,1,gd,'cross-v'),
      r(0,12,3,2,gdl,'pld-lhi'), r(0,13,3,3,gd,'pld-l'),
      r(9,12,3,2,gdl,'pld-rhi'), r(9,13,3,3,gd,'pld-r'),
      r(1,18,10,1,gdd,'belt'),
    ],
    armL: [r(0,15,1,3,gd,'arm-l'), r(0,18,1,2,sk,'hand-l')],
    armR: [r(11,15,1,3,gd,'arm-r'), r(11,18,1,2,sk,'hand-r')],
    legs: [
      r(1,19,4,5,gd,'leg-l'), r(7,19,4,5,gd,'leg-r'), r(5,19,2,5,gdd,'leg-g'),
      r(1,21,4,1,gdl,'knee-l'), r(7,21,4,1,gdl,'knee-r'),
      r(0,24,5,2,gdd,'boot-l'), r(6,24,5,2,gdd,'boot-r'),
    ],
    front: [],
  };
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────
function drawSprite(id: string): SpriteParts {
  switch (id) {
    case 'knight':   return drawKnight();
    case 'wizard':   return drawWizard();
    case 'ranger':   return drawRanger();
    case 'rogue':    return drawRogue();
    case 'bard':     return drawBard();
    case 'druid':    return drawDruid();
    case 'sorcerer': return drawSorcerer();
    case 'paladin':  return drawPaladin();
    default:         return drawKnight();
  }
}

// ─── Animation presets ────────────────────────────────────────────────────────
export type AnimationType = 'static' | 'idle' | 'walk' | 'celebrate' | 'levelUp';

// Outer body animation (y-translation on motion.div — HTML, rock-solid in FM v11)
const OUTER_ANIMS: Record<AnimationType, TargetAndTransition> = {
  static:    {},
  idle:      { y: [0, -4, 0],              transition: { duration: 1.8,  repeat: Infinity, ease: 'easeInOut' as const } },
  walk:      { y: [0, -3, 0],              transition: { duration: 0.42, repeat: Infinity, ease: 'easeInOut' as const } },
  celebrate: { y: [0, -26, -26, -10, 0],   transition: { duration: 0.72, times: [0, 0.28, 0.50, 0.78, 1] } },
  levelUp:   { y: [0, -22, 0, -16, 0, -8, 0], transition: { duration: 1.25, times: [0, 0.14, 0.30, 0.50, 0.65, 0.82, 1] } },
};

// Arm CSS animation — plain <g> with transform-box:fill-box so transform-origin
// is relative to each arm's own bounding box (shoulder joint). Pure CSS avoids
// Framer Motion's SVG transform pipeline which breaks rotation in FM v11.
const ARM_CSS: Record<AnimationType, { l: string; r: string }> = {
  static:    { l: '', r: '' },
  idle:      { l: '', r: '' },
  walk:      { l: 'armSwingL 0.42s ease-in-out infinite alternate', r: 'armSwingR 0.42s ease-in-out infinite alternate' },
  celebrate: { l: 'armCelebrateL 0.72s ease-out both',              r: 'armCelebrateR 0.72s ease-out both' },
  levelUp:   { l: 'armLevelUpL 1.25s ease-out both',                r: 'armLevelUpR 1.25s ease-out both' },
};

// ─── Portrait ─────────────────────────────────────────────────────────────────
// Close-up bust portrait, Baldur's Gate style. Renders head + hair only,
// cropped to the head area and shown at a larger scale with a pixel frame.

const PORTRAIT_VB: Record<string, string> = {
  wizard: '0 -16 48 68',
};
const PORTRAIT_VBH: Record<string, number> = {
  wizard: 68,
};
const PORTRAIT_DEFAULT_VB  = '0 0 48 54';
const PORTRAIT_DEFAULT_VBH = 54;

// Parchment-style scanline background for depth
function PortraitBg() {
  return (
    <>
      <rect x="0" y="0" width="48" height="200" fill="#0a0618" />
      <rect x="0" y="0" width="48" height="200" fill="url(#grain)" opacity="0.18" />
      {/* subtle vignette */}
      <radialGradient id="vign" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <rect x="0" y="0" width="48" height="200" fill="url(#vign)" />
    </>
  );
}

interface PortraitProps {
  charId: string;
  /** Pixel size multiplier — default 3 gives a 144×162px portrait */
  size?: number;
  selected?: boolean;
}

export function PixelPortrait({ charId, size = 3, selected = false }: PortraitProps) {
  const parts   = drawSprite(charId);
  const vb      = PORTRAIT_VB[charId]  ?? PORTRAIT_DEFAULT_VB;
  const vbH     = PORTRAIT_VBH[charId] ?? PORTRAIT_DEFAULT_VBH;
  const color   = CLASS_COLORS[charId] ?? '#6b5ca5';
  const w = 48 * size;
  const h = vbH * size;

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      lineHeight: 0,
      border: `3px solid ${selected ? color : '#2d1b69'}`,
      boxShadow: selected
        ? `0 0 16px ${color}88, 0 0 4px ${color}44, inset 0 0 24px rgba(0,0,0,0.6)`
        : 'inset 0 0 16px rgba(0,0,0,0.6)',
      transition: 'border-color 0.15s, box-shadow 0.15s',
      background: '#0a0618',
      overflow: 'hidden',
    }}>
      {/* Pixel corner accents */}
      {selected && (
        <>
          <div style={{ position:'absolute', top:0,   left:0,  width:6, height:6, borderTop:`2px solid ${color}`, borderLeft:`2px solid ${color}`, zIndex:2 }} />
          <div style={{ position:'absolute', top:0,   right:0, width:6, height:6, borderTop:`2px solid ${color}`, borderRight:`2px solid ${color}`, zIndex:2 }} />
          <div style={{ position:'absolute', bottom:0,left:0,  width:6, height:6, borderBottom:`2px solid ${color}`, borderLeft:`2px solid ${color}`, zIndex:2 }} />
          <div style={{ position:'absolute', bottom:0,right:0, width:6, height:6, borderBottom:`2px solid ${color}`, borderRight:`2px solid ${color}`, zIndex:2 }} />
        </>
      )}
      <svg
        viewBox={vb}
        width={w}
        height={h}
        style={{ imageRendering: 'pixelated', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="2" height="2" fill="#ffffff" />
          </pattern>
        </defs>
        <PortraitBg />
        <g>{parts.behind}</g>
        <g>{parts.head}</g>
        <g>{parts.front}</g>
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  charId: string;
  size?: number;
  animation?: AnimationType;
  /** Increment to re-trigger a one-shot animation (celebrate / levelUp) */
  animKey?: number;
  onAnimationComplete?: () => void;
}

export default function PixelCharacter({
  charId,
  size = 1,
  animation = 'idle',
  animKey = 0,
  onAnimationComplete,
}: Props) {
  const parts = drawSprite(charId);
  const vb = VIEWBOXES[charId] ?? DEFAULT_VB;
  const vbHeight = charId === 'wizard' ? 132 : 104;

  const outerAnim = OUTER_ANIMS[animation] ?? OUTER_ANIMS.idle;
  const armCss    = ARM_CSS[animation]     ?? ARM_CSS.idle;
  const isOneShot = animation === 'celebrate' || animation === 'levelUp';

  // motion.div handles y-translation (bob/jump). Pure CSS @keyframes handle arm
  // rotation so Framer Motion's SVG transform pipeline never touches the arms.
  // key={animKey} remounts the div + arms to restart one-shot animations.
  return (
    <motion.div
      key={animKey}
      animate={outerAnim}
      onAnimationComplete={isOneShot ? onAnimationComplete : undefined}
      style={{ display: 'inline-block', lineHeight: 0 }}
    >
      <svg
        viewBox={vb}
        width={48 * size}
        height={vbHeight * size}
        style={{ imageRendering: 'pixelated', overflow: 'visible', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>{parts.behind}</g>
        <g>{parts.legs}</g>
        <g>{parts.body}</g>
        <g style={{ transformBox: 'fill-box', transformOrigin: 'top center', animation: armCss.l || undefined }}>
          {parts.armL}
        </g>
        <g style={{ transformBox: 'fill-box', transformOrigin: 'top center', animation: armCss.r || undefined }}>
          {parts.armR}
        </g>
        <g>{parts.head}</g>
        <g>{parts.front}</g>
      </svg>
    </motion.div>
  );
}
