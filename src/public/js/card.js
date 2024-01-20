class Card {
    constructor(onDismiss, user) {
        this.id = user.id
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.birthDay = user.birthDay
        this.sex = user.sex
        this.group = user.group
        this.description = user.description
        this.tags = user.tags
        this.avatar = user.avatar
        this.onDismiss = onDismiss
        this.#init()
    }

    //private propeties

    #startPoint;
    #offsetX;
    #offsetY;

    //private methods
    #init = () => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.id = this.id

        const anketa = document.createElement('div')
        anketa.classList.add('anketa')

        const card_image = document.createElement('div')
        card_image.classList.add('card_image')
        const img = document.createElement('img')
        img.src = "/uploads/" + this.avatar?.name ?? "placeholder.png"
        card_image.append(img)

        const data = document.createElement('div')
        data.classList.add('data')

        const info = document.createElement('div')
        info.classList.add('info')
        const first_name = document.createElement('h2')
        first_name.classList.add('first_name')
        console.log(this.birthDay)
        let birthDate = new Date(this.birthDay).toUTCString().split(" ");
        birthDate.pop()
        birthDate.pop()
        birthDate.shift()
        first_name.innerHTML = this.firstName + " " + this.lastName + " " + birthDate.join(" ")
        const group = document.createElement('h2')
        group.classList.add('group')
        group.innerHTML = this.group
        const desc = document.createElement('p')
        desc.classList.add('desc')
        desc.innerHTML = this.description
        info.append(first_name,group,desc)


        const l = document.createElement('div')
        l.classList.add('l')
        let lookingArr = ["love", "friendship", "cooperation"];
        let signArr = ["arias", "leo", "sagittarius", "taurus", "virgo", "capricorn",
            "pisces", "scorpio", "cancer", "aquarius", "libra", "gemini",];
        let bad_habArr = ["alcohol", "nicotine", "healthy",];

        const first = document.createElement('div')
        first.classList.add('first')
        const looking = document.createElement('div')
        looking.classList.add('looking')
        const sign = document.createElement('div')
        sign.classList.add('sign')
        const bad_hab = document.createElement('div')
        bad_hab.classList.add('bad_hab')

        const hobby = document.createElement('hobby')
        hobby.classList.add('hobby')
        this.tags.forEach((v) => {
            switch (true) {
                case lookingArr.find((vv) => vv === v.title) !== undefined:
                    looking.innerHTML = capitalizeFirstLetter(v.title);
                    break;
                case signArr.find((vv) => vv === v.title) !== undefined:
                    sign.innerHTML = capitalizeFirstLetter(v.title);
                    break;
                case bad_habArr.find((vv) => vv === v.title) !== undefined:
                    bad_hab.innerHTML = capitalizeFirstLetter(v.title);
                    break;
                default:
                    let p = document.createElement("p");
                    p.innerHTML = capitalizeFirstLetter(v.title);
                    let div = document.createElement("div");
                    div.appendChild(p)
                    hobby.appendChild(div);
                    break;
            }
        })
        first.append(looking,sign,bad_hab)
        l.append(first,hobby)


        data.append(info,l)
        // anketa.append(card_image,data)

        card.append(card_image,data)
        this.element = card
        this.#listenToMouseEvents()
    }

    #listenToMouseEvents = () => {
        // mouse down
        this.element.addEventListener('mousedown', e => {
            const {
                clientX,
                clientY
            } = e
            this.#startPoint = {
                x: clientX,
                y: clientY
            }
            this.element.style.transition = ''
            document.addEventListener('mousemove', this.#handleMouseMove)
        })

        // mouse up

        this.element.addEventListener('mouseup', this.#handleMouseUp)

        // prevent drag
        this.element.addEventListener('dragstart', e => {
            e.preventDefault()
        })
    }

    #handleMouseMove = (e) => {
        if (!this.#startPoint) return
        const {
            clientX,
            clientY
        } = e
        this.#offsetX = clientX - this.#startPoint.x
        this.#offsetY = clientY - this.#startPoint.y

        const rotate = this.#offsetX * 0.1

        this.element.style.transform = `
            translate(
                ${this.#offsetX}px,
                ${this.#offsetY}px
                )
            rotate(${rotate}deg)
            `

        // dismiss card when moving far away

        if (Math.abs(this.#offsetX) > this.element.clientWidth * 0.65) {
            const direction = this.#offsetX > 0 ? 1 : -1

            this.#dismiss(direction)
        }
    }

    #handleMouseUp = (e) => {
        this.#startPoint = null
        document.removeEventListener('mousemove', this.#handleMouseMove)
        this.element.style.transition = 'transform 0.1s'
        this.element.style.transform = ''
    }

    #dismiss = (direction) => {
        this.#startPoint = null
        document.removeEventListener('mouseup', this.#handleMouseUp)
        document.removeEventListener('mousemove', this.#handleMouseMove)

        this.element.style.transition = 'transform 1s'
        this.element.style.transform = `
            translate(
                ${direction * window.innerWidth}px,
                ${this.#offsetY}px
                )
                rotate(${90 * direction}deg)
            `
        this.element.classList.add('dismissing')

        setTimeout(() => {
            this.element.remove()

        }, 1000)

        fetch("/api/dislike/add", {
            method: "POST",
            body: JSON.stringify({userId: this.id}),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })
        if (typeof this.onDismiss === 'function') {
            this.onDismiss()
        }
    }
}