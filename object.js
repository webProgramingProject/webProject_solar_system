class material
{
   
    ambient_v4f;
    diffuse_v4f;
    specular_v4f;
    shineness_1f;
    luminary_1i;
    rim_color_v4f;
    n_mode_1i;
    
    ambient_loc;
    diffuse_loc;
    specular_loc;
    shineness_loc;
    luminary_loc;
    rim_color_loc;
    n_mode_loc;

    constructor()
    {
        this.ambient_v4f = [0.3, 0.3, 0.3, 1.0];
        this.diffuse_v4f = [0.8, 0.8, 0.8, 1.0];
        this.specular_v4f = [0.5, 0.5, 0.5, 1.0];
        this.shineness_1f = 6.0;
        this.luminary_1i = 0;
        this.rim_color_v4f = [0.5 , 0.5 , 0.5 , 1.0];
        this.n_mode_1i = 0;
        
        this.ambient_loc = 0;
        this.diffuse_loc = 0;
        this.specular_loc = 0;
        this.shineness_loc = 0;
        this.luminary_loc = 0;
        this.rim_color_loc = 0;
        this.n_mode_loc = 0;
    }

    glUniformMaterialLocation(gl ,program ,name)
    {
        
        this.ambient_loc = gl.getUniformLocation(program , name + ".ambient_v4");
        this.diffuse_loc = gl.getUniformLocation(program , name + ".diffuse_v4");
        this.specular_loc = gl.getUniformLocation(program , name + ".specular_v4");
        this.shineness_loc = gl.getUniformLocation(program , name + ".shineness_mf");
        this.luminary_loc = gl.getUniformLocation(program , name + ".luminary_1i");
        this.rim_color_loc = gl.getUniformLocation(program , name + ".rim_color_v4");

        this.n_mode_loc = gl.getUniformLocation(program , "u_n_mode_1i");
       
    }
    glUniformMaterial(gl)
    {
    
        gl.uniform4fv(this.ambient_loc , this.ambient_v4f);
        gl.uniform4fv(this.diffuse_loc , this.diffuse_v4f);
        gl.uniform4fv(this.specular_loc , this.specular_v4f);
        gl.uniform1f(this.shineness_loc , this.shineness_1f);
        gl.uniform1i(this.luminary_loc , this.luminary_1i);
        gl.uniform1i(this.n_mode_loc , this.n_mode_1i);
        gl.uniform4fv(this.rim_color_loc , this.rim_color_v4f);
  
    }
}

class sphere
{
    pos_v4f;
    rot_v4f;
    scale_v4f;

    sphere_vbo;
    sphere_color_buffer;
    sphere_vbo_len;
    sphere_vbo_id;
    sphere_tbo_id;

    sphere_texture_info;

    material;
    constructor()
    {
        this.pos_v4f = [0 , 0 , 0 , 0];
        this.rot_v4f = [0 , 0 , 0 , 0];
        this.scale_v4f = [0 ,0 ,0 ,0];
        this.sphere_vbo = [];
        this.sphere_color_buffer = [];
        this.sphere_texture_coord_buffer = [];
        this.sphere_vbo_len = 0;
        this.sphere_texture_coord_buffer_len = 0;

        this.material = new material();
    }

