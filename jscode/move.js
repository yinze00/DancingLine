var cube_x = 0.5;
var cube_y = 0;
var cube_z = 0;
var Tree = new Array();
var TreeCount = 0;
var TreeSize = new Array();

function createTree(x,y,z){
    //tree
    var BasicTree;
    var Tree_mtlLoader = new THREE.MTLLoader();
    //mtlLoader.setPath('models/');
    //加载mtl文件
    Tree_mtlLoader.load('models/Tree1.mtl', function (Tree_materials) {
        var Tree_objLoader = new THREE.OBJLoader();
        Tree_objLoader.setMaterials(Tree_materials);
        Tree_objLoader.load("models/Tree1.obj",function (BasicTree) {
            BasicTree.scale.set(1, 1, 1);
            for(k in BasicTree.children){
                BasicTree.children[k].castShadow = true;
            }
            BasicTree.position.set(cube_x + x, cube_y + y, cube_z + z);
            scene.add(BasicTree);
            TreeSize[TreeCount] = 0;
            Tree[TreeCount++] = BasicTree;

        })
    });
}

function ChangeTree(){
    //tower
   for(var i = 0; i < TreeCount; i++){
     if(TreeSize[i] < 10){
        TreeSize[i]++;
        Tree[i].scale.set(0.15 * TreeSize[i],0.15 * TreeSize[i],0.15 * TreeSize[i]);
     }
   }
}

function CheckDiamond(cube){
    var point = cube.position.clone();
    for(var k = 0; k < DiamondCount; k++){
        if((Diamond[k].position.x - point.x < 1) && (Diamond[k].position.z - point.z < 1)){
            scene.remove(Diamond[k]);
            for(var i = k; i < DiamondCount; i++){
                Diamond[i] = Diamond[i+1];
            }
            DiamondCount--;
            if(move_dir == 0){
                createTree(8,0,0);
            }
            else if(move_dir == 1){
                createTree(0,0,8);
            }
            break;
        }
    }
}

 function CheckCrown(cube){
    var point = cube.position.clone();
    
        if((Crown[0].position.x - point.x < 1) && (Crown[0].position.z - point.z < 1)){
            scene.remove(Crown[0]);
            move_dir = 4;
            alert("done");
        }
}

function draw_cube(){
    var cubeGeometry = new THREE.BoxGeometry(1,1,1);

    var cubeMaterial = new THREE.MeshLambertMaterial({color:0x5C3A21});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
     
    //设置cube的位置 
    cube.position.x= cube_x;
    cube.position.y = cube_y;
    cube.position.z= cube_z;
    cube.castShadow = true;
    //cube添加到场景中

     scene.add(cube);
    var originPoint1 = cube.position.clone();
    var originPoint2 = cube.position.clone();
    var directionVector = cube.position.clone();
        if(move_dir == 0){
            originPoint1.x = cube.position.x- 0.5;
            originPoint2.x = cube.position.x + 0.5;
            directionVector.x = 0;
            directionVector.y = 0;
            directionVector.z = 1;
        }
        else if(move_dir == 1){
            originPoint1.z = cube.position.z- 0.5;
            originPoint2.z = cube.position.z + 0.5;
            directionVector.x = 1;
            directionVector.y = 0;
            directionVector.z = 0;
        }
        var ray = new THREE.Raycaster(originPoint1,directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()/2){
            move_dir = 3;
            closePlay();
            return;
            //break;
        }
        ray = new THREE.Raycaster(originPoint2,directionVector.clone().normalize() );
        collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()/2){
            move_dir = 3;
            closePlay();
            return;
            //break;
        }
    CheckDiamond(cube);
    CheckCrown(cube);
   
}