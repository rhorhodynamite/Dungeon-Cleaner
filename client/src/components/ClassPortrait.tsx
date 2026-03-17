// Static Baldur's Gate–style bust portraits, one per class.
// Canvas: 24 × 34 units, P=4px → 96 × 136px at scale 1.

import { CLASS_COLORS } from './PixelCharacter';

const P = 4;
const CW = 24;
const CH = 34;

function r(c: number, row: number, w: number, h: number, fill: string, k: string): JSX.Element {
  return <rect key={k} x={c * P} y={row * P} width={w * P} height={h * P} fill={fill} />;
}

// ── Shared face builder (portrait scale ≈ 2× sprite face) ────────────────────
// y = row where the forehead begins
function pFace(y: number, sk: string, sd: string, ey: string, br: string, female = false): JSX.Element[] {
  const lips  = female ? '#cc5555' : sd;
  const cheek = female ? '#ffb8b8' : '#ffaaaa';
  const els: JSX.Element[] = [
    r(5, y,   14, 1, sk,        'ft'),
    r(3, y+1, 18, 7, sk,        'fm'),
    r(1, y+2,  2, 4, sk,        'el'),
    r(21,y+2,  2, 4, sk,        'er'),
    r(4, y+2,  4, 3, '#f8f8f0', 'ewl'),
    r(16,y+2,  4, 3, '#f8f8f0', 'ewr'),
    r(5, y+3,  2, 2, ey,        'epl'),
    r(17,y+3,  2, 2, ey,        'epr'),
    r(5, y+2,  1, 1, '#ffffff', 'ehl'),
    r(17,y+2,  1, 1, '#ffffff', 'ehr'),
    r(4, y+1,  4, 1, br,        'brl'),
    r(16,y+1,  4, 1, br,        'brr'),
    r(2, y+4,  2, 2, cheek,     'ckl'),
    r(20,y+4,  2, 2, cheek,     'ckr'),
    r(11,y+4,  2, 2, sd,        'nos'),
    r(8, y+6,  8, 1, lips,      'mth'),
    r(3, y+8, 18, 1, sd,        'chn'),
  ];
  if (female) {
    els.push(r(3, y+2, 6, 1, '#202020', 'lasl'));
    els.push(r(15,y+2, 6, 1, '#202020', 'lasr'));
  }
  return els;
}
function pNeck(y: number, sk: string): JSX.Element[] {
  return [r(9, y, 6, 4, sk, 'nck')];
}

// ── KNIGHT ────────────────────────────────────────────────────────────────────
function knightPortrait(): JSX.Element[] {
  const bg='#0e1220', st='#161a2c';
  const sk='#d0b888', sd='#a07840', ey='#2255bb', br='#604020';
  const a='#9098b0', al='#c0c8e0', ad='#5c6480';
  const pl='#3377ee', plh='#88aaff';
  const y = 8;
  return [
    r(0,0,24,34,bg,'bg'),
    r(0,0,4,34,st,'vl'), r(20,0,4,34,st,'vr'), r(0,27,24,7,'#080c18','vb'),
    // plume
    r(10,0,4,1,plh,'p0'), r(9,1,6,2,pl,'p1'), r(8,3,8,1,'#2255cc','p2'),
    // helm top
    r(5,3,14,1,al,'ht0'), r(4,4,16,2,a,'ht1'), r(3,5,18,3,a,'ht2'),
    r(3,5,1,14,ad,'hls'), r(20,5,1,14,ad,'hrs'), r(4,5,1,14,al,'hlh'),
    // cheek guards framing face
    r(3,7,2,9,a,'hcl'), r(19,7,2,9,a,'hcr'),
    // helm interior (above face)
    r(5,5,14,3,ad,'hini'),
    // face
    ...pFace(y,sk,sd,ey,br),
    // neck + gorget
    ...pNeck(y+9,sk),
    r(5,y+13,14,1,ad,'gg'),
    // shoulders
    r(0,y+14,9,12,a,'sl'), r(15,y+14,9,12,a,'sr'),
    r(0,y+14,9,1,al,'slh'), r(15,y+14,9,1,al,'srh'),
    r(1,y+16,7,1,pl,'spt1'), r(16,y+16,7,1,pl,'spt2'),
    r(9,y+14,6,12,ad,'cc'), r(10,y+15,4,1,'#3a4060','csm'),
  ];
}

