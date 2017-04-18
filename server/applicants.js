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

Meteor.publish('applicants', function (applicantID) {
  var selector = {_id: applicantID};
  return Applicants.find(selector);
});

Meteor.methods({

          createApplicantFromAdmin(firstname, middlename, lastname, email, status, applicationNum, branchId, encodedBy, photo, encoderName, createdAt, gradelevel, branchname, gradelevelID, guardian, phone, progress){
                var applicant = Applicants.insert({firstname:firstname, middlename:middlename, lastname:lastname, email:email, status:status, branchId: branchId, branchname: branchname, applicationNum: applicationNum, encodedBy: encodedBy, photo: photo, encoderName: encoderName, createdAt: createdAt, gradelevelid: gradelevelID, gradelevel: gradelevel, guardian: guardian, phone: phone, progress: progress });
                return applicant;
            },
          upsertApplicantFromBasic(detail){
                var selector = {_id: detail._id};
                var modifier = {$set: {
                  city: detail.city,
                  address: detail.address,
                  birthdate: detail.birthdate,
                  firstname: detail.firstname,
                  gender: detail.gender,
                  lastname: detail.lastname,
                  middlename: detail.middlename,
                  mobileNo: detail.mobileNo,
                  nickname: detail.nickname,
                  progress: detail.progress,
                  religion: detail.religion
                }};
                var applicant = Applicants.upsert(selector, modifier);
                return applicant;
            },
            upsertApplicantFromParent(detail){
                  var selector = {_id: detail._id};
                  var modifier = {$set: {
                    guardian: detail.guardian,
                    relation: detail.relation,
                    phone: detail.phone,
                    parentemail: detail.parentemail,
                    progress: detail.progress
                  }};
                  var applicant = Applicants.upsert(selector, modifier);
                  return applicant;
              },
              upsertApplicantFromDocs(applicantID, progress){
                    var selector = {_id: applicantID};
                    var modifier = {$set: {
                      progress: progress
                    }};
                    var applicant = Applicants.upsert(selector, modifier);
                    return applicant;
                },
                upsertFeesFromAdmissions(applicantID, feesID){
                  var selector = {_id: applicantID};
                  var modifier = {$set: {feesid: feesID}};
                  var userUpsert = Applicants.update(selector, modifier);
                  return userUpsert;
                },

})
