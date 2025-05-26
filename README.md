# Infinite Wordle

Infinite Wordle is a Wordle-inspired web app built with Vue 3, Vite, TypeScript, and TailwindCSS.
It lets you play unlimited rounds of Wordle, checks your guesses against a real English dictionary API, and features smooth tile-flipping animations.

## Features

- 🎲 **Infinite Play**: Play new random words endlessly.
- 🧠 **Word Validation**: Checks each guess against [dictionaryapi.dev](https://dictionaryapi.dev/). No made-up words!
- 🟩🟨⬛ **Domino Flip Animation**: Tiles flip one-by-one, just like official Wordle.
- ⌨️ **Virtual Keyboard**: On-screen keyboard disables gray keys for easy play.
- 🌗 **Dark Mode**: Clean and modern dark UI with TailwindCSS.
- ⚡ **Fast & Responsive**: Instant feedback, smooth animations, no backend required.

## Demo

<!-- Replace with your own screenshot or live link if available -->

![Screenshot of Infinite Wordle](screenshot.png)

## Getting Started

### 1. **Clone the repo**

```bash
git clone https://github.com/yourusername/infinite-wordle.git
cd infinite-wordle
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Run the dev server**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to play!

## Project Structure

```
public/
src/
│
├── assets/
│
├── components/
│   ├── Keyboard.vue
│   └── WordleBoard.vue
│
├── utils/
│   ├── wordApi.ts
│   └── words.json
│
├── App.vue
├── main.ts
├── style.css
└── vite-env.d.ts
.gitignore
index.html
package-lock.json
package.json
README.md
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

## How It Works

- Each guess is checked using [dictionaryapi.dev](https://dictionaryapi.dev/).
- Valid guesses trigger a "domino flip" animation for tile reveal.
- Keyboard disables letters that are no longer possible.
- New word loads instantly on game over or correct guess.

## Configuration

- Random Words: By default, random words come from `utils/wordApi.ts` (you can customise with your own list!).
- Word Length: Set to 5 letters for classic Wordle.
- Styling: Easily adjustable via TailwindCSS classes.

---

## Credits

- [dictionaryapi.dev](https://dictionaryapi.dev/) for free dictionary validation
- [Vue.js](https://vuejs.org/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/)
- Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html) (all rights to original owners)

## License

MIT

## Contributing

Pull requests and suggestions are welcome!
Open an issue or PR to help improve the game.
