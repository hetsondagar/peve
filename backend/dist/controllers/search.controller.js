"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = search;
const Idea_1 = require("../models/Idea");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
async function search(req, res) {
    const { q = '', type = 'all', page = '1', limit = '20' } = req.query;
    const rx = new RegExp(String(q), 'i');
    const skip = (Number(page) - 1) * Number(limit);
    const searchIdeas = async () => {
        const items = await Idea_1.Idea.find({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
            .skip(skip)
            .limit(Number(limit));
        const total = await Idea_1.Idea.countDocuments({ $or: [{ title: rx }, { description: rx }, { tags: rx }] });
        return { items, total };
    };
    const searchProjects = async () => {
        const items = await Project_1.Project.find({ $or: [{ title: rx }, { description: rx }, { techStack: rx }] })
            .skip(skip)
            .limit(Number(limit));
        const total = await Project_1.Project.countDocuments({ $or: [{ title: rx }, { description: rx }, { techStack: rx }] });
        return { items, total };
    };
    const searchUsers = async () => {
        const items = await User_1.User.find({ $or: [{ name: rx }, { email: rx }, { skills: rx }] })
            .skip(skip)
            .limit(Number(limit));
        const total = await User_1.User.countDocuments({ $or: [{ name: rx }, { email: rx }, { skills: rx }] });
        return { items, total };
    };
    let data = {};
    if (type === 'ideas')
        data.ideas = await searchIdeas();
    else if (type === 'projects')
        data.projects = await searchProjects();
    else if (type === 'users')
        data.users = await searchUsers();
    else {
        const [ideas, projects, users] = await Promise.all([searchIdeas(), searchProjects(), searchUsers()]);
        data = { ideas, projects, users };
    }
    return res.json({ success: true, data });
}
