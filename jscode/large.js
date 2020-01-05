var renderer;
var camera_height = 20;
var camera_disZ = 10;
var camera_disX = -20;
function initRender() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //告诉渲染器需要阴影效果
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0xffffff);
    document.body.appendChild(renderer.domElement);
}

var collidableMeshList = [];

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(camera_disX, camera_height, -camera_disZ);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var scene;
function initScene() {
    scene = new THREE.Scene();
}

//初始化dat.GUI简化试验流程
var gui;
function initGui() {
    //声明一个保存需求修改的相关数据的对象
    gui = {
    };
    var datGui = new dat.GUI();
    //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
}

var light;
function initLight() {
    scene.add(new THREE.AmbientLight(0x444444));

    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 100, 100);

    //告诉平行光需要开启阴影投射
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);
}
var Crown = new Array();

function initModel() {

    //辅助工具
    var helper = new THREE.AxesHelper(50);
    scene.add(helper);

    var land_material = new THREE.MeshLambertMaterial({ color: 0x5C3A21 });
    var land_objLoader = new THREE.OBJLoader();
    land_objLoader.load("models/land.obj", function (land) {
        land.children.forEach(function (child) {
            child.material = land_material;
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();
        });
        land.scale.set(1, 1, 1);
        land.rotateY(Math.PI / 2);
        scene.add(land);

    });

    var wall_mtlLoader = new THREE.MTLLoader();
    //mtlLoader.setPath('models/');
    //加载mtl文件
    wall_mtlLoader.load('models/doubleroad.mtl', function (wall_materials) {
        var wall_objLoader = new THREE.OBJLoader();
        wall_objLoader.setMaterials(wall_materials);
        wall_objLoader.load("models/doubleroad.obj", function (wall) {
            wall.scale.set(1, 1, 1);
            wall.rotateY(Math.PI / 2);
            for (k in wall.children) {
                wall.children[k].castShadow = true;
                collidableMeshList.push(wall.children[k]);
            }
            scene.add(wall);

        })
    });

    var author_mtlloader = new THREE.MTLLoader();
    author_mtlloader.load('models/author.mtl', function (author) {
        var author_objloader = new THREE.OBJLoader();  
        author_objloader.setMaterials(author);
        author_objloader.load('models/author.obj', function (au) {
            au.scale.set(1, 1, 1);
            au.rotateY(-Math.PI / 2);
            au.position.set(0.0, 0.0, -12.0);
            for (k in au.children) {
                au.children[k].castShadow = false;
            }
            scene.add(au)
        })
    })

    var crown;
    var crown_objLoader = new THREE.OBJLoader();
    var crown_material = new THREE.MeshLambertMaterial({color: 0xffff00});
    crown_objLoader.load("models/crown.obj",function (crown) {
            crown.children.forEach(function (child) {
                child.material = crown_material;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });

            crown.scale.set(0.01, 0.01, 0.01);
             
            for(k in crown.children){
                crown.children[k].castShadow = true;
            }

            crown.position.set(152,0,175);
            scene.add(crown);
            Crown[0] = crown;
  
    });
 }

//初始化性能插件
var stats;
function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls;
function initControls() {

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = false;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = false;
    //是否自动旋转
    controls.autoRotate = false;
    //设置相机距离原点的最远距离
    //controls.minDistance  = 1;
    //设置相机距离原点的最远距离
    //controls.maxDistance  = 200;
    //是否开启右键拖拽
    controls.enablePan = true;
}

function render() {
    var vertices = cloud.geometry.vertices;
    vertices.forEach(function (v) {

        v.y = v.y - (v.velocityY);
        v.x = v.x - (v.velocityX) * .5;

        if (v.y <= -60) v.y = 60;
        if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
    });

    //设置实时更新网格的顶点信息
    cloud.geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
}


//窗口变动触发的函数
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    render();
    renderer.setSize(window.innerWidth, window.innerHeight);

}


function capture() {
    var image = new Image();
    renderer.render(scene, camera);//此处renderer为three.js里的渲染器，scene为场景 camera为相机

    let imgData = renderer.domElement.toDataURL("image/jpeg");//这里可以选择png格式jpeg格式
    image.src = imgData;
    document.body.appendChild(image);//这样就可以查看截出来的图片了
}

var move_dir = 2;
var posX_cam = camera_disX;
var posZ_cam = -camera_disZ;
function setKeyEvents() {
    window.addEventListener('keydown', function (e) {
        if (event.keyCode == 32) {
            if (move_dir == 2) {
                move_dir = 0;
                autoPlay();
            }
            else if (move_dir == 0)
                move_dir = 1;
            else if (move_dir == 1)
                move_dir = 0;
        }
        if (event.keyCode == 80) {
            capture();
            alert("Mouse Down and you'll see the Pic you've just captured!");
        }
    });
}

