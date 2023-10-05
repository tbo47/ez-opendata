/**
 * Description: A library to query open data sources (wikipedia, openstreetmap, wikimedia...).
 * https://github.com/tbo47/ez-opendata
 */

/**
 * Query an openstreetmap server to fetch POIs
 * 
 * @param {*} bbox the rectangle where to perform the query
 * @param {Array.<Array>} categories of pois. Like restaurant, cafe...
 * @returns Promise<Poi[]>
 */
export const openstreetmapGetPOIs = async (bbox: string, categories: any[]) => {
    const url = 'https://overpass-api.de/api/interpreter';

    let quest = '';
    categories.forEach(([key, value]) => {
        const p = `
          node["${key}"="${value}"](${bbox});
          way["${key}"="${value}"](${bbox});
          relation["${key}"="${value}"](${bbox});`;
        quest += p;
    });

    const body = `
        [out:json][timeout:25];
        (
            ${quest}
        );
        out body;
        >;
        out skel qt;`;

    const response = await fetch(url, { method: 'POST', body })
    const data = await response.json()
    return data.elements.filter((p: any) => p.tags).map((p: any) => {
        p = { ...p, ...p.tags } // merge the tags object into the main one
        delete p.tags
        const type = p.members ? 'relation' : p.type
        if (!p.website && p[`contact:website`]) {
            p.website = p[`contact:website`]
        }
        p.osm_url = `https://www.openstreetmap.org/${type}/${p.id}`
        p.osm_url_edit = `https://www.openstreetmap.org/edit?${type}=${p.id}`
        return p
    })
}

/**
 * 
 * @returns Promise<POI[]> restaurants and cafes
 */
export const openstreetmapGetRestaurants = () => {
    return openstreetmapGetPOIs('37.8,-122.3,37.8,-122.2', [{ key: 'amenity', value: 'cafe' }, { key: 'amenity', value: 'restaurant' }])
}

export const getFoodShops = async ({ _northEast, _southWest }: { _northEast: { lat: number; lng: number; }; _southWest: { lat: number; lng: number; }; }) => {
    const bbox = []
    bbox.push(_southWest.lat)
    bbox.push(_southWest.lng)
    bbox.push(_northEast.lat)
    bbox.push(_northEast.lng)
    let categories = [['amenity', 'cafe'], ['amenity', 'restaurant'], ['shop', 'deli'], ['amenity', 'ice_cream'], ['amenity', 'fast_food']]
    // categories = [['leisure', 'park'], ['leisure', 'swimming_pool']]
    const pois = await openstreetmapGetPOIs(bbox.join(','), categories)
    return pois
}

// extract diets from POIs (only makes sense for restaurants)
export const extractDiets = (pois: any[]) => {
    const dietsMap = new Map() // stores ['thai': 3] if thai restaurants have been seen 3 times
    pois.forEach(poi => {
        const diets = new Set()
        // extract poi.cuisine
        poi.cuisine?.split(`;`)?.forEach((c: string) => diets.add(c?.trim()?.toLowerCase()))
        // extract poi.diet:thai == yes for example
        Object.keys(poi)
            .filter(key => key.startsWith(`diet`) && poi[key] === `yes`)
            .forEach(key => diets.add(key.split(`:`).at(1)))

        diets.forEach(diet => {
            if (dietsMap.has(diet)) dietsMap.set(diet, dietsMap.get(diet) + 1)
            else dietsMap.set(diet, 1)
        })
    })
    const dietsSorted = Array.from(dietsMap.entries()).sort((a, b) => b[1] - a[1])
    return dietsSorted
}

export interface WikipediaQueryType { title: string, lat: number, lon: number, url: string, dist: string, pageid: string }

/**
 * Return the wikipedia articles around a given location.
 */
export const wikipediaQuery = async (lat = 37, lon = -122, language = 'en', radius = 10000, limit = 100) => {
    const b = `https://${language}.wikipedia.org/w/api.php`
    const u = `${b}?action=query&list=geosearch&gscoord=${lat}%7C${lon}&gsradius=${radius}&gslimit=${limit}&origin=*&format=json`
    const r = await fetch(u)
    const d = await r.json()
    return d.query.geosearch.map((a: WikipediaQueryType) => {
        a.url = `https://${language}.wikipedia.org/wiki/${a.title}`
        return a
    })
}

