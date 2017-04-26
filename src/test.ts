var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = cadence.run(canvas);
var touchService = cadence.TouchEventService.getInstance();
// var bitmap = new cadence.Bitmap();
// cadence.RES.getRes("0008.png").then((value) => {
//     bitmap.texture = value;
//     bitmap.setWidth(bitmap.texture.width);
//     bitmap.setHeight(bitmap.texture.height);
// });
// stage.addChild(bitmap);
// let speed = 190;

// cadence.Ticker.getInstance().register((deltaTime) => {
//     //console.log("aaa");
//     bitmap.setWidth(500);
// });


var main = new Main(stage,touchService);
cadence.setMain(main);


// cadence.RES.getRES("RES.json",(data) => {
//     var preloadJson = data;
//     cadence.RES.loadConfig(preloadJson, () => {
//         console.log("load complete!!!");
//         var main = new Main(stage,touchService);
//         main.createGameScene();
//     });
// });


