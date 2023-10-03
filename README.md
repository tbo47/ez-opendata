# Getting Started with ez-opendata

ez-opendata is a set of simple javascript functions to call open-data sources such as openstreetmap, wikipedia or wikimedia.

## Install

`npm install --save ez-opendata`

## Examples

### Openstreetmap

Demo found here: https://tbo47.github.io/poi/

```javascript
const cafeAndRestaurants = await openstreetmapGetPOIs(
  "14.67,-17.46,14.71,-17.41",
  [
    ["amenity", "cafe"],
    ["amenity", "restaurant"],
  ]
);
```

### Wikimedia

Demo here: https://tbo47.github.io/wikimedia/

```javascript
const northEast = { lat: 14.71, lng: -17.41 };
const southWest = { lat: 14.67, lng: -17.47 };
const images = await wikimediaQuery(northEast, southWest);
```

```javascript
const pageId = 21900832
const thumbWidth = 400 // 400px
const imageDetails = wikimediaInfo(pageId, thumbWidth)
```