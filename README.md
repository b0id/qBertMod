# Q*bert Navigation Project

This project is a web-based navigation system inspired by the classic arcade game Q*bert. It utilizes an isometric grid layout and character sprites to create an engaging user interface for navigating a website.

## Project Structure

The project is organized as follows:

```
qbert-nav
├── src
│   ├── assets
│   │   ├── fonts
│   │   │   └── NK57MonospaceScSb-Regular.woff2
│   │   ├── images
│   │   │   ├── characters
│   │   │   │   ├── qbert_sprite.png
│   │   │   │   └── other_characters.png
│   │   │   └── pyramid
│   │   │       └── cube.png
│   │   └── sounds
│   │       └── jump.mp3
│   ├── js
│   │   ├── main.js
│   │   ├── grid.js
│   │   ├── character.js
│   │   └── navigation.js
│   ├── styles
│   │   ├── main.css
│   │   └── grid.css
│   └── index.html
├── package.json
├── webpack.config.js
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd qbert-nav
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run the following command:
```
npm start
```

This will launch a local development server and open the application in your default web browser.

## Features

- **Isometric Grid Layout**: The navigation utilizes an isometric grid for a unique visual experience.
- **Character Sprites**: Navigate using Q*bert and other character sprites.
- **Sound Effects**: Enjoy sound effects like jumping to enhance the user experience.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.