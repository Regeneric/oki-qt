/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 31/10/2020
// File: ./controllers/tasks.controller.js
/*-!INFO!-*/

const fs = require("fs");
const rmdir = require("rimraf");
const {exec} = require("child_process");
const adm = require('adm-zip');

const Task = require("../models/task.model");

String.prototype.escapeDiac = function() {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
               .replace(/ć/g, 'c').replace(/Ć/g, 'C')
               .replace(/ę/g, 'e').replace(/Ę/g, 'E')
               .replace(/ł/g, 'l').replace(/Ł/g, 'L')
               .replace(/ń/g, 'n').replace(/Ń/g, 'N')
               .replace(/ó/g, 'o').replace(/Ó/g, 'O')
               .replace(/ś/g, 's').replace(/Ś/g, 'S')
               .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
               .replace(/ź/g, 'z').replace(/Ź/g, 'Z');
}

module.exports = {
    findOne: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(!task) return next();
            else return res.status(200).send(task);
        }
    },
    findAll: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const tasks = await Task.find(req.filters).sort({createdAt: "desc"});
            const perPage = 15;
            const tasksCount = tasks.length;

            const pageCount = Math.ceil(tasksCount/perPage);
            let page = parseInt(req.query.page);
                if(!page) page = 1;
                if(page > pageCount) page = pageCount;

            const from = page*perPage - perPage;
            const to = page*perPage;


            if(!tasks) return next();
            else return res.status(200).send({tasks: tasks.slice(from, to), page, pageCount});
        }
    },
    search: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const tasks = await Task.find(req.filters).sort({createdAt: "desc"});
            if(!tasks) return next();
        
            else {
                const found = new Array();
                const tags = req.params["tags"].toLowerCase().replace(/\,/g, ' ');

                tasks.forEach(task => {
                    const title =  task.taskTitle.escapeDiac().toLowerCase();
                    const desc = task.taskDesc.escapeDiac().toLowerCase();
                    const author = task.taskAuthor.escapeDiac().toLowerCase();

                    const tagFind = task.taskTags.some(tt => tags.includes(tt.escapeDiac().toLowerCase()));
                    if(tagFind) found.push(task);
                    else {
                        const titleFind = title.includes(tags)
                        if(titleFind) found.push(task);
                        else {
                            const descFind = desc.includes(tags);              
                            if(descFind) found.push(task);
                            else {
                                const authorFind = author.includes(tags);
                                if(authorFind) found.push(task);
                            }
                        }
                    }
                }); return res.status(200).send(found);
            }
        }
    },
    render: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(!task) return next();
            
            let taskFile = task.taskBody.split('/');
                taskFile = taskFile[taskFile.length-1];

            const data = fs.readFileSync(`./tasks/${req.params.id}/${taskFile}`);
            
            return res.status(200).type("pdf").send(data);
        }
    },
    create: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await new Task({
                taskID: req.body.taskID,
                taskAuthor: req.body.taskAuthor,
                taskTitle: req.body.taskTitle,
                taskDesc: req.body.taskDesc,
                taskTags: req.body.taskTags,
                taskDifficulty: req.body.taskDifficulty,
                taskBody: req.body.taskBody,
                taskCppCode: req.body.taskCppCode,
                taskInFiles: req.body.taskInFiles,
                taskOutFiles: req.body.taskOutFiles,
                taskRunTime: req.body.taskRunTime,
                taskIsPublic: req.body.taskIsPublic,
                lastTake: req.body.lastTake,
                contributors: req.body.contributors
            }).save();

            return res.status(201).send(task);
        }
    },
    upload: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            if(req.files === null) return res.status(400).json({msg: "No file uploaded!"});

            const task = await Task.findOne({taskID: req.files.id.name});
            const file = req.files.file;

            if(file) if(file.size > 4194304) return res.status(403).json({msg: `File ${file.name} is too big! It must be 4 MiB or less!`});
            if(task) {
                if(!fs.existsSync(`./tasks/${task._id}/`)) fs.mkdirSync(`./tasks/${task._id}/`);

                file.mv(`./tasks/${task._id}/${file.name}`, err => {
                    if(err) {
                        console.error(err);
                        return res.status(500).send(err);
                    } else return res.status(200).json({fileName: file.name, userFile: `/tasks/${task._id}/${file.name}`});
                });
    
                let fileExt = file.name.split('.');
                    fileExt = fileExt[fileExt.length-1];
                    fileExt.toLowerCase();
                
                switch(fileExt) {
                    case "pdf": task.taskBody = `./tasks/${task._id}/${file.name}`; task.save(); break;
                    case "cpp": task.taskCppCode = `./tasks/${task._id}/${file.name}`; task.save(); break;
                    case "in":  task.taskInFiles = [...task.taskInFiles, `./tasks/${task._id}/${file.name}`]; task.save(); break;
                    case "out": task.taskOutFiles = [...task.taskOutFiles, `./tasks/${task._id}/${file.name}`]; task.save(); break;
                    default: break;
                }
            } else return res.status(401).json({});
        }
    },
    uploadUser: async (req, res) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            if(req.files === null) return res.status(400).json({msg: "No file uploaded!"});

            const task = await Task.findOne({_id: req.files.id.name});
            const file = req.files.file;
            let contributor = task.contributors.length > 0 
                ? task.contributors.filter(c => c.userName == req.files.user.name) 
                : {};

            if(file) if(file.size > 4194304) return res.status(403).json({msg: `File ${file.name} is too big! It must be 4 MiB or less!`});
            if(task) {
                if(fs.existsSync(`./tasks/${task._id}/${req.files.user.name}/`)) {
                    rmdir.sync(`./tasks/${task._id}/${req.files.user.name}/`);
                    fs.mkdirSync(`./tasks/${task._id}/${req.files.user.name}/`);
                } else fs.mkdirSync(`./tasks/${task._id}/${req.files.user.name}/`);

                file.mv(`./tasks/${task._id}/${req.files.user.name}/${file.name}`, err => {
                    if(err) {
                        console.error(err);
                        return res.status(500).json({});
                    } else return res.status(200).json({fileName: file.name, userFile: `/tasks/${task._id}/${req.files.user.name}/${file.name}`});
                });

                contributor = {
                    userName: req.files.user.name,
                    taskCppCode: `./tasks/${task._id}/${req.files.user.name}/${file.name}`
                };

                if(task.contributors.length > 0) {
                    const index = task.contributors.findIndex((c => c.userName == req.files.user.name));
                    if(index === -1) {
                        task.contributors = [...task.contributors, contributor];
                        await task.save();
                    } else {
                        task.contributors[index] = contributor;

                        task.markModified("contributors");
                        await task.save();
                    }
                } else {
                    task.contributors = [contributor];
                    await task.save();
                }
                
            } else return res.status(401).json({});
        }
    },
    compile: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            task.lastTake = new Date();

            if(req.query.user == null) {
                console.log(req.params.id);
                const userFile = task.taskCppCode;
    
                if(fs.existsSync(`./tasks/${req.params.id}/app`)) fs.unlinkSync(`./tasks/${req.params.id}/app`);
        
                exec(`g++ ${userFile} -o ./tasks/${req.params.id}/app`, (error, stdout, stderr) => {
                    if(error) console.error(error);
                    if(stderr) {
                        console.log("stderr: ", stderr);
                        return res.status(409).json({});
                    }
        
                    return res.status(200).json({});
                });
            }

            let contributor = task.contributors.filter(c => c.userName === req.query.user);
            if(contributor.length > 0 && req.query.user !== undefined) {
                let userFile = contributor[0].taskCppCode;
                const stats = fs.statSync(userFile);
                const fileSize = stats["size"];
    
                if(fs.existsSync(`./tasks/${req.params.id}/${req.query.user}/app`)) fs.unlinkSync(`./tasks/${req.params.id}/${req.query.user}/app`);
    
                exec(`g++ ${userFile} -o ./tasks/${req.params.id}/${req.query.user}/app`, async (error, stdout, stderr) => {
                    if(error) console.error(error);
                    if(stderr) {
                        console.log("stderr: ", stderr);
    
                        contributor[0].fileSize = fileSize;
                        contributor[0].isCompiling = false;
                        contributor[0].isRunning = false;
                        contributor[0].isPassingTests = false;

                        const index = task.contributors.findIndex((c => c.userName == req.query.user));
                        task.contributors[index] = contributor[0];
        
                        task.markModified("contributors");
                        await task.save();
    
                        return res.status(409).json({});
                    }
    
                    contributor[0].fileSize = fileSize;
                    contributor[0].isCompiling = true;
                    contributor[0].isRunning = false;
                    contributor[0].isPassingTests = false;

                    const index = task.contributors.findIndex((c => c.userName == req.query.user));
                    task.contributors[index] = contributor[0];
    
                    task.markModified("contributors");
                    await task.save();
    
                    return res.status(200).json({});
                });
            }
        }            
    },
    run: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(req.query.user == null) {
                const tempFile = `./tasks/${req.params.id}/`;
                let userFiles = task.taskInFiles;
                    userFiles.sort((a, b) => a > b ? 1 : -1);
                
                let cnt = 0;
                userFiles.forEach(userFile => {
                    exec(`./tasks/${req.params.id}/app < ${userFile} > ${tempFile}temp${cnt}.out`, async (error, stdout, stderr) => {
                        if(error) console.error(error);
                        if(stderr) {
                            console.log(stderr);
                            return res.status(406).json({});
                        }
                    }); cnt++; 
                }); return res.status(200).json({});
            }

            let contributor = task.contributors.filter(c => c.userName === req.query.user);
            if(contributor.length > 0 && req.query.user != null) {
                const tempFile = `./tasks/${req.params.id}/${req.query.user}/`;
                let inFiles = task.taskInFiles;
                    inFiles.sort((a, b) => a > b ? 1 : -1);

                let cnt = 0;
                inFiles.forEach(inFile => {
                    exec(`./tasks/${req.params.id}/${req.query.user}/app < ${inFile} > ${tempFile}temp${cnt}.out`, async (error, stdout, stderr) => {
                        if(error) console.error(error);
                        if(stderr) {
                            console.log(stderr);

                            contributor[0].isRunning = false;
                            contributor[0].isPassingTests = false;

                            const index = task.contributors.findIndex((c => c.userName == req.query.user));
                            task.contributors[index] = contributor[0];
            
                            task.markModified("contributors");
                            await task.save();

                            return res.status(406).json({});
                        }
                    }); cnt++;
                }); 
                
                contributor[0].isRunning = true;
                contributor[0].isPassingTests = false;

                const index = task.contributors.findIndex((c => c.userName == req.query.user));
                task.contributors[index] = contributor[0];

                task.markModified("contributors");
                await task.save();
                
                return res.status(200).json({});
            }
        }
    },
    check: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(req.query.user == null) {
                const tempFile = `./tasks/${req.params.id}/`;
                let userFiles = task.taskOutFiles;
                    userFiles.sort((a, b) => a > b ? 1 : -1);
        
                let cnt = 0, fileCnt = 0;;
                userFiles.forEach(userFile => {
                    const userOut = fs.readFileSync(userFile, {encoding: "utf-8"});
                    const programOut = fs.readFileSync(tempFile+`temp${fileCnt}.out`, {encoding: "utf-8"});
        
                    if(userOut === programOut) cnt++;
                    fs.unlinkSync(tempFile+`temp${fileCnt}.out`); 
                    
                    fileCnt++;
                });
        
                if(cnt === userFiles.length) {
                    fs.unlinkSync(`./tasks/${req.params.id}/app`); 
                    return res.status(202).json({});
                } else return res.status(417).json({});
            }

            let contributor = task.contributors.filter(c => c.userName === req.query.user);
            if(contributor.length > 0 && req.query.user != null) {
                const tempFile = `./tasks/${req.params.id}/${req.query.user}/`;
                let outFiles = task.taskOutFiles;
                    outFiles.sort((a, b) => (a > b ? 1 : -1));

                let cnt = 0, fileCnt = 0;
                outFiles.forEach(outFile => {
                    const userOut = fs.readFileSync(outFile, {encoding: "utf-8"});
                    const programOut = fs.readFileSync(tempFile+`temp${fileCnt}.out`, {encoding: "utf-8"});  

                    console.log(outFile, `temp${fileCnt}.out`);

                    if(userOut === programOut) cnt++;
                    fs.unlinkSync(tempFile+`temp${fileCnt}.out`);

                    fileCnt++;
                });

                if(cnt === outFiles.length) {
                    fs.unlinkSync(`./tasks/${req.params.id}/${req.query.user}/app`); 

                    contributor[0].isPassingTests = true;
                    const index = task.contributors.findIndex((c => c.userName == req.query.user));
                    task.contributors[index] = contributor[0];
    
                    task.markModified("contributors");
                    await task.save();
                    
                    return res.status(202).json({});
                } else {
                    contributor[0].isPassingTests = false;
                    const index = task.contributors.findIndex((c => c.userName == req.query.user));
                    task.contributors[index] = contributor[0];
    
                    task.markModified("contributors");
                    await task.save();

                    return res.status(417).json({});
                }
            }
        }
    },
    download: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});

            if(req.body.data !== "infiles" && req.body.data !== "outfiles") {
                if(req.query.user == null) {
                    const file = `./tasks/${req.params.id}/${req.body.data}`;
                    if(file) return res.status(200).download(file);
                    else return res.status(404).json({});
                } else {
                    let contributor = task.contributors.filter(c => c.userName === req.query.user);
    
                    let file = contributor[0].taskCppCode;
                        file = file.split('/');
                        file = file[file.length-1];
                    
                    if(file) return res.status(200).download(`./tasks/${req.params.id}/${req.query.user}/${file}`, file);
                }
            } 

            if(req.body.data === "infiles") {
                const files = fs.readdirSync(`./tasks/${req.params.id}`);
                const infiles = files.filter(f => f.split('.')[1] == "in");
                console.log(infiles);
                
                const zip = new adm();
                const downloadName = `in-${req.params.id}.zip`;
                    infiles.forEach(inf => {console.log(inf); zip.addLocalFile(`./tasks/${req.params.id}/${inf}`);})
                    const data = zip.toBuffer();

                res.set('Content-Type', 'application/zip');
                res.set('Content-Disposition', `attachment; filename=${downloadName}`);
                res.set('Content-Length', data.length);

                return res.status(200).send(data);
            } if(req.body.data === "outfiles") {
                const files = fs.readdirSync(`./tasks/${req.params.id}`);
                const outfiles = files.filter(f => f.split('.')[1] == "out");
                
                const zip = new adm();
                const downloadName = `in-${req.params.id}.zip`;
                    outfiles.forEach(ouf => {zip.addLocalFile(`./tasks/${req.params.id}/${ouf}`);})
                    const data = zip.toBuffer();

                res.set('Content-Type', 'application/zip');
                res.set('Content-Disposition', `attachment; filename=${downloadName}`);
                res.set('Content-Length', data.length);
                
                return res.status(200).send(data);
            }

            return res.status(404).json({});
        }
    },
    update: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(!task) return next();

            if(req.body.taskAuthor) task.taskAuthor = req.body.taskAuthor;
            if(req.body.taskTitle) task.taskTitle = req.body.taskTitle;
            if(req.body.taskDesc) task.taskDesc = req.body.taskDesc;
            if(req.body.taskTags) task.taskTags = req.body.taskTags;
            if(req.body.taskDifficulty) task.taskDifficulty = req.body.taskDifficulty;
            if(req.body.taskBody) task.taskBody = req.body.taskBody;
            if(req.body.taskCppCode) task.taskCppCode = req.body.taskCppCode;
            if(req.body.taskInFiles) task.taskInFile = req.body.taskInFile;
            if(req.body.taskOutFiles) task.taskOutFile = req.body.taskOutFile;
            if(req.body.taskRunTime) task.taskRunTime = req.body.taskRunTime;
            if(req.body.taskIsPublic) task.taskIsPublic = req.body.taskIsPublic;
            if(req.body.lastTake) task.lastTake = req.body.lastTake;
            if(req.body.contributors) task.contributors = req.body.contributors;

            await task.save();
            return res.status(200).send(task);
        }
    },
    remove: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(!task) return next();
            else await task.remove();

            return res.status(200).json({});
        }
    },
    removeUser: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            const task = await Task.findOne({_id: req.params.id});
            if(!task) return next();
            else {
                let contributors = task.contributors.length > 0 
                ? task.contributors.filter(c => c.userName !== req.body.userName) 
                : {};

                if(task.contributors.length > 0) {
                    task.contributors = contributors;
                    
                    task.markModified("contributors");
                    await task.save();
                } else return res.status(404).json({});
            } return res.status(200).json({});
        }
    },
    purge: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            if(fs.existsSync(`./tasks/${req.params.id}/`)) {
                rmdir.sync(`./tasks/${req.params.id}`);
            
                return res.status(200).json({});
            } else return res.status(500).json({});
        }
    },
    purgeUser: async (req, res, next) => {
        if(req.query.api_key !== process.env.API_KEY) return res.status(403).json({});
        else {
            if(fs.existsSync(`./tasks/${req.params.id}/${req.body.userName}`)) {
                rmdir.sync(`./tasks/${req.params.id}/${req.body.userName}`);
            
                return res.status(200).json({});
            } else return res.status(500).json({});
        }
    }
};