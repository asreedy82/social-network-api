const { Thought, User } = require('../models');

module.exports = {
    //get all
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    //get one
    getSingleThought(req, res) {
        Thought.findById({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "No thought found with that ID" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    //create
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { new: true }
                );
            })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'Thought created, but no user found with that ID' })
                    : res.json({ message: 'Created thought successfully' })
            )
            .catch((err) => res.status(500).json(err));
    },
    //update
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought found with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    //delete
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought found with that ID' })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'Thought deleted, but no user with this ID' })
                    : res.json({ message: 'Thought successfully deleted' })
            )
            .catch((err) => res.status(500).json(err));
    },
    //ad reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought found with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    //delete reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought found with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};