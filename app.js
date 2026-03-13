// ── 색상 상수 ────────────────────────────────────────────────
const COLOR_PARK        = '#79C07A';
const COLOR_PARK_ACTIVE = '#287F3B';
const COLOR_NPARK       = '#E5E5E3';

// ── Tossface 아이콘 헬퍼 ─────────────────────────────────────
const TOSSFACE_CDN = 'https://cdn.jsdelivr.net/npm/tossface@1.0.2/dist/svg';

function tossUrl(emoji) {
  const cp = [...emoji]
    .map(c => c.codePointAt(0))
    .filter(n => n !== 0xFE0F && n !== 0x200D)
    .map(n => n.toString(16).toUpperCase())
    .join('-');
  return `${TOSSFACE_CDN}/${cp}.svg`;
}

function tossImg(emoji, size = 20) {
  return `<img src="${tossUrl(emoji)}" width="${size}" height="${size}" alt="${emoji}" onerror="this.outerHTML=this.alt" style="display:inline-block;vertical-align:middle;flex-shrink:0">`;
}

// ── 공원이 있는 구 목록 ──────────────────────────────────────
const PARK_DISTRICTS = new Set([
  '성동구', '중구', '송파구', '강북구', '도봉구',
  '마포구', '동작구', '광진구', '종로구', '용산구', '영등포구',
]);

