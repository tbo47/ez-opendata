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

It can work for javascript and/or typescript projects on the broswer or with nodej.

You can sponsor this library at [GitHub Sponsors](https://github.com/sponsors/tbo47).

## Install

`npm install --save ez-opendata`

If you just want to give it a quick try on your typescript project, just copy and paste `index.ts` in your project and rename it `ez-opendata.ts`.

## Examples

Only basic examples are shown here. Read [test.mjs](./test.mjs) to see more advanced use cases in action.
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

Get thumb urls for an image.
```javascript
const pageId = 21900832
const thumbWidth = 400 // 400px
const imageDetails = wikimediaInfo(pageId, thumbWidth)
```

### Wikipedia

Demo here: https://tbo47.github.io/wikipedia/

```javascript
 const articles = wikipediaQuery(14.7, -17.4) // lattitude longitude
```
