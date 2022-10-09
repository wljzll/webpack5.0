### assets modules 替代了file-loader和url-loader
```javascript

asset/resource:
 emits a separate file and exports the URL. Previously achievable by using file-loader.

asset/inline:
 exports a data URI of the asset. Previously achievable by using url-loader.

asset/source:
 exports the source code of the asset. Previously achievable by using raw-loader.

asset:
 automatically chooses between exporting a data URI and emitting a separate file. Previously achievable by using url-loader with asset size limit.
```