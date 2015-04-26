module.exports = function(nohm){
	nohm.model('User', {
    properties: {
      name: {
        type: 'string',
        unique: false,
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
      },
		},

    methods: {
    }
  });
}