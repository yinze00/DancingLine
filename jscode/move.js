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
        if(((Diamond[k].position.x - point.x) < 1) && ((Diamond[k].position.z - point.z) < 1) && ((Diamond[k].position.z - point.z) > -1) && ((Diamond[k].position.x - point.x) > -1)){
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
            alert("Congratulations!");
        }
}

function draw_cube(){
    var cube = new Array();
    var cubeGeometry = new THREE.BoxGeometry(1,1,1);
    var count = 0;
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0x5C3A21});
    cube[count++] = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube[0].position.x= cube_x;
    cube[0].position.y = cube_y;
    cube[0].position.z= cube_z; 
    var first = false;//第一个方块碰撞是否检测
    //设置cube的位置 
    if(move_dir == 0){
        cube[0].position.z= old_pos;
        while(cube[count - 1].position.z < cube_z){
            cube[count] = new THREE.Mesh(cubeGeometry,cubeMaterial);
            cube[count].position.x= cube_x;
            cube[count].position.y = cube_y;
            if(cube[count - 1].position.z + 1 <= cube_z){
                cube[count].position.z = cube[count - 1].position.z + 1;
            }
            else{
                cube[count].position.z = cube_z;
            }
            cube[count].castShadow = true;
            scene.add(cube[count]);
            var originPoint1 = cube[count].position.clone();
            var originPoint2 = cube[count].position.clone();
            var directionVector = cube[count].position.clone();
                originPoint1.x = cube[count].position.x- 0.5;
                originPoint2.x = cube[count].position.x + 0.5;
                directionVector.x = 0;
                directionVector.y = 0;
                directionVector.z = 1;
            var ray = new THREE.Raycaster(originPoint1,directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 0.05){
                move_dir = 3;
                closePlay();
                return;
            }
            ray = new THREE.Raycaster(originPoint2,directionVector.clone().normalize() );
            collisionResults = ray.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 0.05){
                move_dir = 3;
                closePlay();
                return;
            }
            CheckDiamond(cube[count]);
            CheckCrown(cube[count]); 
            count++;
        }
    }
    else if(move_dir == 1){
        cube[0].position.x= old_pos; 
        while(cube[count - 1].position.x < cube_x){
            cube[count] = new THREE.Mesh(cubeGeometry,cubeMaterial);
            cube[count].position.z= cube_z;
            cube[count].position.y = cube_y;
            if(cube[count - 1].position.x + 1 <= cube_x){
                cube[count].position.x = cube[count - 1].position.x + 1;
            }
            else{
                cube[count].position.x = cube_x;
            }
            cube[count].castShadow = true;
            scene.add(cube[count]);
            var originPoint1 = cube[count].position.clone();
            var originPoint2 = cube[count].position.clone();
            var directionVector = cube[count].position.clone();
                originPoint1.x = cube[count].position.x- 0.5;
                originPoint2.x = cube[count].position.x + 0.5;
                directionVector.x = 1;
                directionVector.y = 0;
                directionVector.z = 0;
            var ray = new THREE.Raycaster(originPoint1,directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()/2 + 0.05){
                move_dir = 3;
                closePlay();
                return;
            }
            ray = new THREE.Raycaster(originPoint2,directionVector.clone().normalize() );
            collisionResults = ray.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()/2 + 0.05){
                move_dir = 3;
                closePlay();
                return;
            }
            CheckDiamond(cube[count]);
            CheckCrown(cube[count]);  
            count++;
        }
    }
        
}