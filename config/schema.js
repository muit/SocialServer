Models = {};
module.exports = function(){
	Models.User = nohm.model('User', {
    properties: {
      name: {
        type: 'string',
        unique: true,
        validations: [
          'notEmpty'
        ]
      },

      email: {
        type: 'string',
        unique: true,
        validations: [
          'email'
        ]
      },

      password: {
        type: 'string',
        unique: false,
        validations: [
          'notEmpty'
        ]
      }
		},

    methods: {
    }
  });

  Models.FriendRequest = nohm.model('FriendRequest', {
    properties: {
      name: {
        type: 'string',
        unique: false,
        validations: [
          'notEmpty'
        ]
      },

      friend: {
        type: 'string',
        unique: false,
        validations: [
          'notEmpty'
        ]
      }
    },

    methods: {
    }
  });
}