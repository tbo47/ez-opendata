/**
 * https://github.com/tbo47/ez-opendata
 *
 * Run `node test.mjs` to test the functions.
 */
import {
    openstreetmapExtractDiets,
    openstreetmapGetPOIs,
    openstreetmapGetPOIsBbox,
    wikimediaGetThumb,
    wikimediaGetThumbs,
    wikimediaPicOfTheDay,
    wikimediaQuery,
    wikipediaQuery,
} from './index.js'

const okEmoji = '✅'

{
    const POIs = await openstreetmapGetPOIs('14.67,-17.46,14.71,-17.41', [
        ['amenity', 'cafe'],
        ['amenity', 'restaurant'],
    ])
    if (POIs.length === 0) throw new Error('No POIs found. The openstreetmap API may be down.')
    console.log(`${okEmoji} openstreetmapGetPOIs`)
}

{
    const POIs = await openstreetmapGetPOIsBbox(
        { _northEast: { lat: 14.71, lng: -17.41 }, _southWest: { lat: 14.67, lng: -17.47 } },
        [
            ['amenity', 'cafe'],
            ['amenity', 'restaurant'],
        ]
    )
    if (POIs.length === 0) throw new Error('No POIs found. The openstreetmap API may be down.')
    console.log(`${okEmoji} openstreetmapGetPOIsBbox`)

    const diets = openstreetmapExtractDiets(POIs)
    if (diets.length === 0) throw new Error('No diets.')
    console.log(`${okEmoji} openstreetmapExtractDiets`)
}

{
    const articles = await wikipediaQuery()
    if (articles.length === 0) throw new Error('No items found.')
    console.log(`${okEmoji} wikipediaQuery`)
}

{
    // TODO this is broken
    /*
    const articles = await wikidataQuery({ lat: 14.71, lng: -17.41 }, { lat: 14.67, lng: -17.47 })
    if (articles.length === 0) throw new Error('No items found.')
    console.log(`${okEmoji} wikidataQuery`)
    */
}

{
    const images = await wikimediaPicOfTheDay('fr')
    if (images.length === 0) throw new Error('No images found. The wikimedia API may be down.')
    console.log(`${okEmoji} wikimediaPicOfTheDay`)
}

{
    const pics = await wikimediaGetThumbs([136289240, 136289206], 'width', 400)
    if (pics.length === 0) throw new Error('No items found.')
    console.log(`${okEmoji} wikimediaGetThumbs`)
}

{
    const northEast = { lat: 14.71, lng: -17.41 }
    const southWest = { lat: 14.67, lng: -17.47 }
    const limit = 10
    const images = await wikimediaQuery(northEast, southWest, limit)
    if (images.length === 0) throw new Error('No images found. The wikimedia API may be down.')
    if (images.length !== limit) throw new Error('Not the amount of images expected. The wikimedia API may be down.')
    console.log(`${okEmoji} wikimediaQuery`)

    const pageId = images[0].pageid
    const thumbWidth = 400 // 400px
    const imageDetails = await wikimediaGetThumb(pageId, thumbWidth)
    if (!imageDetails.title) throw new Error('A title is expected here.')
    console.log(`${okEmoji} wikimediaInfo`)
}

