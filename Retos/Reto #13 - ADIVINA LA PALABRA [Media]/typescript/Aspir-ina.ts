/*
 * Crea un pequeño juego que consista en adivinar palabras en un número máximo de intentos:
 * - El juego comienza proponiendo una palabra aleatoria incompleta
 *   - Por ejemplo "m_ur_d_v", y el número de intentos que le quedan
 * - El usuario puede introducir únicamente una letra o una palabra (de la misma longitud que
 *   la palabra a adivinar)
 *   - Si escribe una letra y acierta, se muestra esa letra en la palabra. Si falla, se resta
 *     uno al número de intentos
 *   - Si escribe una resolución y acierta, finaliza el juego, en caso contrario, se resta uno
 *     al número de intentos
 *   - Si el contador de intentos llega a 0, el jugador pierde
 * - La palabra debe ocultar de forma aleatoria letras, y nunca puede comenzar ocultando más del 60%
 * - Puedes utilizar las palabras que quieras y el número de intentos que consideres
 */

import { intro, isCancel, outro, text } from "@clack/prompts"


const PERCENTAGE_OF_HIDDEN_LETTERS: number = 60
const ATTEMPTS: number = 5

const words: string[] = [
  "murcielago",
  "casa",
  "coche",
  "perro",
  "gato",
  "ordenador",
  "teclado",
  "raton",
  "mesa",
  "silla",
  "puerta",
  "ventana",
  "cama",
  "libro",
  "papel",
  "lapiz",
]

const random = (max: number, min: number = 0): number => Math.floor(Math.random() * (max - min + 1) + min)

const randomWord = (): string => words[random(words.length)]

const maxHiddenLetters = (word: string) => Math.round((word.length / 100) * PERCENTAGE_OF_HIDDEN_LETTERS)

const hideLettersFromWord = (word: string, maxHiddenLetters: number): string => {
  let hiddenWord: string = word

  for (let i = 0; i < maxHiddenLetters; i++) {
    const randomLetterIndex: number = random(maxHiddenLetters, i)
    hiddenWord = hiddenWord.replace(hiddenWord[randomLetterIndex], "_")
  }

  return hiddenWord
}

const restoreHiddenLettersFromLetter = (word: string, hiddenWord: string, letter: string) => {
  let newHiddenWord: string = hiddenWord
  let isUpdated: boolean = false

  for (let i = 0; i < newHiddenWord.length; i++) {
    if (newHiddenWord[i] === "_" && word[i] === letter) {
      isUpdated = true
      newHiddenWord = newHiddenWord.replace(newHiddenWord[i], letter)
    }
  }

  return { newHiddenWord, isUpdated }

}


const game = async () => {
  const word: string = randomWord()
  const hiddenLetters: number = maxHiddenLetters(word)
  const hiddenWord: string = hideLettersFromWord(word, hiddenLetters)
  let isWinner: boolean = false
  let restoredWord: string = hiddenWord

  intro(`Debes adivinar la palabra: '${hiddenWord}'`)

  for (let i = 0; i < ATTEMPTS; i++) {
    const prompt: string | symbol = await text({
      message: 'Introduce una letra o palabra: ',
      initialValue: '',
      validate(value) {
        if (value.length === 0) return outro("¡No has introducido nada!")
      },
    })

    if (isCancel(prompt)) {
      outro("¡Saliendo del juego!")
      process.exit(0)
    }

    const userAnswer: string = prompt

    if (userAnswer === word) {
      isWinner = true
      break
    }

    if (userAnswer.length === 1) {
      if (word.includes(userAnswer)) {
        const { newHiddenWord, isUpdated } = restoreHiddenLettersFromLetter(word, restoredWord, userAnswer)
        restoredWord = newHiddenWord

        if (!restoredWord.includes('_')) {
          isWinner = true
          break
        }

        if (isUpdated) {
          outro(`¡Has acertado la letra '${userAnswer}'!`)
        }

      } else {
        outro(`¡Has fallado la letra '${userAnswer}'!`)
      }
    } else {
      isWinner = false
      outro(`¡Has perdido!, la palabra era ${word}`)
    }

    outro(`Resultado actual: ${restoredWord}`)
  }

  if (isWinner) {
    outro(`¡Has ganado!, La palabra era ${word}`)
  }
}

game()

