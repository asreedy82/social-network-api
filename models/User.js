const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: [this],
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount').get(function () {
        return this.friends.length;
    });

userSchema.plugin(uniqueValidator);

const User = model('user', userSchema);

module.exports = User;