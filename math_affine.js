const PI =3.1415929204;
const identity_mat4 = [
    1 , 0 , 0 , 0,
    0 , 1 , 0 , 0,
    0 , 0 , 1 , 0,
    0 , 0 , 0 , 1
];


function sub_v4v4_xyz(v1_v4f , v2_v4f)
{
    var re_v4f = [
        v1_v4f[0] - v2_v4f[0],
        v1_v4f[1] - v2_v4f[1],
        v1_v4f[2] - v2_v4f[2],
        1
    ];

    return re_v4f;
}

function add_v4v4_xyz(v1_v4f , v2_v4f)
{
    var re_v4f = [
        v1_v4f[0] + v2_v4f[0],
        v1_v4f[1] + v2_v4f[1],
        v1_v4f[2] + v2_v4f[2],
        1
    ];

    return re_v4f;
}

function lenght_v4_xyz(v_v4f)
{
    var re_1f = Math.sqrt(v_v4f[0]*v_v4f[0] + v_v4f[1]*v_v4f[1] + v_v4f[2]*v_v4f[2]);
    return re_1f;
}

function normalize_v4_xyz(v_v4f)
{
    var len_1f = lenght_v4_xyz(v_v4f);
   
    var re_v4f = [v_v4f[0] / len_1f ,v_v4f[1] / len_1f , v_v4f[2] / len_1f , 1];
    return re_v4f;
}


//3차원 좌표계의 외적 내적임 외적의 반환값 w 에는 벡터임을 나타기위해 1로 표기한것것
function dot_product_1f_xyz(v1_v4f ,v2_v4f)
{
    var re_1f = v1_v4f[0]*v2_v4f[0] +
                v1_v4f[1]*v2_v4f[1] +
                v1_v4f[2]*v2_v4f[2];

    return re_1f;
}

function cross_v4_xyz(v1_v4f ,v2_v4f)
{
    var re_v4f = [v1_v4f[1] * v2_v4f[2] - v1_v4f[2] * v2_v4f[1], 
              v1_v4f[2] * v2_v4f[0] - v1_v4f[0] * v2_v4f[2],
              v1_v4f[0] * v2_v4f[1] - v1_v4f[1] * v2_v4f[0],
              1
            ];

            
    return re_v4f;
}


class model_object
{

    world_coord_v4f = [0 , 0 , 0 , 1];
    rotate_angle_v4f= [0 , 0 , 0 , 1];
    scale_size_v4f= [1 , 1 , 1 , 1];
    scale_mat4 = identity_mat4;
    rotate_mat4 = identity_mat4;
    trans_mat4 = identity_mat4;

    constructor()
    {
        this.world_coord_v4f = [0 , 0 , 0 , 1];
        this.rotate_angle_v4f= [0 , 0 , 0 , 1];
        this.scale_size_v4f= [1 , 1 , 1 , 1];

        this.scale_mat4 = identity_mat4;
        this.rotate_mat4 = identity_mat4;
        this.trans_mat4 = identity_mat4;
    }

    translate(world_pos_v4f) 
    {
        this.world_coord_v4f = world_pos_v4f;
      

        this.trans_mat4 = [
            1 , 0 , 0 , 0,
            0 , 1 , 0 , 0,
            0 , 0 , 1 , 0,
            world_pos_v4f[0] , world_pos_v4f[1], world_pos_v4f[2] , 1

        ];
    }

    rotate(rot_v4f)
    {
        this.rotate_angle_v4f = rot_v4f;

        var angle_axis_x = rot_v4f[3] * rot_v4f[0];
        var angle_axis_y = rot_v4f[3] * rot_v4f[1];
        var angle_axis_z = rot_v4f[3] * rot_v4f[2];


        var cos_x = Math.cos(angle_axis_x);
        var sin_x = Math.sin(angle_axis_x);

        var cos_y = Math.cos(angle_axis_y);
        var sin_y = Math.sin(angle_axis_y);
 
        var cos_z = Math.cos(angle_axis_z);
        var sin_z = Math.sin(angle_axis_z);
        
    
        
        this.rotate_mat4 = [
            cos_z*cos_y ,   -1*sin_z*cos_y   ,sin_y   ,0  ,     
            sin_z*cos_x + cos_z*sin_y*sin_x,  cos_z*cos_x - sin_z*sin_y*sin_x,-1*cos_y*sin_x  ,0,
            sin_z*sin_x - cos_z*sin_y*cos_x, cos_z*sin_x + sin_z*sin_y*cos_x ,cos_y*cos_x , 0,
            0 , 0 , 0, 1
        ];

    }

    scale(scale_v4f)
    {
        this.scale = scale_v4f;
        this.scale_mat4 = [
            scale_v4f[0] , 0             , 0            , 0,
            0             , scale_v4f[1] , 0            , 0,
            0             , 0             , scale_v4f[2], 0,
            0             , 0             , 0            , 1
        ];
    }
    


}

// left handle system // 레스터 과정에서 webgl은 rh이지만 vert shader에서 z값 * -1
class view_cam
{

    view_mat4 = identity_mat4;
    constructor()
    {
        this.view_mat4 = identity_mat4;
    }
    
    look_at_LH(cam_pos_v4f ,cam_at_v4f ,cam_up_v4f)
    {
        //z_axis , x_axis , y_axis is unit vector of view coord system
        var z_axis_v4f = sub_v4v4_xyz(cam_at_v4f, cam_pos_v4f );
        z_axis_v4f = normalize_v4_xyz(z_axis_v4f);

        var x_axis_v4f = cross_v4_xyz(cam_up_v4f , z_axis_v4f);
        x_axis_v4f = normalize_v4_xyz(x_axis_v4f);

        var y_axis_v4f = cross_v4_xyz(z_axis_v4f , x_axis_v4f);
       
        var inverse_trans_x_1f = -1* dot_product_1f_xyz(x_axis_v4f , cam_pos_v4f);
        var inverse_trans_y_1f = -1* dot_product_1f_xyz(y_axis_v4f , cam_pos_v4f);
        var inverse_trans_z_1f = -1* dot_product_1f_xyz(z_axis_v4f , cam_pos_v4f);
        
        this.view_mat4 = [
            x_axis_v4f[0] , y_axis_v4f[0] ,z_axis_v4f[0] ,0,
            x_axis_v4f[1] , y_axis_v4f[1] ,z_axis_v4f[1] ,0,
            x_axis_v4f[2] , y_axis_v4f[2] ,z_axis_v4f[2] ,0, 
            inverse_trans_x_1f , inverse_trans_y_1f ,inverse_trans_z_1f ,1
        ];
        
      
        

    }




}


//use frustumfov system 
class proj_screen{

    proj_mat4 = identity_mat4;

    constructor()
    {

        this.proj_mat4 = identity_mat4;
    }

   
   
    perspective_fov_LH(fieldOfViewInRadians, aspect, near, far)
    {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        var rangeInv = 1.0 / (near - far);

        this.proj_mat4 = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, -1*(near + far) * rangeInv, 1,
            0, 0, near * far * rangeInv * 2, 0
        ];

    }

}



