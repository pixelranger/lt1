const SessionModel = require("../models/Session.model");
const SettingsModel = require("../models/Settings.model");
const axios = require('axios');
const tokens = require("../config").tokens;


const getUserData = async (session) => {
    const userData = await SessionModel.find({
        session: {
            $exists: true,
            $eq: session
        }
    }, { _id: 0 });

    return userData.length ? userData[0] : false;
};

const getAppId = async (session) => {
    const userData = await SessionModel.find({
        session: {
            $exists: true,
            $eq: session
        }
    }, { appId: 1, _id: 0 });

    return userData.length ? userData[0].appId : false;
};

const getSettings = async (appId, admin) => {
    const hiddenSettings = ['token', 'idsAndDesc'];
    const settings = await SettingsModel.find({
        appId: {
            $exists: true,
            $eq: appId
        }
    }, { _id: 0 });

    if(!settings.length || !settings[0].settings)
        return {};

    let output = settings[0].settings;

    if(!admin) {
        hiddenSettings.forEach((k) => {delete output[k]});
    }

    return output;
};

const getSession = async (session) => {
    const userSession = await getUserData(session);

    if(!userSession)
        return;

    const settings = await getSettings(userSession.appId, userSession.role === 'teacher');

    const output = {
        role: userSession.role,
        settings,
        isAssignment: !!userSession.assignmentId
    };

    if(userSession.role === 'teacher') {
        if(userSession.assignmentId)
            output.submissions = await getSubmissions(userSession.assignmentId);
        else
            output.assignments = await getAssignments(userSession);

        return output;
    }

    if(!userSession.assignmentId) {
        output.answers = await getJournal(userSession);
    } else {
        output.answers = userSession.answers
    }
    return output;
};

const getJournal = async (userSession) => {
    const settings = await getSettings(userSession.appId, true);
    const idsAndDesc = settings.idsAndDesc;
    let ids = [];
    idsAndDesc.map((pair) => {
        let id = pair.quiz_id ? pair.quiz_id : pair.id;
        ids.push(id);
    });

    const response = await axios({
        url: `https://develop.skolkovo.d2.3dev.tech/webservice/restjson/server.php`,
        headers: {'Content-Type': 'application/json'},
        params: {
            moodlewsrestformat: "json",
            wsfunction: "local_course_get_user_answers",
            wstoken: tokens.key,
            courseid: userSession.courseId,
            userid: userSession.userId
        },
    }).catch((error) => {
        console.log(error);
    });

    if(!response || !response.data)
        return;

    return await Promise.all(idsAndDesc.map(async (item) => {
        return item;
    }));
};

const updateSettings = async (session, update) => {
    const appId = await getAppId(session);
    return SettingsModel.findOneAndUpdate({appId}, {settings: update}, {
        new: true,
        upsert: true
    });
};

const updateAnswers = async (session, update) => {
    return SessionModel.findOneAndUpdate({session}, {answers: update});
};

const startSession = async (body, session) => {
    const resumedSession = await SessionModel.find({
        session
    });
    if(resumedSession.length)
        return;
    
    const newSession = new SessionModel({
        session,
        role: body.roles.includes('teacher') || body.roles.includes('manager') ? 'teacher' : 'student',
        appId: body.resource_link_id,
        assignmentId: body.resource_link_id,
        userId: body.userid,
        name: body.lis_person_name_full,
        email: body.lis_person_contact_email_primary,
        host: body.tool_consumer_instance_guid,
        courseId: body.contextid
    });
    return newSession.save();
};

const getSubmissions = async (assignmentId) => {
    return await SessionModel.find({
        assignmentId: assignmentId,
        role: 'student'
    }, { _id: 0, answers: 1, name: 1, email: 1, userId: 1 });
};

const getAssignments = async (userSession) => {
    if(!userSession)
        return;

    const response = await axios({
        url: `https://develop.skolkovo.d2.3dev.tech/webservice/restjson/server.php`,
        headers: {'Content-Type': 'application/json'},
        params: {
            moodlewsrestformat: 'json',
            wsfunction: 'local_course_get_modules_information',
            wstoken: tokens.key,
            courseid: userSession.courseId
        },
    })
        .then(function (response) {
            if (!response)
                return null;
            let output = [];
            let questions = [];

            for(let a of response.quizes) {
                for(let q of a.questions) {
                    output.push({
                        name: `${a.name}: ${q.name}`,
                        id: a.id + ':' + q.id,
                    });

                    questions.push({
                        id: q.id,
                        name: q.name,
                        text: q.questiontext,
                    });
                }

                output.push({
                    name: `${a.name}: все задания`,
                    id: a.id,
                    questions
                });
            }

            for(let assign of response.assigns) {
                output.push({name: assign.name, id: assign.id});
            }

            return output;
        })
        .catch((error) => {
        return false
    });
};

const journalDownloaded = (session) => {
    return SessionModel.findOneAndUpdate({session}, { $push: { journalDownloadedAt: new Date() } });
}

module.exports = {
    startSession,
    getSession,
    updateSettings,
    updateAnswers,
    journalDownloaded,
};
