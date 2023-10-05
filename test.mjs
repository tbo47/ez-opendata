/**
 * https://github.com/tbo47/ez-opendata
 * 
 * Run `node test.mjs` to test the functions.
 */
import { openstreetmapGetPOIs, wikimediaInfo, wikimediaQuery } from './index.js';

const okEmoji = '👍';

{
    const northEast = { lat: 14.71, lng: -17.41 };
    const southWest = { lat: 14.67, lng: -17.47 };
    const limit = 10;
    const images = await wikimediaQuery(northEast, southWest, limit);
    if (images.length === 0) throw new Error('No images found. The wikimedia API may be down.');
    if (images.length !== limit) throw new Error('Not the amount of images expected. The wikimedia API may be down.');
    console.log(`${okEmoji} wikimediaQuery passed`);

    const pageId = images[0].pageid
    const thumbWidth = 400 // 400px
    const imageDetails = await wikimediaInfo(pageId, thumbWidth)
    if(!imageDetails.name) throw new Error('The name is expected here.');
    console.log(`${okEmoji} wikimediaInfo passed`);
}


{
    const POIs = await openstreetmapGetPOIs(
        "14.67,-17.46,14.71,-17.41",
        [
            ["amenity", "cafe"],
            ["amenity", "restaurant"],
        ]
    );
    if (POIs.length === 0) throw new Error('No POIs found. The openstreetmap API may be down.');
    console.log(`${okEmoji} openstreetmapGetPOIs passed`);
}