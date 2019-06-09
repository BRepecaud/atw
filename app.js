var createEyes = function (quantity) {
    var eyes = [];
    var eye;
    var lens;
    var i;

    quantity = (quantity | 0) || 2;

    for (i = 0; i < quantity; i++) {

        eye = document.createElement("div");
        eye.classList.add("eye");
        lens = document.createElement("span");
        eye.appendChild(lens);
        document.body.appendChild(eye);
        eyes.push({
            iris: eye,
            lens: lens
        });
    }
    return eyes;

}

var eyes = createEyes(1);

document.addEventListener("mousemove", function (event) {

    var x = event.pageX;
    var y = event.pageY;

    eyes.forEach(function (eye) {

        var offsets = eye.lens.getBoundingClientRect();
        var left = (offsets.left - x)
        var top = (offsets.top - y)
        var rad = Math.atan2(top, left);

        eye.iris.style.webkitTransform = "rotate(" + rad + "rad)";
    });
});