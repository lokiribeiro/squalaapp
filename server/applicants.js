import Applicants from '/imports/models/applicants.js';

Applicants.allow({
    insert(userId, applicant){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, applicant, appId){
        // permission to update only to party owner
        return true;
    },
    remove(userId, applicant){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('applicantsNew', function (searchText) {
  var selector = null;
  var type = 'New application';
  //var branchId = null;

  //var  user = this.userId;
  //console.log(user);
  //selector={_id: user};
  //var details = Meteor.users.find(selector);
  //details.forEach(function(detail){
  //branchId = detail.branchId;
  //});
  //console.log(branchId);

  if(typeof searchText === 'string' && searchText.length){
        var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
        selector = {status : type, $and  : [
              { $or : [
                {lastname: searchString},
                {middlename: searchString},
                {applicationNum: searchString},
                {firstname : searchString}
          //{ branchId : branchId },
              ]}
      ]};
  } else {
      selector =  //{$and : [
        //{branchId: branchId},
        {status : type};
        //]};

  }

  return Applicants.find(selector);
});

Meteor.methods({

          createApplicantFromAdmin(firstname, middlename, lastname, email, status, applicationNum, branchId, encodedBy, photo, encoderName, createdAt){
                var applicant = Applicants.insert({firstname:firstname, middlename:middlename, lastname:lastname, email:email, status:status, branchId: branchId, applicationNum: applicationNum, encodedBy: encodedBy, photo: photo, encoderName: encoderName, createdAt: createdAt });
                return applicant;
            }

})