// ── WIZARD ────────────────────────────────────────────────────────────────────
// Redesigned: gaunt, brooding, 90s hardcore. No jolly clown energy.
function wizardPortrait(): JSX.Element[] {
  const bg='#04020c';
  // weathered gaunt skin, deep amber eyes, near-black brows
  const sk='#b89060', sd='#7a5020', ey='#cc8800', br='#1e0e04';
  // hat: near-black with glowing amber crack lines
  const ht='#0e0618', hd='#070310', hc='#cc7000';
  // robe: void-black
  const rb='#0a0616';
  const y = 9;
  return [
    // void background with subtle energy
    r(0,0,24,34,bg,'bg'),
    r(0,0,5,34,'#030108','vl'), r(19,0,5,34,'#030108','vr'),
    r(0,26,24,8,'#020108','vb'),
    // dim energy crackles behind hat
    r(2,4,1,3,'#18083a','en1'), r(22,6,1,4,'#18083a','en2'),
    r(1,14,1,2,'#18083a','en3'), r(21,18,1,3,'#18083a','en4'),
    // hat — wide, BENDY: tip leans right, body curves back left
    r(14,0,3,1,hd,'h0'),          // tip offset right
    r(13,1,4,1,hd,'h1'),
    r(12,2,5,1,hd,'h2'),
    r(10,3,7,2,ht,'h3'),          // starts pulling back
    r(8, 4,9,2,ht,'h4'),
    r(6, 5,12,2,ht,'h5'),
    r(5, 6,14,1,ht,'h6'),
    // wide drooping brim
    r(2, 7,20,2,ht,'hbr'), r(2,7,20,1,'#18082a','hbrh'),
    r(1, 8,22,1,hd,'hbr2'),       // brim underside slightly wider
    // CRACK LINES following the lean of the hat
    r(15,1,1,2,hc,'cr1'), r(14,3,1,2,hc,'cr2'),
    r(12,4,1,2,'#994800','cr3'), r(9,5,1,3,hc,'cr4'),
    r(7, 6,2,1,hc,'cr5'), r(13,2,1,1,hc,'cr6'),
    // glowing sigil on hat body
    r(10,5,2,2,'#aa5500','sg0'), r(10,5,2,1,'#ff8800','sg1'),
    // face — drawn over hat brim
    ...pFace(y,sk,sd,ey,br),
    // dramatic deep-set eye shadows (drawn over whites)
    r(4,y+2,4,1,'#3a1e08','bsh1'), r(16,y+2,4,1,'#3a1e08','bsh2'),
    // glowing amber pupils (override)
    r(4,y+2,4,3,'#1a0e04','ewov1'), r(16,y+2,4,3,'#1a0e04','ewov2'),
    r(5,y+3,2,2,ey,'eco1'), r(17,y+3,2,2,ey,'eco2'),
    r(5,y+2,1,1,'#ffcc44','egh1'), r(17,y+2,1,1,'#ffcc44','egh2'),
    // heavy furrowed brows
    r(4,y+1,5,1,'#100804','bro1'), r(15,y+1,5,1,'#100804','bro2'),
    // gaunt hollow cheeks (shadow over cheek area)
    r(2,y+3,3,4,'#6a3a10','gcs1'), r(19,y+3,3,4,'#6a3a10','gcs2'),
    // thin tight-lipped mouth (harder expression)
    r(8,y+6,8,1,'#7a3820','mlip'),
    // dark wizard beard — charcoal grey, full but unkempt
    r(5, y+6,14,1,'#5a4838','bd0'),
    r(4, y+7,16,2,'#4e3e2e','bd1'),
    r(4, y+8,16,2,'#423228','bd2'),
    r(5, y+9,14,2,'#362820','bd3'),
    r(6, y+10,12,1,'#2a1e18','bd4'),
    // grey streaks through beard
    r(8, y+7,2,1,'#908070','str1'), r(13,y+8,2,1,'#908070','str2'),
    r(7, y+9,2,1,'#807060','str3'),
    // neck
    ...pNeck(y+9,sk),
    // void robe with dramatic standing collar + amber trim
    r(0,y+13,24,13,rb,'rb'),
    // high collar on sides
    r(0,y+13,5,6,'#0e0620','col1'), r(19,y+13,5,6,'#0e0620','col2'),
    r(0,y+13,5,1,'#2a1048','colh1'), r(19,y+13,5,1,'#2a1048','colh2'),
    // amber rune lines on robe
    r(8,y+14,8,1,hc,'rr1'),
    r(7,y+15,2,1,hc,'rr2'), r(15,y+15,2,1,hc,'rr3'),
    r(6,y+16,1,1,'#804000','rr4'), r(17,y+16,1,1,'#804000','rr5'),
    r(11,y+17,2,1,'#994800','rr6'),
  ];
}

