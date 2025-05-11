class light
{
    pos_v4f;
    ambient_v4f;
    diffuse_v4f;
    specular_v4f;
    att_v4f;

    pos_loc;
    ambient_loc;
    diffuse_loc;
    specular_loc;
    att_loc;

    constructor()
    {
        this.pos_v4f = [0, 0, 0, 1.0];
        this.ambient_v4f = [0.1, 0.1, 0.1, 1.0];
        this.diffuse_v4f = [0.8, 0.8, 0.8, 1.0];
        this.specular_v4f = [0.5, 0.5, 0.5, 1.0];
        this.att_v4f = [1.0, 0, 0, 1.0];

        this.pos_loc = 0;
        this.ambient_loc = 0;
        this.diffuse_loc = 0;
        this.specular_loc = 0;
        this.att_loc = 0;
    
    }

    glUniformLightLocation(gl ,program ,name)
    {
        this.pos_loc = gl.getUniformLocation(program , name + ".pos_v4");
        this.ambient_loc = gl.getUniformLocation(program , name + ".ambient_v4");
        this.diffuse_loc = gl.getUniformLocation(program , name + ".diffuse_v4");
        this.specular_loc = gl.getUniformLocation(program , name + ".specular_v4");
        this.att_loc  = gl.getUniformLocation(program , name + ".att_v4");

    }
    glUniformLight(gl)
    {
        gl.uniform4fv(this.pos_loc , this.pos_v4f);
        gl.uniform4fv(this.ambient_loc , this.ambient_v4f);
        gl.uniform4fv(this.diffuse_loc , this.diffuse_v4f);
        gl.uniform4fv(this.specular_loc , this.specular_v4f);
        gl.uniform4fv(this.att_loc , this.att_v4f);

    }

}