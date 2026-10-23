"""Süper Lig skor istatistikleri: şehirdeki (kurgusal) semt maçlarının gol oranlarını ayarlamak için.

ESPN'in anahtarsız, resmî olmayan uç noktasından son beş tamamlanmış sezonun (2021/22 - 2025/26) bitmiş maçlarını
aylık sorgularla çeker, ev sahibi ve deplasman gol ortalamalarını, sonuç oranlarını ve en sık skorları yazar.
Ham veri depoya girmez: önbellek tools/.cache/ altında (.gitignore'da). js/stadium.js içindeki SUPERLIG sabitleri
bu betiğin çıktısıdır. Yalnızca standart kütüphane: python tools/superlig_stats.py
"""
import json, os, time, urllib.request
from collections import Counter

URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/tur.1/scoreboard?dates={ym}'
SEASONS = [2021, 2022, 2023, 2024, 2025]                 # sezonun başladığı yıl: ağustos - mayıs
CACHE = os.path.join(os.path.dirname(__file__), '.cache')


def month(ym):
    path = os.path.join(CACHE, f'tur1-{ym}.json')
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    req = urllib.request.Request(URL.format(ym=ym), headers={'User-Agent': 'micro-city-stats'})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    os.makedirs(CACHE, exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f)
    time.sleep(0.4)                                        # nazik ol
    return data


def matches():
    seen = {}
    for y in SEASONS:
        for m in list(range(8, 13)) + list(range(1, 6)) + [6]:
            ym = f'{y if m >= 8 else y + 1}{m:02d}'
            for e in month(ym).get('events', []):
                c = e['competitions'][0]
                if not c['status']['type'].get('completed'):
                    continue
                side = {x['homeAway']: x for x in c['competitors']}
                seen[e['id']] = (y, side['home']['team']['displayName'], side['away']['team']['displayName'], int(side['home']['score']), int(side['away']['score']))
    return list(seen.values())


def main():
    ms = matches()
    n = len(ms)
    hg = sum(m[3] for m in ms) / n
    ag = sum(m[4] for m in ms) / n
    hw = sum(m[3] > m[4] for m in ms) / n
    dr = sum(m[3] == m[4] for m in ms) / n
    print(f'maç: {n} ({", ".join(f"{y}/{(y + 1) % 100:02d}: {sum(m[0] == y for m in ms)}" for y in SEASONS)})')
    print(f'ev sahibi gol ort.: {hg:.3f}  deplasman: {ag:.3f}  toplam: {hg + ag:.3f}')
    print(f'ev sahibi kazanır: {hw:.1%}  beraberlik: {dr:.1%}  deplasman kazanır: {1 - hw - dr:.1%}')
    print('en sık skorlar:', ', '.join(f'{k} %{v / n * 100:.1f}' for k, v in Counter(f'{m[3]}-{m[4]}' for m in ms).most_common(8)))
    print(f'js/stadium.js: const SUPERLIG = {{ home: {hg:.3f}, away: {ag:.3f}, n: {n}, seasons: \'2021/22-2025/26\' }};')


if __name__ == '__main__':
    main()
