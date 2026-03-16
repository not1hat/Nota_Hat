document.addEventListener('DOMContentLoaded', function(){

    const blackOverlay = document.getElementById('black');
    const canvas = document.createElement('canvas');
    
    const ctx = canvas.getContext('2d');
    blackOverlay.appendChild(canvas);
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const radius=200;
    let mouseX=0;
    let mouseY=0;
    document.addEventListener('mousemove', function(event){
        mouseX=event.clientX;
        mouseY=event.clientY;
        updateCanvas();
    });
    
    function updateCanvas(){

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle='rgba(0, 0, 0, 0.9)';

        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.globalCompositeOperation='destination-out';

        const gradient = ctx.createRadialGradient(
            mouseX, mouseY, radius*0.6,
            mouseX, mouseY, radius
        );
        gradient.addColorStop(0, 'rgb(180, 180, 180)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.42)');
        
        ctx.globalCompositeOperation='destination-out';

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, Math.PI*2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.globalCompositeOperation='source-over';
    }
    
    updateCanvas();
    setTimeout(function(){
        if(mouseX===0 && mouseY === 0){
            mouseX=window.innerWidth / 2;
            mouseY=window.innerHeight / 2;
            updateCanvas();
        }
    }, 1000);
});