// ── RANGER ────────────────────────────────────────────────────────────────────
function rangerPortrait(): JSX.Element[] {
  const bg='#060e06';
  const sk='#c07040', sd='#8a4018', ey='#2a7030', br='#4a2808';
  const hd='#142e18', hdk='#0c1e10';
  const y = 6;
  return [
    r(0,0,24,34,bg,'bg'),
    r(0,5,2,29,'#0a1a0a','tl'), r(22,8,2,26,'#0a1a0a','tr'),
    r(1,3,2,31,'#040c04','tld'), r(21,6,2,28,'#040c04','trd'),
    // hood back
    r(2,0,20,6,hdk,'hb0'), r(3,1,18,4,hd,'hbt'),
    r(1,3,3,16,hdk,'hsl'), r(20,3,3,16,hdk,'hsr'),
    r(2,4,2,14,hd,'hsl2'), r(21,4,1,14,hd,'hsr2'),
    // face
    ...pFace(y,sk,sd,ey,br),
    // neck
    ...pNeck(y+9,sk),
    r(9,y+9,6,5,hdk,'hfc'),
    // tunic
    r(2,y+13,20,13,'#6a3a18','tb'), r(2,y+13,20,1,'#8a5028','tbh'),
    r(10,y+14,4,3,hdk,'tbd'),
    // cloak draped over shoulders
    r(0,y+13,3,13,hdk,'cl'), r(21,y+13,3,13,hdk,'cr'),
  ];
}

// ── ROGUE ─────────────────────────────────────────────────────────────────────
function roguePortrait(): JSX.Element[] {
  const bg='#04040a';
  const ey='#ff2000';
  const hd='#0d1520', he='#182030';
  const y = 6;
  return [
    r(0,0,24,34,bg,'bg'),
    r(0,0,6,34,'#030308','vl'), r(18,0,6,34,'#030308','vr'),
    // auburn hair behind hood
    r(1,0,10,5,'#5a2808','hr1'), r(13,0,10,5,'#5a2808','hr2'),
    r(0,3,3,20,'#3a1808','hrl'), r(21,3,3,20,'#3a1808','hrr'),
    // hood
    r(2,0,20,6,hd,'hd0'), r(3,1,18,4,'#0a1018','hd1'),
    r(2,3,3,16,hd,'hdl'), r(19,3,3,16,hd,'hdr'),
    r(2,3,1,16,he,'hdlh'), r(20,3,1,16,he,'hdrh'),
    // deep shadow on face
    r(5,y,14,10,'#080d18','fs'),
    // GLOWING RED EYES — the only clear feature
    r(6,y+3,4,3,'#3a0000','egl'), r(14,y+3,4,3,'#3a0000','egr'),
    r(7,y+4,3,2,ey,'epl'), r(15,y+4,3,2,ey,'epr'),
    r(7,y+3,2,1,'#ff6040','ehl'), r(15,y+3,2,1,'#ff6040','ehr'),
    // hint of smirk
    r(9,y+7,6,1,'#2a1820','msk'), r(10,y+7,4,1,'#5a2838','smir'),
    // leather jacket
    r(2,y+13,20,13,'#0f101c','lt'), r(2,y+13,20,1,'#1a1830','lth'),
    r(10,y+13,4,4,'#c02808','trim'),
    r(0,y+13,3,13,'#0d0d18','lts'), r(21,y+13,3,13,'#0d0d18','rts'),
  ];
}

// ── BARD ──────────────────────────────────────────────────────────────────────
function bardPortrait(): JSX.Element[] {
  const bg='#1a1008';
  const sk='#ffd0a0', sd='#d08040', ey='#802080', br='#603010';
  const ht='#8020c0', hd='#5010a0', hl='#a030e0';
  const y = 7;
  return [
    r(0,0,24,34,bg,'bg'),
    r(0,0,24,34,'#0a0806','bgd'),
    r(6,4,12,22,'#221a08','wm'),
    // feather
    r(17,0,3,2,'#ff6040','f0'), r(18,1,3,4,'#ff4020','f1'), r(19,2,2,3,'#cc2000','f2'),
    // hat
    r(3,2,15,2,ht,'hb'), r(3,2,15,1,hl,'hbh'), r(3,3,15,1,'#6010a0','hbs'),
    r(2,4,16,2,'#5010a0','hb2'), r(2,4,16,1,hd,'hb2h'),
    r(1,5,18,2,'#4010a0','hbr'), r(1,5,18,1,'#7020b0','hbrh'),
    r(3,2,1,1,'#ffd700','bl1'), r(7,3,1,1,'#ffd700','bl2'),
    // face
    ...pFace(y,sk,sd,ey,br),
    // wide grin override
    r(8,y+6,8,1,'#cc3333','sm1'), r(9,y+6,6,1,'#ff9999','sm2'),
    r(8,y+7,3,1,'#f0d0a0','tooth1'), r(13,y+7,3,1,'#f0d0a0','tooth2'),
    // neck
    ...pNeck(y+9,sk),
    // jester tunic two-tone
    r(2,y+13,11,13,'#d0a020','tu1'), r(13,y+13,9,13,'#8020a0','tu2'),
    r(2,y+13,20,1,'#e0b030','tuh'),
  ];
}

