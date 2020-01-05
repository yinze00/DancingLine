var cloud;
function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
        var texture = new THREE.TextureLoader().load("models/snow.jpg");
        //存放粒子数据的网格
        var geom = new THREE.Geometry();
        //样式化粒子的THREE.PointCloudMaterial材质
        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            vertexColors: vertexColors,
            sizeAttenuation: sizeAttenuation,
            color: color,
            map:texture,
            depthTest: false  //设置解决透明度有问题的情况
        });


        var range = 1200;
        for (var i = 0; i < 10000; i++) {
            //添加顶点的坐标
            var particle = new THREE.Vector3(cube_x + Math.random() * range - range / 2, Math.random() * range - range / 2, cube_z + Math.random() * range - range / 2);
            particle.velocityY = 0.1 + Math.random() / 5;
            particle.velocityX = (Math.random() - 0.5) / 3;
            geom.vertices.push(particle);
            var color = new THREE.Color(0xffffff);
            //.setHSL ( h, s, l ) h — 色调值在0.0和1.0之间 s — 饱和值在0.0和1.0之间 l — 亮度值在0.0和1.0之间。 使用HSL设置颜色。
            //随机当前每个粒子的亮度
            //color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
            geom.colors.push(color);
        }

        //生成模型，添加到场景当中
        cloud = new THREE.Points(geom, material);
        cloud.verticesNeedUpdate = true;

        scene.add(cloud);
    }