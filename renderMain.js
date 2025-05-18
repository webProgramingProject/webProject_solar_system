

            var cube_vertex = [
                -1 , -1 , -1 , 1,
                -1 , -1 ,  1 , 1,
                -1 ,  1 , -1 , 1,
                -1 ,  1 ,  1 , 1,
    
                 1 , -1 , -1 , 1,
                 1 , -1 ,  1 , 1,
                 1 ,  1 , -1 , 1,
                 1 ,  1 ,  1 , 1
            ];
    
            var cube_inidces = [
                //p1 , p2 , p3
                //bottom
                0,4,5,  // 0 1 2
                1,0,5,  // 3 4 5
    
                //back
                1,5,7,	// 6 7 8
                3,1,7,	// 9 10 11
    
                //top
                3,7,6,	//12 13 14
                2,3,6,	//15 16 17
    
                //front
                2,6,4,	//18 19 20
                0,2,4,	//21 22 23
    
                //left
                0,1,3,	//24 25 26
                2,0,3,	//27 28 29
    
                //right
                5,4,6,	//30 31 32
                7,5,6	//33 34 35
            ]
    
    
            function requestCORSIfNotSameOrigin(img, url) {
                if ((new URL(url, window.location.href)).origin !== window.location.origin) {
                img.crossOrigin = "";
            }
            }
    
    
    
            function loadImageAndCreateTextureInfo(gl,url) {
                var tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
               
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                          new Uint8Array([0, 0, 255, 255]));
                
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                
                var textureInfo = {
                    width: 1,  
                    height: 1,
                    texture: tex,
                };
                var img = new Image();
                img.addEventListener('load', function() {
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                
                gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                });
                requestCORSIfNotSameOrigin(img, url);
                img.src = url;
            
                return textureInfo;
            }
            var program;//나중에 class 문으로 해결 
          
            function initGLSL(gl  ,vertexShaderSrcId , fragmentShaderSrcId)
            {
            
                var vertexShaderSource =  document.querySelector(vertexShaderSrcId).text;
                var fragmentShaderSource = document.querySelector(fragmentShaderSrcId).text;
    
                var vertexShader = createShader(gl , gl.VERTEX_SHADER , vertexShaderSource);
                var fragmentShader = createShader(gl ,gl.FRAGMENT_SHADER , fragmentShaderSource);
                program = createProgram(gl , vertexShader , fragmentShader);
                gl.useProgram(program);
    
            }
            
                  
            var plnaet_seletion = 0;
            var planet_change_init = 1;
            function change_planet_selection(num) 
            {
                planet_change_init = 1;
                plnaet_seletion = num;
            }
      
            function main()
            {
        
    
            var canvas = document.querySelector("#c");
            var render_scale = 1.5;
            canvas.setAttribute("width", window.innerWidth * render_scale);
            canvas.setAttribute("height", window.innerHeight * render_scale);

            var gl = canvas.getContext("webgl");

            const cam_object = new view_cam();
            var canvas_start_point_v2f = [0 , 0];
            var canvas_cur_point_v2f = [0 , 0];
            var mouse_down = 0;
            canvas.addEventListener("mousedown", function(p){
                mouse_down = 1;
                canvas_start_point_v2f[0] = p.offsetX;
                canvas_start_point_v2f[1] = p.offsetY;
                 
            });
            
            canvas.addEventListener("mousemove", function(p){ 
                if(mouse_down)
                {
                    canvas_cur_point_v2f[0] = p.offsetX;
                    canvas_cur_point_v2f[1] = p.offsetY;
                    mouse_cam_trackball(cam_object , canvas , canvas_start_point_v2f ,canvas_cur_point_v2f );
                    
                   
                }
                
            });
            canvas.addEventListener("mouseup", function(p){
                canvas_cur_point_v2f[0] = p.offsetX;
                canvas_cur_point_v2f[1] = p.offsetY;
                mouse_cam_trackball(cam_object , canvas , canvas_start_point_v2f ,canvas_cur_point_v2f );
                mouse_down = 0;
            });





            touche_zoom_start = 0.0;
            touche_down = 0;

            canvas.addEventListener("touchstart", function(p){
               
                touche_down = 1;
                p.preventDefault(); // 기본 동작 방지
               
                if(p.touches.length == 1)
                {
                    const x = p.touches[0].clientX - canvas.offsetLeft;
                    const y = p.touches[0].clientY - canvas.offsetTop;
                    canvas_start_point_v2f[0] = x;
                    canvas_start_point_v2f[1] = y;
                }
                else if(p.touches.length == 2)
                {
                    dx = (p.touches[0].clientX -  p.touches[1].clientX);
					dy = (p.touches[0].clientY -  p.touches[1].clientY);
                    touche_zoom_start = (dx * dx + dy * dy);
                }
                
            });
            canvas.addEventListener("touchmove", function(p){ 
                if(touche_down)
                {
                    p.preventDefault(); // 기본 동작 방지
                    if(p.touches.length == 1)
                    {
                        const x = p.touches[0].clientX - canvas.offsetLeft;
                        const y = p.touches[0].clientY - canvas.offsetTop;
                        canvas_cur_point_v2f[0] = x;
                        canvas_cur_point_v2f[1] = y;
                        mouse_cam_trackball(cam_object , canvas , canvas_start_point_v2f ,canvas_cur_point_v2f );
                    }
                    else if(p.touches.length == 2)
                    {
                     
                        dx = (p.touches[0].clientX -  p.touches[1].clientX);
						dy = (p.touches[0].clientY -  p.touches[1].clientY);

                        touche_zoom_cur = (dx * dx + dy * dy);
                        var len_1f_scale = lenght_v4_xyz(cam_object.pos_v4f);
                        cam_object.pos_v4f = sub_v4v4_xyz( cam_object.pos_v4f ,  cam_object.at_v4f);
                        var len_1f = lenght_v4_xyz(cam_object.pos_v4f);
                
                        if((touche_zoom_cur - touche_zoom_start) > 0 && len_1f > scroll_min)
                        {

                             cam_object.pos_v4f = [
                                 cam_object.pos_v4f[0]*(1 - 1/(len_1f_scale)),
                                 cam_object.pos_v4f[1]*(1 - 1/(len_1f_scale)),
                                 cam_object.pos_v4f[2]*(1 - 1/(len_1f_scale)),
                                 1.0
                             ];

                        }
                        else if((touche_zoom_cur - touche_zoom_start) < 0 && len_1f < scroll_max - 1)
                        {
                              cam_object.pos_v4f = [
                                 cam_object.pos_v4f[0]*(1 + 1/(len_1f_scale)),
                                 cam_object.pos_v4f[1]*(1 + 1/(len_1f_scale)),
                                 cam_object.pos_v4f[2]*(1 + 1/(len_1f_scale)),
                                 1.0
                             ];

                        }
                        cam_object.pos_v4f = add_v4v4_xyz( cam_object.pos_v4f ,  cam_object.at_v4f);

                        touche_zoom_start = touche_zoom_cur;
                    }
                }
                
            });

            canvas.addEventListener("touchend", function(p){
                touche_zoom_start = 0;
                touche_down = 0;
            });


            scroll_min = 40.0;
            scroll_max = 250.0;
            canvas.addEventListener("wheel", function(p){
                p.preventDefault(); // 기본 동작 방지

                
                var len_1f_scale = lenght_v4_xyz(cam_object.pos_v4f);
                cam_object.pos_v4f = sub_v4v4_xyz( cam_object.pos_v4f ,  cam_object.at_v4f);
                var len_1f = lenght_v4_xyz(cam_object.pos_v4f);
                
               if(p.deltaY > 0 && len_1f > scroll_min)
               {
                    
                    cam_object.pos_v4f = [
                        cam_object.pos_v4f[0]*(1 - 1/(len_1f_scale)),
                        cam_object.pos_v4f[1]*(1 - 1/(len_1f_scale)),
                        cam_object.pos_v4f[2]*(1 - 1/(len_1f_scale)),
                        1.0
                    ];
                    
               }
               else if(p.deltaY < 0 && len_1f < scroll_max - 1)
               {
                     cam_object.pos_v4f = [
                        cam_object.pos_v4f[0]*(1 + 1/(len_1f_scale)),
                        cam_object.pos_v4f[1]*(1 + 1/(len_1f_scale)),
                        cam_object.pos_v4f[2]*(1 + 1/(len_1f_scale)),
                        1.0
                    ];
                    
               }
               cam_object.pos_v4f = add_v4v4_xyz( cam_object.pos_v4f ,  cam_object.at_v4f);
            });


           

            console.log(canvas.width);
            console.log(canvas.height);

            initGLSL(gl,"#vertex-shader","#fragment-shader");
    
            var w = canvas.width;
            var aPos_loc_v4f = gl.getAttribLocation(program , "a_position_v4");
            var aTex_loc_v2f = gl.getAttribLocation(program , "a_tex_coord_v2");
            var u_trans_loc_m4f = gl.getUniformLocation(program, "u_translate_m4")
            var u_rotate_loc_m4f = gl.getUniformLocation(program , "u_rotate_m4");
            var u_scale_loc_m4f = gl.getUniformLocation(program , "u_scale_m4");
    
            var u_view_loc_m4f = gl.getUniformLocation(program , "u_view_m4");
            var u_proj_loc_m4f = gl.getUniformLocation(program , "u_proj_m4");
            var u_cam_pos_loc_v4f = gl.getUniformLocation(program , "u_cam_pos_v4");
            gl.enableVertexAttribArray(aPos_loc_v4f);
            gl.enableVertexAttribArray(aTex_loc_v2f);
    
            var cube = [];
            for(var i = 0; i < 144; i+= 4)
            {
                cube[i] = cube_vertex[cube_inidces[i/4]*4 + 0];
                cube[i+1] = cube_vertex[cube_inidces[i/4]*4 + 1];
                cube[i+2] = cube_vertex[cube_inidces[i/4]*4 + 2];
                cube[i+3] = cube_vertex[cube_inidces[i/4]*4 + 3];
            }
            var sphere_object = new sphere();  // origin_sphere
            sphere_object.gen_sphere(4 ,cube , 144);
          
    
    
    
           
            var planets_distance = [0.39, 0.72 , 1.0 , 1.52  , 5.2 , 12, 19.2 , 30.5];//태양으로 부터의 거리 AU
            var size = [0.4 , 0.9 , 1.0 , 0.5 , 11.2 , 9.4 , 4.0 , 3.9]; // 지구와의 크기 비 태양: 109
    
            var planets_rot = [0.01694 , 0.00411 , 1 , 0.975 , 2.4, 2.24 , 1.411 , 1.5]; // 행성자전 주기
            var planet_orbit = [2.073 , 1.502 ,  1 , 0.531 , 1/12 * 5 , 1/29.5 * 10 , 1/84 * 20 , 1/165 * 30]
    
    
            var planet = [];
            var center_planet = init_sphere(gl ,sphere_object , "https://raw.githubusercontent.com/m98541/web1/refs/heads/main/sun.jpg");
             
             
            center_planet.material.ambient_v4f = [1.0 , 1.0 , 1.0 , 1.0];
            center_planet.material.diffuse_v4f = [1.0 , 1.0 , 1.0 , 1.0];
            center_planet.material.luminary_1i = 1;



            var sun =   init_sphere(gl ,sphere_object , "https://raw.githubusercontent.com/m98541/web1/refs/heads/main/sun.jpg");
            planet[0] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_0.jpg");
            planet[1] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_1.jpg");
            planet[2] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_2_N.jpg");
            planet[2].material.n_mode_1i = 1;
            planet[3] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_3.jpg");
            planet[4] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_4.jpg");
            planet[5] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_5.jpg");
            planet[6] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_6.jpg");
            planet[7] = init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/planet_7.jpg");
            
            var disk =  init_sphere(gl , sphere_object , "https://raw.githubusercontent.com/webProgramingProject/webProject_solar_system/refs/heads/graphic/fake_disk.png");
            
            sun.scale_v4f = [ 109/4, 109/4, 109/4, 1];
            
            sun.material.glUniformMaterialLocation(gl,program,"u_material_13f");
            center_planet.material.glUniformMaterialLocation(gl,program,"u_material_13f");
           
             
            for(var i = 0; i < 8; i++)
            {
                planet[i].material.glUniformMaterialLocation(gl,program,"u_material_13f");
                planet[i].pos_v4f = [109/2 + planets_distance[i]*50 , 0 , 0 , 1];
                
                planet[i].scale_v4f = [0.9 +  size[i]*0.9 ,0.9 + size[i]*0.9  , 0.9 + size[i]*0.9 , 1];
    
                var init_pos = (PI / 180) * Math.random()*360;
                x =  planet[i].pos_v4f[0] * Math.cos(init_pos) -   planet[i].pos_v4f[2] * Math.sin(init_pos); 
                y =  planet[i].pos_v4f[0] * Math.sin(init_pos) +   planet[i].pos_v4f[2] * Math.cos(init_pos); 
                planet[i].pos_v4f[0]  = x;
                planet[i].pos_v4f[2]  = y;
    
            }
           

            disk.material.glUniformMaterialLocation(gl,program,"u_material_13f");
            disk.material.rim_color_v4f = [0.0 , 0.0 , 0.0 ,0.0];
            disk.pos_v4f = planet[5].pos_v4f;
            disk.scale_v4f =  [planet[5].scale_v4f[0]*2, 10 ,  planet[5].scale_v4f[2]*2];
           
            center_planet.pos_v4f = sun.pos_v4f;
            center_planet.scale_v4f = sun.scale_v4f;
            //0 all solar system 1 sun 2....
           
            var view_cam_radius = 500;
       
            select_planet_cam(plnaet_seletion);
               
        
            function select_planet_cam(num)
            {
                plnaet_seletion = num;
                
                if(planet_change_init)
                {
                    if(num >= 2 && num <= 9)
                    {
                        pos_len =  lenght_v4_xyz(cam_object.pos_v4f);
                       
                        cam_object.at_v4f = planet[num - 2].pos_v4f;
                        planet_radius = lenght_v4_xyz(cam_object.at_v4f);
                        cam_object.pos_v4f = [
                            planet[num - 2].pos_v4f[0] +  cam_object.pos_v4f[0]/pos_len *  planet[num - 2].scale_v4f[0] * 3, 
                            planet[num - 2].pos_v4f[1] +  cam_object.pos_v4f[1]/pos_len *  planet[num - 2].scale_v4f[1] * 3,
                            planet[num - 2].pos_v4f[2] +  cam_object.pos_v4f[2]/pos_len *  planet[num - 2].scale_v4f[2] * 3,
                            1.0
                        ];

                        scroll_min = planet[num - 2].scale_v4f[0] * 2;
                        scroll_max = planet_radius - 25;
                       
                    }
                    else
                    {
                         cam_object.at_v4f  = [0 , 0 , 0 , 1.0];
                         cam_object.pos_v4f = [
                            0,
                            0,
                            150,
                            1.0
                        ];

                        scroll_min = 40.0;
                        scroll_max = 500.0;
                    }
                    planet_change_init = 0;
                }


                 if(num >= 2 && num <= 9)
                    {
                        cam_object.at_v4f = planet[num - 2].pos_v4f;
                      
                        cam_object.pos_v4f = [
                            cam_object.pos_v4f[0] * Math.cos(planet_orbit[num - 2] * earth_orbit) -  cam_object.pos_v4f[2] * Math.sin(planet_orbit[ num - 2 ]* earth_orbit),
                            cam_object.pos_v4f[1],
                            cam_object.pos_v4f[0]  * Math.sin(planet_orbit[num - 2]* earth_orbit) +   cam_object.pos_v4f[2] * Math.cos(planet_orbit[ num - 2]* earth_orbit),
                            1.0
                        ];
                    
                        
                    }
                    else
                    {
                         cam_object.at_v4f  = [0 , 0 , 0 , 1.0];
                       
                    }
             
            }
    
    
    
    
    
    
         
            gl.viewport(0, 0, canvas.width , canvas.height);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
    
             
            var earth_rot = (PI/180 * 1) *  (1/30) * 365 * 0.05; 
            var earth_orbit = (PI/180 * 1) *  (1/30) * 2;
    
            var theta =0;
            gl.clearColor(0,  0, 0 , 0);


            light_0 = new light();
            light_0.glUniformLightLocation(gl ,program ,"u_light_20f");
            light_0.pos_v4f = center_planet.pos_v4f;
            light_0.glUniformLight(gl);

            cam_object.up_v4f = [0 , 1 , 0, 1];
            cam_object.at_v4f = [0 , 0 , 0 , 1]
            cam_object.pos_v4f =[0 ,  Math.sin(PI / 180 * 30) * view_cam_radius ,  Math.cos(PI / 180 * 30) * view_cam_radius , 1];
            

            draw();
            
            function draw()
            {     
    
                
                const screen_object = new proj_screen();
               
                select_planet_cam(plnaet_seletion); 
              
                var angle = 0;


               
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.clearDepth(-1);

                cam_object.look_at_LH(cam_object.pos_v4f , cam_object.at_v4f , cam_object.up_v4f); 
                gl.uniform4fv(u_cam_pos_loc_v4f , cam_object.pos_v4f);           

                screen_object.perspective_fov_LH(PI/180 * 60 , window.innerWidth/window.innerHeight - 0.07 , 1 , 5000.0 );
                gl.uniformMatrix4fv(u_view_loc_m4f, 0,  cam_object.view_mat4);
                gl.uniformMatrix4fv(u_proj_loc_m4f, 0, screen_object.proj_mat4);
              
 
                center_planet.rot_v4f[3] += (1/60 * 365) / 1000; 
                draw_sphere(gl,center_planet);
                
                  for(var i = 0; i < 8; i++)
                    {

                       
                        planet[i].rot_v4f[3] +=planets_rot[i] * earth_rot;
                        
                        x =  planet[i].pos_v4f[0] * Math.cos(planet_orbit[i]* earth_orbit) -   planet[i].pos_v4f[2] * Math.sin(planet_orbit[i]* earth_orbit); 
                        y =  planet[i].pos_v4f[0] * Math.sin(planet_orbit[i]* earth_orbit) +   planet[i].pos_v4f[2] * Math.cos(planet_orbit[i]* earth_orbit); 
                        planet[i].pos_v4f[0]  = x;
                        planet[i].pos_v4f[2]  = y;

                      
                        draw_sphere(gl , planet[i]);
                        if( i == 5)
                        {
                           
                            gl.enable(gl.BLEND);
                            gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
                            disk.material.luminary_1i = 0;
                            disk.pos_v4f = planet[i].pos_v4f;
                            disk.rot_v4f = planet[i].rot_v4f;
                            disk.scale_v4f =  [planet[5].scale_v4f[0]*2, 0.1 ,  planet[5].scale_v4f[2]*2];
                            
                            draw_sphere(gl,disk);
                            gl.disable(gl.BLEND);
                        }
                    }
                  
                
               
                requestAnimationFrame(draw);
            }
    
            
    
    
            function init_sphere(gl , origin_sphere,textur_url)
            {
                var new_sphere = new sphere();
                new_sphere.sphere_vbo = origin_sphere.sphere_vbo;
                new_sphere.sphere_vbo_len = origin_sphere.sphere_vbo_len;
               
                new_sphere.sphere_texture_info = loadImageAndCreateTextureInfo(gl , textur_url);
                
                new_sphere.sphere_vbo_id = gl.createBuffer();
              
                gl.bindTexture(gl.TEXTURE_2D , new_sphere.sphere_texture_info.texture );
               
                
                gl.bindBuffer(gl.ARRAY_BUFFER , new_sphere.sphere_vbo_id);
                gl.bufferData(gl.ARRAY_BUFFER , new Float32Array(new_sphere.sphere_vbo) , gl.STATIC_DRAW );
                
                gl.vertexAttribPointer(aPos_loc_v4f , 4, gl.FLOAT , false , 6 * 4 , 0);
                gl.vertexAttribPointer(aTex_loc_v2f , 2, gl.FLOAT , false , 6 * 4 , 4 * 4);
                
               
                new_sphere.pos_v4f = [0, 0 , 0 , 1];
                new_sphere.rot_v4f = [0 , 1, 0 , 0];
                new_sphere.scale_v4f = [1 , 1 ,1 ,1];
    
                return new_sphere
    
            }


         
           
            function draw_sphere(gl ,draw_sphere)
            {
                const trans_object = new model_object();
                trans_object.translate(draw_sphere.pos_v4f);
                trans_object.rotate(draw_sphere.rot_v4f);
                trans_object.scale( draw_sphere.scale_v4f);
                gl.uniformMatrix4fv(u_trans_loc_m4f, 0, trans_object.trans_mat4);
                gl.uniformMatrix4fv(u_rotate_loc_m4f, 0, trans_object.rotate_mat4);
                gl.uniformMatrix4fv(u_scale_loc_m4f, 0, trans_object.scale_mat4);

                
                draw_sphere.material.glUniformMaterial(gl);
                gl.bindTexture(gl.TEXTURE_2D , draw_sphere.sphere_texture_info.texture );
               
                gl.bindBuffer(gl.ARRAY_BUFFER , draw_sphere.sphere_vbo_id);
                gl.drawArrays(gl.TRIANGLES , 0, draw_sphere.sphere_vbo_len/6);
          
            }

            function calc_trackball_unit_vector(canvas , in_p_v2f)
            {
              

                p_v2f = [0 , 0];
                if(in_p_v2f[0] < 0) p_v2f[0] = 0;
                else if(in_p_v2f[0] > canvas.width) p_v2f[0] = canvas.width;
                else p_v2f[0] = in_p_v2f[0];

                if(in_p_v2f[1] < 0) p_v2f[1] = 0;
                else if(in_p_v2f[1] > canvas.height) p_v2f[1] = canvas.height;
                else p_v2f[1] = in_p_v2f[1];

                //트렉볼 를 1대1로 맞춤
                size = canvas.width;
                if(size > canvas.height) size = canvas.height;

                radius = Math.sqrt(2 * size * size);
                var unit_v4f = [
                    (p_v2f[0] -size/2) / radius,
                    (size / 2 - p_v2f[1])/radius, 
                    0, 1.0
                ];
                unit_v4f[2] = Math.sqrt(1 - unit_v4f[0]*unit_v4f[0] - unit_v4f[1]*unit_v4f[1]);
                if(unit_v4f[2] < 0) unit_v4f[2] = 0;

                unit_v4f = normalize_v4_xyz(unit_v4f);

                return unit_v4f;

            }
            
            
            function mouse_cam_trackball(view_cam_obj, canvas ,start_p_v2f , cur_p_v2f)
            {
               

                if(start_p_v2f[0] == cur_p_v2f[0] && start_p_v2f[1] == cur_p_v2f[1])return;

                
                unit_start_v4f = calc_trackball_unit_vector(canvas , start_p_v2f);
                unit_cur_v4f = calc_trackball_unit_vector(canvas , cur_p_v2f);
                
                dot_c_s_1f = dot_product_1f_xyz(unit_start_v4f , unit_cur_v4f);
                

                norm_c_s = Math.sqrt(dot_product_1f_xyz(unit_start_v4f , unit_cur_v4f));
             
                axis_v4f = cross_v4_xyz(unit_cur_v4f , unit_start_v4f);

                theta_1f = Math.acos(dot_c_s_1f / (norm_c_s));
               
                theta_1f= theta_1f/3.0;
                
                

                angle_axis_x = theta_1f * axis_v4f[0];
                angle_axis_y = theta_1f * axis_v4f[1];
                angle_axis_z = theta_1f * axis_v4f[2];
                
                 if(angle_axis_y > 0.05 && angle_axis_y < -0.05) return; 

                var cos_x = Math.cos(angle_axis_x);
                var sin_x = Math.sin(angle_axis_x);

                var cos_y = Math.cos(angle_axis_y);
                var sin_y = Math.sin(angle_axis_y);
 
                var cos_z = Math.cos(angle_axis_z);
                var sin_z = Math.sin(angle_axis_z);
        
              

                 rotate_mat4 = [
                    cos_y * cos_x  ,  cos_y*sin_x ,   -sin_y , 0,
                    sin_z*sin_y*cos_x - cos_z*sin_x ,sin_x * sin_y *sin_z + cos_x * cos_z , sin_z * cos_y  , 0,
                    cos_x*sin_y*cos_z + sin_x*sin_z , cos_z * sin_y * sin_x - sin_z * cos_x , cos_z * cos_y , 0, 
                    0 ,0 ,0 , 1
                ];
                
                view_cam_obj.pos_v4f = sub_v4v4_xyz( view_cam_obj.pos_v4f ,  view_cam_obj.at_v4f);
    
                view_cam_obj.pos_v4f = [
                    rotate_mat4[0]  * view_cam_obj.pos_v4f[0] + rotate_mat4[1]  * view_cam_obj.pos_v4f[1] + rotate_mat4[2]  * view_cam_obj.pos_v4f[2] + rotate_mat4[3]  * view_cam_obj.pos_v4f[3] ,
                    rotate_mat4[4]  * view_cam_obj.pos_v4f[0] + rotate_mat4[5]  * view_cam_obj.pos_v4f[1] + rotate_mat4[6]  * view_cam_obj.pos_v4f[2] + rotate_mat4[7]  * view_cam_obj.pos_v4f[3] ,
                    rotate_mat4[8]  * view_cam_obj.pos_v4f[0] + rotate_mat4[9]  * view_cam_obj.pos_v4f[1] + rotate_mat4[10] * view_cam_obj.pos_v4f[2] + rotate_mat4[11] * view_cam_obj.pos_v4f[3] , 
                    rotate_mat4[12] * view_cam_obj.pos_v4f[0] + rotate_mat4[13] * view_cam_obj.pos_v4f[1] + rotate_mat4[14] * view_cam_obj.pos_v4f[2] + rotate_mat4[15] * view_cam_obj.pos_v4f[3] ,
                ];

                view_cam_obj.pos_v4f = add_v4v4_xyz( view_cam_obj.pos_v4f ,  view_cam_obj.at_v4f);

            }
            
        }
           
            
        main()