// ── 공원 데이터 ──────────────────────────────────────────────
const PARKS = [
  {
    id: 1,
    name: '서울숲',
    nameEn: 'Seoul Forest',
    district: '성동구',
    address: '서울 성동구 뚝섬로 273',
    area: '약 115만 m²',
    icon: '🌳',
    features: ['산책로', '자전거길', '습지생태원', '야외공연장', '반려동물'],
    description: '서울 도심 속 대형 문화공원으로, 한강과 인접해 있습니다. 곤충식물원, 습지생태원, 가족마당 등 다양한 테마 공간을 갖추고 있으며 사계절 내내 많은 시민들이 찾는 도심 속 자연공간입니다.',
    lat: 37.5446, lng: 127.0374,
  },
  {
    id: 2,
    name: '남산공원',
    nameEn: 'Namsan Park',
    district: '중구',
    address: '서울 중구 삼일대로 231',
    area: '약 297만 m²',
    icon: '⛰️',
    features: ['N서울타워', '케이블카', '팔각정', '한양도성길', '봉화대'],
    description: '서울의 상징적 랜드마크인 N서울타워가 있는 공원입니다. 해발 262m의 남산에 위치하며 사계절 아름다운 경치를 자랑합니다. 한양도성 순성길을 따라 역사적인 산책을 즐길 수 있습니다.',
    lat: 37.5512, lng: 126.9882,
  },
  {
    id: 3,
    name: '올림픽공원',
    nameEn: 'Olympic Park',
    district: '송파구',
    address: '서울 송파구 올림픽로 424',
    area: '약 145만 m²',
    icon: '🏟️',
    features: ['조각공원', '장미광장', '자전거길', '스케이트장', '몽촌토성'],
    description: '1988년 서울올림픽을 기념해 조성된 대규모 공원입니다. 200여 점의 조각 작품이 전시된 세계 5대 야외 조각공원 중 하나이며, 몽촌토성 등 역사 유적과 함께 문화·스포츠 시설이 잘 갖춰져 있습니다.',
    lat: 37.5218, lng: 127.1220,
  },
  {
    id: 4,
    name: '북한산국립공원',
    nameEn: 'Bukhansan National Park',
    district: '강북구',
    address: '서울 강북구 삼양로 173길 470',
    area: '약 7,976만 m²',
    icon: '🏔️',
    features: ['등산', '암벽등반', '북한산성', '계곡', '야생동물'],
    description: '도시 안에 있는 세계 유일의 국립공원입니다. 백운대(836.5m)를 비롯한 여러 봉우리와 북한산성 등 역사 유적이 있으며, 연간 탐방객이 세계에서 가장 많은 국립공원으로 기록된 곳입니다.',
    lat: 37.6597, lng: 126.9773,
  },
  {
    id: 5,
    name: '월드컵공원',
    nameEn: 'World Cup Park',
    district: '마포구',
    address: '서울 마포구 하늘공원로 95',
    area: '약 276만 m²',
    icon: '🌅',
    features: ['하늘공원', '노을공원', '억새축제', '한강조망', '캠핑장'],
    description: '난지도 쓰레기 매립지를 생태공원으로 복원한 곳입니다. 하늘공원의 억새밭은 가을마다 장관을 이루고, 노을공원에서는 한강 너머 석양이 아름답습니다. 난지한강공원과 연결되어 있습니다.',
    lat: 37.5682, lng: 126.8979,
  },
  {
    id: 6,
    name: '보라매공원',
    nameEn: 'Boramae Park',
    district: '동작구',
    address: '서울 동작구 여의대방로20길 33',
    area: '약 43만 m²',
    icon: '🌿',
    features: ['항공우주관', '수영장', '야외음악당', '인라인스케이트', '테니스장'],
    description: '옛 공군사관학교 부지를 공원화한 곳으로 항공 관련 전시물이 있습니다. 다양한 체육·문화 시설과 드넓은 잔디광장을 갖추고 있어 가족 나들이와 운동을 즐기기에 좋은 생활 공원입니다.',
    lat: 37.4951, lng: 126.9174,
  },
  {
    id: 7,
    name: '어린이대공원',
    nameEn: "Children's Grand Park",
    district: '광진구',
    address: '서울 광진구 능동로 216',
    area: '약 56만 m²',
    icon: '🎡',
    features: ['동물원', '식물원', '놀이동산', '음악분수', '숲속의 무대'],
    description: '1973년 개원한 서울 최초의 대형 어린이 테마공원입니다. 동물원, 식물원, 놀이시설, 공연장을 모두 갖추고 있으며 주말이면 어린이를 동반한 가족들로 늘 붐비는 인기 명소입니다.',
    lat: 37.5491, lng: 127.0778,
  },
  {
    id: 8,
    name: '낙산공원',
    nameEn: 'Naksan Park',
    district: '종로구',
    address: '서울 종로구 낙산길 41',
    area: '약 26만 m²',
    icon: '🏯',
    features: ['한양도성', '이화마을', '서울야경', '전망대', '성곽길'],
    description: '서울의 내사산 중 하나인 낙산(125m)에 위치한 공원입니다. 조선시대 한양도성이 지나가며, 이화마을 벽화골목과 연결됩니다. 정상에서는 서울 도심의 아름다운 야경을 조망할 수 있습니다.',
    lat: 37.5793, lng: 126.9950,
  },
  {
    id: 9,
    name: '용산가족공원',
    nameEn: 'Yongsan Family Park',
    district: '용산구',
    address: '서울 용산구 서빙고로 137',
    area: '약 30만 m²',
    icon: '🌸',
    features: ['잔디광장', '산책로', '국립중앙박물관 인접', '연못'],
    description: '미8군 골프장 부지를 시민에게 개방한 생태공원입니다. 국립중앙박물관 옆에 위치하며 도심에서 드물게 넓은 잔디밭을 즐길 수 있는 곳입니다. 봄에는 벚꽃이 아름다운 산책로로도 유명합니다.',
    lat: 37.5261, lng: 126.9776,
  },
  {
    id: 10,
    name: '북서울꿈의숲',
    nameEn: 'Dream Forest',
    district: '강북구',
    address: '서울 강북구 월계로 173',
    area: '약 66만 m²',
    icon: '🌲',
    features: ['전망대', '공연장', '미술관', '창녕위궁재사', '연못'],
    description: '서울 동북권 최대 생태문화공간입니다. 전망대에서는 북한산과 도봉산, 서울 시내 전경이 한눈에 보입니다. 창녕위궁재사 등 문화재와 함께 현대적인 공연·전시 시설도 갖추고 있습니다.',
    lat: 37.6307, lng: 127.0303,
  },
  {
    id: 11,
    name: '선유도공원',
    nameEn: 'Seonyudo Park',
    district: '영등포구',
    address: '서울 영등포구 선유로 343',
    area: '약 11만 m²',
    icon: '💧',
    features: ['수생식물원', '온실', '한강조망', '교각전망대', '생태연못'],
    description: '한강의 섬인 선유도에 조성된 생태공원입니다. 옛 정수장 시설을 재활용해 만든 독특한 수생식물원과 온실이 있으며, 한강 위 보행교를 건너 입장합니다. 사계절 색다른 풍경을 선사합니다.',
    lat: 37.5451, lng: 126.8978,
  },
  {
    id: 12,
    name: '하늘공원',
    nameEn: 'Sky Park',
    district: '마포구',
    address: '서울 마포구 하늘공원로 95',
    area: '약 58만 m²',
    icon: '🌾',
    features: ['억새밭', '풍력발전기', '한강조망', '메타세쿼이아길', '일몰명소'],
    description: '월드컵공원 내 해발 98m에 위치한 공원입니다. 가을 억새 군락지로 유명하며 매년 10월 억새축제가 열립니다. 풍력발전기가 돌아가는 언덕 위에서 한강과 서울 전경을 한눈에 감상할 수 있습니다.',
    lat: 37.5713, lng: 126.8911,
  },
];

