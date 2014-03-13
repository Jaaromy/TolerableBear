/*
       Common vector2 operations
       Ugly as hell but no GC headaches
       Author: Tudor Nita | cgrats.com
       Version: 0.6 

       Modifications: Jaaromy Zierse

*/
/* vector 2D structure */
function Vec2(x_, y_) {
    this.x = x_;
    this.y = y_;
}

/* vector math */
vMath = new function () {
    /* vector * scalar */
    this.mulS = function (v, value) {
        var vTmp = new Vec2(v.x, v.y);
        vTmp.x *= value;
        vTmp.y *= value;
        return vTmp;
    };
    /* vector * vector */
    this.mulV = function (v1, v2) {
        var vTmp = new Vec2(v1.x, v1.y);
        vTmp.x *= v2.x;
        vTmp.y *= v2.y;
        return vTmp;
    };
    /* vector / scalar */
    this.divS = function (v, value) {
        var vTmp = new Vec2(v.x, v.y);
        vTmp.x /= value;
        vTmp.y /= value;
        return vTmp;
    };
    /* vector + scalar */
    this.addS = function (v, value) {
        var vTmp = new Vec2(v.x, v.y);
        vTmp.x += value;
        vTmp.y += value;
        return vTmp;
    };
    /* vector + vector */
    this.addV = function (v1, v2) {
        var vTmp = new Vec2(v1.x, v1.y);
        vTmp.x += v2.x;
        vTmp.y += v2.y;
        return vTmp;
    };
    /* vector - scalar */
    this.subS = function (v, value) {
        var vTmp = new Vec2(v.x, v.y);
        vTmp.x -= value;
        vTmp.y -= value;
        return vTmp;
    };
    /* vector - vector */
    this.subV = function (v1, v2) {
        var vTmp = new Vec2(v1.x, v1.y);
        vTmp.x -= v2.x;
        vTmp.y -= v2.y;
        return vTmp;
    };
    /*	vector absolute */
    this.abs = function (v) {
        var vTmp = new Vec2(v.x, v.y);
        Math.abs(vTmp.x);
        Math.abs(vTmp.y);
        return vTmp;
    };
    /* dot product */
    this.dot = function (v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    };
    /* vector length */
    this.length = function (v) {
        return Math.sqrt(vMath.dot(v, v));
    };
    /* distance between vectors */
    this.dist = function (v1, v2) {
        return vMath.length(vMath.subV(v2, v1));
    };
    /* vector length, squared */
    this.lengthSqr = function (v) {
        return vMath.dot(v, v);
    };
    /* 
        vector linear interpolation 
        interpolate between two vectors.
        value should be in 0.0f - 1.0f space ( just to skip a clamp operation )
    */
    this.lerp = function (targetV2, v1, v2, value) {
        targetV2.x = v1.x + (v2.x - v1.x) * value;
        targetV2.y = v1.y + (v2.y - v1.y) * value;
    };
    /* returnn a normalized vector */
    this.normalize = function (v) {
        var vTmp = new Vec2(v.x, v.y);
        var vlen = vMath.length(vTmp);
        vTmp.x = vTmp.x / vlen;
        vTmp.y = vTmp.y / vlen;
        return vTmp;
    };
};