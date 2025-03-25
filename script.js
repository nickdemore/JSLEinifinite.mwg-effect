let incr = 400, deltaObject = {delta: 0}, deltaTo, tl, isWheeling, indexImg = 0
const mediaArray = []

document.body.classList.add('no-smooth')
window.addEventListener("DOMContentLoaded", () => {

    const root = document.querySelector('.mwg_effect012')
    const container = root.querySelector('.container')

    root.querySelectorAll('.preload-medias img').forEach(image => {
        mediaArray.push(image.getAttribute('src'))
    })

    const medias = root.querySelectorAll('.media')
    const mediasImg = root.querySelectorAll('.media img')

    // QUICK TOS
    deltaTo = gsap.quickTo(deltaObject, 'delta', { duration: 2, ease: "power1" })
    const rotY = gsap.quickTo(container, "rotationY", {duration: 0.5, ease: 'power1'})
    const rotX = gsap.quickTo(container, "rotationX", {duration: 0.5, ease: 'power1'})

    medias.forEach(media => {
        updateMedia(media)
    })

    tl = gsap.timeline({
        paused: true
    })

    tl.to(medias, {
        z: 0, // Bring back to front
        ease: "none", // Linear movement
        duration: 8, // Same as number of images
        stagger: {
            each: 1, // Each image starts evenly spaced across the total duration
            repeat: -1, // Infinite repeat
            onRepeat() {
                // Calling the function with the repeated item as a parameter accessible via this.targets()[0]
                updateMedia(this.targets()[0])
            }
        }
    })
    tl.fromTo(mediasImg, {
        scale: 0
    }, {
        scale: 1, // Making the image appear at the back
        ease: "back.out(2)", // With a slight bounce effect
        duration: 0.6,
        stagger: {
            each: 1, // Each image starts evenly spaced across the total duration
            repeat: -1, 
            repeatDelay: 7.4, // 7.4 + 0.6 = 8
            onRepeat() {
                // When it repeats: force the scale to 0
                this.targets()[0].style.transform = "scale(0, 0)"
            }
        }
    }, '<') // Means the animation starts at the beginning of the previous tween
    tl.fromTo(mediasImg, {
        scale: 1,
    }, {
        scale: 0, // Making the image disappear at the back
        ease: "back.in(1.2)", // With a slight bounce effect
        duration: 0.6,
        immediateRender: false, // Because the same property is animated by another tween
        delay: 7.4, // Since 7.4 + 0.6 = 8, it will play exactly at the end
        stagger: {
            each: 1, // Each image starts evenly spaced across the total duration
            repeat: -1, 
            repeatDelay: 7.4, // 7.4 + 0.6 = 8
            onRepeat() {
                // When it repeats: force the scale to 1
                this.targets()[0].style.transform = "scale(1, 1)"
            }
        }
    }, '<') // Means the animation starts at the beginning of the previous tween

    gsap.ticker.add(tick)
    window.addEventListener("wheel", handleWheel, {passive: true});
    root.addEventListener("mousemove", e => {
        const valY = (e.clientX / window.innerWidth - 0.5) * 10
        const valX = (e.clientY / window.innerHeight - 0.5) * 10

        rotY(valY)
        rotX(-valX)
    })
})

function updateMedia(media) {
    gsap.set(media, {
        xPercent: -50,
        yPercent: -50,
        // Random value between 0.2 and 0.8 to keep elements within the frame 
        x: (Math.random() * (0.8 - 0.2) + 0.2) * window.innerWidth,
        y: (Math.random() * (0.8 - 0.2) + 0.2) * window.innerHeight,
    })

    // Assigning a new media URL
    indexImg = (indexImg + 1) % mediaArray.length
    media.querySelector('img').setAttribute('src', mediaArray[indexImg])
}


function handleWheel(e) {
    deltaTo(e.deltaY)

    window.clearTimeout(isWheeling) // Kill setTimeout
    isWheeling = setTimeout(() => { // Init setTimeout
        deltaTo(0) // Reset speed
    }, 120)
}

function tick(time, dt) {
    // deltaObject.delta varies depending on deltaTo()
    incr += deltaObject.delta / 300 + dt / 1000
    tl.time(incr) // time() : go to a specific time of a timeline
}