const {User, Thought} = require('../models/User');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
            .populate({ path: 'thoughts', select: '-__v' })
            .then((user) => 
                !user
                    ? res.status(404).json({message: 'No user found with that ID'})
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            { runValidators: true, new: true }
        )
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) => 
        !user
        ? res.status(404).json({message: 'No user found with that ID'})
        : Thought.deleteMany({_id: {$in: user.thoughts}})
        )
        .then(() => res.json({message: 'User and associated thoughts deleted'}))
        .catch((err) => res.status(500).json(err));
    },
};
