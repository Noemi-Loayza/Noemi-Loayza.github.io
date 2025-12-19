const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        // Niebla suave color crema para fundir el fondo
        scene.fog = new THREE.FogExp2(0xF0EBE0, 0.035);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 6;
        camera.position.y = 0;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Mapeo de tonos para look cinemático
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // --- 2. MATERIALES (Estilo "Art Deco & Marble") ---
        
        // Mármol (Sculpture)
        const marbleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xfffaf0,
            roughness: 0.4,
            metalness: 0.1,
            clearcoat: 0.3,
            clearcoatRoughness: 0.2
        });

        // Oro (Art Deco)
        const goldMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xD4AF37,
            metalness: 1.0,
            roughness: 0.15,
            clearcoat: 1.0
        });

        // Lente de Cámara (Modern Tech)
        const lensMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.1, // Un poco de vidrio
            transparent: true
        });

        // --- 3. CREACIÓN DEL COLLAGE ABSTRACTO 3D ---
        const collageGroup = new THREE.Group();

        // Elemento A: La "Escultura" (Icosaedro deformado suave)
        const geometryA = new THREE.IcosahedronGeometry(1.2, 0);
        const meshA = new THREE.Mesh(geometryA, marbleMaterial);
        meshA.castShadow = true;
        meshA.receiveShadow = true;
        collageGroup.add(meshA);

        // Elemento B: El "Anillo de la Lente"
        const geometryB = new THREE.TorusGeometry(1.4, 0.05, 16, 100);
        const meshB = new THREE.Mesh(geometryB, goldMaterial);
        meshB.rotation.x = Math.PI / 2;
        meshB.rotation.y = 0.2;
        collageGroup.add(meshB);

        // Elemento C: "Lente Oscura" (Cilindro interno)
        const geometryC = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
        const meshC = new THREE.Mesh(geometryC, lensMaterial);
        meshC.rotation.z = Math.PI / 2;
        meshC.position.x = 0.5;
        collageGroup.add(meshC);

        // Elemento D: Detalles geométricos Art Deco (Esferas doradas flotantes)
        const sphereGeo = new THREE.SphereGeometry(0.1, 32, 32);
        const sphere1 = new THREE.Mesh(sphereGeo, goldMaterial);
        sphere1.position.set(-1.5, 0.5, 0.5);
        collageGroup.add(sphere1);

        const sphere2 = new THREE.Mesh(sphereGeo, goldMaterial);
        sphere2.position.set(1.2, -1, 0.2);
        collageGroup.add(sphere2);

        scene.add(collageGroup);

        // --- 4. PARTÍCULAS DE "POLVO DE ORO" ---
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 300;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.03,
            color: 0xD4AF37,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- 5. ILUMINACIÓN CINEMÁTICA ---
        
        // Luz ambiental suave (Warm tone)
        const ambientLight = new THREE.AmbientLight(0xffecd1, 0.5);
        scene.add(ambientLight);

        // Spotlight principal (Drama)
        const spotLight = new THREE.SpotLight(0xffffff, 2);
        spotLight.position.set(5, 8, 5);
        spotLight.angle = 0.4;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        spotLight.shadow.bias = -0.0001;
        scene.add(spotLight);

        // Luz de rebote dorada (Relleno)
        const pointLight = new THREE.PointLight(0xD4AF37, 1);
        pointLight.position.set(-5, -2, -5);
        scene.add(pointLight);

        // --- 6. ANIMACIÓN Y RENDER LOOP ---
        
        // Mouse interaction suave
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.001;
            mouseY = (event.clientY - windowHalfY) * 0.001;
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Rotación hipnótica del collage
            collageGroup.rotation.y += 0.003;
            collageGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;

            // Movimiento flotante
            collageGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

            // Interactividad del mouse (Smooth)
            targetX = mouseX * 2;
            targetY = mouseY * 2;
            
            collageGroup.rotation.y += 0.05 * (targetX - collageGroup.rotation.y);
            collageGroup.rotation.x += 0.05 * (targetY - collageGroup.rotation.x);

            // Animación de partículas (flotar suavemente)
            particlesMesh.rotation.y = -elapsedTime * 0.05;
            particlesMesh.position.y = -elapsedTime * 0.02;

            renderer.render(scene, camera);
        }

        animate();

        // --- 7. RESPONSIVIDAD ---
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
