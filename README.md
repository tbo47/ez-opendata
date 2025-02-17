<p align="center">
  <a href="https://www.npmjs.com/ez-opendata"><img src="https://img.shields.io/npm/v/ez-opendata.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="ez-opendata on npm" /></a>&nbsp;
  <a href="https://www.npmjs.com/ez-opendata"><img src="https://img.shields.io/npm/dw/ez-opendata.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="ez-opendata on npm" /></a>&nbsp;
</p>

# Getting Started with ez-opendata

`ez-opendata` is a set of ez (easy) to use javascript functions to call open-data sources such as openstreetmap, wikipedia or wikimedia.
It is tiny and has no dependencies.

It can work for javascript and/or typescript projects on the browser or with nodejs.

## Install

`npm install ez-opendata`

## Examples

### Openstreetmap

See restaurants in an area: [demo](https://tbo47.github.io/poi/) or [code demo](https://jsfiddle.net/tbo47/qsuy92ht/)

```javascript
const cafeAndRestaurants = await openstreetmapGetPOIs('14.67,-17.46,14.71,-17.41', [
    ['amenity', 'cafe'],
    ['amenity', 'restaurant'],
])
```

Use [openstreetmap nominatim](https://nominatim.org/release-docs/develop/api/Search/) to fetch coordonates of a place: [demo](https://jsfiddle.net/tbo47/xv0g3s59/)

```javascript
const res = await openstreetmapGeocoding('20 rue du Faubourg Saint-Antoine, 75012 Paris')
const { lat, lng } = res.at(0)
```

### Wikimedia Commons

Query pictures in an area: [demo](https://tbo47.github.io/wikimedia/) or [code demo](https://jsfiddle.net/tbo47/hyrn2vc0/)

```javascript
const northEast = { lat: 14.71, lng: -17.41 }
const southWest = { lat: 14.67, lng: -17.47 }
const images = await wikimediaQuery(northEast, southWest)
```

Get a custom thumb image: [demo](https://jsfiddle.net/tbo47/6b7j2ohy/)

```javascript
const pageId = 21900832
const height = 100
const with = 100
const { thumburl } = await wikimediaGetThumb(pageid, height, width)
```

### Wikipedia

Get wikipedia articles in an area: [demo](https://tbo47.github.io/wikipedia/) or [code demo](https://jsfiddle.net/tbo47/csfjyd4x/13/)

```javascript
const articles = wikipediaQuery(14.7, -17.4) // latitude longitude
```

### Wikidata

Query wikidata REST endpoint: [demo](https://tbo47.github.io/wikidata/) or
[code demo](https://jsfiddle.net/tbo47/1z2kbuaf/)