// ── 구 → 공원 매핑 ───────────────────────────────────────────
const districtParkMap = {};
PARKS.forEach(park => {
  park.district.split('·').forEach(d => {
    d = d.trim();
    if (!districtParkMap[d]) districtParkMap[d] = [];
    districtParkMap[d].push(park);
  });
});

// ── DOM 참조 ────────────────────────────────────────────────
const parkDetail   = document.getElementById('park-detail');
const parkHint     = document.getElementById('park-hint');
const closeDetail  = document.getElementById('close-detail');
const detailIcon   = document.getElementById('detail-icon');
const detailName   = document.getElementById('detail-name');
const detailNameEn = document.getElementById('detail-name-en');
const detailAddr   = document.getElementById('detail-address');
const detailArea   = document.getElementById('detail-area');
const detailFeats  = document.getElementById('detail-features');
const detailDesc   = document.getElementById('detail-description');
const parkListEl   = document.getElementById('park-list');
const parkCountEl  = document.getElementById('park-count');

// ── 상태 ─────────────────────────────────────────────────────
let activeMarkerId   = null;
const markerMap      = {};  // id → L.marker
const districtLayerMap = {}; // name → L.layer

// ── Leaflet 지도 (타일 없는 심플 맵) ─────────────────────────
const map = L.map('map', {
  center: [37.5665, 126.9780],
  zoom: 11,
  zoomControl: true,
  attributionControl: true,
});

// 공원 폴리곤 전용 pane (구 레이어 위, 라벨 마커 아래)
map.createPane('parkPolygons');
map.getPane('parkPolygons').style.zIndex = 450;

// ── 서울 구 GeoJSON 로드 ──────────────────────────────────────
async function loadSeoulDistricts() {
  const url = 'https://raw.githubusercontent.com/southkorea/seoul-maps/master/kostat/2013/json/seoul_municipalities_geo_simple.json';
  try {
    const res  = await fetch(url);
    const data = await res.json();

    L.geoJSON(data, {
      style: () => ({
        fillColor:   '#F8F8F9',
        fillOpacity: 1,
        color:       '#D8D8D4',
        weight:      1,
      }),
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name || '';
        districtLayerMap[name] = layer;
        if (PARK_DISTRICTS.has(name)) {
          layer.on('click', () => {
            const parks = districtParkMap[name];
            if (parks?.length > 0) selectPark(parks[0], false);
          });
        }
      },
    }).addTo(map);
  } catch (e) {
    console.error('GeoJSON 로드 실패:', e);
  }
}

// ── 상세 정보 표시 ───────────────────────────────────────────
function showDetail(park) {
  detailIcon.innerHTML     = tossImg(park.icon, 38);
  detailName.textContent   = park.name;
  detailNameEn.textContent = park.nameEn;
  detailAddr.textContent   = park.address;
  detailArea.textContent   = park.area;

  detailFeats.innerHTML = park.features
    .map(f => `<span class="feature-tag">${f}</span>`)
    .join('');

  detailDesc.textContent   = park.description;
  parkHint.style.display   = 'none';
  parkDetail.classList.remove('hidden');
}

// ── 활성 구/마커 갱신 ────────────────────────────────────────
function setActive(park) {
  // 이전 라벨 비활성화
  if (activeMarkerId !== null) {
    const prevEl = document.querySelector(`.park-label-pin[data-id="${activeMarkerId}"]`);
    if (prevEl) prevEl.classList.remove('active');
  }

  // 새 라벨 활성화
  activeMarkerId = park.id;
  const newEl = document.querySelector(`.park-label-pin[data-id="${park.id}"]`);
  if (newEl) newEl.classList.add('active');

  // 목록 활성화
  document.querySelectorAll('.park-list-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === String(park.id));
  });
}