// ── DRUID ─────────────────────────────────────────────────────────────────────
function druidPortrait(): JSX.Element[] {
  const bg='#061008';
  const sk='#c87848', sd='#8a4818', ey='#1a6010', br='#3a1808';
  const hair='#e8c830', hairD='#b89010', hairL='#f8e060';
  const lf='#207820';
  const y = 6;
  return [
    r(0,0,24,34,bg,'bg'),
    r(0,0,4,34,'#040c04','vl'), r(20,0,4,34,'#040c04','vr'),
    // golden hair behind
    r(2,0,20,6,hair,'hb0'), r(2,0,20,1,hairL,'hbh'),
    r(0,4,3,22,hairD,'hrl'), r(21,4,3,22,hairD,'hrr'),
    r(0,4,2,22,hair,'hrl2'), r(22,4,2,22,hair,'hrr2'),
    // flower crown
    r(4,3,3,2,lf,'fl1'), r(9,2,3,2,'#ee4466','fl2'), r(14,2,3,2,lf,'fl3'), r(18,3,3,2,lf,'fl4'),
    r(5,3,1,1,'#ffee00','fc1'), r(10,2,1,1,'#ffffff','fc2'), r(15,2,1,1,'#ffaacc','fc3'), r(19,3,1,1,'#ffee00','fc4'),
    // face (female)
    ...pFace(y,sk,sd,ey,br,true),
    ...pNeck(y+9,sk),
    // robe
    r(2,y+13,20,13,'#6a4020','rb'), r(2,y+13,20,1,'#8a5830','rbh'),
    r(5,y+14,2,1,lf,'lv1'), r(17,y+14,2,1,lf,'lv2'),
    r(0,y+15,2,11,'#207820','leafl'), r(22,y+16,2,10,'#207820','leafr'),
  ];
}

// ── SORCERER ──────────────────────────────────────────────────────────────────
function sorcererPortrait(): JSX.Element[] {
  const bg='#040610';
  const sk='#e8d0d8', sd='#b09098', ey='#00ccff', br='#180810';
  const hair='#180810', hairD='#0c0408';
  const y = 6;
  return [
    r(0,0,24,34,bg,'bg'),
    r(0,0,24,34,'#03050e','bgd'),
    // arcane glow centre
    r(8,8,8,16,'#04081c','gw'),
    // faint rune marks
    r(3,4,1,3,'#0a1840','rn1'), r(20,6,1,2,'#0a1840','rn2'), r(14,2,1,2,'#0a1840','rn3'),
    r(2,16,1,2,'#0a1840','rn4'), r(21,20,1,3,'#0a1840','rn5'),
    // dark hair
    r(2,0,20,5,hair,'hb0'), r(2,0,20,1,'#2a1020','hbh'),
    r(0,3,3,22,hairD,'hrl'), r(21,3,3,22,hairD,'hrr'),
    r(0,3,2,22,hair,'hrl2'), r(22,3,2,22,hair,'hrr2'),
    // cowl/shadow framing
    r(0,2,3,9,hairD,'cl'), r(21,2,3,9,hairD,'cr'),
    // face (female base)
    ...pFace(y,sk,sd,'#0a1840',br,true),
    // override eyes: dark shadow + glowing cyan
    r(4, y+2,4,3,'#1a1838','ewol'), r(16,y+2,4,3,'#1a1838','ewor'),
    r(5, y+3,2,2,ey,         'ecl'), r(17,y+3,2,2,ey,         'ecr'),
    r(5, y+2,1,1,'#80eeff',  'eg1'), r(17,y+2,1,1,'#80eeff',  'eg2'),
    // purple lips
    r(8, y+6,8,1,'#8020a0','lips'),
    ...pNeck(y+9,sk),
    // dark arcane robe
    r(2,y+13,20,13,'#0c0820','rb'), r(2,y+13,20,1,'#1a1038','rbh'),
    r(8,y+14,8,1,'#2080ff','ru1'), r(7,y+15,2,1,'#2080ff','ru2'), r(15,y+15,2,1,'#2080ff','ru3'),
  ];
}

