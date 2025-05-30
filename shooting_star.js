 window.addEventListener('load', () => {
        // 별똥별용 캔버스 추가
        const canvas = document.createElement('canvas');
        canvas.id = 'shooting-star-canvas';
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
    
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);
    
        class ShootingStar {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width * 0.8;
                this.y = Math.random() * canvas.height * 0.3;
                this.speed = 6 + Math.random() * 4;
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.05;
                this.opacity = 1;
                this.trail = [];
                this.maxTrail = 30;
                this.delayTrail = 5;
                this.frames = 0;
            }
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                this.frames++;
                if (this.frames > this.delayTrail) {
                    this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
                    if (this.trail.length > this.maxTrail) this.trail.shift();
                }
                this.opacity -= 0.004;
                if (this.opacity <= 0) this.dead = true;
            }
            draw(ctx) {
                for (let i = 0; i < this.trail.length; i++) {
                    const t = this.trail[i];
                    const grad = ctx.createLinearGradient(t.x, t.y, t.x - 50, t.y - 50);
                    grad.addColorStop(0, `rgba(255,255,255,${t.opacity * 0.3})`);
                    grad.addColorStop(1, `rgba(255,255,255,0)`);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(t.x, t.y);
                    ctx.lineTo(t.x - 50, t.y - 50);
                    ctx.stroke();
                }
            }
        }
    
        let stars = [];
    
        function createShootingStars() {
            for (let i = 0; i < 4; i++) {
                stars.push(new ShootingStar());
            }
        }
    
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });
            stars = stars.filter(star => !star.dead);
            requestAnimationFrame(animate);
        }
        animate();
    
        // ⭐️ aside 안의 버튼들 클릭할 때 별똥별 + 소리
        const shootingSound = new Audio('shine-1-268902.mp3');
    
        document.querySelectorAll('#right button').forEach(button => {
            button.addEventListener('click', () => {
                createShootingStars();
                shootingSound.currentTime = 0;
                shootingSound.play().catch(e => console.log('Audio play error:', e));
            });
        });
    });