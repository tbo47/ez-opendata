<p align="center">
  <a href="https://www.npmjs.com/ez-opendata">
    <img src="https://img.shields.io/npm/v/ez-opendata.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="ez-opendata on npm" />
  </a>&nbsp;
  <a href="https://www.npmjs.com/ez-opendata">
    <img src="https://img.shields.io/npm/dw/ez-opendata.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="ez-opendata on npm" />
  </a>&nbsp;
</p>

# Getting Started with ez-opendata

`ez-opendata` is a set of ez (easy) to use javascript functions to call open-data sources such as openstreetmap, wikipedia or wikimedia.
It is tiny and has no dependencies.

It can work for javascript and/or typescript projects on the browser or with nodejs.

You can sponsor this library at [GitHub Sponsors](https://github.com/sponsors/tbo47).

## Install

`npm install --save ez-opendata`

If you just want to give it a quick try on your typescript project, just copy and paste `index.ts` in your project and rename it `ez-opendata.ts`.

## Examples

Only basic examples are shown here. Read [test.mjs](./test.mjs) to see more advanced examples.
### Openstreetmap

Demo here: https://tbo47.github.io/poi/ or https://jsfiddle.net/tbo47/qsuy92ht/

```javascript
const cafeAndRestaurants = await openstreetmapGetPOIs(
  "14.67,-17.46,14.71,-17.41",
  [
    ["amenity", "cafe"],
    ["amenity", "restaurant"],
  ]
);
```

### Wikimedia Commons 

Demo here: https://tbo47.github.io/wikimedia/ or https://jsfiddle.net/tbo47/hyrn2vc0/

```javascript
const northEast = { lat: 14.71, lng: -17.41 };
const southWest = { lat: 14.67, lng: -17.47 };
const images = await wikimediaQuery(northEast, southWest);
```

Get a custom thumb image. Demo here: https://jsfiddle.net/tbo47/6b7j2ohy/
```javascript
const pageId = 21900832
const height = 100 
const with = 100
const { thumburl } = await wikimediaGetThumb(pageid, height, width)
```


### Wikipedia

Query wikipedia REST endpoint.

Demo here: https://tbo47.github.io/wikipedia/ or https://jsfiddle.net/tbo47/csfjyd4x/13/

```javascript
 const articles = wikipediaQuery(14.7, -17.4) // latitude longitude
```


### Wikidata

Query wikidata REST endpoint.

https://tbo47.github.io/wikidata/ or 
https://jsfiddle.net/tbo47/1z2kbuaf/
