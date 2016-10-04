Slingshot.GoogleCloud.directiveDefault.GoogleAccessId = "schoolmanagementapps@squala-145313.iam.gserviceaccount.com";
Slingshot.GoogleCloud.directiveDefault.GoogleSecretKey = Assets.getText('google-cloud-service-key.pem');

Slingshot.createDirective('myFileUploads', Slingshot.GoogleCloud, {
    bucket: 'squala',
    acl: 'public-read',
    allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
    maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited).
    authorize: function() {
        if (!this.userId) {
            var message = 'Please login before posting file';
            throw new Meteor.Error('Login Required', message);
        }

        return true;
    },
    key: function(file) {
        var user = Meteor.users.findOne(this.userId);
        var ext = file.type.split('/')[1];
        return user.username + '/' + Random.hexString(8) + '.' + ext;
    }
});




















/*import Images from '/imports/models/images.js';
import fs from 'fs';

Meteor.publish('filesimagesall', function () {
    return Images.find().cursor;
  });

Meteor.methods({


  uploadFileFromClient(fileInfo, path, fileData, encoding){
      console.log('daan dito' + path);
      console.log('filename: ' + fileInfo);
      console.log('filedata: ' + fileData);

      var filename = fileInfo;

      var path = cleanPath(path);
      console.log('daan pathclean' + path);
      var projectPath = Assets.absoluteFilePath(filename);
      console.log('daan asset' + projectPath);
      var filename = cleanName(filename);
      console.log('daan filename' + filename);
      var encoding = encoding;
      var chroot = Meteor.chroot || projectPath + 'public';
      console.log = ('chroot' + chroot);
        // Clean up the path. Remove any initial and final '/' -we prefix them-,
        // any sort of attempt to go to the parent directory '..' and any empty directories in
        // between '/////' - which may happen after removing '..'
        path = chroot + (path ? '/' + path + '/' : '/');
        console.log('daan pathchroot' + path);
        var pathfile = path + filename;
        console.log(pathfile);


        fs.writeFile(path + filename, fileData, encoding, function(err) {
          if (err) {
            throw (new Meteor.Error(500, 'Failed to save file.', err));
          } else {
            console.log('The file ' + filename + ' (' + encoding + ') was saved to ' + path);
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
          var name2 = str.replace(/\.\./g,'').replace(/\//g,'');
          console.info('name2', name2);
          return name2;
        }
      }

})*/
