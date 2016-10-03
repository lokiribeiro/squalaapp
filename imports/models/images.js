export default Images = new FilesCollection({
  collectionName: 'images',
  storagePath: '/assets/app/uploads',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  downloadCallback: function (fileObj) {
    if (this.params.query.download == 'true') {
      // Increment downloads counter
      Images.update(fileObj._id, {$inc: {'meta.downloads': 1}});
    }
    // Must return true to continue download
    return true;
  }


});



/*export default Images = new FilesCollection({
  storagePath: 'assets/app/uploads/Images',
  collection: new Mongo.Collection('Images'),
  downloadRoute: '/files/images',
  //collectionName: 'Images',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  downloadCallback: function (fileObj) {
    if (this.params.query.download == 'true') {
      // Increment downloads counter
      Images.update(fileObj._id, {$inc: {'meta.downloads': 1}});
    }
    // Must return true to continue download
    return true;
  }
});*/

/*Images.allow({
    insert() {
      return true;
    },
    update() {
      return true;
    },
    remove() {
      return true;
    }
  });*/

  /* Equal shortcut: */
  /*Images.allowClient();*/
