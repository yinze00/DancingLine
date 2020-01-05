    var renderer;
    var camera_height = 25;
    var camera_disZ = 20;
    var camera_disX = 20;
    function initRender() {

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        //告诉渲染器需要阴影效果
        renderer.shadowMap.enabled = true;
        renderer.setClearColor(0xffffff);
        document.body.appendChild(renderer.domElement);
    }

    
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
        camera.position.set(camera_disX , camera_height, -camera_disZ);
        camera.lookAt(new THREE.Vector3(0,0,0));
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
        light.position.set(0,100,100);
        //告诉平行光需要开启阴影投射
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        scene.add(light);
    }


    var DiamondList = [];
var collidableMeshList = [];

function initModel() {

        //辅助工具
        var helper = new THREE.AxesHelper(50);
        scene.add(helper);

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('models/map03.mtl', function (materials) {
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load("models/map03.obj",function (object) {
                
                object.scale.set(1, 1, 1);
                object.rotateY(Math.PI);
                object.rotateZ(Math.PI);
                object.position.set(-3,0,0);
                for(k in object.children){
                    object.children[k].castShadow = true;
                    collidableMeshList.push(object.children[k]);
                    //object.children[k].receiveShadow = true;
                }
                scene.add(object);

            })
        });
        draw_cube();
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
        controls = new THREE.OrbitControls( camera, renderer.domElement );
        // 如果使用animate方法时，将此函数删除
        //controls.addEventListener( 'change', render );
        // 使动画循环使用时阻尼或自转 意思是否有惯性
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = false;
        controls.enablePan = true;
    }

    function render() {
        var vertices = cloud.geometry.vertices;
        vertices.forEach(function (v) {

            v.y = v.y - (v.velocityY);
            v.x = v.x - (v.velocityX)*.5;

            if (v.y <= -60) v.y = 60;
            if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
        });

        //设置实时更新网格的顶点信息
        cloud.geometry.verticesNeedUpdate = true;

        renderer.render( scene, camera );
    }

    //窗口变动触发的函数
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    var move_dir = 2;
    var posX_cam = camera_disX ;
    var posZ_cam = -camera_disZ ;
    function setKeyEvents(){
        window.addEventListener('keydown',function(e){
        if(event.keyCode == 32){
　　　　　　 if(move_dir == 2) {
                move_dir = 0;
                myAuto.play();
            }
            else if(move_dir == 0) 
                move_dir = 1;
            else if ( move_dir == 1) 
                move_dir = 0;
　　　　}
        }); 
    }

    var time_last = Date.now();
    var time_now;
    var step = 2;
    function animate() {
        time_now = Date.now();
        if(move_dir == 2){
            time_last = time_now;
        }
        else if(move_dir == 0){
            
            cube_z +=step * (time_now - time_last)/1000;
            posZ_cam = camera.position.z + step * (time_now - time_last)/1000;
            draw_cube();
            time_last = time_now;
            /*cube_z +=step;
            posZ_cam = camera.position.z + step;*/
            camera.position.set(posX_cam, camera_height, posZ_cam);
            camera.lookAt(new THREE.Vector3(posX_cam - camera_disX ,0,posZ_cam + camera_disZ));
        }
        else if(move_dir == 1){
            
            cube_x +=step * (time_now - time_last)/1000;
            posX_cam = camera.position.x + step * (time_now - time_last)/1000;
            draw_cube();
            time_last = time_now;
            /*cube_x +=step;
            posX_cam = camera.position.x + step;*/
            camera.position.set(posX_cam, camera_height, posZ_cam);
            camera.lookAt(new THREE.Vector3(posX_cam - camera_disX ,0,posZ_cam + camera_disZ));
        }
        else{
            camera.position.set(posX_cam, camera_height, posZ_cam);
            camera.lookAt(new THREE.Vector3(posX_cam - camera_disX ,0,posZ_cam + camera_disZ));
        }
        //更新控制器
        renderer.clear();
        render();

                //更新性能插件
        stats.update();

        controls.update();
        
        requestAnimationFrame(animate);
    }

    function initPlane(){
        //创建一个平面几何体作为投影面
        var planeGeometry = new THREE.PlaneGeometry(400, 400);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        // 设置接收阴影的投影面
        plane.rotateX(-Math.PI / 2); //旋转网格模型
        plane.position.y = -0.6; //设置网格模型y坐标
        //plane.material.side = THREE.DoubleSide;
        plane.receiveShadow = true;
        scene.add(plane); //网格模型添加到场景中
        
    }
var Diamond = new Array();
    var DiamondCount;
    function initDiamond(){
        DiamondCount = 0;
        var diamondGeometry = new THREE.BoxGeometry(1.5,1.5,1.5);

        var diamondMaterial = new THREE.MeshLambertMaterial({color:0x007fff});
        var diamond = new THREE.Mesh(diamondGeometry,diamondMaterial);
         
        //设置diamond的位置 
        diamond.position.x= 0;
        diamond.position.y = 0;
        diamond.position.z= 3;
        diamond.castShadow = true;
        scene.add(diamond);
        Diamond[DiamondCount++] = diamond;
        DiamondList.push(diamond);
    }

    function draw() {
        initGui();
        initRender();
        initScene();
        initCamera();
        initLight();
        initPlane();
        initModel();
        initDiamond();
        initMusic() ;
        initControls();
        initStats();
        createParticles(1, true, 0.6, true, true, 0xffffff);
        setKeyEvents();//定义键盘按键事件 
        animate();
        window.onresize = onWindowResize;
    }