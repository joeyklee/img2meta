# img2meta

**NOTE: currently only tested with iPhone images**

## Installation

1. Download and unzip the repo
2. `cd` into the directory
   ```sh
   $ cd img2meta
   ```
3. run `npm install`:
   ```sh
   $ npm install
   ``` 

## Usage

1. Get the path to your folder of images: e.g. `"/Users/joeyklee/Google Drive/super cool project/tree bed photos"`
2. `cd` into the directory
   ```sh
   $ cd img2meta
   ```
3. Run the script
   ```sh
   $ npm run make -- "/Users/joeyklee/Google Drive/super cool project/tree bed photos" true
   ```

The script can be run:

```sh
 npm run make -- "<absolute path to folder>" <true|false>
```
* `<absolute path to folder>`: the folder that contains your images
* `<true|false>`: use `true` if you want to export a geojson point feature collection or `false` if you just want the metadata.

## Acknowledgements

* [exif-parser](https://www.npmjs.com/package/exif-parser)
* [Turf.js](https://turfjs.org/docs/)