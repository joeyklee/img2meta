const fs = require('fs');
const path = require('path');
const parser = require('exif-parser');
const turf = require('@turf/helpers');
const dataDirectory = process.argv[2] || __dirname + '/example';
const withGeoJSON = process.argv[3] || false;

// call the function
make();

/**
 * Gets the image files from a directory
 * @param {*} dataDirectory 
 */
function getFiles(dataDirectory) {
  if (fs.lstatSync(dataDirectory).isDirectory()) {
    let files = fs.readdirSync(dataDirectory);

    files = files.filter(file => {
      if (
        file.endsWith('JPG') ||
        file.endsWith('jpeg') ||
        file.endsWith('jpg') ||
        file.endsWith('png')
      ) {
        return file;
      } 
    });

    files = files.map(file => {
      return `${dataDirectory}/${file}`;
    });

    return files;
  }
}

/**
 * Gets the metadata from an image given a filePath
 * @param {*} filePath 
 */
function getExif(filePath) {
  const buffer = fs.readFileSync(filePath);
  const myFile = parser.create(buffer);
  const result = myFile.parse();
  const fileName = path.basename(filePath);
  result.meta = {
    fileName: fileName
  };
  return result;
}

/**
 * Makes a FeatureCollection of GeoJSON points given an
 * array of metadata
 * @param {*} metaDataList 
 */
function makeGeoJSONFeatureCollection(metaDataList) {
  const points = metaDataList.map(meta => makeGeoJSONPoint(meta));
  const fc = turf.featureCollection(points);
  return fc;
}

/**
 * Makes a geojson point using the metadata 
 * NOTE: currently only tested for iphone 5 & 7
 * will return [0,0] if the EXIF data is
 * @param {*} metadata 
 */
function makeGeoJSONPoint(metadata) {
  if(metadata.tags && metadata.tags.GPSLatitude && metadata.tags.GPSLongitude ){
    const { GPSLatitude, GPSLongitude } = metadata.tags;
    const point = turf.point([GPSLongitude, GPSLatitude, metadata]);
    return point;
  } else {
    const point = turf.point([0,0, metadata]);
    return point;
  }
}

/**
 * The main function
 */
function make() {
  const files = getFiles(dataDirectory);
  const meta = files.map(filePath => {
    return getExif(filePath);
  });

  if (withGeoJSON) {
    const fc = makeGeoJSONFeatureCollection(meta);
    fs.writeFileSync(
      dataDirectory + '/img_metadata.geojson',
      JSON.stringify(fc)
    );
  }

  fs.writeFileSync(dataDirectory + '/img_metadata.json', JSON.stringify(meta));
}
