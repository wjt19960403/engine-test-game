"use strict";
class NPC extends cadence.DisplayObjectContainer {
    constructor(npcId, npcCode, dialogue) {
        super();
        this.dialogue = [];
        this.taskAcceptDialogue = [];
        this.taskSubmitDialogue = [];
        //private canFinishedTaskId : string = null;
        this.taskList = {};
        this.canAcceptTaskList = {};
        this.canSumbitTaskList = {};
        for (var i = 0; i < dialogue.length; i++) {
            this.dialogue[i] = dialogue[i];
        }
        //console.log(npcCode);
        this.NPCId = npcId;
        this.width = 64;
        this.height = 64;
        this.NPCBitmap = this.createBitmapByName(npcCode);
        this.addChild(this.NPCBitmap);
        this.NPCBitmap.x = 0;
        this.NPCBitmap.y = 0;
        this.NPCBitmap.touchEnabled = true;
        //this.onNPCClick();
        this.touchEnabled = true;
        this.NPCBitmap.addEventListener(cadence.TouchEventsType.CLICK, () => {
            NPC.npcIsChoose = this;
        }, this);
        this.emoji = new cadence.Bitmap();
        let rule = (taskList) => {
            for (var taskId in taskList) {
                if (taskList[taskId].fromNpcId == this.NPCId || taskList[taskId].toNpcId == this.NPCId) {
                    this.taskList[taskId] = taskList[taskId];
                }
                if (taskList[taskId].fromNpcId == this.NPCId) {
                    this.canAcceptTaskList[taskId] = taskList[taskId];
                }
                if (taskList[taskId].toNpcId == this.NPCId) {
                    this.canSumbitTaskList[taskId] = taskList[taskId];
                }
                if (taskList[taskId].fromNpcId == this.NPCId && taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    this.emoji.texture = cadence.RES.getRES("tanhao_yellow.png", (value) => {
                        this.emoji.texture = value;
                    });
                    this.taskList[taskId] = taskList[taskId];
                }
                if (this.NPCId == taskList[taskId].toNpcId && taskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    this.emoji.texture = cadence.RES.getRES("wenhao_yellow.png", (value) => {
                        this.emoji.texture = value;
                    });
                    this.taskList[taskId] = taskList[taskId];
                }
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        this.addChild(this.emoji);
        this.emoji.x = 20;
        this.emoji.y = 20;
    }
    setTaskAcceptDialogue(acceptDialogue) {
        this.taskAcceptDialogue = acceptDialogue;
    }
    setTaskSubmitDialogue(submitDialogue) {
        this.taskSubmitDialogue = submitDialogue;
    }
    onChange(task) {
        if (this.NPCId == task.fromNpcId && task.status == TaskStatus.ACCEPTABLE) {
            this.emoji.alpha = 1;
            this.emoji.texture = cadence.RES.getRES("tanhao_yellow.png", (value) => {
                this.emoji.texture = value;
            });
            this.taskList[task.id].status = TaskStatus.ACCEPTABLE;
            return;
        }
        if (this.NPCId == task.toNpcId && task.status == TaskStatus.CAN_SUBMIT) {
            this.emoji.alpha = 1;
            this.emoji.texture = cadence.RES.getRES("wenhao_yellow.png", (value) => {
                this.emoji.texture = value;
            });
            this.taskList[task.id].status = TaskStatus.CAN_SUBMIT;
            this.canSumbitTaskList[task.id] = task;
            //this.canFinishedTaskId = task.id;
            return;
        }
        // if(this.NPCId == task.toNpcId && task.status == TaskStatus.CAN_SUBMIT){
        //     this.canFinishedTaskId = task.id;
        //     return;
        // }
        // if(this.NPCId == task.toNpcId && task.status == TaskStatus.SUBMITTED){
        //     this.canFinishedTaskId = null;
        //     return;
        // }
        if (this.NPCId == task.fromNpcId && task.status != TaskStatus.ACCEPTABLE && task.status != TaskStatus.SUBMITTED) {
            this.emoji.alpha = 0;
            this.taskList[task.id].status = task.status;
            for (var taskId in this.canSumbitTaskList) {
                if (this.NPCId == this.canSumbitTaskList[taskId].toNpcId
                    && this.canSumbitTaskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    this.emoji.alpha = 1;
                    this.emoji.texture = cadence.RES.getRES("wenhao_yellow.png", (value) => {
                        this.emoji.texture = value;
                    });
                    return;
                }
            }
            for (var taskId in this.taskList) {
                if (this.NPCId == this.taskList[taskId].fromNpcId
                    && this.taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    this.emoji.alpha = 1;
                    this.emoji.texture = cadence.RES.getRES("tanhao_yellow.png", (value) => {
                        this.emoji.texture = value;
                    });
                    return;
                }
            }
            return;
        }
        if (this.NPCId == task.toNpcId && task.status != TaskStatus.CAN_SUBMIT) {
            this.emoji.alpha = 0;
            this.taskList[task.id].status = task.status;
            for (var taskId in this.canSumbitTaskList) {
                if (this.NPCId == this.canSumbitTaskList[taskId].toNpcId
                    && this.canSumbitTaskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    this.emoji.alpha = 1;
                    this.emoji.texture = cadence.RES.getRES("wenhao_yellow.png", (value) => {
                        this.emoji.texture = value;
                    });
                    return;
                }
            }
            for (var taskId in this.taskList) {
                if (this.NPCId == this.taskList[taskId].fromNpcId
                    && this.taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    this.emoji.alpha = 1;
                    this.emoji.texture = cadence.RES.getRES("tanhao_yellow.png", (value) => {
                        this.emoji.texture = value;
                    });
                    return;
                }
            }
            return;
        }
    }
    onNPCClick() {
        var x = 0;
        //console.log(this.canFinishedTaskId);
        // if(this.canFinishedTaskId != null){
        //         if(this.NPCId == this.taskList[this.canFinishedTaskId].toNpcId && this.taskList[this.canFinishedTaskId].status == TaskStatus.DURING){
        //         DialoguePanel.getInstance().alpha = 0.8;
        //         DialoguePanel.getInstance().buttonTouchEnable(true);
        //         DialoguePanel.getInstance().setButtonBitmap("wancheng_png");
        //         DialoguePanel.getInstance().setIfAccept(false);
        //         DialoguePanel.getInstance().setDuringTaskId(this.canFinishedTaskId);
        //         DialoguePanel.getInstance().setDialogueText(this.dialogue);
        //         DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
        //         TaskService.getInstance().canFinish(this.canFinishedTaskId);
        //     }
        // }
        //if( this.canFinishedTaskId == null){
        //console.log("233NPC");
        for (var taskId in this.canSumbitTaskList) {
            if (this.NPCId == this.canSumbitTaskList[taskId].toNpcId && this.canSumbitTaskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                DialoguePanel.getInstance().alpha = 0.8;
                //console.log("Give me dialogue");
                // DialoguePanel.getInstance().buttonTouchEnable(true);
                DialoguePanel.getInstance().button.touchEnabled = true;
                DialoguePanel.getInstance().setButtonBitmap("wancheng.png");
                DialoguePanel.getInstance().setIfAccept(false);
                DialoguePanel.getInstance().setDuringTask(this.canSumbitTaskList[taskId]);
                //DialoguePanel.getInstance().setDuringTaskConditionType(this.canSumbitTaskList[taskId].conditionType);
                //DialoguePanel.getInstance().setDuringTaskCondition(this.taskList[taskId].getCondition());
                DialoguePanel.getInstance().setDialogueText(this.taskSubmitDialogue);
                DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang.png");
                TaskService.getInstance().canFinish(taskId);
                return;
            }
        }
        for (var taskId in this.taskList) {
            //console.log(taskId);
            if (this.NPCId == this.taskList[taskId].fromNpcId && this.taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                DialoguePanel.getInstance().alpha = 0.8;
                // DialoguePanel.getInstance().buttonTouchEnable(true);
                DialoguePanel.getInstance().button.touchEnabled = true;
                DialoguePanel.getInstance().setButtonBitmap("jieshou.png");
                DialoguePanel.getInstance().setIfAccept(true);
                DialoguePanel.getInstance().setDuringTask(this.taskList[taskId]);
                //DialoguePanel.getInstance().setDuringTaskConditionType(this.taskList[taskId].conditionType);
                //DialoguePanel.getInstance().setDuringTaskCondition(this.taskList[taskId].getCondition());
                DialoguePanel.getInstance().setDialogueText(this.taskAcceptDialogue);
                DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang.png");
                //TaskService.getInstance().canAccept(taskId);
                x++;
                break;
            }
            if (this.NPCId == this.taskList[taskId].toNpcId && this.taskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                DialoguePanel.getInstance().alpha = 0.8;
                //console.log("Give me dialogue");
                // DialoguePanel.getInstance().buttonTouchEnable(true);
                DialoguePanel.getInstance().button.touchEnabled = true;
                DialoguePanel.getInstance().setButtonBitmap("wancheng.png");
                DialoguePanel.getInstance().setIfAccept(false);
                DialoguePanel.getInstance().setDuringTask(this.taskList[taskId]);
                //DialoguePanel.getInstance().setDuringTaskConditionType(this.taskList[taskId].conditionType);
                //DialoguePanel.getInstance().setDuringTaskCondition(this.taskList[taskId].getCondition());
                DialoguePanel.getInstance().setDialogueText(this.taskSubmitDialogue);
                DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang.png");
                //TaskService.getInstance().canFinish(taskId);
                x++;
                break;
            }
            // }
        }
        if (x <= 0)
            TalkCommand.canFinish = true;
    }
    getNPC() {
        this.NPCBitmap.addEventListener(cadence.TouchEventsType.CLICK, () => {
            NPC.npcIsChoose = this;
        }, this);
    }
    createBitmapByName(name) {
        var result = new cadence.Bitmap();
        result.texture = cadence.RES.getRES(name, (value) => {
            console.log(value);
            result.texture = value;
        });
        return result;
    }
}
class DialoguePanel extends cadence.DisplayObjectContainer {
    constructor() {
        super();
        this.dialogue = [];
        this.ifAccept = false;
        this.width = 300;
        this.height = 300;
        this.touchEnabled = true;
        this.background = this.createBitmapByName("duihuakuang.png");
        this.addChild(this.background);
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = 300;
        this.background.height = 300;
        this.button = this.createBitmapByName("jieshou_gray.png");
        this.addChild(this.button);
        this.button.width = 100;
        this.button.height = 50;
        this.button.x = 100;
        this.button.y = 200;
        this.button.touchEnabled = false;
        this.textField = new cadence.TextField();
        this.addChild(this.textField);
        //this.textField.text = dialogue[0];
        //this.textField.text = "233"
        this.textField.width = 200;
        this.textField.x = 40;
        this.textField.y = 40;
        this.textField.size = 20;
        this.textField.textColor = "#ffffff";
        //this.alpha = 1;
        this.alpha = 0;
        this.onClick();
    }
    static getInstance() {
        if (DialoguePanel.instance == null) {
            DialoguePanel.instance = new DialoguePanel();
            //DialoguePanel.instance.alpha = 1;
        }
        return DialoguePanel.instance;
    }
    SetMain(main) {
        this._tmain = main;
    }
    setButtonBitmap(buttonBitmapCode) {
        this.button.texture = cadence.RES.getRES(buttonBitmapCode, (value) => {
            this.button.texture = value;
        });
        // console.log(texture);
        // console.log(this.button.texture);
    }
    setDuringTaskCondition(taskCondition) {
        this.duringTaskCondition = taskCondition;
    }
    setDialogueText(dialogue) {
        this.dialogue = [];
        for (var i = 0; i < dialogue.length; i++) {
            this.dialogue[i] = dialogue[i];
        }
        for (var j = 0; j < this.dialogue.length; j++) {
            this.textField.text = this.dialogue[j] + "\n";
        }
    }
    setIfAccept(b) {
        this.ifAccept = b;
        //console.log(this.ifAccept);
    }
    buttonTouchEnable(b) {
        this.button.touchEnabled = b;
    }
    setDuringTask(task) {
        this.duringTask = task;
    }
    setDuringTaskConditionType(taskConditionType) {
        this.duringTaskConditionType = taskConditionType;
    }
    setBackgroundBitmap(backgroundCode) {
        this.background.texture = cadence.RES.getRES("duihuakuang.png", (value) => {
            this.background.texture = value;
        });
    }
    onClick() {
        this.button.addEventListener(cadence.TouchEventsType.CLICK, () => {
            console.log("dialogue on click");
            if (this.ifAccept) {
                //TaskService.getInstance().accept(this.duringTask.id);
                this.duringTask.accept();
                this.button.touchEnabled = false;
                this.button.texture = cadence.RES.getRES("wancheng_gray.png", (value) => {
                    this.button.texture = value;
                });
                if (this.duringTask.conditionType == "npctalk") {
                    this.duringTask.updateProccess(1);
                    //TaskService.getInstance().canFinish(this.duringTask.id);
                    //this.duringTask.setCurrent(1);
                }
                //egret.Tween.get(this).to({alpha : 0},1000);
                this.alpha = 0;
                //console.log("1");
                TalkCommand.canFinish = true;
            }
            if (!this.ifAccept) {
                //TaskService.getInstance().finish(this.duringTask.id);
                this.duringTask.submit();
                this.button.texture = cadence.RES.getRES("jieshou_gray.png", (value) => {
                    this.button.texture = value;
                });
                //egret.Tween.get(this).to({alpha : 0},1000);
                this.alpha = 0;
                //console.log("2");
                TalkCommand.canFinish = true;
            }
        }, this);
    }
    createBitmapByName(name) {
        var result = new cadence.Bitmap();
        result.texture = cadence.RES.getRES(name, (value) => {
            result.texture = value;
        });
        return result;
    }
}