export const wikidataQuery = async (northEast: { lat: number; lng: number; }, southWest: { lat: number; lng: number; }, limit = 3000) => {
    const b = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query='
    const q = `SELECT ?q ?qLabel ?location ?image ?reason ?desc ?commonscat WHERE {
                  SERVICE wikibase:box {
                    ?q wdt:P625 ?location.
                    bd:serviceParam wikibase:cornerSouthWest "Point(${southWest.lng} ${southWest.lat})"^^geo:wktLiteral;
                      wikibase:cornerNorthEast "Point(${northEast.lng} ${northEast.lat})"^^geo:wktLiteral.
                  }
                  OPTIONAL { ?q wdt:P18 ?image. } 
                  OPTIONAL { ?q wdt:P373 ?commonscat. }
                  SERVICE wikibase:label {
                    bd:serviceParam wikibase:language "[AUTO_LANGUAGE]".
                    ?q schema:description ?desc;
                      rdfs:label ?qLabel.
                  }
            }
            LIMIT ${limit}`
    // console.log('https://query.wikidata.org/#' + encodeURI(q))
    const r = await fetch(b + encodeURI(q))
    const d = await r.json()
    return d.results.bindings || []
}


export const wikimediaQuery = async (northEast: { lat: number; lng: number; }, southWest: { lat: number; lng: number; }, limit = 100) => {
    const r = 'https://commons.wikimedia.org/w/api.php'
    const q = `${r}?action=query&list=geosearch&gsbbox=${northEast.lat}%7C${southWest.lng}%7C${southWest.lat}%7C${northEast.lng}&gsnamespace=6&gslimit=${limit}&format=json&origin=*`
    const res = await fetch(q)
    const d = await res.json()
    if (d.error) {
        return Promise.reject(d.error)
    } else {
        return d.query.geosearch || []
    }
}


/*
 * https://www.mediawiki.org/wiki/API:Imageinfo
 */
export const wikimediaInfoMultiplePages = async (pageids: number[], thumbWidth = 600) => {
    const pageidsStr = pageids.join('|')
    const r = 'https://commons.wikimedia.org/w/api.php'
    const q = `${r}?action=query&pageids=${pageidsStr}&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=${thumbWidth}&format=json&origin=*`
    const res = await fetch(q)
    const d = await res.json()
    return d.query.pages
}

export const wikimediaGetAuthor = async (title: string, pageid: number) => {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&format=json&origin=*`)
    const d = await res.json()
    return d.query.pages[pageid].imageinfo[0].user
}

export const wikimediaGetAuthorLink = (name: string, limit = 40) => {
    return `https://commons.wikimedia.org/wiki/Special:ListFiles?limit=${limit}&user=${name}`
}

/*
 *
 */
export const wikimediaInfo = async (pageid: number, thumbWidth = 600) => {
    const infos = await wikimediaInfoMultiplePages([pageid], thumbWidth)
    const info = infos[pageid].imageinfo[0]
    const name = info.extmetadata.ObjectName.value
    const date = info.extmetadata.DateTime.value
    const categories = info.extmetadata.Categories.value
    const description = info.extmetadata.ImageDescription.value
    const artistHtml = info.extmetadata.Artist.value
    const title = infos[pageid].title
    return { name, date, categories, description, artistHtml, title, ...info }
}

/*
 * Return the browser language or 'en' if not found.
 * This will not work in nodejs, only for the browser.
 */
const getLang = () => {
    return window?.navigator?.language?.split('-')?.at(0) || 'en'
}


/**
 * Get the picture of the day from wikimedia commons.
 * 
 * Leave lang empty to use the browser language. Set it to 'en' for example to force english.
 * You will have to set the lang if you use nodejs.
 */
export const wikimediaPicOfTheDay = async (lang = '') => {
    if (!lang) { lang = getLang() }
    const url = `https://commons.wikimedia.org/w/api.php?action=featuredfeed&feed=potd&feedformat=atom&language=${lang}&origin=*`
    const match1 = 'href="https://commons.wikimedia.org/wiki/Special'
    const match2 = 'typeof="mw:File"'
    const raw = await fetch(url)
    const text = await raw.text();
    // const xml = new window.DOMParser().parseFromString(text, 'text/xml'); // doesn't work for nodejs
    const urls = text.split(/\n/).filter(l => l.includes(match1)).map(l => l.split(/"/)[5])
    return urls
    // TODO to be continued
    const lastUrl = urls.slice(-1)[0]
    console.log(lastUrl)
    const raw2 = await fetch(lastUrl, { mode: 'no-cors', redirect: 'follow', headers: { 'Content-Type': 'text/html' }, referrer: 'no-referrer' })
    const text2 = await raw2.text()
    const picUrl = text2.split(/\n/).filter(l => l.includes(match2)).map(l => l.split(/"/)[7])
    const picName = picUrl[0].slice(11)
    return picName;
};