    sub_division_tri(level_1i,start_idx ,p1_v4f ,p2_v4f ,p3_v4f)
    {
      
    if(level_1i == 0)
    {
        this.sphere_vbo[start_idx] = p1_v4f[0];     //X
        this.sphere_vbo[start_idx+1] = p1_v4f[1];   //Y
        this.sphere_vbo[start_idx+2] = p1_v4f[2];   //Z
        this.sphere_vbo[start_idx+3] = 1.0; //W

        this.sphere_vbo[start_idx+6] = p2_v4f[0];
        this.sphere_vbo[start_idx+7] = p2_v4f[1];
        this.sphere_vbo[start_idx+8] = p2_v4f[2];
        this.sphere_vbo[start_idx+9] = 1.0;

    

        this.sphere_vbo[start_idx+12] = p3_v4f[0];
        this.sphere_vbo[start_idx+13] = p3_v4f[1];
        this.sphere_vbo[start_idx+14] = p3_v4f[2];
        this.sphere_vbo[start_idx+15] = 1.0;
        


        if(p1_v4f[2] < 0 && p2_v4f[2] < 0 && p3_v4f[2] < 0)
        {
            this.sphere_vbo[start_idx+4]  =   (Math.atan2(-p1_v4f[0] , -p1_v4f[2]) + PI)/PI/2.0 ;
            this.sphere_vbo[start_idx+5]  =   0.5 - Math.asin(p1_v4f[1] )/(PI) ;
            this.sphere_vbo[start_idx+10]  =   (Math.atan2(-p2_v4f[0] , -p2_v4f[2]) + PI)/PI/2.0  ;
            this.sphere_vbo[start_idx+11]  =   0.5 - Math.asin(p2_v4f[1] )/(PI) ;
            this.sphere_vbo[start_idx+16]  = (Math.atan2(-p3_v4f[0] , -p3_v4f[2]) + PI)/PI/2.0 ;
            this.sphere_vbo[start_idx+17]  =   0.5 - Math.asin(p3_v4f[1] )/(PI) ;

        }
        else
        {
            this.sphere_vbo[start_idx+4]  =   Math.atan2(p1_v4f[0],p1_v4f[2])/PI/2.0 ;
            this.sphere_vbo[start_idx+5]  =   0.5 - Math.asin(p1_v4f[1] )/(PI) ;
            this.sphere_vbo[start_idx+10]  =  Math.atan2(p2_v4f[0], p2_v4f[2])/PI/2.0;
            this.sphere_vbo[start_idx+11]  =   0.5 - Math.asin(p2_v4f[1] )/(PI) ;
            this.sphere_vbo[start_idx+16]  =  Math.atan2(p3_v4f[0], p3_v4f[2])/PI/2.0;
            this.sphere_vbo[start_idx+17]  =   0.5 - Math.asin(p3_v4f[1] )/(PI) ;
           
        }
       
        this.sphere_vbo_len = this.sphere_vbo_len + 18;
    }
    else
    {
        var p1_p2_v4f = add_v4v4_xyz(p1_v4f , p2_v4f);
        p1_p2_v4f = normalize_v4_xyz(p1_p2_v4f);

        var p2_p3_v4f = add_v4v4_xyz(p2_v4f , p3_v4f);
        p2_p3_v4f = normalize_v4_xyz(p2_p3_v4f);

        var p3_p1_v4f = add_v4v4_xyz(p3_v4f ,p1_v4f);
        p3_p1_v4f = normalize_v4_xyz(p3_p1_v4f);
        
        
        this.sub_division_tri(level_1i - 1 , this.sphere_vbo_len , p1_v4f , p1_p2_v4f , p3_p1_v4f);
        this.sub_division_tri(level_1i - 1 , this.sphere_vbo_len , p2_v4f , p2_p3_v4f , p1_p2_v4f);
        this.sub_division_tri(level_1i - 1 , this.sphere_vbo_len , p3_v4f , p3_p1_v4f , p2_p3_v4f);
        this.sub_division_tri(level_1i - 1 , this.sphere_vbo_len , p1_p2_v4f , p2_p3_v4f , p3_p1_v4f);

    }

    }

    gen_sphere(level_1i, src_cube_object , src_cube_object_len)
    {
        for(var i = 0; i < src_cube_object_len; i += 12)
        {
            var p1_v4f = [ src_cube_object[i] , src_cube_object[i+1] , src_cube_object[i+2] , src_cube_object[i+3]  ];
            p1_v4f = normalize_v4_xyz(p1_v4f);

            var p2_v4f = [ src_cube_object[i+4] , src_cube_object[i+5] , src_cube_object[i+6] , src_cube_object[i+7]  ];
            p2_v4f = normalize_v4_xyz(p2_v4f);

            var p3_v4f = [ src_cube_object[i+8] , src_cube_object[i+9] , src_cube_object[i+10] , src_cube_object[i+11]  ];
            p3_v4f = normalize_v4_xyz(p3_v4f);
         
            this.sub_division_tri(level_1i , this.sphere_vbo_len , p1_v4f,p2_v4f,p3_v4f);
   
        }

    }


  


}