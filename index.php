<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Photography Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        .hero {
            height: 100vh;
            background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('your-background-image.jpg');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }

        .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
        }

        .gallery {
            padding: 50px 10%;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .gallery img {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
            transition: transform 0.3s;
        }

        .gallery img:hover {
            transform: scale(1.05);
        }

        nav {
            position: fixed;
            width: 100%;
            padding: 20px;
            background: rgba(0,0,0,0.8);
        }

        nav a {
            color: white;
            text-decoration: none;
            margin: 0 20px;
        }
    </style>
</head>
<body>
    <nav>
        <a href="#home">Home</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
    </nav>

    <section class="hero" id="home">
        <div class="hero-content">
            <h1>My Photography</h1>
            <p>Capturing moments that last forever</p>
        </div>
    </section>

    <section class="gallery" id="gallery">
        <!-- Replace src with your image paths -->
        <img src="image1.jpg" alt="Photo 1">
        <img src="image2.jpg" alt="Photo 2">
        <img src="image3.jpg" alt="Photo 3">
        <img src="image4.jpg" alt="Photo 4">
        <img src="image5.jpg" alt="Photo 5">
        <img src="image6.jpg" alt="Photo 6">
    </section>
</body>
</html>