// ── PALADIN ───────────────────────────────────────────────────────────────────
function paladinPortrait(): JSX.Element[] {
  const bg='#120e02';
  const sk='#f0c898', sd='#c89050', ey='#2040c0', br='#60380a';
  const gd='#d4a020', gdl='#f0c840', gdd='#9a7010';
  const wg='#f0f0a0';
  const y = 8;
  return [
    r(0,0,24,34,bg,'bg'),
    // divine radial glow
    r(6,4,12,22,'#1e1804','gw1'), r(8,6,8,18,'#261e04','gw2'), r(10,8,4,14,'#2e2406','gw3'),
    // helm wings
    r(0,3,3,7,wg,'wl'), r(21,3,3,7,wg,'wr'),
    r(0,3,3,1,'#fffff0','wlh'), r(21,3,3,1,'#fffff0','wrh'),
    // helm top
    r(6,2,12,1,gdl,'hcr'), r(5,3,14,1,gdl,'ht0'),
    r(4,4,16,2,gd,'ht1'), r(3,5,18,3,gd,'ht2'),
    r(3,5,1,13,gdd,'hls'), r(20,5,1,13,gdd,'hrs'), r(4,5,1,13,gdl,'hlh'),
    // cheek guards
    r(3,6,2,11,gd,'hcgl'), r(19,6,2,11,gd,'hcgr'),
    // face
    ...pFace(y,sk,sd,ey,br),
    ...pNeck(y+9,sk),
    r(5,y+13,14,1,gdd,'gg'),
    // golden armour
    r(2,y+14,20,12,gd,'ch'), r(2,y+14,20,1,gdl,'chh'),
    r(9,y+15,6,1,'#fffff8','crh'), r(11,y+15,2,3,'#fffff8','crv'),
    r(3,y+15,5,1,gdd,'apl'), r(16,y+15,5,1,gdd,'apr'),
  ];
}

// ── Dispatch ──────────────────────────────────────────────────────────────────
function drawPortrait(id: string): JSX.Element[] {
  switch (id) {
    case 'knight':   return knightPortrait();
    case 'wizard':   return wizardPortrait();
    case 'ranger':   return rangerPortrait();
    case 'rogue':    return roguePortrait();
    case 'bard':     return bardPortrait();
    case 'druid':    return druidPortrait();
    case 'sorcerer': return sorcererPortrait();
    case 'paladin':  return paladinPortrait();
    default:         return knightPortrait();
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  charId: string;
  /** pixel multiplier — default 1 = 96 × 136 px */
  size?: number;
  selected?: boolean;
  name?: string;
}

export default function ClassPortrait({ charId, size = 1, selected = false, name }: Props) {
  const color = CLASS_COLORS[charId] ?? '#6b5ca5';
  const els   = drawPortrait(charId);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        position: 'relative',
        lineHeight: 0,
        border: `2px solid ${selected ? color : '#2d1b69'}`,
        boxShadow: selected
          ? `0 0 14px ${color}88, 0 0 4px ${color}44`
          : '0 2px 8px rgba(0,0,0,0.8)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}>
        {/* Corner accents */}
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            top:    pos.startsWith('t') ? -1 : undefined,
            bottom: pos.startsWith('b') ? -1 : undefined,
            left:   pos.endsWith('l')   ? -1 : undefined,
            right:  pos.endsWith('r')   ? -1 : undefined,
            width: 6, height: 6,
            borderTop:    pos.startsWith('t') ? `2px solid ${color}` : undefined,
            borderBottom: pos.startsWith('b') ? `2px solid ${color}` : undefined,
            borderLeft:   pos.endsWith('l')   ? `2px solid ${color}` : undefined,
            borderRight:  pos.endsWith('r')   ? `2px solid ${color}` : undefined,
            zIndex: 2,
          }} />
        ))}
        <svg
          viewBox={`0 0 ${CW * P} ${CH * P}`}
          width={CW * P * size}
          height={CH * P * size}
          style={{ imageRendering: 'pixelated', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {els}
        </svg>
      </div>
      {name && (
        <div style={{
          fontFamily: '"Press Start 2P"',
          fontSize: '0.35rem',
          color: selected ? color : '#6b5ca5',
          letterSpacing: '0.05em',
        }}>
          {name.toUpperCase()}
        </div>
      )}
    </div>
  );
}
