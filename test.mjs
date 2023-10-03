import { openstreetmapGetPOIs, wikimediaQuery } from './index.js';

const okEmoji = '👍';

{
    const testTitle = 'wikimediaQuery';

    const northEast = { lat: 14.71, lng: -17.41 };
    const southWest = { lat: 14.67, lng: -17.47 };
    const limit = 10;
    const images = await wikimediaQuery(northEast, southWest, limit);
    if (images.length === 0) throw new Error('No images found. The wikimedia API may be down.');
    if (images.length !== limit) throw new Error('Not the amount of images expected. The wikimedia API may be down.');
    console.log(`${okEmoji} ${testTitle} passed`);
}


{
    const testTitle = 'openstreetmapGetPOIs';

    const POIs = await openstreetmapGetPOIs(
        "14.67,-17.46,14.71,-17.41",
        [
            ["amenity", "cafe"],
            ["amenity", "restaurant"],
        ]
    );
    if(POIs.length === 0) throw new Error('No POIs found. The openstreetmap API may be down.');
    console.log(`${okEmoji} ${testTitle} passed`);
}