function initPlane() {
    //创建一个平面几何体作为投影面
    var planeGeometry = new THREE.PlaneGeometry(400, 400);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // 设置接收阴影的投影面
    plane.rotateX(-Math.PI / 2); //旋转网格模型
    plane.position.y = -0.6; //设置网格模型y坐标
    //plane.material.side = THREE.DoubleSide;
    plane.receiveShadow = true;
    scene.add(plane); //网格模型添加到场景中

}

function animate() {
    if (move_dir == 0) {

        cube_z += 0.4;
        posZ_cam = camera.position.z + 0.4;
        draw_cube();
        /*while(move_dir == 3)
            ;*/
        camera.position.set(posX_cam, camera_height, posZ_cam);
        camera.lookAt(new THREE.Vector3(posX_cam - camera_disX, 0, posZ_cam + camera_disZ));
        ChangeTree();
    }
    else if (move_dir == 1) {

        cube_x += 0.4;
        posX_cam = camera.position.x + 0.4;
        draw_cube();
        /*while(move_dir == 3)
            ;*/
        camera.position.set(posX_cam, camera_height, posZ_cam);
        camera.lookAt(new THREE.Vector3(posX_cam - camera_disX, 0, posZ_cam + camera_disZ));
        ChangeTree();
    }
    else {
        camera.position.set(posX_cam, camera_height, posZ_cam);
        camera.lookAt(new THREE.Vector3(posX_cam - camera_disX, 0, posZ_cam + camera_disZ));
    }
    //更新控制器
    renderer.clear();
    //controls.update();
    render();
    //renderer.clear();
    //更新性能插件
    stats.update();

    requestAnimationFrame(animate);
}

var Diamond = new Array();
var DiamondCount = 5;
var Pos_diamond = [[0,5],[19,26],[48,61],[71,86],[91,113]];
function createDiamond(x, z, i) {
    var diamond;
    var Diamond_objLoader = new THREE.OBJLoader();
    var diamond_material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    Diamond_objLoader.load("models/diamond.obj", function (diamond) {
        diamond.scale.set(0.01, 0.01, 0.01);
        diamond.children.forEach(function (child) {
            child.material = diamond_material;
            child.geometry.computeFaceNormals();
            child.geometry.computeVertexNormals();
        });
        for (k in diamond.children) {
            diamond.children[k].castShadow = true;
        }
        diamond.position.set(Pos_diamond[i][0], 0, Pos_diamond[i][1]);
        scene.add(diamond);
        Diamond[i] = diamond;
    });
}
// 更新div的位置
function addDiv(divid,htmlstr,position) {
    var addDivDom = document.createElement('div');
    div1 = addDivDom;
    var bodyDom = document.body;
    bodyDom.insertBefore(addDivDom, bodyDom.lastChild);
    addDivDom.classList = 'tap';
    addDivDom.innerHTML = htmlstr;
    addDivDom.id = divid;
    var screenPosition;
    screenPosition=docCoord2Screen(position.x,position.y,0);
    var worldPosition=screenCoord2World(screenPosition.x,screenPosition.y);//屏幕坐标转为世界坐标
    addDivDom.style.top = screenPosition.y + 'px';//y
    addDivDom.style.left = screenPosition.x + 'px';//x
    var divStr={"id":divid,"position":worldPosition}//存入divid与div的世界坐标
    divList.push(divStr);
}
//世界坐标转屏幕坐标
function worldToScreenPosition (divWorldPosition) {//divWorldPosition
    if(divWorldPosition==null||divWorldPosition==undefined||divWorldPosition==''){
      divWorldPosition={x:0, y: 0, z:0};
    };
      var camera=getCamera();
      var world_vector = new THREE.Vector3(divWorldPosition.x, divWorldPosition.y, divWorldPosition.z);//世界坐标系 必须根据世界坐标系计算
      let vector = world_vector.project(camera);
      // console.log("vector",vector)
      var halfWidth = window.innerWidth / 2;
      var  halfHeight = window.innerHeight / 2;
      return {
          x: Math.round(vector.x * halfWidth + halfWidth),
          y: Math.round(-vector.y * halfHeight + halfHeight)
      };
}

function initdiv(){
    
}

function draw() {
    initGui();
    initRender();
    initScene();
    initCamera();
    initLight();
    initPlane();
    initModel();

    //initDiamond();
    var diamond_count = 0;
    for (; diamond_count < DiamondCount; diamond_count++) {
        createDiamond(Pos_diamond[diamond_count][0], Pos_diamond[diamond_count][1], diamond_count);
    }
    initMusic();
    createParticles(4, true, 0.6, true, false, 0xffffff);
    initControls();
    initStats();
    setKeyEvents();//定义键盘按键事件 
    animate();
    window.onresize = onWindowResize;
}