// ── 공원 선택 ────────────────────────────────────────────────
function selectPark(park, flyTo = true) {
  setActive(park);
  showDetail(park);
  if (flyTo) {
    map.flyTo([park.lat, park.lng], 14, { duration: 0.8 });
  }
}

// ── 마커 & 목록 생성 ─────────────────────────────────────────
PARKS.forEach(park => {
  // 툴팁 형태 라벨 마커 (iconSize [0,0] + translateX(-50%) 로 자동 중앙 정렬)
  const icon = L.divIcon({
    className: '',
    html: `<div class="park-label-pin" data-id="${park.id}">${tossImg(park.icon, 13)}${park.name}</div>`,
    iconSize:   [0, 0],
    iconAnchor: [0, 29],   // 삼각형 끝이 좌표에 닿도록
  });

  const marker = L.marker([park.lat, park.lng], { icon, zIndexOffset: 100 }).addTo(map);
  marker.on('click', () => selectPark(park, false));
  markerMap[park.id] = marker;

  // 목록 아이템
  const li = document.createElement('li');
  li.className  = 'park-list-item';
  li.dataset.id = park.id;
  li.innerHTML  = `
    <span class="list-icon">${tossImg(park.icon, 22)}</span>
    <div class="list-info">
      <div class="list-name">${park.name}</div>
      <div class="list-district">${park.district}</div>
    </div>
    <span class="list-arrow">›</span>
  `;
  li.addEventListener('click', () => selectPark(park));
  parkListEl.appendChild(li);
});

parkCountEl.textContent = PARKS.length;

// ── 닫기 버튼 ────────────────────────────────────────────────
closeDetail.addEventListener('click', () => {
  if (activeMarkerId !== null) {
    const dotEl = document.querySelector(`.park-label-pin[data-id="${activeMarkerId}"]`);
    if (dotEl) dotEl.classList.remove('active');
  }
  activeMarkerId = null;
  parkDetail.classList.add('hidden');
  parkHint.style.display = '';
  document.querySelectorAll('.park-list-item').forEach(el => el.classList.remove('active'));
});

// ── Overpass API: 실제 공원 경계 폴리곤 ──────────────────────
function findParkByOsmName(osmName) {
  if (!osmName) return null;
  return PARKS.find(p =>
    osmName === p.name ||
    osmName.includes(p.name) ||
    p.name.includes(osmName)
  ) || null;
}

async function loadParkPolygons() {
  // 서울 bounding box 안에서 공원 경계 일괄 조회
  const names = PARKS.map(p => p.name).join('|');
  const bbox  = '37.41,126.76,37.71,127.18';
  const query = `[out:json][timeout:30];
(
  way["leisure"="park"]["name"~"${names}"](${bbox});
  relation["leisure"="park"]["name"~"${names}"](${bbox});
  way["leisure"="nature_reserve"]["name"~"북한산"](${bbox});
  relation["boundary"="national_park"]["name"~"북한산"](${bbox});
);
out geom;`;

  try {
    const res  = await fetch(
      'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query)
    );
    const data = await res.json();

    data.elements.forEach(el => {
      const park = findParkByOsmName(el.tags?.name);

      // polygon 좌표 목록 수집
      const rings = [];
      if (el.type === 'way' && el.geometry?.length > 2) {
        rings.push(el.geometry.map(n => [n.lat, n.lon]));
      } else if (el.type === 'relation' && el.members) {
        el.members
          .filter(m => m.role === 'outer' && m.geometry?.length > 2)
          .forEach(m => rings.push(m.geometry.map(n => [n.lat, n.lon])));
      }

      rings.forEach(coords => {
        const poly = L.polygon(coords, {
          pane:        'parkPolygons',
          fillColor:   COLOR_PARK_ACTIVE,
          fillOpacity: 0.55,
          color:       'transparent',
          weight:      0,
          interactive: !!park,
        }).addTo(map);

        if (park) {
          poly.on('click', () => selectPark(park, false));
          poly.on('mouseover', () => poly.setStyle({ fillOpacity: 0.78 }));
          poly.on('mouseout',  () => poly.setStyle({ fillOpacity: 0.55 }));
        }
      });
    });

    // 라벨 마커가 폴리곤 위에 오도록
    Object.values(markerMap).forEach(m => m.bringToFront());

  } catch (e) {
    console.warn('공원 폴리곤 로드 실패 (Overpass):', e);
  }
}

// ── GeoJSON 로드 시작 ────────────────────────────────────────
loadSeoulDistricts();
loadParkPolygons();
