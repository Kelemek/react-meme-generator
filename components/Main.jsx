import { useState, useEffect, useRef } from "react"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])
    
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const newMemeUrl = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }))
    }
    
    function handleChange(event) {
        const {value, name} = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    // Canvas ref for drawing meme
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef?.current
        if (!canvas) return;
        const ctx = canvas.getContext('2d')
        const image = new window.Image()
        image.crossOrigin = 'anonymous'
        image.src = meme.imageUrl
        image.onload = () => {
            canvas.width = image.width
            canvas.height = image.height
            ctx.drawImage(image, 0, 0)
            ctx.font = `bold 40px Impact, Arial`
            ctx.textAlign = 'center'
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 3
            ctx.fillStyle = 'white'
            ctx.strokeText(meme.topText, canvas.width / 2, 50)
            ctx.fillText(meme.topText, canvas.width / 2, 50)
            ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20)
            ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20)
        };
    }, [meme, canvasRef]);

    async function handleCanvasClick() {
        const canvas = canvasRef.current
        if (!canvas) return
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = url
        link.download = 'meme.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('Meme image has been downloaded. You can manually upload or share this file.')
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <canvas
                    ref={canvasRef}
                    style={{ maxWidth: '100%', cursor: 'pointer', border: '2px solid #333' }}
                    onClick={handleCanvasClick}
                />
                {/* Meme image will be downloaded on click. */}
            </div>
        </main>
    )
}