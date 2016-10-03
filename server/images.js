import Images from '/imports/models/images.js';
import fs from 'fs';

Meteor.publish('filesimagesall', function () {
    return Images.find().cursor;
  });

Meteor.methods({


  uploadFileFromClient(fileInfo, path, fileData, encoding){
      console.log('daan dito');
      console.log('filename: ' + fileInfo);
      console.log('filedata: ' + fileData);
      var filename = fileInfo;

      var path = cleanPath(path);
      var filename = cleanName(filename);
      var encoding = encoding || 'binary';
      var chroot = Meteor.chroot;
      console.log = ('chroot' + chroot);
        // Clean up the path. Remove any initial and final '/' -we prefix them-,
        // any sort of attempt to go to the parent directory '..' and any empty directories in
        // between '/////' - which may happen after removing '..'
        console.info('path before chroot', path);
        path = chroot + (path ? '/' + path + '/' : '/');
        console.info('path after chroot', path);


        fs.writeFile(path + filename, fileData, encoding, function(err) {
          if (err) {
            throw (new Meteor.Error(500, 'Failed to save file.', err));
          } else {
            console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
          }
        });

        function cleanPath(str) {
          if (str) {
            var path2 = str.replace(/\.\./g,'').replace(/\/+/g,'').
            replace(/^\/+/,'').replace(/\/+$/,'');
            console.info('path', path2);
            return path2
          }
        }
        function cleanName(str) {
          var name2 = str.replace(/\.\./g,'').replace(/\/+/g,'');
          console.info('name2', name2);
          return name2;
        }
      }

})
